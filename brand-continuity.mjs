export const objectWord=s=>{const n=s.trim().charCodeAt(s.trim().length-1);return s+(n>=0xAC00&&n<=0xD7A3&&(n-0xAC00)%28?'을':'를');};
export function brandContinuity(topic,promise){const photo=/사진|색감|촬영|풍경/.test(topic),book=/책|독서|서평/.test(topic);return {
 promise,
 impression:photo?'나도 매일 지나는 길을 다르게 보고 싶다.':book?'내 일상과 이어지는 읽을거리를 찾았다.':`${objectWord(topic)} 내 생활과 연결해 생각하게 된다.`,
 trust:photo?'직접 촬영한 원본과 촬영 상황을 보여주세요. 사진의 색과 구도를 유지하세요.':book?'직접 읽은 경험과 인용 출처를 구분해 보여주세요.':'직접 경험한 내용과 확인한 출처를 구분해 보여주세요.',
 series:photo?'매주 발견한 동네의 색':book?'한 장면으로 연결하는 책과 일상':`${topic}, 일상에서 발견한 한 가지`,
 next:photo?'다음에는 같은 길의 아침과 저녁 색을 비교해 볼게요.':book?'다음에는 이 문장이 실제 하루에서 떠오른 순간을 이야기할게요.':`다음에는 ${objectWord(topic)} 직접 경험하며 달라진 점을 이어갈게요.`,
 bridge:photo?'비용 부담 없이 발견하는 동네의 색':book?'새로 사기 전에 다시 읽은 책에서 찾은 이야기':`${topic}에 쓰는 시간과 비용, 일상에서 달라지는 선택`,
 bridgeReason:'경제 소재는 독자의 생활 속 선택과 연결될 때 검토하세요. 이 문구는 소재 후보이며 소비 행동, 반응을 분석한 결과는 아닙니다.',
 production:[
 {role:'글 담당',task:`첫 문장과 마지막 문장에서 “${promise}”라는 관점을 일관되게 전달하세요. 직접 경험과 참여 질문을 붙이세요.`},
 {role:'디자인 담당',task:photo?'원본 사진 비율, 색을 보존하고, 글자가 핵심 장면을 가리지 않게 배치하세요.':'핵심 메시지 하나를 먼저 읽을 수 있게 배치하고 자료의 출처를 알아볼 수 있게 표시하세요.'},
 {role:'영상 담당',task:'직접 만든 장면 → 브랜드 관점 → 참여 질문 순서로 구성하세요. 설명과 영상이 같은 약속을 전달하는지 확인하세요.'},
 {role:'함께 확인',task:'메시지가 한 문장으로 이해되는지, 직접 경험과 출처가 보이는지, 다음 편을 기대할 이유가 있는지 확인하세요.'}
 ]
};}
