import { TEST_ID, MAX_RESPONSES, MESSAGES, validateResponse, summarizeResponses, guidance } from "./message-check-02-model.mjs";

const form = document.querySelector("#messageTestForm");
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

document.querySelector("#participantId").addEventListener("change", event => {
  const cards = document.querySelector("#variantCards");
  const order = Number(event.target.value.slice(-1)) % 2 === 0 ? ["B", "A"] : ["A", "B"];
  for (const key of order) cards.append(cards.querySelector(`[data-variant="${key}"]`));
});

function render() {
  const summary = summarizeResponses(read());
  document.querySelector("#responseTotal").textContent = summary.total;
  document.querySelectorAll("[data-final-result]").forEach(element => { element.hidden = summary.total < MAX_RESPONSES; });
  for (const key of ["A", "B"]) {
    document.querySelector(`#count${key}`).textContent = `${summary[`count${key}`]}명`;
    document.querySelector(`#bar${key}`).style.width = `${summary.total ? summary[`count${key}`] / summary.total * 100 : 0}%`;
  }
  document.querySelector("#countSame").textContent = `${summary.countSame}명`;
  const pair = (a, b) => summary.total ? `${summary[a]} / ${summary[b]}` : "—";
  document.querySelector("#clarityResult").textContent = pair("clarityA", "clarityB");
  document.querySelector("#interestResult").textContent = pair("interestA", "interestB");
  document.querySelector("#confusionResult").textContent = summary.total ? `${summary.featureConfusionYes}명 · 잘 모르겠어요 ${summary.featureConfusionUnsure}명` : "—";
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
  else { notice.textContent = "이미 5명의 응답이 저장되어 있습니다. 수정하려면 같은 참여자 번호를 선택하세요."; notice.classList.add("error"); return; }
  write(responses);
  form.reset();
  notice.textContent = `${result.value.participantId} 응답을 저장했습니다.`;
  notice.classList.remove("error");
  render();
});

document.querySelector("#exportButton").addEventListener("click", () => {
  const responses = read();
  if (!responses.length) { notice.textContent = "저장된 응답이 없습니다."; return; }
  const payload = JSON.stringify({ testId: TEST_ID, exportedAt: new Date().toISOString(), messages: MESSAGES, responses, summary: summarizeResponses(responses) }, null, 2);
  const url = URL.createObjectURL(new Blob([payload], { type: "application/json" }));
  const link = Object.assign(document.createElement("a"), { href: url, download: "message-test-02-results.json" });
  link.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
});

document.querySelector("#resetButton").addEventListener("click", () => {
  if (!window.confirm("이 브라우저에 저장된 2차 응답만 모두 지울까요?")) return;
  localStorage.removeItem(TEST_ID);
  notice.textContent = "2차 응답을 지웠습니다.";
  notice.classList.remove("error");
  render();
});

render();
