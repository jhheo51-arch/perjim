import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {accountURL,parseFeed,parseTrends,meta,strip} from './strategy.mjs';
import {parseGoogleNews,selectNews,naverWindow,summarizeNaver,normalizeYouTube} from './trend-evidence.mjs';

const root=path.dirname(fileURLToPath(import.meta.url));
const feedURL='https://trends.google.com/trending/rss?geo=KR';
const mime={'.html':'text/html; charset=utf-8','.css':'text/css; charset=utf-8','.js':'text/javascript; charset=utf-8','.mjs':'text/javascript; charset=utf-8','.woff2':'font/woff2','.png':'image/png','.jpg':'image/jpeg','.json':'application/json; charset=utf-8','.zip':'application/zip'};
let trendCache=null;
const evidenceCache=new Map();

const historyDir=path.join(root,'runtime');
fs.mkdirSync(historyDir,{recursive:true});
const historyPath=path.join(historyDir,'keyword-history.json');
let history=[];
try{history=JSON.parse(fs.readFileSync(historyPath,'utf8'));}catch{}

const koreaDay=value=>new Date(new Date(value).getTime()+9*3600000).toISOString().slice(0,10);
function remember(feed){
  const day=koreaDay(feed.fetchedAt),old=history.find(item=>item.day===day);
  if(old){
    const map=new Map(old.items.map(item=>[item.title,item]));
    for(const item of feed.items)map.set(item.title,item);
    old.items=[...map.values()];
    old.fetchedAt=feed.fetchedAt;
  }else history.push({day,fetchedAt:feed.fetchedAt,items:feed.items});
  history=history.filter(item=>Date.now()-Date.parse(item.day)<15*86400000);
  fs.writeFileSync(historyPath,JSON.stringify(history,null,2));
}
function keywordHistory(){
  const today=koreaDay(new Date()),base=new Date(today+'T00:00:00Z'),dow=(base.getUTCDay()+6)%7;
  const weekStart=new Date(+base-dow*86400000).toISOString().slice(0,10);
  return {today,weekStart,days:history.filter(item=>item.day>=weekStart&&item.day<=today)};
}

const publicHosts=new Set(['www.instagram.com','instagram.com','blog.naver.com','m.blog.naver.com','rss.blog.naver.com','brunch.co.kr','trends.google.com','news.google.com','www.youtube.com','youtube.com','www.tiktok.com','tiktok.com','x.com','twitter.com','threads.net','www.threads.net','threads.com','www.threads.com','www.facebook.com','facebook.com','www.linkedin.com','linkedin.com','www.pinterest.com','pinterest.com']);
const allowed=host=>publicHosts.has(host)||/^[a-z0-9-]+\.tistory\.com$/.test(host);

async function read(url,depth=0){
  const target=new URL(url);
  if(target.protocol!=='https:'||target.username||target.password||target.port||!allowed(target.hostname)||depth>3)throw Error('이 공개 주소는 읽을 수 없습니다.');
  const response=await fetch(target,{redirect:'manual',signal:AbortSignal.timeout(12000),headers:{'User-Agent':'Perjim/1.1 (public-trend-reader)','Accept':'text/html,application/rss+xml,application/xml,text/xml'}});
  if(response.status>=300&&response.status<400){
    const next=new URL(response.headers.get('location'),target);
    return read(next.href,depth+1);
  }
  if(!response.ok)throw Error(`공개 자료 접근 응답 ${response.status}`);
  const type=response.headers.get('content-type')||'';
  if(!/html|xml|text/.test(type))throw Error('읽을 수 있는 공개 문서가 아닙니다.');
  let size=0,text='';
  const reader=response.body.getReader(),decoder=new TextDecoder();
  for(;;){
    const {value,done}=await reader.read();
    if(done)break;
    size+=value.length;
    if(size>2000000){await reader.cancel();throw Error('공개 문서 크기가 읽기 범위를 넘었습니다.');}
    text+=decoder.decode(value,{stream:true});
  }
  return text+decoder.decode();
}

