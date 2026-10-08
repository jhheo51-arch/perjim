const signalData={
  cost:{label:'선택한 경제 신호',title:'금액보다 “이번 달의 이유”를 설명할 기회',fact:'2026년 2분기 가계지출은 늘었지만 평균소비성향은 낮아졌습니다.',interpretation:'얼마를 썼는지만 보여주기보다 생활 장면과 지출의 관계를 이해하도록 돕는 가계부 콘텐츠가 필요하다는 가설을 세웠습니다.'},
  trust:{label:'선택한 플랫폼 신호',title:'소셜에서도 신뢰할 수 있는 금융 설명이 필요',fact:'YouTube는 한국 이용자의 94%가 정보와 지식을 얻기 위해 서비스를 활용한다고 밝혔습니다.',interpretation:'짧은 흥미 유도 뒤에 출처와 계산 과정을 이어주는 콘텐츠 구조를 선택했습니다.'},
  depth:{label:'선택한 문화 신호',title:'짧게 발견하고, 깊게 이해하는 이중 구조',fact:'YouTube는 장편 콘텐츠와 인간의 노력이 다시 가치를 얻는 흐름을 제시했습니다.',interpretation:'3초 광고로 끝내지 않고 3분 설명과 온드 채널 근거로 깊이를 확장했습니다.'}
};
const channels={
  meta:{number:'01',name:'Meta',role:'생활 장면으로 발견하고, 브랜드 태도로 기억',hook:'“배달비 뒤에 화요일이 있었습니다.”',format:'제작 완료 · 1080×1350 카드 6장 + 게시글 문안',structure:['발견 · 숫자 뒤의 생활 장면','이해 · 가상 내역과 본인의 설명 구분','참여 · 지출 한 건을 한 줄로 돌아보기'],metric:'메시지 이해 · 브랜드와 이유 회상 · 저장/이동은 보조 지표',tone:'쉽게 설명하되 소비 이유를 대신 단정하지 않기'},
  youtube:{number:'02',name:'YouTube · Google',role:'이야기 발견에서 충분한 설명으로',hook:'“같은 72,000원, 다른 이유가 있습니다.”',format:'구성 제안 · 15초 유입 영상 + 3분 설명 영상 / 영상 미제작',structure:['유입 영상 · 생활 장면과 한 가지 질문','설명 영상 · 사실과 당사자의 설명 구분','마무리 · 돈을 쉽게 이해하는 브랜드 메시지'],metric:'브랜드·메시지 회상 / 실제 배치·예산·운영 기준은 집행 전 설계',tone:'광고와 일반 콘텐츠를 구분해 제작·검수'},
  owned:{number:'03',name:'토스 온드 채널',role:'콘텐츠의 태도를 자기 회고로 경험',hook:'“쓴 돈을 보기 전에, 그날의 나부터.”',format:'제작 완료 · 웹 콘텐츠와 뉴스레터 첫 원고·후속 원고 / 미게재',structure:['읽기 · 배달비 4건의 가상 이야기','직접 해보기 · 자기 메모장에 지출 이유 한 줄','다시 보기 · 7일 뒤 같은 질문으로 돌아보기'],metric:'메시지 이해 · 브랜드 연상 · 후속 참여 / 기능 이용과 구분',tone:'가입·금융 정보 공유 없이 콘텐츠 자체로 이해 제공'}
};
const vocs=[
  {channel:'Instagram',theme:'공감',text:'월급은 같은데 왜 빠듯한지라는 말이 딱 제 얘기 같았어요.'},
  {channel:'YouTube',theme:'근거요청',text:'물가 때문인지 제가 더 쓴 건지 비교 기준을 알고 싶어요.'},
  {channel:'Instagram',theme:'행동요청',text:'그래서 다음 달에는 무엇부터 바꾸면 되는지도 알려주세요.'},
  {channel:'Owned',theme:'근거요청',text:'지난달과 비교한 건지 작년 같은 달과 비교한 건지 궁금해요.'},
  {channel:'YouTube',theme:'공감',text:'절약하라는 말보다 이유를 같이 본다는 말이 부담 없어요.'},
  {channel:'Community',theme:'근거요청',text:'배달비가 늘었다는 결과가 횟수 때문인지 금액 때문인지 보여주세요.'},
  {channel:'Instagram',theme:'공감',text:'생활 장면부터 시작해서 광고처럼 느껴지지 않았어요.'},
  {channel:'Owned',theme:'행동요청',text:'분석을 본 뒤 바로 알림이나 예산을 설정할 수 있으면 좋겠어요.'},
  {channel:'YouTube',theme:'근거요청',text:'숫자 출처와 계산 과정이 설명란에도 있으면 믿고 공유할 것 같아요.'},
  {channel:'Community',theme:'공감',text:'무조건 줄이라고 하지 않아서 제 소비를 차분히 볼 수 있었어요.'},
  {channel:'Instagram',theme:'행동요청',text:'한 문장 요약 뒤에 내 결과를 확인하는 버튼이 필요해요.'},
  {channel:'YouTube',theme:'근거요청',text:'사람마다 조건이 다른데 누구에게 해당하는 내용인지 알려주세요.'}
];
function renderSignal(key){const s=signalData[key];document.querySelector('#signalDecision').innerHTML=`<div><span>${s.label}</span><h3>${s.title}</h3></div><dl><div><dt>확인한 사실</dt><dd>${s.fact}</dd></div><div><dt>캠페인 해석</dt><dd>${s.interpretation}</dd></div></dl>`;}
document.querySelectorAll('.trend-card').forEach(card=>{const activate=()=>{document.querySelectorAll('.trend-card').forEach(x=>x.classList.remove('selected'));card.classList.add('selected');renderSignal(card.dataset.signal)};card.addEventListener('click',activate);card.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();activate()}})});
function renderChannel(key){const c=channels[key];document.querySelector('#channelStage').innerHTML=`<div class="channel-creative"><div class="creative-top"><span>${c.name}</span><b>${c.number}</b></div><p>${c.role}</p><h3>${c.hook}</h3><small>${c.format}</small></div><div class="channel-detail"><div><span>콘텐츠 흐름</span><ol>${c.structure.map(x=>`<li>${x}</li>`).join('')}</ol></div><dl><div><dt>확인 지표</dt><dd>${c.metric}</dd></div><div><dt>톤 원칙</dt><dd>${c.tone}</dd></div></dl></div>`;}
document.querySelectorAll('[role=tab]').forEach(tab=>tab.addEventListener('click',()=>{document.querySelectorAll('[role=tab]').forEach(x=>x.setAttribute('aria-selected','false'));tab.setAttribute('aria-selected','true');renderChannel(tab.dataset.channel)}));
function renderVoc(filter='all'){const list=filter==='all'?vocs:vocs.filter(v=>v.theme===filter);document.querySelector('#vocCount').textContent=`${list.length}건`;document.querySelector('#vocList').innerHTML=list.map(v=>`<article><span>${v.channel}</span><p>${v.text}</p><b>${v.theme}</b></article>`).join('');const needs=list.filter(v=>v.theme==='근거요청').length;const action=list.filter(v=>v.theme==='행동요청').length;document.querySelector('#vocReading').innerHTML=`<span>이번 필터에서 읽은 것</span><strong>${filter==='all'?'공감 뒤에 근거와 행동이 필요했습니다.':filter==='공감'?'훈계보다 함께 이해하는 태도에 반응했습니다.':filter==='근거요청'?'숫자의 출처·비교 기준·적용 조건이 필요했습니다.':'분석 이후 바로 할 수 있는 행동을 요청했습니다.'}</strong><dl><div><dt>근거 요청</dt><dd>${needs}건</dd></div><div><dt>행동 요청</dt><dd>${action}건</dd></div></dl><p>가상 반응을 분류한 결과이며 실제 고객 조사나 고객 비율을 뜻하지 않습니다.</p>`;}
document.querySelectorAll('.voc-filter').forEach(button=>button.addEventListener('click',()=>{document.querySelectorAll('.voc-filter').forEach(x=>x.classList.remove('active'));button.classList.add('active');renderVoc(button.dataset.filter)}));
document.querySelector('#printButton').addEventListener('click',()=>window.print());
window.addEventListener('scroll',()=>{const max=document.documentElement.scrollHeight-innerHeight;document.querySelector('#progressBar').style.width=`${max?scrollY/max*100:0}%`;},{passive:true});
renderSignal('cost');renderChannel('meta');renderVoc();
