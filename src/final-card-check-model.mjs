export const TEST_ID = "trend-to-trust-final-card-check";
export const MAX_RESPONSES = 5;
export const CORRECT = Object.freeze({
  amountBasis: "FOUR_X_18000",
  storyType: "FICTIONAL",
  brandRole: "EASY_UNDERSTANDING"
});

const allowed = Object.freeze({
  amountBasis: ["FOUR_X_18000", "FOUR_X_72000", "INCREASE_18", "UNSURE"],
  storyType: ["FICTIONAL", "REAL_DATA", "UNSURE"],
  featureConfusion: ["YES", "NO", "UNSURE"],
  brandRole: ["EASY_UNDERSTANDING", "SPENDING_JUDGE", "AUTO_ANALYSIS", "UNSURE"]
});

export function validateResponse(input) {
  const participantId = String(input.participantId ?? "").trim();
  if (!/^P0[1-5]$/.test(participantId)) return { valid: false, error: "참여자 번호는 P01부터 P05까지 사용합니다." };
  for (const [name, values] of Object.entries(allowed)) {
    if (!values.includes(String(input[name] ?? ""))) return { valid: false, error: "모든 객관식 질문에 답해주세요." };
  }
  const clarity = Number(input.clarity);
  const interest = Number(input.interest);
  if (![clarity, interest].every(score => Number.isInteger(score) && score >= 1 && score <= 5)) return { valid: false, error: "이해도와 계속 볼 의향을 모두 골라주세요." };
  return { valid: true, value: {
    participantId,
    amountBasis: String(input.amountBasis),
    storyType: String(input.storyType),
    featureConfusion: String(input.featureConfusion),
    brandRole: String(input.brandRole),
    clarity,
    interest,
    impression: String(input.impression ?? "").trim().slice(0, 500),
    confusing: String(input.confusing ?? "").trim().slice(0, 500),
    submittedAt: new Date().toISOString()
  } };
}

export function summarizeResponses(responses) {
  const total = responses.length;
  const count = (key, value) => responses.filter(response => response[key] === value).length;
  const average = key => total ? Number((responses.reduce((sum, item) => sum + item[key], 0) / total).toFixed(1)) : null;
  return {
    total,
    correctAmount: count("amountBasis", CORRECT.amountBasis),
    fictionalStory: count("storyType", CORRECT.storyType),
    featureConfusionYes: count("featureConfusion", "YES"),
    featureConfusionUnsure: count("featureConfusion", "UNSURE"),
    intendedBrandRole: count("brandRole", CORRECT.brandRole),
    clarity: average("clarity"),
    interest: average("interest")
  };
}

export function guidance(summary) {
  if (summary.total < MAX_RESPONSES) return "5건이 모이기 전에는 결과를 표시하지 않습니다.";
  return "5건이 모였습니다. 오답과 자유 응답을 읽고 다음 카드에서 바꿀 한 가지를 결정합니다.";
}
