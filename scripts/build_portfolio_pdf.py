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
OUTPUT = ROOT / "docs/submission/Trend-to-Trust-Brand-Marketing-2026-10-09.pdf"
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
    ("04", "수정", "익명 문장 응답 2회를 보고 첫 3장 수정"),
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
    ("확인", "공개 자료와 두 차례의 익명 문장 응답, 각 5건"),
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
heading(c, "02 / FINISHED CONTENT", "문장 검증을 반영한 카드 6장과 원고",
        "실제 반응은 문장에 대한 것입니다. 아래 카드는 그 반응을 적용한 미게시 제작물입니다.")
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
    ("03", "인물이 직접 말하는 이유"),
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
c.linkURL("https://jhheo51-arch.github.io/trend-to-trust/campaign-v03.html", (M, 68, 230, 90), relative=0)
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

# 05 / Learning, next test and honest scope.
heading(c, "04 / LEARNING LOOP", "문장 응답을 보고 첫 장을 고쳤습니다.",
        "두 차례 모두 익명 5건의 문장 비교입니다. 완성 카드의 독자 반응이나 캠페인 성과로 해석하지 않습니다.")
box(c, M, H - 336, 248, 145, LIGHT, 12)
box(c, M + 261, H - 336, 248, 145, PALE, 12)
word(c, "1차 / 문장 선택", M + 16, H - 220, 9, BLUE, True)
word(c, "4 / 5", M + 16, H - 269, 30, INK, True)
paragraph(c, "숫자 중심 A 선택. 5건 모두 숫자의 구성이나 이유를 더 보고 싶다고 응답했습니다.", M + 16, H - 280, 216, 8.6, 13.5)
word(c, "2차 / 이해와 지속의 차이", M + 277, H - 220, 9, BLUE, True)
word(c, "5.0 / 3.2", M + 277, H - 267, 24, INK, True)
paragraph(c, "B 이해도 / B 계속 볼 의향(5점 만점). A의 계속 볼 의향은 4.8점. B를 실제 기능으로 오해 3건, 불확실 1건.", M + 277, H - 280, 216, 8.4, 13)

word(c, "수정 결정", M, H - 379, 11, INK, True)
box(c, M, H - 489, W - 2 * M, 93, INK, 12)
word(c, "18% 증가", M + 17, H - 430, 16, colors.HexColor("#F1AFAF"), True)
word(c, "→", M + 149, H - 430, 16, WHITE, True)
word(c, "4번의 저녁. 72,000원.", M + 186, H - 430, 16, WHITE, True)
paragraph(c, "비교 월 자료가 없는 비율을 버리고 계산 가능한 가상 내역을 사용했습니다. 생활 이유는 인물의 자기 설명으로 분리했습니다.", M + 17, H - 444, W - 2 * M - 34, 8.5, 14, WHITE)

word(c, "다음 검증 / 가장 중요한 미완료 단계", M, H - 530, 11, INK, True)
paragraph(c, "완성 카드의 첫 3장을 설명 없이 보여주고 ① 72,000원의 계산 근거 ② 이야기의 사실/가상 구분 ③ 실제 토스 기능으로 오해한 부분 ④ 계속 읽고 싶은 이유를 확인합니다. 그 결과가 나오기 전까지 수정 효과는 주장하지 않습니다.", M, H - 546, W - 2 * M, 9.1, 16)
box(c, M, H - 689, W - 2 * M, 78, PALE, 10)
word(c, "본인 수행 범위", M + 14, H - 636, 9, BLUE, True)
paragraph(c, "공개 자료 조사부터 카피, 카드와 원고, 채널별 제작안, 제휴안, 응답 분석, 웹 구현까지 혼자 했습니다. 토스 승인, 광고 집행, 파트너 접촉, 행사 운영은 하지 않았습니다.", M + 14, H - 647, W - 2 * M - 28, 8.5, 13.5)
word(c, "웹 포트폴리오 ↗", M, 94, 8.8, BLUE, True)
c.linkURL("https://jhheo51-arch.github.io/trend-to-trust/", (M, 86, M + 132, 107), relative=0)
word(c, "응답 근거 ↗", M + 158, 94, 8.8, BLUE, True)
c.linkURL("https://github.com/jhheo51-arch/trend-to-trust/blob/main/docs/validation/SECOND-MESSAGE-RESULT-2026-10-09-v01.md", (M + 158, 86, M + 280, 107), relative=0)
footer(c, 5)
c.showPage()

c.save()
print(OUTPUT)
