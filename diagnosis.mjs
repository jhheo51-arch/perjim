export function subject(a,entered=''){if(entered.trim())return {text:entered.trim(),basis:'직접 입력한 소개'};const text=[a.title,a.description,...(a.posts||[]).map(p=>p.title)].join(' ');for(const [pattern,label] of [[/여행|숙소|여행지/,'여행과 장소'],[/사진|촬영|풍경/,'사진과 일상'],[/맛집|요리|레시피/,'음식과 생활'],[/책|독서|서평/,'책과 문화'],[/개발|코딩|프로그래밍/,'개발과 학습']])if(pattern.test(text))return {text:label,basis:'공개 글 표현에서 찾은 주제 후보 ,  직접 확인 필요'};return {text:'내 브랜드',basis:'공개 정보에서 주제를 확정하지 못함'};}
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
export function nextContent(a,topic){
 const posts=a.posts||[],p=posts.find(p=>p.title),hasTopic=topic&&topic!=='내 브랜드';
 if(p)return {basis:`공개 글 ${posts.length}개 중 "${p.title}"에서 이어갈 소재를 골랐습니다. 반응 수치는 확인하지 못함.`,title:`${p.title}에서 못다 한 이야기`,outline:'해당 글의 한 가지 질문을 고르고, 직접 경험한 장면과 구체적인 답을 이어지는 글로 작성하세요. 앞 글의 원문을 연결해 독자가 맥락을 확인할 수 있게 하세요.',question:'이 주제에서 다음으로 알고 싶은 것은 무엇인가요?'};
 if(!hasTopic)return {basis:'게시물과 주제를 확인하지 못했습니다. 아래는 계정 분석 결과가 아닌 시작용 제안입니다.',title:'이 계정에서 앞으로 전할 이야기',outline:'직접 다룰 주제와 본인의 관점을 한 문장으로 소개하고, 대표 경험 하나를 보여주세요. 선택 소개를 추가하면 주제에 맞는 제안을 받을 수 있습니다.',question:'다음 글이나 영상에서 어떤 이야기를 보고 싶으신가요?'};
 const photo=/사진|색감|풍경/.test(topic);
 return {basis:`주제 "${topic}"를 기준으로 작성한 초안입니다. 개별 게시물 반응은 확인하지 못함.`,title:photo?'같은 길에서 발견한 서로 다른 색':`${topic}에서 자주 놓치는 한 가지`,outline:photo?'한 장소에서 발견한 색을 원본 비율의 사진 세 장으로 보여주세요. 마지막 장에는 실제 촬영 경험과 다음에 찾아볼 장소를 짧게 적어 주세요.':'주제와 관련된 생활 속 질문 하나를 고르고, 직접 확인한 경험과 근거를 순서대로 보여주세요.',question:photo?'이 색을 보면 어떤 장소가 떠오르세요?':'여러분은 어떤 경험을 하셨나요?'};
}