async function readJson(url,options={}){
  const response=await fetch(url,{...options,signal:AbortSignal.timeout(12000)});
  if(!response.ok)throw Error(`자료 제공처 응답 ${response.status}`);
  return response.json();
}

async function naverEvidence(keyword){
  const clientId=process.env.NAVER_CLIENT_ID,clientSecret=process.env.NAVER_CLIENT_SECRET;
  if(!clientId||!clientSecret)return {status:'needs-key'};
  try{
    const period=naverWindow();
    const payload=await readJson('https://naverapihub.apigw.ntruss.com/search-trend/v1/search',{
      method:'POST',
      headers:{'Content-Type':'application/json','X-NCP-APIGW-API-KEY-ID':clientId,'X-NCP-APIGW-API-KEY':clientSecret},
      body:JSON.stringify({...period,timeUnit:'date',keywordGroups:[{groupName:keyword,keywords:[keyword]}]})
    });
    const summary=summarizeNaver(payload);
    return summary
      ? {status:'ready',summary,period,source:'https://datalab.naver.com/keyword/trendSearch.naver'}
      : {status:'insufficient',message:'최근 14일의 일간 자료를 충분히 받지 못했습니다.',period,source:'https://datalab.naver.com/keyword/trendSearch.naver'};
  }catch(error){return {status:'error',message:error.message};}
}

async function youtubeEvidence(keyword){
  const apiKey=process.env.YOUTUBE_API_KEY;
  if(!apiKey)return {status:'needs-key',items:[]};
  try{
    const after=new Date(Date.now()-7*86400000).toISOString();
    const search=new URL('https://www.googleapis.com/youtube/v3/search');
    for(const [key,value] of Object.entries({part:'snippet',type:'video',maxResults:'5',order:'viewCount',regionCode:'KR',relevanceLanguage:'ko',publishedAfter:after,q:keyword,key:apiKey}))search.searchParams.set(key,value);
    const searchPayload=await readJson(search);
    const ids=(searchPayload.items||[]).map(item=>item.id?.videoId).filter(Boolean);
    if(!ids.length)return {status:'ready',items:[],periodStart:after,source:'https://www.youtube.com/'};
    const videos=new URL('https://www.googleapis.com/youtube/v3/videos');
    for(const [key,value] of Object.entries({part:'snippet,statistics',id:ids.join(','),key:apiKey}))videos.searchParams.set(key,value);
    const videoPayload=await readJson(videos);
    return {status:'ready',items:normalizeYouTube(searchPayload,videoPayload),periodStart:after,source:'https://www.youtube.com/'};
  }catch(error){return {status:'error',message:error.message,items:[]};}
}

async function newsEvidence(keyword){
  const source=new URL('https://news.google.com/rss/search');
  source.searchParams.set('q',keyword);
  source.searchParams.set('hl','ko');
  source.searchParams.set('gl','KR');
  source.searchParams.set('ceid','KR:ko');
  try{
    const xml=await read(source.href);
    const parsed=parseGoogleNews(xml,20),items=selectNews(parsed,keyword);
    return {status:'ready',items,excludedCount:parsed.length-items.length,source:source.href};
  }catch(error){return {status:'error',message:error.message,items:[],source:source.href};}
}

async function trendEvidence(keyword){
  const cacheKey=keyword.toLocaleLowerCase('ko-KR'),cached=evidenceCache.get(cacheKey);
  if(cached&&Date.now()-Date.parse(cached.checkedAt)<30*60000)return cached;
  const [naver,youtube,news]=await Promise.all([naverEvidence(keyword),youtubeEvidence(keyword),newsEvidence(keyword)]);
  const result={keyword,checkedAt:new Date().toISOString(),naver,youtube,news};
  evidenceCache.set(cacheKey,result);
  return result;
}

const json=(res,status,obj)=>{
  res.writeHead(status,{'Content-Type':'application/json; charset=utf-8','Cache-Control':'no-store','X-Content-Type-Options':'nosniff'});
  res.end(JSON.stringify(obj));
};
async function bodyJson(req,max=4000){
  let body='';
  for await(const chunk of req){
    body+=chunk;
    if(Buffer.byteLength(body)>max)throw Error('입력 크기를 확인해 주세요.');
  }
  return JSON.parse(body||'{}');
}

