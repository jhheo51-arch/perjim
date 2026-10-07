export function subject(a,entered=''){if(entered.trim())return {text:entered.trim(),basis:'직접 입력한 소개'};const text=[a.title,a.description,...(a.posts||[]).map(p=>p.title)].join(' ');for(const [pattern,label] of [[/여행|숙소|여행지/,'여행과 장소'],[/사진|촬영|풍경/,'사진과 일상'],[/맛집|요리|레시피/,'음식과 생활'],[/책|독서|서평/,'책과 문화'],[/개발|코딩|프로그래밍/,'개발과 학습']])if(pattern.test(text))return {text:label,basis:'공개 글 표현에서 찾은 주제 후보, 직접 확인 필요'};return {text:'내 브랜드',basis:'공개 정보에서 주제를 확정하지 못함'};}
export function diagnoseAccount(a,now=new Date()){
 const result=[],posts=a.posts||[],generic=/Followers.*Following|See Instagram|Log in|로그인/i.test(a.description||'');
 if(!a.description||generic)result.push({level:'확인하지 못함',title:'누구를 위한 계정인지 소개 문구를 확인하세요',fact:generic?'읽은 공개 설명은 계정 수치, 페이지 안내이며 실제 소개 문구는 확인하지 못했습니다.':'공개 소개 문구를 읽지 못했습니다.',action:'대상, 주제, 이 계정만의 관점을 한 문장으로 적고 대표 콘텐츠와 같은 약속을 전달하세요.'});
 else result.push({level:'공개 근거 확인',title:'소개와 실제 콘텐츠의 약속을 맞추세요',fact:a.description,action:'이 설명에서 독자가 얻을 내용을 한 문장으로 고르고, 다음 콘텐츠의 첫 장면이나 제목과 연결하세요.'});
 if(posts.length){const dates=posts.map(p=>Date.parse(p.date)).filter(x=>Number.isFinite(x)&&x<=+now);const latest=dates.length?Math.max(...dates):null;if(latest&&(+now-latest)/86400000>60)result.push({level:'관측된 보완점',title:'다음 콘텐츠를 기대할 계기를 다시 만드세요',fact:`읽은 RSS ${posts.length}개 글 중 가장 최근 날짜는 ${new Date(latest).toISOString().slice(0,10)}입니다. 계정 전체 게시 상태는 별도 확인이 필요합니다.`,action:'지금 다루는 주제를 다시 소개하고, 이어질 글이나 영상의 약속을 밝혀 주세요. 긴 간격이 낮은 반응의 원인이라고 확정하지 않습니다.'});const short=posts.filter(p=>p.title.length<8);if(short.length)result.push({level:'관측된 검토점',title:'짧은 제목에 독자가 얻을 것을 보완하세요',fact:`읽은 ${posts.length}개 글 중 제목이 8자 미만인 글 ${short.length}개. 짧은 제목 자체가 실패를 뜻하지는 않습니다.`,action:'독자의 상황이나 장소, 경험을 제목에 드러내는 안과 현재 제목을 비교하세요.'});result.push({level:'공개 근거 확인',title:'읽은 글에서 다음 연재 주제를 고르세요',fact:`RSS 글 ${posts.length}개를 읽었습니다. 제목과 본문 일부만 확인했으며 전체 내용, 반응은 아닙니다.`,action:'아래 원문에서 반복되는 질문이나 소재를 확인하고, 하나의 관점으로 이어지는 3편의 구성안을 먼저 정하세요.'});}
 else result.push({level:'확인하지 못함',title:'콘텐츠의 첫 장면과 반응을 확인해야 합니다',fact:'개별 게시물의 화면, 본문, 공유, 시청 자료를 읽지 못했습니다. 현재 계정의 콘텐츠가 부족하다고 판정하지 않습니다.',action:'대표 콘텐츠에서 처음 보는 사람이 주제를 알 수 있는지, 누구에게 보내고 싶은지 점검하세요. 아래 제안은 플랫폼과 확인된 주제를 바탕으로 한 초안입니다.'});
 return result;
}
export function publicEvidence(a){
 const p=a.posts||[],dated=p.filter(x=>Number.isFinite(Date.parse(x.date))),described=p.filter(x=>x.description);
 const known=v=>v||'확인하지 못함';
 const description=/Followers.*Following|See Instagram|Log in|로그인/i.test(a.description||'')?'':a.description;
 return [{label:'계정 이름',value:known(a.title)},{label:'공개 소개',value:known(description)},
 {label:'읽은 게시물',value:p.length?`${p.length}개 (공개 피드 범위)`:'확인하지 못함'},
 {label:'게시물 본문',value:described.length?`${described.length}개 일부 확인`:'확인하지 못함'},
 {label:'게시 날짜',value:dated.length?`${dated.length}개 확인`:'확인하지 못함'},
 {label:'이미지와 영상 내용',value:'확인하지 못함'},
 {label:'조회, 좋아요, 공유, 저장, 팔로우',value:'확인하지 못함'}];
}
export {contentDecision as nextContent} from './recommendation-engine.mjs';
