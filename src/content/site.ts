// Site-wide copy. Projects and memos live in the database (editable after login);
// everything here is edited in code.

export const contact = {
  // Extra profile links shown in the footer. Add LinkedIn etc. here.
  links: [{ label: "GitHub", href: "https://github.com/namhyunkang" }] as { label: string; href: string }[],
  email: "rkdskagus123@gmail.com",
  phone: "+82 10 8757 2558",
  tel: "+821087572558",
};

export const marquee = [
  "Sensor firmware",
  "Device software",
  "Equipment monitoring",
  "Scope first, then code",
];

const en = {
  nav: [
    { id: "top", label: "About" },
    { id: "projects", label: "Projects" },
    { id: "work", label: "Experience" },
    { id: "skills", label: "Skills" },
    { id: "notes", label: "Notes" },
    { id: "contact", label: "Contact" },
  ],
  hero: {
    name: "Nam Hyun Kang",
    loc: "Yongin, South Korea",
    lede:
      "I build software that has to get along with hardware — sensor firmware, Linux/Android device services, and the web tools that keep an eye on equipment. When a bug won’t explain itself, I put a probe on the bus and read the code side by side.",
    meta: [
      { k: "Experience", v: "5+ years" },
      { k: "Now", v: "Software Engineer, CanTops" },
      { k: "Languages", v: "Korean · English" },
    ],
    status: (ago: string) => `notebook · last entry ${ago}`,
  },
  projects: {
    title: "Projects",
    sub: (n: number) => `${n} entries · open one for the full log`,
    caseBadge: "Case",
    entries: (pub: number, priv: number) =>
      priv ? `${pub + priv} log · ${priv} locked` : `${pub} log`,
    add: "New project",
  },
  work: {
    title: "Experience",
    body:
      "Five-plus years writing software that lives close to hardware. Most of my work sits where firmware, the device OS and the people actually running the equipment meet — C++ on sensors, Java services on set-top boxes, web tools for monitoring rigs. I hand things over with test scenarios, so QA doesn’t have to guess what “done” means.",
    items: [
      { co: "CanTops", role: "Software Engineer", period: "Aug 2024 — Present" },
      { co: "Innopia Technologies", role: "Software Engineer", period: "Apr 2021 — Sep 2023" },
      { co: "Fourth Logic", role: "Software Engineer", period: "May 2020 — Sep 2020" },
      { co: "Unichal", role: "Software Engineer", period: "May 2018 — Jan 2019" },
    ],
  },
  skills: {
    title: "Skills",
    hint: "Tap a skill to see where it shows up",
    usedIn: "Where I’ve used",
    none: "on the résumé — no write-up here yet",
    groups: [
      { k: "Languages", v: ["C", "C++", "Java", "Python", "JavaScript", "C#"] },
      { k: "Operating systems", v: ["Linux (Ubuntu)", "Android", "RTOS"] },
      { k: "Protocols", v: ["I2C", "TR-069", "REST APIs", "RTSP", "WebRTC"] },
      { k: "Dev & test", v: ["Git", "Code review", "Scenario testing", "Oscilloscope"] },
    ],
  },
  notes: {
    title: "Notebook",
    sub: "Public entries are open. The locked ones are internal work notes — client and company details stay private, but the log keeps growing.",
    count: (pub: number, priv: number) => `${pub} public · ${priv} private`,
    locked: "Internal note — client/company details, so it stays private. It’s there, just not public.",
    empty: "Nothing public yet.",
    activity: "last 26 weeks",
    general: "General",
    words: (n: number) => `~${n} words`,
  },
  edu: {
    title: "Education · Certification",
    items: [
      { k: "Education", v: "Dankook University — B.S., Mobile Systems Engineering" },
      { k: "Also studied", v: "Simon Fraser University — Mechanical Engineering (no degree)" },
      { k: "Certification", v: "Engineer Information Processing (2017)" },
    ],
  },
  contact: {
    cta: "Let’s talk.",
    copy: "Copy email",
    copied: "Copied ✓",
    mail: "Write an email",
    resume: "Résumé",
    resumeHref: "/resume-en.pdf",
    sign: "Built by hand. Notes kept like a lab book.",
  },
  project: {
    back: "All projects",
    prev: "Previous",
    next: "Next",
    built: "What I built",
    caseTitle: "Case notes",
    caseSub: "how it actually went",
    caseLabels: ["Symptom", "Trace", "Fix", "Result"],
    noCase: "No case notes for this one — the list above covers it.",
    log: "Log",
    logCount: (pub: number, priv: number) => `${pub} public · ${priv} private`,
    logEmpty: "Nothing logged yet.",
  },
  memo: {
    back: "Back to",
    home: "Notebook",
    updated: "edited",
  },
};

type Copy = typeof en;

