import test from 'node:test';
import assert from 'node:assert/strict';
import {parseGoogleNews,selectNews,naverWindow,summarizeNaver,normalizeYouTube} from './trend-evidence.mjs';

test('Google 뉴스 RSS에서 제목과 원문을 읽는다', () => {
  const xml = '<rss><channel><item><title><![CDATA[봄 전시 소식]]></title><link>https://news.google.com/a</link><source>테스트뉴스</source><pubDate>Wed, 07 Oct 2026 00:00:00 GMT</pubDate></item></channel></rss>';
  assert.deepEqual(parseGoogleNews(xml), [{title:'봄 전시 소식',url:'https://news.google.com/a',publisher:'테스트뉴스',publishedAt:'Wed, 07 Oct 2026 00:00:00 GMT'}]);
});

test('두 번 감싼 HTML 기호를 한 번만 해제한다', () => {
  const xml = '<item><title>&amp;lt;가을&amp;gt;</title><link>https://example.com/a</link><source>연합뉴스</source><pubDate>Thu, 08 Oct 2026 00:00:00 GMT</pubDate></item>';
  const [item] = parseGoogleNews(xml);
  assert.equal(item.title, '&lt;가을&gt;');
});

test('한국어 키워드에서는 한국어 매체명이 확인된 뉴스를 우선한다',()=>{
  const items=[{title:'벚꽃 정보',publisher:'Unknown Site',url:'https://example.com/a'},{title:'벚꽃 개화',publisher:'테스트뉴스',url:'https://example.com/b'}];
  assert.deepEqual(selectNews(items,'벚꽃'),[items[1]]);
  assert.equal(selectNews(items,'cherry').length,2);
});

test('네이버 비교 기간은 한국 날짜 기준 완료된 14일이다', () => {
  assert.deepEqual(naverWindow(new Date('2026-10-08T03:00:00Z')), {startDate:'2026-09-24',endDate:'2026-10-07'});
});

test('네이버 상대 지수는 최근 7일과 이전 7일 평균으로 비교한다', () => {
  const points = Array.from({length:14},(_,i)=>({period:new Date(Date.UTC(2026,8,24+i)).toISOString().slice(0,10),ratio:i<7?20:30}));
  const data = {results:[{data:points}]};
  assert.deepEqual(summarizeNaver(data), {
    previousAverage:20,recentAverage:30,changePercent:50,startDate:'2026-09-24',splitDate:'2026-10-01',endDate:'2026-10-07',points
  });
});

test('YouTube 검색 결과와 공개 통계를 영상별로 연결한다', () => {
  const result = normalizeYouTube({items:[{id:{videoId:'abc'},snippet:{title:'검색 제목'}}]}, {items:[{id:'abc',snippet:{title:'영상 제목',channelTitle:'채널',publishedAt:'2026-10-01T00:00:00Z'},statistics:{viewCount:'1200',commentCount:'30'}}]});
  assert.equal(result[0].viewCount,1200);
  assert.equal(result[0].commentCount,30);
  assert.equal(result[0].url,'https://www.youtube.com/watch?v=abc');
});
