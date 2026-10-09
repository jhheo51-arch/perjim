import { TEST_ID, MAX_RESPONSES, CORRECT, validateResponse, summarizeResponses, guidance } from "./final-card-check-model.mjs";

const form = document.querySelector("#finalCardForm");
const notice = document.querySelector("#formNotice");
const read = () => {
  try {
    const saved = JSON.parse(localStorage.getItem(TEST_ID) || "[]");
    return Array.isArray(saved) ? saved : [];
  } catch { return []; }
};
const write = responses => localStorage.setItem(TEST_ID, JSON.stringify(responses));

document.querySelectorAll(".scale").forEach(container => {
  for (let value = 1; value <= 5; value += 1) {
    const label = document.createElement("label");
    const input = document.createElement("input");
    input.type = "radio";
    input.name = container.dataset.name;
    input.value = String(value);
    input.setAttribute("aria-label", `${container.previousElementSibling.textContent} ${value}점`);
    label.append(String(value), input);
    container.append(label);
  }
});

function render() {
  const summary = summarizeResponses(read());
  document.querySelector("#responseTotal").textContent = summary.total;
  document.querySelectorAll("[data-final-result]").forEach(element => { element.hidden = summary.total < MAX_RESPONSES; });
  document.querySelector("#amountResult").textContent = summary.total ? `${summary.correctAmount} / ${summary.total}` : "—";
  document.querySelector("#fictionResult").textContent = summary.total ? `${summary.fictionalStory} / ${summary.total}` : "—";
  document.querySelector("#confusionResult").textContent = summary.total ? `예 ${summary.featureConfusionYes}, 불확실 ${summary.featureConfusionUnsure}` : "—";
  document.querySelector("#brandResult").textContent = summary.total ? `${summary.intendedBrandRole} / ${summary.total}` : "—";
  document.querySelector("#clarityResult").textContent = summary.total ? `${summary.clarity} / 5` : "—";
  document.querySelector("#interestResult").textContent = summary.total ? `${summary.interest} / 5` : "—";
  document.querySelector("#decision").textContent = guidance(summary);
}

form.addEventListener("submit", event => {
  event.preventDefault();
  const result = validateResponse(Object.fromEntries(new FormData(form)));
  if (!result.valid) { notice.textContent = result.error; notice.classList.add("error"); return; }
  const responses = read();
  const index = responses.findIndex(item => item.participantId === result.value.participantId);
  if (index >= 0) responses[index] = result.value;
  else if (responses.length < MAX_RESPONSES) responses.push(result.value);
  else { notice.textContent = "이미 5건이 저장되어 있습니다. 수정하려면 같은 참여자 번호를 선택하세요."; notice.classList.add("error"); return; }
  write(responses);
  form.reset();
  notice.textContent = `${result.value.participantId} 응답을 저장했습니다.`;
  notice.classList.remove("error");
  notice.focus?.();
  render();
});

document.querySelector("#exportButton").addEventListener("click", () => {
  const responses = read();
  if (!responses.length) { notice.textContent = "저장된 응답이 없습니다."; return; }
  const payload = JSON.stringify({ testId: TEST_ID, exportedAt: new Date().toISOString(), correctAnswers: CORRECT, responses, summary: summarizeResponses(responses) }, null, 2);
  const url = URL.createObjectURL(new Blob([payload], { type: "application/json" }));
  const link = Object.assign(document.createElement("a"), { href: url, download: "final-card-check-results.json" });
  link.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
});

document.querySelector("#resetButton").addEventListener("click", () => {
  if (!window.confirm("이 브라우저에 저장된 완성 카드 응답을 모두 지울까요?")) return;
  localStorage.removeItem(TEST_ID);
  notice.textContent = "완성 카드 응답을 지웠습니다.";
  notice.classList.remove("error");
  render();
});

render();