http.createServer(async(req,res)=>{
  try{
    const host=(req.headers.host||'').split(':')[0];
    if(!['127.0.0.1','localhost'].includes(host))return json(res,403,{error:'내 컴퓨터에서만 사용할 수 있습니다.'});
    if(req.headers.origin&&new URL(req.headers.origin).host!==req.headers.host)return json(res,403,{error:'다른 페이지의 요청은 허용하지 않습니다.'});
    const url=new URL(req.url,'http://localhost');

    if(url.pathname==='/api/trends'&&req.method==='GET'){
      if(trendCache&&Date.now()-Date.parse(trendCache.fetchedAt)<300000)return json(res,200,{...trendCache,history:keywordHistory()});
      const xml=await read(feedURL);
      const next={source:feedURL,fetchedAt:new Date().toISOString(),kind:'한국 Google 검색 관심 신호, SNS 바이럴 미확인',items:parseTrends(xml)};
      trendCache=next;
      remember(next);
      return json(res,200,{...next,history:keywordHistory()});
    }

    if(url.pathname==='/api/trend-evidence'&&req.method==='POST'){
      const {keyword}=await bodyJson(req,1000);
      const clean=String(keyword||'').trim();
      if(clean.length<2||clean.length>50||/[\u0000-\u001f]/.test(clean))return json(res,400,{error:'두 글자 이상 50자 이하의 키워드를 입력해 주세요.'});
      return json(res,200,await trendEvidence(clean));
    }

    if(url.pathname==='/api/account'&&req.method==='POST'){
      const input=await bodyJson(req);
      const account=accountURL(input.url);
      const result={...account,checkedAt:new Date().toISOString(),title:'',description:'',posts:[],status:'unavailable',limitation:'공개 문서 접근이 제한됐습니다. 비공개 정보, 도달, 공유, 저장 수는 읽지 않습니다.'};
      try{
        const html=await read(account.feed||account.url);
        if(account.feed){
          result.posts=parseFeed(html);
          result.title=strip(html.match(/<channel>[\s\S]*?<title>([\s\S]*?)<\/title>/)?.[1]||'');
          result.description=strip(html.match(/<channel>[\s\S]*?<description>([\s\S]*?)<\/description>/)?.[1]||'');
          result.status=result.posts.length?'public-posts':'limited';
          result.limitation='RSS에 제공된 최근 글 제목, 날짜, 본문 일부입니다. 전체 기록이나 읽은 사람, 공유 통계는 아닙니다.';
        }else{
          result.title=meta(html,'og:title');
          result.description=meta(html,'og:description')||meta(html,'description');
          if(/로그인|log in|sign up/i.test(result.description+result.title)&&!result.title.includes(account.id)){result.title='';result.description='';}
          result.status=result.description?'public-profile':'limited';
          result.limitation='공개 페이지 소개만 읽었습니다. 사진의 색, 게시물 내용, 반응은 자동 평가하지 않았습니다.';
        }
      }catch(error){result.reason=error.message;}
      return json(res,200,result);
    }

    if(url.pathname.startsWith('/api/'))return json(res,404,{error:'지원하지 않는 요청입니다.'});
    const rel=decodeURIComponent(url.pathname).slice(1)||'index.html',file=path.resolve(root,rel);
    if(!file.startsWith(root+path.sep)||rel==='server.mjs'||rel.split('/').includes('runtime')||rel.includes('test')||!mime[path.extname(file)]||!fs.existsSync(file)||!fs.statSync(file).isFile())return json(res,404,{error:'파일 없음'});
    res.writeHead(200,{'Content-Type':mime[path.extname(file)],'X-Content-Type-Options':'nosniff','Cache-Control':'no-store'});
    fs.createReadStream(file).pipe(res);
  }catch(error){json(res,400,{error:error.message||'자료를 읽지 못했습니다.'});}
}).listen(4191,'127.0.0.1',()=>console.log('http://127.0.0.1:4191/'));