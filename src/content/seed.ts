import type { DB, Project, Memo } from "@/lib/types";

// First-run content. Once you save anything after logging in, the database
// becomes the source of truth and this file is no longer read.

const T0 = "2026-10-12T00:00:00.000Z";

const p = (x: Omit<Project, "createdAt" | "updatedAt">): Project => ({ ...x, createdAt: T0, updatedAt: T0 });

const projects: Project[] = [
  p({
    id: "tof",
    order: 0,
    co: { en: "CanTops", ko: "캔탑스" },
    year: "2024–",
    period: { en: "Aug 2024 — Present", ko: "2024.08 — 현재" },
    title: { en: "ToF sensor evaluation firmware", ko: "ToF 센서 평가 펌웨어" },
    summary: {
      en: "C++ firmware for evaluating a ToF sensor and driving an I2C display, on an in-house RTOS.",
      ko: "사내 RTOS 위에서 ToF 센서를 평가하고 I2C 디스플레이를 제어하는 C++ 펌웨어.",
    },
    tags: ["C++", "I2C", "RTOS"],
    built: {
      en: [
        "Wrote C++ firmware for ToF sensor evaluation and I2C display control on the company’s in-house RTOS.",
        "Handled sensor bring-up and module integration, and helped bring vibration/tilt sensing into OHT (overhead hoist transport) monitoring.",
        "Built a small GUI that parses and plots the sensor readings.",
      ],
      ko: [
        "사내에서 개발한 RTOS 위에서 ToF 센서 평가와 I2C 디스플레이 제어용 C++ 펌웨어를 작성했습니다.",
        "센서 초기 구동(bring-up)과 모듈 연동을 맡았고, OHT 모니터링용 진동·기울기 센서 연동에도 참여했습니다.",
        "측정값을 파싱해 그래프로 보여주는 GUI를 만들었습니다.",
      ],
    },
    caseNotes: {
      en: {
        symptom: "Burst reads from a 4×4 ToF sensor kept failing mid-evaluation.",
        trace:
          "The sensor code and the I2C address both checked out, so I put an oscilloscope on the bus. The clock was running slower than configured — an init routine in the in-house OS was quietly overwriting the I2C speed setting.",
        fix: "Patched the routine, added diagnostic logs, and pushed the change to Git. Wrote a GUI to parse and plot the readings.",
        result:
          "Data came through clean. ToF was later dropped when the product changed direction; the habit of checking the wire before the code stayed.",
      },
      ko: {
        symptom: "4×4 ToF 센서 평가 중 burst read가 계속 실패했습니다.",
        trace:
          "센서 코드와 I2C 주소에는 문제가 없어서 오실로스코프로 버스를 직접 찍어봤습니다. 클럭이 설정값보다 낮게 나오고 있었고, 원인은 사내 OS 초기화 루틴이 I2C 속도 설정을 조용히 덮어쓰던 것이었습니다.",
        fix: "루틴을 패치하고, 진단 로그를 보강해 Git에 올렸습니다. 측정값을 파싱·시각화하는 GUI도 만들었습니다.",
        result:
          "정상 수신을 확인했습니다. 이후 제품 방향이 바뀌면서 ToF는 채택되지 않았지만, ‘코드보다 선부터 본다’는 습관은 남았습니다.",
      },
    },
  }),
  p({
    id: "oht-web",
    order: 2,
    co: { en: "CanTops", ko: "캔탑스" },
    year: "2024–",
    period: { en: "Aug 2024 — Present", ko: "2024.08 — 현재" },
    title: { en: "OHT monitoring, moved to the web", ko: "OHT 모니터링 웹 전환" },
    summary: {
      en: "Monitoring and configuration for OHT and rail-mounted devices, rebuilt from Windows Forms into a web app.",
      ko: "OHT·레일 부착 장치의 모니터링·설정 기능을 Windows Forms에서 웹으로 옮겼습니다.",
    },
    tags: ["JavaScript", "WebRTC", "MediaMTX"],
    built: {
      en: [
        "Reimplemented the Windows Forms monitoring and configuration tools as a web application for OHT and rail-mounted devices.",
        "Brought live video, live sensor data and historical records into one view.",
        "Relayed RTSP camera streams to the browser over WebRTC with MediaMTX.",
      ],
      ko: [
        "OHT·레일 부착 장치용 Windows Forms 모니터링·설정 기능을 웹 애플리케이션으로 재구현했습니다.",
        "실시간 영상, 실시간 센서 데이터, 이력 조회를 한 화면에 모았습니다.",
        "MediaMTX로 RTSP 카메라 영상을 WebRTC로 중계해 브라우저에서 바로 재생되게 했습니다.",
      ],
    },
    caseNotes: {
      en: {
        symptom: "Monitoring and configuration lived in a Windows Forms desktop app.",
        trace:
          "Once it moved to the web, the older Firefox on the customers’ Linux PCs surfaced JavaScript that browser simply didn’t support.",
        fix: "Tracked down and rewrote the unsupported code within a week.",
        result: "Verified video playback, sensor data, history and settings on the customers’ own machines.",
      },
      ko: {
        symptom: "모니터링·설정 기능이 Windows Forms 데스크톱 프로그램에 묶여 있었습니다.",
        trace: "웹으로 옮기고 나니 고객사 Linux PC의 구형 Firefox가 지원하지 않는 JavaScript가 드러났습니다.",
        fix: "문제가 되는 코드를 찾아 일주일 안에 고쳐 썼습니다.",
        result: "고객사 PC에서 영상 재생, 센서 데이터, 이력 조회, 설정 기능을 직접 검증했습니다.",
      },
    },
  }),
  p({
    id: "wlan",
    order: 4,
    co: { en: "CanTops", ko: "캔탑스" },
    year: "2024–",
    period: { en: "Aug 2024 — Present", ko: "2024.08 — 현재" },
    title: { en: "Embedded web UI for wireless LAN gear", ko: "무선 LAN 장비 내장 웹 UI" },
    summary: {
      en: "Parts of the firmware, plus the on-device web server and UI for settings, status, logs and FTP/CLI control.",
      ko: "일부 펌웨어와, 장비 설정·상태·로그·FTP/CLI 제어를 위한 내장 웹서버와 UI.",
    },
    tags: ["JavaScript", "Python", "FastAPI"],
    built: {
      en: [
        "Developed selected firmware components for wireless LAN devices.",
        "Built the embedded web server and UI (JavaScript, Python, FastAPI) for device settings, status and log viewing, and FTP/CLI control.",
      ],
      ko: [
        "무선 LAN 장비의 일부 펌웨어를 개발했습니다.",
        "JavaScript·Python·FastAPI로 내장 웹서버와 UI를 만들어 장비 설정, 상태·로그 조회, FTP·CLI 제어를 구현했습니다.",
      ],
    },
    caseNotes: null,
  }),
  p({
    id: "diag",
    order: 3,
    co: { en: "CanTops", ko: "캔탑스" },
    year: "2024–",
    period: { en: "Aug 2024 — Present", ko: "2024.08 — 현재" },
    title: { en: "Sensor diagnostic tool", ko: "센서 진단 도구" },
    summary: {
      en: "A C# tool for live plots and raw-data analysis of sensor data arriving over 460,800-baud serial at 1 ms intervals.",
      ko: "460,800 baud 직렬 통신으로 1ms마다 들어오는 센서 데이터를 실시간으로 보고 분석하는 C# 진단 도구.",
    },
    tags: ["C#", "Serial", "Multithreading"],
    built: {
      en: [
        "Built a C# diagnostic tool for live visualization and raw sensor-data analysis.",
        "Split reception, parsing and UI updates into independent threads, connected through a circular buffer and a queue.",
        "Added live sensor values, charts and raw-data analysis views for equipment diagnostics.",
      ],
      ko: [
        "실시간 시각화와 RAW 센서 데이터 분석을 위한 C# 진단 도구를 만들었습니다.",
        "수신·파싱·UI 갱신을 독립 스레드로 분리하고, 원형 버퍼와 큐로 연결했습니다.",
        "실시간 센서 값, 차트, 원시 데이터 분석 화면을 구현했습니다.",
      ],
    },
    caseNotes: {
      en: {
        symptom: "Sensor data arrived continuously — 460,800-baud serial, a new sample every 1 ms — and had to be parsed and shown on screen while it kept coming.",
        trace: "Doing reception, parsing and drawing in one flow would tie them together, so the work needed a structure that kept each stage separate.",
        fix: "Gave reception, parsing and UI updates their own threads, linked by a circular buffer and a queue.",
        result: "A working tool for equipment diagnostics and raw sensor-data analysis. (1 ms is the input interval, not an end-to-end latency figure.)",
      },
      ko: {
        symptom: "460,800 baud 직렬 통신으로 1ms마다 센서 데이터가 계속 들어오는 환경에서, 받으면서 동시에 파싱하고 화면에 보여줘야 했습니다.",
        trace: "수신·파싱·화면 갱신을 한 흐름으로 처리하면 서로 묶이기 때문에, 단계별로 분리된 처리 구조가 필요했습니다.",
        fix: "수신·파싱·UI 갱신을 각각 독립 스레드로 나누고, 원형 버퍼와 큐로 연결했습니다.",
        result: "장비 진단과 원시 센서 데이터 분석에 쓰는 도구를 완성했습니다. (1ms는 입력 주기이며, 전체 처리 지연을 뜻하지 않습니다.)",
      },
    },
  }),
  p({
    id: "stb",
    order: 1,
    co: { en: "Innopia", ko: "이노피아테크" },
    year: "2021–23",
    period: { en: "Apr 2021 — Sep 2023", ko: "2021.04 — 2023.09" },
    title: { en: "Set-top box software: library redesign & TR-069", ko: "셋톱박스 라이브러리 재설계 · TR-069" },
    summary: {
      en: "Pitched and carried out a redesign of a hard-coded legacy library. It shipped.",
      ko: "하드코딩된 레거시 라이브러리의 재설계를 먼저 제안하고 직접 진행했습니다. 출하 제품에 들어갔습니다.",
    },
    tags: ["Java", "C++", "Android", "Linux", "TR-069"],
    built: {
      en: [
        "Proposed a redesign of a legacy set-top box library whose hard-coded structure made every feature change painful.",
        "Reimplemented the existing Java code with object-oriented design to meet updated Android requirements.",
        "Reworked inter-app communication and the overall structure so future protocols could be added without another rewrite.",
        "Developed and extended TR-069 services and device-management data models in C++ and Java on Linux/Android.",
      ],
      ko: [
        "기능 하나 바꾸기도 버거운 하드코딩 구조의 셋톱박스 라이브러리를 재설계하자고 먼저 제안했습니다.",
        "바뀐 Android 요구사항에 맞춰 기존 Java 코드를 객체지향 구조로 다시 구현했습니다.",
        "앱 간 통신 방식과 전체 구조를 손봐, 새 프로토콜이 생겨도 다시 갈아엎지 않도록 했습니다.",
        "Linux·Android 환경에서 C++·Java로 TR-069 서비스와 장치 관리 데이터 모델을 구현·확장했습니다.",
      ],
    },
    caseNotes: {
      en: {
        symptom: "A legacy library so hard-coded that small feature changes turned into big ones.",
        trace:
          "Nobody had asked for a redesign, so I made the case for one — then reimplemented the Java code with object-oriented design for the new Android requirements.",
        fix: "Reworked inter-app communication and the software structure to leave room for future protocol extensions.",
        result: "The revised software went into a shipped product.",
      },
      ko: {
        symptom: "구조가 하드코딩돼 있어 작은 기능 변경도 큰 공사가 되는 라이브러리였습니다.",
        trace:
          "재설계를 요청받은 건 아니었지만 필요하다고 제안했고, 바뀐 Android 요구사항에 맞춰 Java 코드를 객체지향 구조로 다시 구현했습니다.",
        fix: "앱 간 통신 방식과 소프트웨어 구조를 바꿔 프로토콜 확장 여지를 만들었습니다.",
        result: "수정한 소프트웨어가 실제 출하 제품에 반영됐습니다.",
      },
    },
  }),
];

