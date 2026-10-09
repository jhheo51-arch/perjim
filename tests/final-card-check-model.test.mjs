import test from "node:test";
import assert from "node:assert/strict";
import { guidance, summarizeResponses, validateResponse } from "../src/final-card-check-model.mjs";

const answer = overrides => ({ participantId: "P01", amountBasis: "FOUR_X_18000", storyType: "FICTIONAL", featureConfusion: "NO", brandRole: "EASY_UNDERSTANDING", clarity: 5, interest: 4, ...overrides });

test("완성 카드 이해와 브랜드 역할 응답을 함께 저장한다", () => {
  const result = validateResponse(answer());
  assert.equal(result.valid, true);
  assert.equal(result.value.amountBasis, "FOUR_X_18000");
  assert.equal(result.value.brandRole, "EASY_UNDERSTANDING");
  assert.equal(validateResponse(answer({ storyType: "" })).valid, false);
  assert.equal(validateResponse(answer({ interest: 6 })).valid, false);
});

test("계산 이해와 기능 오해를 나누고 자동 성공 판정을 하지 않는다", () => {
  const responses = Array.from({ length: 5 }, (_, index) => validateResponse(answer({ participantId: `P0${index + 1}`, featureConfusion: index === 0 ? "YES" : "NO", clarity: index === 0 ? 3 : 5 })).value);
  const summary = summarizeResponses(responses);
  assert.equal(summary.correctAmount, 5);
  assert.equal(summary.fictionalStory, 5);
  assert.equal(summary.featureConfusionYes, 1);
  assert.equal(summary.clarity, 4.6);
  assert.doesNotMatch(guidance(summary), /성공|합격|완료/);
});
