---
name: moa-init
description: MOA 신규 프로젝트 초기 세팅 스킬. "/init", "init 실행", "프로젝트 세팅 시작", "프로젝트 초기화" 등 프로젝트를 새로 만들거나 초기 환경을 구성하는 요청이 들어오면 반드시 이 스킬을 실행한다. 사용자에게 단계별로 질문해서 프로젝트 기본 정보와 인프라 선택을 수집하고, 그에 맞는 코드/설정 파일과 문서 파일을 자동으로 생성한다. 이미 세팅된 프로젝트(package.json 존재)에서는 실행하지 않는다.
---

# moa-init

MOA 신규 프로젝트의 초기 환경을 세팅하는 스킬.
사용자에게 L1 → L2 → L3 순서로 질문하고, 응답을 바탕으로 코드/설정 파일과 문서 파일을 생성한다.

## 동작 순서

1. Git 연결 상태 확인 → 템플릿 레포로 연결된 경우 재초기화
2. L1 질문 (프로젝트 기본 정보) — 4개 질문을 하나씩 순서대로
3. L2 질문 (인프라 선택) — 최대 7개 질문, 조건 분기 포함
4. L3 질문 (스타일) — 1개 질문
5. 선택 조합 요약 → 사용자 확인
6. 코드/설정 파일 생성
7. 문서 파일 생성
8. Vercel 선택 시 인프라 연동 — `references/vercel-setup.md` 참고

---

## Git 연결 상태 확인

L1 질문 전에 가장 먼저 실행한다.

```bash
git remote get-url origin
```

결과가 템플릿 레포 URL(`moa-template` 포함)이거나 `.git`이 없으면 아래를 확인한다.

**케이스 1 — 템플릿 레포로 연결된 경우**

아래 메시지를 보여주고 `AskUserQuestion` 툴로 확인한다.

> "현재 git이 템플릿 레포로 연결되어 있어요. 이 프로젝트 전용 git으로 재초기화할까요?
> 새 GitHub 레포 URL이 있으면 함께 알려주세요. (없으면 로컬 git만 초기화합니다)"

사용자가 확인하면 아래를 순서대로 실행한다.

```bash
rm -rf .git
git init
git add .
git commit -m "chore: initial setup"
```

URL을 제공한 경우 추가 실행:
```bash
git remote add origin {제공된 URL}
git push -u origin main
```

**케이스 2 — .git 자체가 없는 경우**

아래 메시지를 보여주고 `AskUserQuestion` 툴로 확인한다.

> "git이 초기화되어 있지 않아요. 이 프로젝트로 git을 초기화할까요?
> 연결할 GitHub 레포 URL이 있으면 함께 알려주세요. (없으면 로컬 git만 초기화합니다)"

사용자가 확인하면 케이스 1과 동일하게 실행한다.

**케이스 3 — 이미 다른 레포로 연결된 경우**

정상 상태로 판단하고 그대로 진행한다.

---

**규칙:** 질문은 반드시 하나씩 순서대로 한다. 이전 답변을 받기 전에 다음 질문을 하지 않는다.

**질문 방식:**
- L1 질문(자유 입력)은 일반 텍스트로 묻는다.
- L2, L3 질문(선택지가 있는 것)은 반드시 `AskUserQuestion` 툴을 사용해서 버튼 형태로 묻는다.

---

## L1. 프로젝트 기본 정보

아래 4개 질문을 순서대로 하나씩 일반 텍스트로 묻는다.

1. 어떤 프로젝트를 만들려고 하시나요? 간단히 설명해주세요. (예: 사내 정산 관리 도구, 고객 대상 예약 서비스 등)
2. 프로젝트 이름이 뭔가요?
3. 왜 만들었나요? 어떤 문제를 해결하는 프로젝트인가요?
4. 주요 기능을 간단히 나열해주세요. (예: 로그인, 대시보드, 리포트 다운로드)

---

## L2. 인프라 선택

아래 질문을 순서대로 하나씩 `AskUserQuestion` 툴로 묻는다. 조건 분기에 따라 일부 질문은 건너뛴다.

**Q1.** 웹 배포 채널은 무엇인가요?
```
header: "배포 채널"
options:
  - label: "Vercel", description: "Vercel을 통해 배포"
  - label: "EC2", description: "AWS EC2를 통해 직접 배포"
  - label: "미정", description: "나중에 결정"
```

