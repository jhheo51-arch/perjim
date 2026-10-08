"""Build the versioned Trend to Trust application case PDF."""
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
OUTPUT = ROOT / "docs/archive/Trend-to-Trust-Brand-Marketing-2026-10-09-v01.pdf"
FONT_DIR = Path("C:/Windows/Fonts")
pdfmetrics.registerFont(TTFont("Malgun", str(FONT_DIR / "malgun.ttf")))
pdfmetrics.registerFont(TTFont("Malgun-Bold", str(FONT_DIR / "malgunbd.ttf")))

W, H = A4
INK = colors.HexColor("#191F28")
BLUE = colors.HexColor("#0055D6")
PALE = colors.HexColor("#E8F3FF")
SUB = colors.HexColor("#4E5968")
LINE = colors.HexColor("#D9DDE3")
WHITE = colors.white
M = 43


def txt(c, value, x, y, size=10, color=INK, bold=False):
    c.setFillColor(color)
    c.setFont("Malgun-Bold" if bold else "Malgun", size)
    c.drawString(x, y, value)


def para(c, value, x, top, width, size=9.5, leading=16, color=SUB, bold=False):
    style = ParagraphStyle(
        "p", fontName="Malgun-Bold" if bold else "Malgun", fontSize=size,
        leading=leading, textColor=color, alignment=TA_LEFT,
        wordWrap="CJK", spaceAfter=0,
    )
    p = Paragraph(value, style)
    _, height = p.wrap(width, H)
    p.drawOn(c, x, top - height)
    return height


def rounded(c, x, y, width, height, fill, radius=14, stroke=None):
    c.setFillColor(fill)
    c.setStrokeColor(stroke or fill)
    c.roundRect(x, y, width, height, radius, fill=1, stroke=bool(stroke))


def footer(c, n):
    c.setStrokeColor(LINE)
    c.line(M, 38, W - M, 38)
    txt(c, "TREND TO TRUST  ·  개인 지원용 비공식 프로젝트", M, 22, 7.5, SUB)
    txt(c, f"{n} / 3", W - M - 22, 22, 7.5, SUB, True)


c = canvas.Canvas(str(OUTPUT), pagesize=A4)
c.setTitle("Trend to Trust - Toss Brand Marketing Portfolio")
c.setAuthor("Trend to Trust independent portfolio")

# 1. Role fit and tangible outputs.
rounded(c, 0, H - 322, W, 322, INK, 0)
txt(c, "TOSS BRAND MARKETING SPECIALIST  /  PERSONAL CASE", M, H - 55, 9, colors.HexColor("#A9C9FF"), True)
txt(c, "Trend to Trust", M, H - 113, 34, WHITE, True)
txt(c, "공개 신호를 브랜드 콘텐츠로,", M, H - 161, 21, WHITE, True)
txt(c, "실제 문장 반응을 다음 시안으로.", M, H - 192, 21, WHITE, True)
para(c, "‘퍼짐’으로 공개 신호의 확인 범위를 기록하고, 토스 브랜드 캠페인 〈한 달의 이유〉의 카드·원고·채널·제휴안을 독립 제작했습니다.", M, H - 215, W - 2 * M, 10.5, 18, colors.HexColor("#E0EAFF"))
rounded(c, M, H - 309, W - 2 * M, 51, colors.HexColor("#263447"), 10)
txt(c, "본인 역할", M + 17, H - 278, 9, colors.HexColor("#A9C9FF"), True)
para(c, "신호 조사 · 브랜드 가설 · 카피/카드/원고 · 채널 설계 · 파트너 제안 · 응답 분석 · 웹 구현", M + 85, H - 267, W - 2 * M - 104, 9, 14, WHITE)

txt(c, "공고의 업무와 연결한 제출 증거", M, H - 354, 15, INK, True)
cards = [
    ("01  트렌드를 브랜드에", "경제·문화·플랫폼 공개 신호를 ‘돈을 쉽게 이해한다’는 브랜드 과제로 해석. 가계부를 생활 이야기로 번역했습니다."),
    ("02  매체별 콘텐츠", "Meta 카드 6장·게시글·뉴스레터 원고 완성. YouTube/Google 영상은 컷별 구성안까지 작성했습니다."),
    ("03  외부 채널과 제휴", "어피티·오늘의집·캐릿을 역할별로 비교하고, 어피티 공동 연재의 가치·책임·검수 조건을 제안했습니다."),
    ("04  반응을 다음 안으로", "익명 문장 비교 2회, 각 5건. 명확성·계속 볼 의향·실제 기능 오해를 나누어 읽고 첫 3장을 수정했습니다."),
]
y = H - 464
for label, body in cards:
    rounded(c, M, y, W - 2 * M, 83, WHITE, 11, LINE)
    txt(c, label, M + 17, y + 58, 11, BLUE, True)
    para(c, body, M + 17, y + 48, W - 2 * M - 34, 9, 15)
    y -= 94
footer(c, 1)
c.showPage()

# 2. Concrete learning loop.
txt(c, "RESPONSE → DECISION → REVISED ASSET", M, H - 48, 9, BLUE, True)
txt(c, "좋아 보이는 문장이 아니라", M, H - 100, 25, INK, True)
txt(c, "다음 콘텐츠에 남길 판단을 골랐습니다.", M, H - 135, 21, INK, True)
para(c, "문장 실험의 소규모 응답이며 완성 카드의 효과나 캠페인 성과로 해석하지 않습니다.", M, H - 152, W - 2 * M, 9, 16)

