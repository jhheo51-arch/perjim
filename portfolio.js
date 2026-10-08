const signalData={
  cost:{label:'선택한 경제 신호',title:'금액보다 “이번 달의 이유”를 설명할 기회',fact:'2026년 2분기 가계지출은 늘었지만 평균소비성향은 낮아졌습니다.',interpretation:'얼마를 썼는지만 보여주기보다 생활 장면과 지출의 관계를 이해하도록 돕는 가계부 콘텐츠가 필요하다는 가설을 세웠습니다.'},
  trust:{label:'선택한 플랫폼 신호',title:'소셜에서도 신뢰할 수 있는 금융 설명이 필요',fact:'YouTube는 한국 이용자의 94%가 정보와 지식을 얻기 위해 서비스를 활용한다고 밝혔습니다.',interpretation:'짧은 흥미 유도 뒤에 출처와 계산 과정을 이어주는 콘텐츠 구조를 선택했습니다.'},
  depth:{label:'선택한 문화 신호',title:'짧게 발견하고, 깊게 이해하는 이중 구조',fact:'YouTube는 장편 콘텐츠와 인간의 노력이 다시 가치를 얻는 흐름을 제시했습니다.',interpretation:'3초 광고로 끝내지 않고 3분 설명과 온드 채널 근거로 깊이를 확장했습니다.'}
};
const channels={
  meta:{number:'01',name:'Meta',role:'생활 장면으로 멈춰 세우기',hook:'“배달비가 늘어난 건, 야근한 화요일 때문이에요.”',format:'9:16 릴스 6초 → 가계부 카드 4장',structure:['0–2초 · 야근한 화요일의 영수증','3–4초 · 배달비 변화와 비교 기준','5–6초 · “이번 달의 이유 보기”'],metric:'3초 시청률 · 저장률 · 가계부 콘텐츠 이동',tone:'공감은 빠르게, 숫자의 이유는 정확하게'},
  youtube:{number:'02',name:'YouTube · Google',role:'관심을 이해와 신뢰로 바꾸기',hook:'“가계부가 말해준 이번 달의 세 가지 이유”',format:'YouTube 3분 복기 영상 + Google 영상 캠페인 15초',structure:['발견 · 이번 달 달라진 지출','이해 · 생활 장면과 계산 기준','행동 · 다음 달 바꿀 한 가지'],metric:'15초 유지율 · 근거 구간 시청 · 가계부 진입',tone:'출처와 계산 과정을 숨기지 않기'},
  owned:{number:'03',name:'토스 온드 채널',role:'브랜드의 약속을 제품 경험으로 증명',hook:'“10월의 돈, 어디가 아니라 왜 썼는지 볼까요?”',format:'토스피드 ‘한 달의 이유’ + 앱 내 가계부 카드',structure:['한 문장 요약 · 무엇이 달라졌나','이유 · 날짜·시간·생활 장면','다음 행동 · 알림 또는 예산 점검'],metric:'이유 자세히 보기 · 알림 설정 · 다음 달 재방문',tone:'쉬운 언어와 충분한 근거를 같은 화면에'}
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
