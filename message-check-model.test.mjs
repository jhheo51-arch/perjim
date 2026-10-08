import test from "node:test";
import assert from "node:assert/strict";
import { nextDecision, summarizeResponses, validateResponse } from "./message-check-model.mjs";

const response = overrides => ({ participantId: "P01", preferredMessage: "B", clarity: 4, tossLike: 4, actionIntent: 3, ...overrides });

test("익명 번호와 1~5점 응답만 저장한다", () => {
  assert.equal(validateResponse(response()).valid, true);
  assert.equal(validateResponse(response({ participantId: "민수" })).valid, false);
  assert.equal(validateResponse(response({ clarity: 6 })).valid, false);
});

test("응답 요약은 선택 수와 평균을 분리한다", () => {
  const summary = summarizeResponses([response(), response({ participantId: "P02", preferredMessage: "A", clarity: 5 })]);
  assert.deepEqual(summary, { total: 2, countA: 1, countB: 1, clarity: 4.5, tossLike: 4, actionIntent: 3 });
});

test("5명 전에는 결론을 만들지 않는다", () => {
  assert.match(nextDecision(summarizeResponses([response()])), /5명/);
});
