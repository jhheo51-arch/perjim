const $ = id => document.getElementById(id);
const esc = value => String(value ?? '').replace(/[&<>"']/g, char => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
const safe = value => {
  try {
    const url = new URL(value);
    return url.protocol === 'https:' && !url.username && !url.password ? url.href : '';
  } catch {
    return '';
  }
};
const sourceLink = (url, label) => safe(url) ? `<a href="${esc(url)}" target="_blank" rel="noopener">${esc(label)}</a>` : '';
const format = value => Number(value).toLocaleString('ko-KR');
const date = value => value ? new Date(value).toLocaleString('ko-KR',{timeZone:'Asia/Seoul'}) : '확인하지 못함';

function row({role, source, state, body, links = ''}) {
  return `<article class="signal-row">
    <div><span class="signal-label">역할</span><strong>${esc(role)}</strong></div>
    <div><span class="signal-label">자료</span><strong>${esc(source)}</strong></div>
    <div><span class="signal-label">현재 확인</span><span class="signal-state ${esc(state.kind)}">${esc(state.label)}</span><div class="signal-body">${body}</div></div>
    <div><span class="signal-label">다음 확인</span><div class="signal-links">${links}</div></div>
  </article>`;
}

function googleRow(feed, keyword) {
  const normalized = keyword.toLowerCase();
  const item = (feed?.items || []).find(candidate => candidate.title.toLowerCase() === normalized)
    || (feed?.items || []).find(candidate => candidate.title.toLowerCase().includes(normalized) || normalized.includes(candidate.title.toLowerCase()));
  const url = new URL('https://trends.google.co.kr/trends/explore');
  url.searchParams.set('geo','KR');
  url.searchParams.set('q',keyword);
  return row({
    role:'새 소재 발견',
    source:'Google Trends 급상승',
    state:item ? {kind:'ready',label:'현재 피드에서 확인'} : {kind:'unknown',label:'현재 피드에서 확인하지 못함'},
    body:item
      ? `<p><b>검색량 표시 ${esc(item.traffic || '미제공')}</b><br>발생 ${date(item.date)}, 연결 기사 ${item.news?.length || 0}건</p><p class="muted">피드 제공 표시이며 고유 검색자 수나 SNS 공유 수가 아닙니다.</p>`
      : '<p>일치 항목이 없다는 것은 관심이 0이라는 뜻이 아닙니다. 탐색 화면에서 기간과 지역을 정해 확인하세요.</p>',
    links:sourceLink(url.href,'검색 흐름 확인')
  });
}

function naverRow(naver, keyword) {
  const url = new URL('https://datalab.naver.com/keyword/trendSearch.naver');
  if (naver.status === 'ready' && naver.summary) {
    const change = naver.summary.changePercent;
    const direction = change === null ? '이전 기간이 0이라 변화율 계산 안 됨' : `${change > 0 ? '+' : ''}${change}%`;
    return row({
      role:'국내 관심 검증',source:'네이버 데이터랩',state:{kind:'ready',label:'자동 확인'},
      body:`<p><b>최근 7일 평균 ${naver.summary.recentAverage}</b><br>이전 7일 평균 ${naver.summary.previousAverage}, 변화 ${esc(direction)}</p><p class="muted">한 번의 조회에서 계산한 상대 지수 평균입니다. 실제 검색 횟수가 아닙니다. ${esc(naver.summary.startDate)} ~ ${esc(naver.summary.endDate)}</p>`,
      links:sourceLink(url.href,'데이터랩 원문')
    });
  }
  const label = naver.status === 'needs-key' ? 'API Hub 인증값 연결 전' : '자동 확인 실패';
  const body = naver.status === 'needs-key'
    ? '<p>NAVER API Hub의 Client ID와 Secret을 로컬 설정에 넣으면 최근 7일과 이전 7일을 자동 비교합니다. 현재는 한시적으로 무료이며 유료 전환 시 별도 공지가 예정돼 있습니다.</p>'
    : `<p>${esc(naver.message || '자료를 읽지 못했습니다.')}</p>`;
  return row({role:'국내 관심 검증',source:'네이버 데이터랩',state:{kind:'pending',label},body,links:`${sourceLink(url.href,'직접 확인')} ${sourceLink('https://guide.ncloud-docs.com/docs/apihub-overview','API Hub 안내')}`});
}

function youtubeRow(youtube, keyword) {
  const url = new URL('https://www.youtube.com/results');
  url.searchParams.set('search_query',keyword);
  if (youtube.status === 'ready') {
    const items = youtube.items || [];
    const body = items.length ? `<ul class="signal-items">${items.slice(0,3).map(item=>`<li>${sourceLink(item.url,item.title)}<br><small>${esc(item.channel)}, 현재 누적 조회 ${format(item.viewCount)}, 댓글 ${item.commentCount === null ? '미제공' : format(item.commentCount)}</small></li>`).join('')}</ul><p class="muted">최근 공개 영상을 검색한 결과입니다. 조회와 댓글은 현재 누적값이며 해당 기간에 발생한 수가 아닙니다.</p>` : '<p>현재 조건에서 확인한 영상이 없습니다. 관심이 0이라는 뜻은 아닙니다.</p>';
    return row({role:'영상과 문화 반응',source:'YouTube',state:{kind:'ready',label:`공개 영상 ${items.length}건 확인`},body,links:sourceLink(url.href,'YouTube에서 더 보기')});
  }
  const label = youtube.status === 'needs-key' ? '무료 인증값 연결 전' : '자동 확인 실패';
  const body = youtube.status === 'needs-key' ? '<p>YouTube API Key를 로컬 설정에 넣으면 최근 공개 영상과 현재 누적 반응을 확인합니다.</p>' : `<p>${esc(youtube.message || '자료를 읽지 못했습니다.')}</p>`;
  return row({role:'영상과 문화 반응',source:'YouTube Data API',state:{kind:'pending',label},body,links:`${sourceLink(url.href,'직접 검색')} ${sourceLink('https://developers.google.com/youtube/v3/getting-started','무료 할당량 안내')}`});
}

function newsRow(news, keyword) {
  const bigkinds = new URL('https://www.bigkinds.or.kr/');
  const items = news.items || [];
  const body = items.length ? `<ul class="signal-items">${items.slice(0,3).map(item=>`<li>${sourceLink(item.url,item.title)}<br><small>${esc(item.publisher)}, ${date(item.publishedAt)}</small></li>`).join('')}</ul><p class="muted">Google 뉴스 RSS에 연결된 기사 표본입니다. 한국어 키워드는 한국어 매체명이 확인된 자료를 우선합니다. 전체 기사 수나 대중의 호감이 아닙니다.</p>` : `<p>${esc(news.message || '연결된 최근 기사를 확인하지 못했습니다.')}</p>`;
  return row({role:'사건 배경 확인',source:'Google 뉴스와 빅카인즈',state:items.length?{kind:'ready',label:`연결 기사 ${items.length}건`}:{kind:'unknown',label:'기사 확인하지 못함'},body,links:`${sourceLink(news.source,'Google 뉴스 결과')} ${sourceLink(bigkinds.href,'빅카인즈에서 맥락 확인')}`});
}

function cultureRow() {
  return row({
    role:'신조어와 생활 맥락',source:'트렌드어워드와 썸트렌드',state:{kind:'manual',label:'공개 원문에서 확인'},
    body:'<p>신조어의 뜻과 사용 장면, 소셜 언급의 채널과 기간을 확인합니다. 현재 퍼짐이 전체 언급량을 자동 수집하지는 않습니다.</p>',
    links:`${sourceLink('https://maily.so/trendaword/posts','트렌드어워드')} ${sourceLink('https://some.co.kr/analysis/compare/mention','썸트렌드')}`
  });
}

function summary(keyword, feed, evidence) {
  const google = (feed?.items || []).some(item => item.title.toLowerCase().includes(keyword.toLowerCase()) || keyword.toLowerCase().includes(item.title.toLowerCase()));
  const naver = evidence.naver?.status === 'ready';
  const youtube = evidence.youtube?.status === 'ready' && evidence.youtube.items?.length;
  const news = evidence.news?.items?.length;
  const confirmed = [google,naver,youtube,news].filter(Boolean).length;
  const next = confirmed >= 2
    ? '서로 다른 자료에서 관심 신호가 확인됐습니다. 이제 내 브랜드가 이 주제에 제공할 경험이나 정보가 있는지 검토하세요.'
    : '현재 자동 자료만으로는 여러 신호가 함께 확인되지 않았습니다. 억지로 연결하지 말고 원문 맥락이나 다른 키워드를 확인하세요.';
  return `<section class="signal-decision"><span class="tag">퍼짐의 다음 판단</span><h4>${esc(keyword)}을(를) 콘텐츠에 쓸까요?</h4><p>${next}</p><p class="muted">확인된 자료의 수는 품질 점수가 아닙니다. 검색, 영상, 뉴스의 단위가 달라 합산하지 않습니다.</p><button type="button" class="primary" id="signal-use">내 브랜드와 연결 검토</button></section>`;
}

export async function reviewTrendEvidence(keyword) {
  const clean = String(keyword || '').trim();
  if (clean.length < 2 || clean.length > 50) {
    $('signal-status').textContent = '두 글자 이상 50자 이하의 키워드를 입력해 주세요.';
    return;
  }
  const button = $('signal-check');
  button.disabled = true;
  $('signal-status').textContent = `“${clean}”의 다섯 자료를 확인하고 있습니다…`;
  $('signal-results').innerHTML = '';
  try {
    const [feedResponse,evidenceResponse] = await Promise.all([
      fetch('/api/trends'),
      fetch('/api/trend-evidence',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({keyword:clean})})
    ]);
    const feed = await feedResponse.json();
    const evidence = await evidenceResponse.json();
    if (!feedResponse.ok) throw Error(feed.error || 'Google Trends 자료를 읽지 못했습니다.');
    if (!evidenceResponse.ok) throw Error(evidence.error || '비교 자료를 읽지 못했습니다.');
    $('signal-results').innerHTML = [googleRow(feed,clean),naverRow(evidence.naver,clean),youtubeRow(evidence.youtube,clean),newsRow(evidence.news,clean),cultureRow(),summary(clean,feed,evidence)].join('');
    $('signal-status').textContent = `다섯 자료 확인 완료, ${date(evidence.checkedAt)}. 자동 연결되지 않은 자료는 연결 전 또는 원문 확인으로 표시했습니다.`;
    $('signal-use').onclick = () => window.dispatchEvent(new CustomEvent('trend-evidence-use',{detail:{keyword:clean,summary:`Google Trends, 네이버, YouTube와 뉴스의 확인 범위를 나눠 검토했습니다. 확인 ${date(evidence.checkedAt)}. 검색 관심은 SNS 성과가 아닙니다.`,source:'https://trends.google.com/trending?geo=KR'}}));
  } catch (error) {
    $('signal-status').textContent = `자료 확인 실패: ${error.message}`;
    $('signal-results').innerHTML = '<article class="panel"><h4>새 자료를 표시하지 못했습니다</h4><p>기존 화면의 원문 링크에서 직접 확인할 수 있습니다.</p></article>';
  } finally {
    button.disabled = false;
  }
}

export function setupTrendEvidence() {
  $('signal-form').onsubmit = event => {
    event.preventDefault();
    reviewTrendEvidence($('signal-keyword').value);
  };
}
