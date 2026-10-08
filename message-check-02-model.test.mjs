import test from "node:test";
import assert from "node:assert/strict";
import { guidance, summarizeResponses, validateResponse } from "./message-check-02-model.mjs";

const answer = overrides => ({ participantId: "P01", preferredMessage: "B", featureConfusion: "NO", clarityA: 3, clarityB: 5, interestA: 2, interestB: 4, ...overrides });

test("두 문장의 점수를 따로 저장하고 빠진 점수는 거절한다", () => {
  const result = validateResponse(answer());
  assert.equal(result.valid, true);
  assert.equal(result.value.clarityA, 3);
  assert.equal(result.value.clarityB, 5);
  assert.equal(validateResponse(answer({ clarityB: undefined })).valid, false);
  assert.equal(validateResponse(answer({ featureConfusion: "" })).valid, false);
});

test("선택 수와 기능 오해를 별도 집계하며 작은 표본에서 자동 승자를 선언하지 않는다", () => {
  const responses = Array.from({ length: 5 }, (_, index) => validateResponse(answer({ participantId: `P0${index + 1}`, featureConfusion: index === 0 ? "YES" : "NO" })).value);
  const summary = summarizeResponses(responses);
  assert.deepEqual({ A: summary.countA, B: summary.countB, same: summary.countSame, confusion: summary.featureConfusionYes }, { A: 0, B: 5, same: 0, confusion: 1 });
  assert.equal(summary.clarityA, 3);
  assert.equal(summary.clarityB, 5);
  assert.doesNotMatch(guidance(summary), /우수|승리|성공/);
});
