export const MAX_RESPONSES = 5;

export function validateResponse(input) {
  const participantId = String(input.participantId ?? "").trim();
  const preferredMessage = input.preferredMessage;
  const scores = [input.clarity, input.tossLike, input.actionIntent].map(Number);

  if (!/^P0[1-5]$/.test(participantId)) return { valid: false, error: "참여자 번호는 P01부터 P05까지 사용합니다." };
  if (!["A", "B"].includes(preferredMessage)) return { valid: false, error: "더 이해하기 쉬운 문장을 하나 골라주세요." };
  if (scores.some(score => !Number.isInteger(score) || score < 1 || score > 5)) return { valid: false, error: "세 가지 점수를 모두 골라주세요." };

  return {
    valid: true,
    value: {
      participantId,
      preferredMessage,
      clarity: scores[0],
      tossLike: scores[1],
      actionIntent: scores[2],
      reason: String(input.reason ?? "").trim().slice(0, 500),
      friction: String(input.friction ?? "").trim().slice(0, 500),
      submittedAt: input.submittedAt ?? new Date().toISOString()
    }
  };
}

export function summarizeResponses(responses) {
  const total = responses.length;
  const countA = responses.filter(item => item.preferredMessage === "A").length;
  const countB = responses.filter(item => item.preferredMessage === "B").length;
  const average = key => total ? Number((responses.reduce((sum, item) => sum + Number(item[key] || 0), 0) / total).toFixed(1)) : null;

  return { total, countA, countB, clarity: average("clarity"), tossLike: average("tossLike"), actionIntent: average("actionIntent") };
}

export function nextDecision(summary) {
  if (summary.total < MAX_RESPONSES) return "응답을 5명까지 모은 뒤 문구를 판단합니다.";
  if (summary.countB >= 4 && summary.clarity >= 4) return "문장 B를 유지하고 채널별 제작물로 확장합니다.";
  if (summary.countA >= 4) return "문장 A의 장점을 반영해 문장 B를 다시 다듬습니다.";
  return "선호가 갈렸습니다. 선택 이유와 불편 문구를 읽고 두 문장을 다시 만듭니다.";
}
