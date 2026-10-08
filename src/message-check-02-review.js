import { TEST_ID, summarizeResponses } from "./message-check-02-model.mjs";

const summaryContainer = document.querySelector("#reviewSummary");
const responsesContainer = document.querySelector("#responses");
let responses = [];
try {
  const stored = JSON.parse(localStorage.getItem(TEST_ID) || "[]");
  if (Array.isArray(stored)) responses = stored;
} catch { /* No usable local result. */ }

const summary = summarizeResponses(responses);
const summaryCards = [
  ["응답 수", `${summary.total}/5`],
  ["더 쉬운 문장", `A ${summary.countA}명 · B ${summary.countB}명 · 비슷함 ${summary.countSame}명`],
  ["기능으로 오해", `${summary.featureConfusionYes}명 · 잘 모르겠음 ${summary.featureConfusionUnsure}명`]
];
for (const [label, value] of summaryCards) {
  const card = document.createElement("article");
  const caption = document.createElement("span");
  const number = document.createElement("strong");
  caption.textContent = label;
  number.textContent = value;
  card.append(caption, number);
  summaryContainer.append(card);
}

if (!responses.length) {
  const empty = document.createElement("p");
  empty.className = "empty";
  empty.textContent = "이 브라우저에 저장된 2차 응답이 없습니다. 응답을 입력한 브라우저에서 이 주소를 열어 주세요.";
  responsesContainer.append(empty);
}

for (const response of responses.slice().sort((a, b) => String(a.participantId).localeCompare(String(b.participantId)))) {
  const card = document.createElement("article");
  card.className = "response-card";
  const heading = document.createElement("h2");
  heading.textContent = response.participantId;
  const scores = document.createElement("dl");
  const fields = [
    ["더 쉬운 문장", response.preferredMessage === "SAME" ? "비슷함" : response.preferredMessage],
    ["이해도 A / B", `${response.clarityA} / ${response.clarityB}`],
    ["계속 볼 의향 A / B", `${response.interestA} / ${response.interestB}`],
    ["기능으로 오해", { YES: "네", NO: "아니요", UNSURE: "잘 모르겠어요" }[response.featureConfusion] || "미기록"]
  ];
  for (const [label, value] of fields) {
    const item = document.createElement("div");
    const term = document.createElement("dt");
    const description = document.createElement("dd");
    term.textContent = label;
    description.textContent = value;
    item.append(term, description);
    scores.append(item);
  }
  card.append(heading, scores);
  for (const [label, value] of [["선택 이유", response.reason], ["더 알고 싶은 점", response.missing]]) {
    const paragraph = document.createElement("p");
    const title = document.createElement("strong");
    const content = document.createElement("span");
    title.textContent = label;
    content.textContent = value || "작성하지 않음";
    paragraph.append(title, content);
    card.append(paragraph);
  }
  responsesContainer.append(card);
}
