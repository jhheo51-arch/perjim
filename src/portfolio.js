const signalData={
  cost:{label:'선택한 경제 신호',title:'금액보다 “이번 달의 이유”를 설명할 기회',fact:'2026년 2분기 가계지출은 늘었지만 평균소비성향은 낮아졌습니다.',interpretation:'얼마를 썼는지만 보여주기보다 생활 장면과 지출의 관계를 이해하도록 돕는 가계부 콘텐츠가 필요하다는 가설을 세웠습니다.'},
  trust:{label:'선택한 플랫폼 신호',title:'소셜에서도 신뢰할 수 있는 금융 설명이 필요',fact:'YouTube는 한국 이용자의 94%가 정보와 지식을 얻기 위해 서비스를 활용한다고 밝혔습니다.',interpretation:'짧은 흥미 유도 뒤에 출처와 계산 과정을 이어주는 콘텐츠 구조를 선택했습니다.'},
  depth:{label:'선택한 문화 신호',title:'짧게 발견하고, 깊게 이해하는 이중 구조',fact:'YouTube는 장편 콘텐츠와 인간의 노력이 다시 가치를 얻는 흐름을 제시했습니다.',interpretation:'3초 광고로 끝내지 않고 3분 설명과 온드 채널 근거로 깊이를 확장했습니다.'}
};
const channels={
  meta:{number:'01',name:'Meta',role:'숫자로 발견하고, 근거와 사람의 설명으로 이해',hook:'“4번의 저녁. <span class="nowrap">72,000원.</span>”',format:'제작 완료 · 카드 6장 + 게시글 문안 / 릴스는 콘티 제안',structure:['발견 · 가상 4건·72,000원','이해 · 18,000원 × 4건과 인물의 직접 회고 분리','참여 · 지출 한 건을 한 줄로 돌아보기'],metric:'메시지 이해 · 브랜드와 이유 회상 · 저장/이동은 보조 지표',tone:'가상 숫자를 명시하고 실제 자동 분석처럼 표현하지 않기'},
  youtube:{number:'02',name:'YouTube · Google',role:'이야기 발견에서 충분한 설명으로',hook:'“같은 72,000원, 다른 이유가 있습니다.”',format:'구성 제안 · 15초 유입 영상 + 3분 설명 영상 / 영상 미제작',structure:['유입 영상 · 생활 장면과 한 가지 질문','설명 영상 · 사실과 당사자의 설명 구분','마무리 · 돈을 쉽게 이해하는 브랜드 메시지'],metric:'브랜드·메시지 회상 / 실제 배치·예산·운영 기준은 집행 전 설계',tone:'광고와 일반 콘텐츠를 구분해 제작·검수'},
  owned:{number:'03',name:'토스 온드 채널',role:'콘텐츠의 태도를 자기 회고로 경험',hook:'“쓴 돈을 보기 전에, 그날의 나부터.”',format:'제작 완료 · 웹 콘텐츠와 뉴스레터 첫 원고·후속 원고 / 미게재',structure:['읽기 · 배달비 4건의 가상 이야기','직접 해보기 · 자기 메모장에 지출 이유 한 줄','다시 보기 · 7일 뒤 같은 질문으로 돌아보기'],metric:'메시지 이해 · 브랜드 연상 · 후속 참여 / 기능 이용과 구분',tone:'가입·금융 정보 공유 없이 콘텐츠 자체로 이해 제공'}
};
function renderSignal(key){const s=signalData[key];document.querySelector('#signalDecision').innerHTML=`<div><span>${s.label}</span><h3>${s.title}</h3></div><dl><div><dt>확인한 사실</dt><dd>${s.fact}</dd></div><div><dt>캠페인 해석</dt><dd>${s.interpretation}</dd></div></dl>`;}
document.querySelectorAll('.trend-card').forEach(card=>{const activate=()=>{document.querySelectorAll('.trend-card').forEach(x=>x.classList.remove('selected'));card.classList.add('selected');renderSignal(card.dataset.signal)};card.addEventListener('click',activate);card.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();activate()}})});
function renderChannel(key){const c=channels[key];document.querySelector('#channelStage').innerHTML=`<div class="channel-creative"><div class="creative-top"><span>${c.name}</span><b>${c.number}</b></div><p>${c.role}</p><h3>${c.hook}</h3><small>${c.format}</small></div><div class="channel-detail"><div><span>콘텐츠 흐름</span><ol>${c.structure.map(x=>`<li>${x}</li>`).join('')}</ol></div><dl><div><dt>확인 지표</dt><dd>${c.metric}</dd></div><div><dt>톤 원칙</dt><dd>${c.tone}</dd></div></dl></div>`;}
document.querySelectorAll('[role=tab]').forEach(tab=>tab.addEventListener('click',()=>{document.querySelectorAll('[role=tab]').forEach(x=>x.setAttribute('aria-selected','false'));tab.setAttribute('aria-selected','true');renderChannel(tab.dataset.channel)}));
window.addEventListener('scroll',()=>{const max=document.documentElement.scrollHeight-innerHeight;document.querySelector('#progressBar').style.width=`${max?scrollY/max*100:0}%`;},{passive:true});
renderSignal('cost');renderChannel('meta');
