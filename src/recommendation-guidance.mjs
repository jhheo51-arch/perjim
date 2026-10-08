export const guidanceSources={
 writing:{title:'토스의 글쓰기 원칙',url:'https://toss.tech/article/21022',date:'2022-11-15'},
 experiment:{title:'푸시 실험과 지표 해석',url:'https://toss.tech/article/41147',date:'2025-10-01'},
 retention:{title:'만보기의 실패에서 바꾼 판단',url:'https://toss.tech/article/undercover-silo-3',date:'2025-07-21'},
 culture:{title:'토스피드 안정감 프로젝트',url:'https://toss.im/tossfeed/article/findyoursafezone-2d',date:'2026-09-29'}
};
export function deliveryReview(next){
 if(next.kind!=='observed')return {status:'needs-evidence',intro:'공개 글을 확인하기 전에는 개별 문구와 검증안을 정하지 않습니다.',items:[]};
 const anchor=next.evidence[0].title;
 return {status:'proposal',intro:`"${anchor}"에서 이어갈 실행 전 검토입니다. 아래 방법은 제품 사례에서 참고해 SNS에 맞게 설계한 제안입니다.`,items:[
 {title:'첫 장면에 남길 말 하나',draft:`${anchor}에서 더 알려주고 싶은 한 가지`,action:'질문이나 장면 하나로 시작하고, 출처와 적용 조건은 다음 부분에 적으세요. 모르는 말을 설명하지 않고 넘기거나 공유를 강요하지 않습니다.',check:'처음 보는 사람에게 무엇을 말하는 글인지 물어보세요. 서로 다른 주제로 이해하면 첫 장면을 다시 씁니다.',source:'writing'},
 {title:'관심 소재를 내 경험과 연결',draft:'이 소재를 내가 직접 말할 이유',action:'현재 관심 소재를 선택했다면 기준 글과 연결되는 실제 장면을 찾으세요. 주제, 독자의 상황과 내 관점 중 연결 고리를 설명할 수 없으면 이번 글에는 사용하지 않습니다.',check:'유행한 단어를 뺀 뒤에도 이 계정에서 다룰 이유가 남는지 확인하세요. 관련 경험이 없으면 유행 적용을 보류합니다.',source:'culture'},
 {title:'좋은 비율이 더 많은 반응을 뜻할까',draft:'공유 수와 공유율을 각각 비교',action:'게시 후 같은 관측 기간과 광고 조건에서 도달 수, 공유 수와 공유율을 함께 보세요. 저장도 별도로 비교합니다. 도달이 줄어 비율만 오른 경우를 메시지 개선으로 확정하지 않습니다.',check:'자료가 충분하면 첫 장면만 바꾸고 형식과 주제를 맞춰 비교하세요. 일반 게시물의 기간 비교는 무작위 실험이 아니므로 원인을 확정할 수 없습니다.',source:'experiment'},
 {title:'다음 편을 찾을 이유',draft:`"${anchor}"의 다음 질문을 마지막에 예고`,action:'처음 본 사람이 다음에 찾을 구체적인 상황을 남기세요. 첫날 조회나 보상성 참여만으로 팬이 생겼다고 판단하지 않습니다.',check:'다음 편의 방문 경로와 찾아온 이유를 확인하세요. 참여 요구가 부담스럽다는 반응이면 요구를 줄이고 콘텐츠에서 얻을 것을 먼저 보여줍니다.',source:'retention'}]};
}
