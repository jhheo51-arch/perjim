import { MAX_RESPONSES, nextDecision, summarizeResponses, validateResponse } from "./message-check-model.mjs";

const storageKey = "trend-to-trust-message-test-v1";
const form = document.querySelector("#messageTestForm");
const notice = document.querySelector("#formNotice");
const read = () => JSON.parse(localStorage.getItem(storageKey) || "[]");
const write = responses => localStorage.setItem(storageKey, JSON.stringify(responses));

document.querySelectorAll(".scale").forEach(container => {
  const name = container.dataset.name;
  container.innerHTML = [1, 2, 3, 4, 5].map(value => `<label>${value}<input type="radio" name="${name}" value="${value}"></label>`).join("");
});

function render() {
  const summary = summarizeResponses(read());
  document.querySelector("#responseTotal").textContent = summary.total;
  document.querySelector("#countA").textContent = `${summary.countA}명`;
  document.querySelector("#countB").textContent = `${summary.countB}명`;
  document.querySelector("#barA").style.width = `${summary.total ? summary.countA / summary.total * 100 : 0}%`;
  document.querySelector("#barB").style.width = `${summary.total ? summary.countB / summary.total * 100 : 0}%`;
  document.querySelector("#clarityResult").textContent = summary.clarity ? `${summary.clarity}/5` : "—";
  document.querySelector("#tossLikeResult").textContent = summary.tossLike ? `${summary.tossLike}/5` : "—";
  document.querySelector("#actionResult").textContent = summary.actionIntent ? `${summary.actionIntent}/5` : "—";
  document.querySelector("#decision").textContent = nextDecision(summary);
}

form.addEventListener("submit", event => {
  event.preventDefault();
  const data = Object.fromEntries(new FormData(form));
  const checked = form.querySelector("input[name='preferredMessage']:checked");
  data.preferredMessage = checked?.value;
  const result = validateResponse(data);
  if (!result.valid) { notice.textContent = result.error; notice.classList.add("error"); return; }
  const responses = read();
  const index = responses.findIndex(item => item.participantId === result.value.participantId);
  if (index >= 0) responses[index] = result.value; else if (responses.length < MAX_RESPONSES) responses.push(result.value); else { notice.textContent = "이미 5명의 응답이 저장되어 있습니다. 수정하려면 같은 참여자 번호를 선택하세요."; notice.classList.add("error"); return; }
  write(responses); form.reset(); notice.textContent = `${result.value.participantId} 응답을 저장했습니다.`; notice.classList.remove("error"); render();
});

document.querySelector("#exportButton").addEventListener("click", () => {
  const payload = JSON.stringify({ exportedAt: new Date().toISOString(), responses: read(), summary: summarizeResponses(read()) }, null, 2);
  const url = URL.createObjectURL(new Blob([payload], { type: "application/json" }));
  const link = Object.assign(document.createElement("a"), { href: url, download: "message-test-results.json" });
  link.click(); URL.revokeObjectURL(url);
});

document.querySelector("#resetButton").addEventListener("click", () => {
  if (!window.confirm("이 브라우저에 저장된 응답을 모두 지울까요?")) return;
  localStorage.removeItem(storageKey); notice.textContent = "저장된 응답을 지웠습니다."; notice.classList.remove("error"); render();
});

render();
