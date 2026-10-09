"""Build the editorial five-page Trend to Trust application portfolio."""

from pathlib import Path

from reportlab.lib import colors
from reportlab.lib.enums import TA_LEFT
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import ParagraphStyle
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.pdfgen import canvas
from reportlab.platypus import Paragraph


ROOT = Path(__file__).resolve().parents[1]
OUTPUT = ROOT / "docs/submission/Trend-to-Trust-Brand-Marketing-Response-2026-10-09.pdf"
FONT_DIR = Path("C:/Windows/Fonts")
pdfmetrics.registerFont(TTFont("Malgun", str(FONT_DIR / "malgun.ttf")))
pdfmetrics.registerFont(TTFont("Malgun-Bold", str(FONT_DIR / "malgunbd.ttf")))
pdfmetrics.registerFontFamily("Malgun", normal="Malgun", bold="Malgun-Bold")

W, H = A4
M = 43
INK = colors.HexColor("#191F28")
BLUE = colors.HexColor("#0064FF")
MID = colors.HexColor("#4E5968")
LIGHT = colors.HexColor("#F5F8FC")
PALE = colors.HexColor("#E8F3FF")
LINE = colors.HexColor("#D8E0E8")
WHITE = colors.white
ORANGE = colors.HexColor("#FFB070")


def word(c, value, x, y, size=10, color=INK, bold=False):
    c.setFillColor(color)
    c.setFont("Malgun-Bold" if bold else "Malgun", size)
    c.drawString(x, y, value)


def paragraph(c, value, x, top, width, size=9.2, leading=15.5, color=MID, bold=False):
    style = ParagraphStyle(
        "body", fontName="Malgun-Bold" if bold else "Malgun",
        fontSize=size, leading=leading, textColor=color,
        alignment=TA_LEFT, wordWrap="CJK",
    )
    p = Paragraph(value, style)
    _, height = p.wrap(width, H)
    p.drawOn(c, x, top - height)
    return height


def box(c, x, y, width, height, fill=WHITE, radius=13, stroke=None):
    c.setFillColor(fill)
    c.setStrokeColor(stroke or fill)
    c.roundRect(x, y, width, height, radius, fill=1, stroke=int(stroke is not None))


def hairline(c, y):
    c.setStrokeColor(LINE)
    c.setLineWidth(.7)
    c.line(M, y, W - M, y)


def footer(c, page):
    hairline(c, 39)
    word(c, "TREND TO TRUST  /  개인 제작, 토스 승인 전", M, 23, 7.4, MID)
    word(c, f"{page} / 5", W - M - 24, 23, 7.4, MID, True)


def heading(c, eyebrow, title, subtitle=None):
    word(c, eyebrow, M, H - 52, 8.4, BLUE, True)
    word(c, title, M, H - 101, 24, INK, True)
    if subtitle:
        paragraph(c, subtitle, M, H - 114, W - 2 * M, 9.2, 15.5)
    hairline(c, H - 164)


def pill(c, label, x, y, width, color=PALE, text_color=BLUE):
    box(c, x, y, width, 24, color, 12)
    word(c, label, x + 10, y + 7, 7.7, text_color, True)


c = canvas.Canvas(str(OUTPUT), pagesize=A4)
c.setTitle("Trend to Trust | Brand Marketing Portfolio")
c.setAuthor("Independent brand marketing portfolio")

# 01 / A cover that explains the work before the artifact list.
box(c, 0, H - 441, W, 441, INK, 0)
word(c, "BRAND MARKETING SPECIALIST  /  CASE 01", M, H - 55, 9, colors.HexColor("#9BC3FF"), True)
word(c, "Trend", M, H - 132, 43, WHITE, True)
word(c, "to Trust", M, H - 182, 43, WHITE, True)
paragraph(c, "트렌드와 공개 반응을 읽는 ‘퍼짐’에서 시작해<br/>토스 브랜드 콘텐츠 〈한 달의 이유〉로 발전시켰습니다.", M, H - 217, 475, 12.5, 22, WHITE)
pill(c, "확인한 신호", M, H - 354, 113, colors.HexColor("#2C4058"), WHITE)
pill(c, "브랜드 해석", M + 125, H - 354, 113, colors.HexColor("#2C4058"), WHITE)
pill(c, "제작과 검증", M + 250, H - 354, 118, colors.HexColor("#2C4058"), WHITE)
paragraph(c, "개인 기획. 브랜드 승인, 광고 집행, 제휴 접촉 전.", M, H - 378, 450, 9.1, 15, colors.HexColor("#D5E6FF"))

