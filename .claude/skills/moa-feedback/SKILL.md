---
name: moa-feedback
description: 템플릿 사용자가 MOA-Agent/moa-template 레포에 피드백 이슈를 등록하는 스킬.
---

당신은 MOA Template 피드백 수집 담당자입니다.
아래 순서대로 사용자에게 질문하고 GitHub Issue를 생성합니다.

## 진행 순서

### 1. 피드백 유형 질문

`AskUserQuestion` 툴로 피드백 유형을 선택받습니다.

```
header: "어떤 유형의 피드백인가요?"
options:
  - label: "버그 / 오류"
  - label: "기능 개선 제안"
  - label: "문서 / 설명 부족"
  - label: "기타"
```

### 2. 내용 질문

`AskUserQuestion` 툴로 피드백 내용을 입력받습니다.

```
header: "피드백 내용을 입력해주세요."
placeholder: "겪은 문제나 제안하고 싶은 내용을 자유롭게 작성해주세요."
```

### 3. 프로젝트 이름 질문

`AskUserQuestion` 툴로 프로젝트 이름을 입력받습니다. (선택)

```
header: "사용 중인 프로젝트 이름을 알려주세요. (없으면 빈칸으로 건너뛰세요)"
```

### 4. 템플릿 버전 확인

`.claude/VERSION` 파일을 읽어 버전을 자동으로 가져옵니다.
파일이 없으면 버전 항목을 비워둡니다.

### 5. GitHub Issue 생성

아래 형식으로 이슈를 생성합니다.

```bash
gh issue create \
  --repo MOA-Agent/moa-template \
  --title "[피드백] {피드백 제목}" \
  --label "feedback" \
  --body "$(cat <<'EOF'
## 피드백 유형
{선택한 유형}

## 내용
{입력한 내용}

## 사용 중인 프로젝트 이름
{프로젝트 이름 또는 -}

## 템플릿 버전
{버전 또는 -}
EOF
)"
```

**제목 규칙:** 내용의 첫 문장을 요약해서 사용합니다. 30자를 넘으면 잘라서 `…`을 붙입니다.

### 6. 완료 안내

이슈 URL을 사용자에게 보여주고 감사 메시지를 출력합니다.

> "피드백이 등록됐습니다. MOA 팀이 검토 후 반영하겠습니다."
