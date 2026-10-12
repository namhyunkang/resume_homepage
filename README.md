# nhk — 개인 홈페이지

🔗 **Live:** https://resume-homepage-psi.vercel.app

Next.js 15 (App Router) + Upstash Redis. Vercel에 배포하는 걸 기준으로 만들었습니다.

## 기능
- 홈 (`/`): 히어로, 프로젝트 카드, 경력, 기술(누르면 사용한 프로젝트 표시), 노트, 연락처
- 프로젝트 페이지 (`/projects/[id]`): 만든 것, 케이스 노트(증상/추적/조치/결과), **작업 로그**
- 공개 노트 페이지 (`/notes/[id]`)
- KO/EN 전환 (쿠키 저장, 기본은 영어)
- **로그인 (`/login`, 푸터 오른쪽 아래 "sign in")** 후 할 수 있는 것:
  - 프로젝트 추가 / 수정 / 삭제 / 순서 변경 (`/admin`)
  - 프로젝트 안의 모든 텍스트(영/한), 케이스 노트 수정
  - 메모 추가·수정·삭제, 공개 ↔ 비공개 전환 (프로젝트 페이지에서 바로, 또는 대시보드에서)
  - 프로젝트에 붙지 않은 일반 메모도 작성 가능
- **비공개 메모**: 방문자에게는 🔒 아이콘 + 가림막 + 날짜 + 대략적인 분량("약 52단어")만 보입니다.
  제목과 본문은 서버에서 아예 빼고 보내기 때문에 페이지 소스에도 남지 않습니다.
  노트 패널의 "공개 2 · 비공개 4" 숫자와 26주 활동 그래프에도 비공개 기록이 함께 집계됩니다.

## Vercel 배포 (한 번만)
1. 이 폴더를 GitHub 저장소로 올립니다.
2. Vercel → **Add New → Project** → 저장소 선택 → Deploy.
3. 프로젝트의 **Storage** 탭 → **Upstash for Redis** 연결 (무료 플랜 OK).
   `KV_REST_API_URL`, `KV_REST_API_TOKEN` 환경변수가 자동으로 들어옵니다.
4. **Settings → Environment Variables** 에 추가:
   - `ADMIN_PASSWORD` — 로그인 비밀번호 (길게, 12자 이상 권장)
   - (선택) `SESSION_SECRET` — 32자 이상 랜덤 문자열. 없으면 비밀번호에서 자동으로 만듭니다.
5. **Redeploy**. 끝.

처음엔 `src/content/seed.ts`의 내용이 보이고, 로그인해서 무언가 저장하는 순간부터 Redis가 원본이 됩니다.

## 로컬 실행
```bash
npm install
cp .env.example .env.local   # ADMIN_PASSWORD, SESSION_SECRET 채우기
npm run dev                  # http://localhost:3000
```
Redis 환경변수가 없으면 로컬에서는 `.data/db.json` 파일에 저장합니다.

## 직접 채워야 할 것
- `public/resume-en.pdf`, `public/resume-ko.pdf` — 이력서 PDF (푸터의 이력서 버튼이 이 파일을 받습니다)
- 비공개 메모 4개는 **자리표시용(placeholder)** 입니다. 로그인해서 실제 내용으로 바꾸거나 지우세요.
- 경력·기술·학력·소개 문구는 `src/content/site.ts`에서 수정합니다 (코드 수정 → 배포).

## 메모 문법
`**굵게**`, `*기울임*`, `` `코드` ``, `- 목록`, `1. 목록`, `> 인용`, ```` ``` 코드블록 ``` ````, `# 제목`, `[링크](https://...)`

## 구조
```
src/
  app/            페이지 (home, projects/[id], notes/[id], login, admin)
  components/     UI 조각
  content/        site.ts(고정 문구), seed.ts(초기 데이터)
  lib/            data.ts(비공개 필터링), store.ts(Redis/파일), session.ts(로그인 토큰), actions.ts(수정 기능)
  middleware.ts   /admin 보호
```