word(c, "이 프로젝트에서 한 일", M, H - 491, 17, INK, True)
steps = [
    ("01", "발견", "공개 자료의 관심과 생활 맥락을 구분해 기록"),
    ("02", "기획", "토스가 돈을 이해하도록 돕는다는 목표 설정"),
    ("03", "제작", "카드 6장, 원고, 채널별 제작안, 제휴안 작성"),
    ("04", "수정", "문장 응답 2회와 완성 카드 응답을 보고 카드 수정"),
]
for i, (num, title, body) in enumerate(steps):
    x = M + (i % 2) * 259
    y = H - 601 - (i // 2) * 107
    box(c, x, y, 249, 96, LIGHT, 12)
    word(c, num, x + 15, y + 65, 9, BLUE, True)
    word(c, title, x + 47, y + 62, 15, INK, True)
    paragraph(c, body, x + 15, y + 50, 219, 8.8, 14)
footer(c, 1)
c.showPage()

# 02 / Signal, interpretation and brand hypothesis.
heading(c, "01 / SIGNAL → BRAND ROLE", "가계부 숫자를 생활 이야기로 풀었습니다.",
        "공개 자료에서 경제와 콘텐츠 이용 흐름을 확인했습니다. 소비자 욕구에 관한 해석은 캠페인 가설로 남겼습니다.")
box(c, M, H - 343, 155, 152, LIGHT, 12)
box(c, M + 168, H - 343, 155, 152, PALE, 12)
box(c, M + 336, H - 343, 173, 152, LIGHT, 12)
for x, label, title, body in [
    (M, "확인한 범위", "공개 관심", "검색 관심과 콘텐츠 사례를 자료별 기간과 함께 확인했습니다."),
    (M + 168, "해석", "생활의 맥락", "지출한 금액과 그날의 사정을 함께 알고 싶을 것이라고 가정했습니다."),
    (M + 336, "브랜드 과제", "쉬운 이해", "토스가 돈을 이해하도록 돕는 브랜드로 기억되게 제안했습니다."),
]:
    word(c, label, x + 13, H - 219, 8.3, BLUE, True)
    word(c, title, x + 13, H - 254, 16, INK, True)
    paragraph(c, body, x + 13, H - 266, (173 if x == M + 336 else 155) - 26, 8.5, 13.5)

word(c, "브랜드 아이디어", M, H - 385, 9, BLUE, True)
box(c, M, H - 532, W - 2 * M, 128, INK, 14)
word(c, "한 달의 이유", M + 21, H - 452, 25, WHITE, True)
paragraph(c, "가상의 지출 내역을 제시하고 인물이 직접 그날의 이유를 설명하는 카드뉴스를 만들었습니다. 금액은 계산할 수 있게 적었습니다.", M + 21, H - 468, W - 2 * M - 42, 9.7, 16.5, WHITE)

word(c, "자료와 주장 사이의 경계", M, H - 577, 13, INK, True)
for i, (name, body) in enumerate([
    ("확인", "공개 자료, 문장 응답 2회와 완성 카드 응답, 각 5건"),
    ("가설", "‘생활 맥락’과 브랜드 인식의 연결"),
    ("가상", "카드 속 인물, 거래 금액, 야근 상황"),
]):
    y = H - 624 - i * 44
    box(c, M, y, W - 2 * M, 38, LIGHT, 8)
    word(c, name, M + 13, y + 13, 9, BLUE, True)
    word(c, body, M + 76, y + 13, 8.8, INK)
word(c, "토스 머니북 공식 자료 ↗", M, 74, 8.1, BLUE, True)
c.linkURL("https://toss.im/tossfeed/article/moneybook", (M, 67, M + 165, 86), relative=0)
word(c, "공개 자료와 해석 기록 ↗", M + 195, 74, 8.1, BLUE, True)
c.linkURL("https://github.com/jhheo51-arch/trend-to-trust/blob/main/docs/strategy/CASE-STUDY.md", (M + 195, 67, M + 390, 86), relative=0)
footer(c, 2)
c.showPage()

# 03 / Make the finished content visible and scannable.
heading(c, "02 / FINISHED CONTENT", "세 차례 반응을 반영한 카드 6장과 원고",
        "문장 응답 2회와 완성 카드 응답 5건을 반영한 미게시 제작물입니다.")
box(c, M, H - 604, 245, 408, BLUE, 13)
word(c, "한 달의 이유  /  EP.01", M + 18, H - 236, 8.5, WHITE, True)
word(c, "4번의", M + 18, H - 316, 28, WHITE, True)
word(c, "저녁.", M + 18, H - 354, 28, WHITE, True)
word(c, "72,000원.", M + 18, H - 411, 26, WHITE, True)
hair_x = M + 18
c.setStrokeColor(colors.HexColor("#A7CBFF"))
c.line(hair_x, H - 438, M + 227, H - 438)
paragraph(c, "숫자는 어디까지 말해줄까요?<br/>그날의 이유도 함께 돌아봅니다.", M + 18, H - 459, 207, 10.5, 18, WHITE)
paragraph(c, "가상 내역, 개인 포트폴리오 시안", M + 18, H - 562, 207, 7.8, 12, colors.HexColor("#D9E9FF"))

word(c, "6장의 서사", M + 270, H - 218, 11, INK, True)
sequence = [
    ("01", "4번의 저녁, 72,000원"),
    ("02", "18,000원 × 4건의 내역"),
    ("03", "가상 인물이 직접 적은 이유"),
    ("04", "돈의 숫자와 선택을 분리"),
    ("05", "내 소비를 돌아보는 질문"),
    ("06", "쉬운 이해라는 브랜드 약속"),
]
for i, (num, label) in enumerate(sequence):
    y = H - 271 - i * 52
    box(c, M + 270, y, 239, 43, LIGHT, 8)
    word(c, num, M + 282, y + 14, 8, BLUE, True)
    paragraph(c, label, M + 310, y + 30, 187, 8.7, 13, INK)

box(c, M, H - 713, W - 2 * M, 84, PALE, 11)
word(c, "원고까지 확장", M + 16, H - 656, 10, BLUE, True)
paragraph(c, "Meta 게시글 문안, 첫 뉴스레터와 7일 뒤 후속 뉴스레터를 썼습니다. 세 원고 모두 지출 한 건을 돌아보는 질문으로 끝납니다.", M + 16, H - 670, W - 2 * M - 32, 8.8, 14.5)
word(c, "전체 카드와 원고 보기  ↗", M, 76, 8.8, BLUE, True)
c.linkURL("https://jhheo51-arch.github.io/trend-to-trust/campaign-v04.html", (M, 68, 230, 90), relative=0)
footer(c, 3)
c.showPage()

# 04 / Media, partner and execution maturity.
heading(c, "03 / CHANNELS & PARTNERS", "채널별 형식과 확인 지표를 나눴습니다.",
        "매체별 소재와 외부 파트너의 역할을 설계했습니다. 실제 광고 집행과 제휴 접촉은 아직 없습니다.")
channels = [
    ("META", "피드 카드와 릴스", "첫 장에 금액을 쓰고, 다음 장에서 계산 근거를 보여줍니다.", "메시지 이해, 저장과 완독"),
    ("YOUTUBE / GOOGLE", "30초 영상 콘티", "금액, 내역, 인물의 설명 순서로 장면을 구성했습니다.", "시청 지속, 기능 오해"),
    ("TOSS OWNED", "카드와 뉴스레터", "긴 글에서 지출 이유를 풀고 7일 뒤 다시 묻습니다.", "브랜드 회상, 재방문"),
]
for i, (name, format_, role, metric) in enumerate(channels):
    y = H - 319 - i * 108
    box(c, M, y, W - 2 * M, 96, LIGHT if i != 1 else PALE, 12)
    word(c, name, M + 16, y + 70, 8.3, BLUE, True)
    word(c, format_, M + 16, y + 43, 14, INK, True)
    paragraph(c, role, M + 193, y + 76, 299, 8.7, 14)
    word(c, "확인할 것: " + metric, M + 193, y + 18, 8.2, MID)

word(c, "외부 플랫폼 선택", M, H - 578, 11, INK, True)
box(c, M, H - 726, W - 2 * M, 132, INK, 12)
word(c, "어피티  /  공동 연재 제안", M + 18, H - 626, 15, WHITE, True)
paragraph(c, "어피티, 오늘의집, 캐릿을 비교한 뒤 어피티와의 공동 연재안을 썼습니다. 독자가 글을 읽고 소비 한 건을 적은 뒤 7일 후 다시 돌아보는 구성입니다.", M + 18, H - 645, W - 2 * M - 36, 8.9, 15, WHITE)
paragraph(c, "역할 분담, 원고 검수, 비용과 권리 협의 항목을 적었습니다. 제안서를 보내거나 계약하지는 않았습니다.", M + 18, H - 694, W - 2 * M - 36, 8.1, 13, colors.HexColor("#D9E9FF"))
word(c, "매체안 ↗", M, 76, 8.8, BLUE, True)
c.linkURL("https://jhheo51-arch.github.io/trend-to-trust/campaign-kit-v02.html", (M, 68, M + 85, 90), relative=0)
word(c, "제휴안 ↗", M + 120, 76, 8.8, BLUE, True)
c.linkURL("https://jhheo51-arch.github.io/trend-to-trust/partner-proposal-v02.html", (M + 120, 68, M + 205, 90), relative=0)
footer(c, 4)
c.showPage()

# 05 / Completed learning loop and honest scope.
heading(c, "04 / LEARNING LOOP", "완성 카드 반응을 보고 세 번째 카드를 고쳤습니다.",
        "익명 응답 5건에서 반복된 기능 오해를 확인했습니다. 작은 표본이며 캠페인 성과로 해석하지 않습니다.")

metrics = [
    ("5 / 5", "계산 근거 이해"),
    ("5 / 5", "가상 사례 구분"),
    ("4 + 1", "기능 오해, 예 4 / 불확실 1"),
    ("0 / 5", "목표 브랜드 역할 선택"),
]
gap = 8
bw = (W - 2 * M - 3 * gap) / 4
for i, (value, label) in enumerate(metrics):
    x = M + i * (bw + gap)
    box(c, x, H - 330, bw, 139, PALE if i == 2 else LIGHT, 11)
    word(c, value, x + 13, H - 246, 20, INK, True)
    paragraph(c, label, x + 13, H - 263, bw - 26, 8.1, 12.5)

word(c, "확인한 문제", M, H - 376, 11, INK, True)
paragraph(c, "계산과 가상 설정은 전달됐지만 5명 모두 자동 분석 기능이 아니라고 확신하지 못했습니다. 자유 응답에서도 ‘분석한 내용’이 반복됐습니다.", M, H - 394, W - 2 * M, 9.1, 16)

box(c, M, H - 548, W - 2 * M, 104, INK, 12)
word(c, "세 번째 카드 수정", M + 17, H - 476, 9, colors.HexColor("#A9C9FF"), True)
word(c, "그날은 왜 주문했을까요?", M + 17, H - 513, 13, colors.HexColor("#F1AFAF"), True)
word(c, "→", M + 243, H - 513, 15, WHITE, True)
word(c, "그날의 이유는 직접 적었습니다.", M + 278, H - 513, 13, WHITE, True)
paragraph(c, "결제 내역 분석 결과가 아니라 가상 인물이 자기 생활을 직접 돌아본 기록이라고 제목과 본문에 표시했습니다.", M + 17, H - 520, W - 2 * M - 34, 8.5, 14, WHITE)

box(c, M, H - 677, W - 2 * M, 96, PALE, 10)
word(c, "본인 수행 범위", M + 14, H - 612, 9, BLUE, True)
paragraph(c, "공개 자료 조사, 브랜드 해석, 카피와 카드, 원고, 채널 제작안, 제휴안, 응답 분석, 웹 구현과 수정까지 수행했습니다. 토스 승인, 광고 집행, 파트너 접촉과 행사 운영은 하지 않았습니다.", M + 14, H - 626, W - 2 * M - 28, 8.5, 13.5)
paragraph(c, "한계  /  수정 카드 재확인과 실제 게시 반응은 진행하지 않았습니다. 5건을 전체 고객 의견으로 일반화하지 않습니다.", M, H - 706, W - 2 * M, 8.5, 14)
word(c, "응답 결과와 수정 보기  ↗", M, 94, 8.8, BLUE, True)
c.linkURL("https://jhheo51-arch.github.io/trend-to-trust/final-card-check.html", (M, 86, M + 185, 107), relative=0)
word(c, "수정 카드 6장  ↗", M + 216, 94, 8.8, BLUE, True)
c.linkURL("https://jhheo51-arch.github.io/trend-to-trust/campaign-v04.html", (M + 216, 86, M + 350, 107), relative=0)
footer(c, 5)
c.showPage()

c.save()
print(OUTPUT)

