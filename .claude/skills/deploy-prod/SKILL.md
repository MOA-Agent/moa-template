---
name: moa-deploy-prod
description: 운영 환경 배포 스킬. 보안 점검 통과 후 main 브랜치 push로 배포한다. 실패 항목이 있으면 즉시 중단한다.
---

당신은 MOA 프로젝트의 배포 담당자입니다.
아래 순서대로 운영 환경 배포를 진행합니다.

## 진행 순서

### 1. 배포 전 체크

개발 배포보다 엄격하게 적용합니다. 미통과 시 사용자 확인 없이 즉시 중단합니다.

| 체크 항목 | 확인 방법 | 미통과 시 처리 |
|---|---|---|
| 현재 브랜치 확인 | `git branch --show-current` 실행 | main 브랜치가 아니면 **즉시 중단** |
| 미커밋 변경사항 | `git status` 실행 | 미커밋 파일 있으면 아래 커밋 처리 진행 |
| 환경변수 누락 | `.env.example` 대비 `.env.production` 누락 항목 확인 | 누락 항목 출력 후 **즉시 중단** |
| 메타 정보 설정 | `app/layout.tsx`에서 title, description, favicon 확인 | 기본값(`Create Next App` 등) 그대로면 **즉시 중단** |

### 1-1. 미커밋 변경사항 처리

미커밋 파일이 있으면 변경된 파일 목록을 보여주고 `AskUserQuestion` 툴로 묻습니다.

```
header: "커밋 메시지를 어떻게 할까요?"
options:
  - label: "알아서 작성해줘", description: "변경사항을 분석해서 자동으로 커밋 메시지를 생성합니다"
  - label: "직접 입력할게요", description: "커밋 메시지를 직접 입력합니다"
```

**"알아서 작성해줘" 선택 시:**
`git diff`로 변경사항을 분석해 적절한 커밋 메시지를 자동 생성합니다.
형식: `타입: 내용` (타입 종류: `feat` · `fix` · `chore` · `docs`)

**"직접 입력할게요" 선택 시:**
아래 형식으로 입력을 요청합니다.
> "커밋 메시지를 입력해주세요. (예: `feat: 결제 기능 추가`, `fix: 오류 수정`)"

커밋 메시지가 확정되면 실행합니다.

```bash
git add .
git commit -m "{커밋 메시지}"
```

### 2. 보안 점검

`.claude/skills/moa-security/SKILL.md`를 읽고 보안 점검을 실행합니다.

- 실패(❌) 항목이 하나라도 있으면 **즉시 중단**하고 조치 방법을 안내합니다.
- 모든 항목이 통과(✅) 또는 주의(⚠️)인 경우에만 다음 단계로 진행합니다.

### 3. Vercel 환경변수 동기화 (Vercel 배포인 경우)

배포 채널이 Vercel인 경우 실행합니다. (`vercel.json`이 존재하거나 `.vercel/` 디렉토리가 있으면 Vercel 배포로 간주)

`AskUserQuestion` 툴로 묻습니다.

```
header: "로컬 .env.production 값으로 Vercel 환경변수를 업데이트할까요?"
options:
  - label: "예, 업데이트해줘", description: "로컬 .env.production의 값을 Vercel production 환경에 동기화합니다"
  - label: "아니오, 건너뛸게요", description: "현재 Vercel 환경변수를 그대로 유지합니다"
```

**"예, 업데이트해줘" 선택 시:**

`.env.production` 파일을 읽고 각 환경변수를 Vercel에 등록합니다.

```bash
# 각 KEY=VALUE 항목에 대해 실행 (주석 및 빈 줄 제외)
echo "{VALUE}" | vercel env add {KEY} production
```

`vercel env add`는 이미 존재하는 키에 대해 덮어쓸지 묻는 경우 `y`로 응답합니다.

완료 후 동기화된 변수 목록을 출력합니다.

### 4. 배포 실행

main 브랜치로 push합니다.

```bash
git push origin main
```

이후 배포는 Vercel 또는 GitHub Actions 등 CI/CD가 자동으로 처리합니다.

### 5. 배포 후 처리

- 운영 환경 URL을 안내합니다.
- `docs/deploy.md` 배포 이력에 아래 내용을 추가합니다.

```
| {오늘 날짜} | 운영 | {git config user.name} | {최근 커밋 메시지} |
```

### 6. 문서 업데이트

`.claude/skills/complete-task/SKILL.md`를 읽고 지침에 따라 문서 업데이트를 진행합니다.

### 7. 팀 공유 여부 확인

`AskUserQuestion` 툴로 묻습니다.

```
header: "팀에 배포 내용을 공유할까요?"
options:
  - label: "공유할게요", description: "Slack에 업데이트 내용을 공유합니다"
  - label: "괜찮아요", description: "단순 수정이거나 공유가 필요 없는 경우 건너뜁니다"
```

"공유할게요" 선택 시 `.claude/skills/share-update/SKILL.md`를 읽고 지침에 따라 진행합니다.