**Q2.** 배포 환경은 어떻게 구성할 건가요?
```
header: "배포 환경"
options:
  - label: "운영만", description: "운영(production) 환경만 구성"
  - label: "개발+운영", description: "개발(dev)과 운영(production) 환경 모두 구성"
  - label: "미정", description: "나중에 결정"
```

**Q3.** DB를 사용하나요?
```
header: "DB 사용"
options:
  - label: "예", description: "데이터베이스를 사용"
  - label: "아니오", description: "DB 없이 진행 (Q4 건너뜀)"
```

**Q4.** (Q3이 "예"인 경우만) 어떤 DB를 사용하나요?
```
header: "DB 종류"
options:
  - label: "Supabase", description: "Supabase (PostgreSQL 기반)"
  - label: "RDS", description: "AWS RDS"
  - label: "미정", description: "나중에 결정"
```

**Q5.** 관리자 인증이 필요한가요?
```
header: "관리자 인증"
options:
  - label: "예", description: "서비스를 운영/관리하는 내부 관리자 전용 로그인이 필요한 경우 (예: MOA 내부 직원만 접근하는 어드민 페이지, 비밀번호 입력 방식 등)"
  - label: "아니오", description: "관리자 전용 인증 불필요"
  - label: "미정", description: "나중에 결정"
```

**Q6.** 사용자 인증이 필요한가요?
```
header: "사용자 인증"
options:
  - label: "예", description: "서비스를 이용하는 일반 사용자의 로그인/회원가입이 필요한 경우 (예: 이메일 로그인, 소셜 로그인, 회원별 데이터 관리 등)"
  - label: "아니오", description: "로그인 없이 누구나 접근 가능한 경우"
  - label: "미정", description: "나중에 결정"
```

**Q7.** 외부 API 연동이 필요한가요?
```
header: "외부 API"
options:
  - label: "예", description: "외부 서비스와 데이터를 주고받아야 하는 경우 (예: 카카오 알림톡, 문자 발송, 결제, 지도, 슬랙 연동 등)"
  - label: "아니오", description: "외부 API 연동 불필요"
  - label: "미정", description: "나중에 결정"
```

---

## L3. 스타일

**Q1.** MOA 기본 디자인 시스템을 적용할 건가요?
```
header: "디자인 시스템"
options:
  - label: "예", description: "MOA 기본 디자인 시스템 적용"
  - label: "아니오", description: "디자인 시스템 미적용"
  - label: "미정", description: "나중에 결정"
```

---

## 선택 조합 요약 및 확인

모든 질문이 끝난 뒤, 아래 형식으로 요약해서 사용자에게 확인을 받는다.
확인이 되면 파일 생성을 시작한다. 수정 요청이 있으면 해당 항목만 다시 묻는다.

```
📋 세팅 요약

[프로젝트 기본 정보]
- 이름: {프로젝트 이름}
- 설명: {프로젝트 설명}
- 목적: {목적}
- 주요 기능: {기능 목록}

[인프라]
- 배포 채널: {Vercel / EC2 / 미정}
- 배포 환경: {운영만 / 개발+운영 / 미정}
- DB: {Supabase / RDS / 없음 / 미정}
- 관리자 인증: {예 / 아니오 / 미정}
- 사용자 인증: {예 / 아니오 / 미정}
- 외부 API 연동: {예 / 아니오 / 미정}

[스타일]
- MOA 디자인 시스템: {예 / 아니오 / 미정}

이 내용으로 프로젝트를 세팅할게요. 맞나요?
```

---

## 파일 생성 및 실행 규칙

파일 생성 규칙 상세 내용은 `references/file-rules.md`를 읽고 따른다.

**중요:** 파일 생성뿐 아니라 npm install, git, vercel 등 모든 명령을 Claude가 직접 실행한다. 명령어를 출력하고 사용자에게 실행을 넘기지 않는다.

실행 순서:
1. 코드/설정 파일 생성 (Next.js 기본 구조 → 조건별 파일)
2. 문서 파일 생성 (`README.md` → `docs/` 하위 파일들)
3. MOA 디자인 시스템 선택 시 → `references/templates/design.md` 참고하여 직접 실행
4. Vercel 선택 시 → `references/vercel-setup.md` 참고하여 직접 실행

---

## 실패 처리

| 상황 | 처리 방식 |
|---|---|
| 파일이 이미 존재하는 경우 | 덮어쓰기 전 사용자에게 확인 |
| 미정 선택 항목 | 해당 파일은 생성하지 않고, 완료 후 수동 추가 필요 항목 안내 |
| 생성 중 오류 발생 | 오류 내용 출력 후 중단, 이미 생성된 파일 목록 안내 |