const ko: Copy = {
  nav: [
    { id: "top", label: "소개" },
    { id: "projects", label: "프로젝트" },
    { id: "work", label: "경력" },
    { id: "skills", label: "기술" },
    { id: "notes", label: "노트" },
    { id: "contact", label: "연락" },
  ],
  hero: {
    name: "강남현",
    loc: "경기도 용인",
    lede:
      "하드웨어와 맞물려 돌아가는 소프트웨어를 만듭니다. 센서 펌웨어부터 Linux·Android 장치 서비스, 장비를 지켜보는 모니터링 웹까지. 버그가 이유를 말해주지 않으면, 코드만 노려보지 않고 버스에 프로브부터 꽂아봅니다.",
    meta: [
      { k: "경력", v: "5년+" },
      { k: "현재", v: "캔탑스 · 주임" },
      { k: "언어", v: "한국어 · English" },
    ],
    status: (ago: string) => `노트 · 마지막 기록 ${ago}`,
  },
  projects: {
    title: "프로젝트",
    sub: (n: number) => `${n}개 · 눌러서 전체 기록 보기`,
    caseBadge: "케이스",
    entries: (pub: number, priv: number) =>
      priv ? `로그 ${pub + priv} · 잠김 ${priv}` : `로그 ${pub}`,
    add: "새 프로젝트",
  },
  work: {
    title: "경력",
    body:
      "5년 넘게 하드웨어 가까이에서 일하는 소프트웨어를 만들어 왔습니다. 센서 위의 C++, 셋톱박스 위의 Java 서비스, 장비를 감시하는 웹 도구까지. 펌웨어와 장치 OS, 그리고 그 장비를 실제로 쓰는 사람 사이 어딘가가 제 자리입니다. 넘길 때는 시험 시나리오까지 챙겨서, QA가 ‘어디까지가 완료인지’ 추측하지 않게 합니다.",
    items: [
      { co: "캔탑스", role: "주임 · 소프트웨어 개발", period: "2024.08 — 현재" },
      { co: "이노피아테크", role: "연구원", period: "2021.04 — 2023.09" },
      { co: "포스로직", role: "연구원", period: "2020.05 — 2020.09" },
      { co: "유니챌", role: "연구원", period: "2018.05 — 2019.01" },
    ],
  },
  skills: {
    title: "기술",
    hint: "기술을 누르면 쓰인 프로젝트를 보여드려요",
    usedIn: "사용한 프로젝트 —",
    none: "이력서에는 있고, 여기엔 아직 정리 전입니다",
    groups: [
      { k: "프로그래밍", v: ["C", "C++", "Java", "Python", "JavaScript", "C#"] },
      { k: "운영체제", v: ["Linux (Ubuntu)", "Android", "RTOS"] },
      { k: "프로토콜", v: ["I2C", "TR-069", "REST APIs", "RTSP", "WebRTC"] },
      { k: "개발 · 시험", v: ["Git", "Code review", "Scenario testing", "Oscilloscope"] },
    ],
  },
  notes: {
    title: "노트",
    sub: "공개 노트는 열어두고, 사내·고객사 내용이 얽힌 노트는 잠가둡니다. 내용은 못 보여드려도 기록은 꾸준히 쌓이는 중이에요.",
    count: (pub: number, priv: number) => `공개 ${pub} · 비공개 ${priv}`,
    locked: "사내·고객사 내용이 담긴 비공개 노트예요. 있긴 있어요, 공개만 안 할 뿐.",
    empty: "아직 공개된 노트가 없습니다.",
    activity: "최근 26주",
    general: "일반",
    words: (n: number) => `약 ${n}단어`,
  },
  edu: {
    title: "학력 · 자격",
    items: [
      { k: "학력", v: "단국대학교 모바일시스템공학 학사" },
      { k: "재학 이력", v: "Simon Fraser University 기계공학 (학위 미취득)" },
      { k: "자격", v: "정보처리기사 (2017)" },
    ],
  },
  contact: {
    cta: "편하게 연락 주세요.",
    copy: "이메일 복사",
    copied: "복사됨 ✓",
    mail: "메일 쓰기",
    resume: "이력서",
    resumeHref: "/resume-ko.pdf",
    sign: "직접 만들었습니다. 노트는 실험 노트처럼 씁니다.",
  },
  project: {
    back: "전체 프로젝트",
    prev: "이전",
    next: "다음",
    built: "만든 것",
    caseTitle: "케이스 노트",
    caseSub: "실제로 어떻게 풀었나",
    caseLabels: ["증상", "추적", "조치", "결과"],
    noCase: "따로 정리한 케이스 노트는 없습니다. 위 내용이 전부예요.",
    log: "작업 로그",
    logCount: (pub: number, priv: number) => `공개 ${pub} · 비공개 ${priv}`,
    logEmpty: "아직 기록이 없습니다.",
  },
  memo: {
    back: "돌아가기 —",
    home: "노트",
    updated: "수정",
  },
};

export const copy = { en, ko };
export type { Copy };