rounded(c, M, H - 313, W - 2 * M, 119, PALE)
txt(c, "1차 · 익명 응답 5건", M + 18, H - 222, 11, BLUE, True)
txt(c, "4/5", M + 18, H - 269, 31, INK, True)
para(c, "숫자 중심 A 문장 선택. 다섯 응답 모두 숫자의 세부 구성이나 원인을 더 보고 싶다고 적었습니다.", M + 125, H - 237, W - 2 * M - 144, 9, 16)

txt(c, "2차 · 익명 응답 5건", M, H - 346, 11, BLUE, True)
metrics = [
    ("3/5", "B를 이해하기 쉬운 문장으로 선택"),
    ("4.8 : 3.2", "계속 볼 의향 평균 · A : B / 5점"),
    ("3 + 1", "B를 실제 기능으로 오해 3건 · 불확실 1건"),
]
gap = 9
bw = (W - 2 * M - 2 * gap) / 3
for i, (value, label) in enumerate(metrics):
    x = M + i * (bw + gap)
    rounded(c, x, H - 484, bw, 116, WHITE, 11, LINE)
    txt(c, value, x + 15, H - 414, 23 if i != 1 else 18, INK, True)
    para(c, label, x + 15, H - 428, bw - 30, 8.2, 13)

txt(c, "판단", M, H - 520, 11, BLUE, True)
para(c, "생활 맥락을 한 문장에 붙인 B를 최종 표지로 채택하지 않았습니다. ‘18% 증가’는 비교 월 자료가 없어 최종 제작물에서 제외했습니다.", M + 53, H - 506, W - 2 * M - 53, 9.4, 17)
rounded(c, M, H - 691, W - 2 * M, 105, BLUE)
txt(c, "수정한 첫 장", M + 20, H - 617, 9, colors.HexColor("#D4E5FF"), True)
txt(c, "4번의 저녁. 72,000원.", M + 20, H - 653, 22, WHITE, True)
para(c, "다음 장에서 18,000원 × 4건을 보여주고, ‘야근’은 가상 인물이 스스로 돌아본 말로 분리합니다.", M + 20, H - 662, W - 2 * M - 40, 8.6, 14, WHITE)
para(c, "한계  |  두 차례 참여자가 동일한지 확인되지 않았고 질문도 달랐습니다. 전체 고객 비율·전후 인과·실제 광고 성과를 주장하지 않습니다.", M, H - 715, W - 2 * M, 8.6, 14)
footer(c, 2)
c.showPage()

# 3. Submission map, responsibilities and scope.
txt(c, "DELIVERABLES & BOUNDARIES", M, H - 48, 9, BLUE, True)
txt(c, "직무에 맞게 만든 결과와", M, H - 102, 26, INK, True)
txt(c, "아직 하지 않은 일을 나눴습니다.", M, H - 139, 21, INK, True)

sections = [
    ("완성 콘텐츠", "카드 6장 v03 · Meta 게시글 · 첫 뉴스레터 · 7일 뒤 후속 원고", "campaign-v03.html"),
    ("매체별 제작안", "Meta 피드/릴스, YouTube·Google 영상, 토스 온드 채널의 역할·컷·지표", "campaign-kit-v02.html"),
    ("외부 제휴 제안", "어피티 공동 연재의 추가 가치, 역할, 비용·권리·검수 조건", "partner-proposal-v02.html"),
    ("학습 근거", "1·2차 익명 문장 비교 각 5건과 선택하지 않은 문장의 이유", "docs/validation/SECOND-MESSAGE-RESULT-2026-10-09-v01.md"),
]
y = H - 256
for title, detail, path in sections:
    rounded(c, M, y, W - 2 * M, 82, WHITE, 10, LINE)
    txt(c, title, M + 16, y + 56, 11, BLUE, True)
    para(c, detail, M + 16, y + 47, W - 2 * M - 32, 8.6, 14)
    txt(c, path, M + 16, y + 14, 7.2, SUB)
    y -= 93

rounded(c, M, H - 703, W - 2 * M, 62, PALE, 10)
txt(c, "정확한 수행 범위", M + 16, H - 665, 10, BLUE, True)
para(c, "개인 기획·제작·분석 완료  /  토스 승인·광고 집행·파트너 접촉·온오프라인 행사 운영 없음  /  카드 자체의 독자 반응 미확인", M + 16, H - 675, W - 2 * M - 32, 8.4, 13)
txt(c, "다음 검증", M, H - 735, 10, BLUE, True)
para(c, "수정한 6장 중 첫 3장을 설명 없이 보여주고 계산 근거, 이야기 출처, 실제 기능 오해 여부를 묻습니다. 결과 전에는 개선 효과를 주장하지 않습니다.", M + 75, H - 721, W - 2 * M - 75, 8.7, 14)
txt(c, "웹 포트폴리오  jhheo51-arch.github.io/trend-to-trust/", M, 68, 8.5, BLUE, True)
c.linkURL("https://jhheo51-arch.github.io/trend-to-trust/", (M, 60, W - M, 82), relative=0)
footer(c, 3)
c.save()
print(OUTPUT)