const m = (x: Omit<Memo, "updatedAt">): Memo => ({ ...x, updatedAt: x.createdAt });

const memos: Memo[] = [
  m({
    id: "m-i2c-clock",
    projectId: "tof",
    visibility: "public",
    createdAt: "2026-10-03T05:20:00.000Z",
    title: "What the scope showed when the I2C clock didn’t match",
    body: `Config said one clock rate. The bus said another.

Checked, in order:
- sensor driver — fine
- I2C address — fine
- the actual wire — **slower than configured**

Culprit: an init routine in the in-house RTOS that re-applied its own I2C speed after mine.

> When the code and the config agree but the device doesn't, measure before you refactor.`,
  }),
  m({
    id: "m-old-firefox",
    projectId: "oht-web",
    visibility: "public",
    createdAt: "2026-09-14T08:40:00.000Z",
    title: "Getting WebRTC video to play on an old Firefox",
    body: `The customer PCs ran Linux with an older Firefox. Everything worked on my machine; a few things didn't on theirs.

- RTSP → WebRTC through MediaMTX: fine
- our own JavaScript: used syntax that browser didn't support

Fixed within a week, then verified video, sensor data, history and settings on the customers' machines.

Note to self: put the oldest target browser in the test matrix on day one.`,
  }),
  // Private placeholders — replace or delete after logging in.
  m({
    id: "m-priv-1",
    projectId: "tof",
    visibility: "private",
    createdAt: "2026-10-08T12:10:00.000Z",
    title: "(placeholder) private follow-up",
    body: "Private placeholder. Edit or delete me after logging in. Only you can read this; visitors see a locked row with the date and rough length.",
  }),
  m({
    id: "m-priv-2",
    projectId: null,
    visibility: "private",
    createdAt: "2026-09-27T01:30:00.000Z",
    title: "(placeholder) general private note",
    body: "Private placeholder. Edit or delete me. This one isn't tied to any project, so it shows up only in the home notebook. A slightly longer body makes the redaction bar on the public side a little longer too, which is the whole point of having something to hide.",
  }),
  m({
    id: "m-priv-3",
    projectId: "stb",
    visibility: "private",
    createdAt: "2026-08-19T06:00:00.000Z",
    title: "(placeholder) retrospective",
    body: "Private placeholder. Edit or delete me.",
  }),
  m({
    id: "m-priv-4",
    projectId: "diag",
    visibility: "private",
    createdAt: "2026-06-11T09:45:00.000Z",
    title: "(placeholder) threading notes",
    body: "Private placeholder. Edit or delete me after logging in — write the real notes here.",
  }),
];

export const seedDB: DB = { version: 1, projects, memos };
