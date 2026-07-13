# 장평 2048

중학교 1학년 전환기 수업(정보 교과 — 문제 해결과 알고리즘 단원)을 위한 2048 게임 클론 웹앱입니다.
게임 플레이를 통해 "상태 → 입력 → 규칙 → 새로운 상태"라는 알고리즘의 기본 구조를 체험하고,
학년 전체 기록을 대시보드로 공유합니다.

## 기술 스택

| 항목 | 내용 |
|---|---|
| 프론트엔드 | Vite + React 19 + Tailwind CSS v4 |
| 라우팅 | react-router-dom |
| 상태 관리 | React `useReducer` (게임 로직은 순수 함수로 분리) |
| DB | Firebase Firestore |
| 배포 | Vercel |
| 테스트 | Vitest + Testing Library |

## 로컬 개발

```bash
npm install
cp .env.example .env   # 아래 "Firebase 설정" 참고하여 값 채우기
npm run dev
```

```bash
npm test        # Vitest 단위/컴포넌트 테스트 실행
npm run build   # 프로덕션 빌드
npm run lint    # oxlint
```

## 프로젝트 구조

```
src/
  game/          게임 코어 순수 함수(move, addRandomTile, isGameOver 등) + 단위 테스트
  student/       학번/이름 등록, localStorage, 유효성 검사
  firebase/      Firestore 연동(점수 저장/조회)
  components/    보드, 타일, 헤더, 모달, 대시보드 UI 컴포넌트
  pages/         GamePage(/), DashboardPage(/dashboard)
```

게임 규칙(이동/병합/점수)은 `src/game/gameLogic.js`의 순수 함수
`move(board, direction) -> { board, gained, moved }`로 구현되어 있으며,
`src/game/gameLogic.test.js`에 TDD로 작성된 단위 테스트가 있습니다.

## Firebase 설정

1. [Firebase 콘솔](https://console.firebase.google.com)에서 프로젝트를 만들고 **Firestore Database**를
   생성합니다.
2. 프로젝트 설정 > 일반 > "웹 앱 추가"로 앱을 등록하고, 발급되는 설정 값을 `.env`
   (`.env.example` 참고)에 채웁니다. 배포 시에는 Vercel 프로젝트의 Environment Variables에도
   동일한 `VITE_FIREBASE_*` 값을 등록해야 합니다.
3. **Firestore 보안 규칙 적용**: Firebase 콘솔 → Firestore Database → **규칙(Rules)** 탭에서
   이 저장소의 [`firestore.rules`](./firestore.rules) 내용을 붙여넣고 게시합니다.
   - 읽기는 전체 허용(대시보드용)
   - `scores/{studentId}` 갱신은 `bestScore`가 기존 값보다 클 때만 허용(기록 조작 방지)
   - 클라이언트에서의 삭제는 금지되어 있습니다.

규칙을 게시하지 않으면 기록 저장/조회가 `permission-denied` 오류로 실패합니다.

## 배포 (Vercel)

1. GitHub 저장소를 Vercel 프로젝트에 연결합니다.
2. Framework Preset은 Vite가 자동 인식됩니다 (Build: `npm run build`, Output: `dist`).
3. 프로젝트 설정 > Environment Variables에 `.env.example`에 나열된 `VITE_FIREBASE_*` 값을 등록합니다.
4. `vercel.json`에 SPA 라우팅용 rewrite 규칙이 포함되어 있어 `/dashboard`로 직접 접속해도
   정상적으로 동작합니다.

## 데이터 모델 (Firestore)

```
scores/{studentId}          # 문서 ID = 학번, 개인 최고 기록
  studentId, name, classNo, bestScore, bestTile, playCount, updatedAt

plays/{autoId}               # 전체 플레이 로그 (수업 데이터 분석용)
  studentId, name, score, maxTile, moveCount, createdAt
```

## 수업 활용 가이드

- **도입**: "이 게임의 규칙을 순서도로 그려보자" — 게임의 상태(보드)/입력(방향키)/조건(병합 규칙)/
  반복(게임 오버까지 반복되는 루프)을 학생 스스로 식별해보는 활동.
- **전개**: 점수 공식 탐구 — "2048 타일을 만들려면 최소 몇 점이 필요할까?" ((k−1)×2ᵏ 공식 유도).
- **심화**: "항상 한쪽 구석에 큰 타일 모으기" 같은 탐욕(greedy) 전략을 직접 플레이하며 토론.
- **정리**: `/dashboard`의 반별 평균·분포를 함께 보며 데이터 리터러시로 연결.

### 진행 방법

1. 학생들은 배포된 URL에 접속해 학번(5자리)과 이름을 입력하고 게임을 플레이합니다.
2. 게임 오버 시 점수가 자동으로 저장됩니다(저장 실패 시 화면에 재시도 버튼이 표시됩니다).
3. 교사는 `/dashboard`를 교실 화면에 띄우고 새로고침 버튼으로 최신 순위를 확인합니다.
   (실시간 갱신이 아니므로 버튼을 눌러야 최신 데이터가 반영됩니다.)

## 개인정보 처리 및 데이터 삭제

학번과 이름은 개인정보이므로 다음 사항을 유의해 주세요.

- 수업 안내 시 학생·학부모에게 "학번과 이름이 학급 대시보드에 표시되며, 수업 종료 후 삭제된다"는
  점을 사전 고지하는 것을 권장합니다.
- 대시보드에는 이름을 마스킹(예: 김\*수)해서 표시하는 옵션이 있으며, 상단 토글로 전환할 수 있습니다.
- **수업 종료 후에는 반드시 아래 절차로 Firestore에 쌓인 기록을 삭제하세요.** 앱 자체에는
  삭제 기능이 없습니다(오조작으로 인한 기록 유실을 막기 위한 설계입니다).

### Firebase 콘솔에서 기록 삭제/초기화하는 방법

1. [Firebase 콘솔](https://console.firebase.google.com) → 해당 프로젝트 → **Firestore Database**로 이동합니다.
2. `scores` 컬렉션을 클릭한 뒤, 컬렉션 이름 옆 **⋮(더보기) 메뉴 → 컬렉션 삭제**를 선택합니다.
   문서 수가 많으면 콘솔에서 안내하는 대로 여러 번에 나눠 삭제해야 할 수 있습니다.
3. `plays` 컬렉션도 동일한 방법으로 삭제합니다.
4. 문서가 매우 많다면 [Firebase CLI](https://firebase.google.com/docs/cli)를 설치한 뒤 아래 명령으로
   한 번에 삭제할 수도 있습니다.

   ```bash
   firebase login
   firebase use <프로젝트 ID>
   firebase firestore:delete --all-collections
   ```

## 라이선스

[MIT License](./LICENSE)
