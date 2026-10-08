export const TEST_ID = "trend-to-trust-message-test-v2";
export const MAX_RESPONSES = 5;
export const MESSAGES = Object.freeze({
  A: "배달비가 18% 늘었어요.",
  B: "18% 늘어난 배달비, 야근한 화요일 4번을 함께 돌아봐요."
});

export function validateResponse(input) {
  const participantId = String(input.participantId ?? "").trim();
  const preferredMessage = String(input.preferredMessage ?? "");
  const featureConfusion = String(input.featureConfusion ?? "");
  const names = ["clarityA", "clarityB", "interestA", "interestB"];
  const scores = Object.fromEntries(names.map(name => [name, Number(input[name]) ]));
  if (!/^P0[1-5]$/.test(participantId)) return { valid: false, error: "참여자 번호는 P01부터 P05까지 사용합니다." };
  if (Object.values(scores).some(score => !Number.isInteger(score) || score < 1 || score > 5)) return { valid: false, error: "두 문장의 이해도와 계속 볼 의향을 모두 골라주세요." };
  if (!["A", "B", "SAME"].includes(preferredMessage)) return { valid: false, error: "더 이해하기 쉬운 문장을 골라주세요." };
  if (!["YES", "NO", "UNSURE"].includes(featureConfusion)) return { valid: false, error: "실제 기능처럼 느껴졌는지도 골라주세요." };
  return { valid: true, value: {
    participantId, preferredMessage, featureConfusion, ...scores,
    reason: String(input.reason ?? "").trim().slice(0, 500),
    missing: String(input.missing ?? "").trim().slice(0, 500),
    submittedAt: new Date().toISOString()
  } };
}

export function summarizeResponses(responses) {
  const total = responses.length;
  const count = value => responses.filter(response => response.preferredMessage === value).length;
  const average = key => total ? Number((responses.reduce((sum, item) => sum + item[key], 0) / total).toFixed(1)) : null;
  return {
    total, countA: count("A"), countB: count("B"), countSame: count("SAME"),
    clarityA: average("clarityA"), clarityB: average("clarityB"),
    interestA: average("interestA"), interestB: average("interestB"),
    featureConfusionYes: responses.filter(response => response.featureConfusion === "YES").length,
    featureConfusionUnsure: responses.filter(response => response.featureConfusion === "UNSURE").length
  };
}

export function guidance(summary) {
  if (summary.total < MAX_RESPONSES) return "응답을 모은 뒤 선택 이유와 점수를 함께 읽습니다.";
  return "5명 응답이 모였습니다. 선택 이유와 기능 오해 여부를 읽고 다음 문장을 결정합니다.";
}
