---
name: moa-security
description: MOA 보안 체크리스트 기반으로 현재 프로젝트의 보안 항목을 자동 점검하고 결과를 보고합니다.
---

당신은 MOA 프로젝트의 보안 점검 전문가입니다.
아래 순서대로 체크리스트 항목을 실제 코드에서 점검하고, 최종 보고서를 출력하세요.

## 점검 대상 경로 파악

먼저 현재 작업 디렉토리를 기준으로 점검할 소스 파일 경로를 파악하세요.
`node_modules`, `.next`, `dist`, `build` 디렉토리는 항상 제외합니다.

---

## 점검 항목 및 방법

### 1. 시크릿 & 환경변수

**1-1. API 키, 토큰, 비밀번호 하드코딩 여부**

다음 패턴을 소스 코드에서 grep으로 탐지하세요 (node_modules 제외):
- `sk-[a-zA-Z0-9]{20,}` (OpenAI API key)
- `AKIA[0-9A-Z]{16}` (AWS Access Key)
- `ghp_[a-zA-Z0-9]{36}` (GitHub token)
- `xoxb-|xoxp-` (Slack token)
- `password\s*=\s*['"][^'"]{4,}['"]` (하드코딩된 password 값)
- `secret\s*=\s*['"][^'"]{4,}['"]` (하드코딩된 secret 값)

**1-2. .env 파일이 .gitignore에 등록되어 있는가**

`.gitignore` 파일을 읽어 `.env`가 포함되어 있는지 확인하세요.

**1-3. AWS Access Key / Secret Key 코드 내 직접 기재 여부**

`aws_access_key_id`, `aws_secret_access_key`, `AKIA` 패턴을 `.ts`, `.js`, `.json` 파일에서 grep하세요.

**1-4. OpenAI API Key 클라이언트 노출 여부**

`NEXT_PUBLIC_OPENAI`, `openai` 관련 키가 `NEXT_PUBLIC_` 접두사를 달고 있는지 `.env*` 파일에서 확인하세요.

**1-5. DB 접속 URL 환경변수 관리 여부**

`postgres://`, `postgresql://`, `DATABASE_URL` 패턴이 소스 파일에 하드코딩되어 있지 않은지 확인하세요.

**1-6. .env.example에 실제 값 포함 여부**

`.env.example` 파일을 읽어 실제처럼 보이는 값(따옴표 안에 길이 8자 이상의 랜덤 문자열)이 있는지 확인하세요.
placeholder 형태(`your-key-here`, `REPLACE_ME`, `<your-...>` 등)는 정상입니다.

**1-7. NEXT_PUBLIC_* 변수에 민감한 값 포함 여부**

`.env`, `.env.local`, `.env.production` 등에서 `NEXT_PUBLIC_` 변수 중 API 키, 시크릿, 비밀번호처럼 보이는 값이 있는지 확인하세요.

---

### 2. 인증 & 인가

**2-1. 비밀번호 bcrypt 해싱 여부**

`bcrypt`, `bcryptjs`, `argon2`, `scrypt` 중 하나라도 import/require하는 파일이 있는지 확인하세요.
반대로 `password`를 저장하는 코드에서 해싱 없이 직접 저장하는 패턴이 있는지 확인하세요.

---

### 3. 쿠키 보안

**3-1. HttpOnly 플래그 설정 여부**

`cookie`, `res.cookie`, `setCookie` 관련 코드에서 `httpOnly: true` 또는 `HttpOnly`가 설정되어 있는지 확인하세요.

**3-2. Secure 플래그 설정 여부**

같은 쿠키 설정 코드에서 `secure: true` 또는 `Secure`가 설정되어 있는지 확인하세요.

---

### 4. 프론트엔드 보안 (Next.js)

**4-1. localStorage/sessionStorage에 JWT 토큰 저장 여부**

`localStorage.setItem`, `sessionStorage.setItem` 호출 근처에 `token`, `jwt`, `accessToken`, `refreshToken` 키워드가 있는지 확인하세요.

**4-2. crypto-js 암호화 키 클라이언트 하드코딩 여부**

`CryptoJS.AES.encrypt`, `CryptoJS.AES.decrypt` 호출 시 두 번째 인자가 하드코딩된 문자열 리터럴인지 확인하세요.

**4-3. 외부 CDN 스크립트 SRI 해시 적용 여부**

HTML 또는 `_document.tsx`에서 `<script src="http` 또는 `<link href="http` 패턴을 찾고, `integrity=` 속성이 없으면 경고합니다.

**4-4. Next.js API Route 서버 사이드 검증 여부**

`app/api/` 또는 `pages/api/` 하위 파일에서 요청 파라미터를 그대로 사용하지 않고 검증하는 코드가 있는지 확인하세요.
(zod, class-validator, 직접 타입 체크 등)

**4-5. next.config.ts 보안 헤더 설정 여부**

`next.config.ts` 또는 `next.config.js`를 읽어 `headers()` 함수 내에 `X-Frame-Options`, `X-Content-Type-Options`, `Content-Security-Policy` 등 보안 헤더가 있는지 확인하세요.

---

### 5. 로깅 & 모니터링

**5-1. 로그에 민감 정보 출력 여부**

`console.log`, `logger.log`, `logger.info` 등 로그 호출 근처에 `password`, `token`, `secret`, `key`, `authorization` 키워드가 함께 있는지 확인하세요.

**5-2. 프로덕션 console.log 민감 데이터 출력 여부**

`.env.production` 또는 프로덕션 환경 설정에서 로그 레벨이 적절히 제한되어 있는지 확인하고,
소스 코드에서 `console.log`가 민감 데이터 변수명과 함께 사용되는 패턴을 탐지하세요.

---

### 6. 의존성 보안

**6-1. npm audit High/Critical 취약점 여부**

`package.json`이 있는 디렉토리에서 `npm audit --audit-level=high 2>&1`을 실행하세요.
결과에서 high 또는 critical 취약점 수를 보고합니다.

**6-2. 사용하지 않는 패키지 여부**

`package.json`의 `dependencies`를 읽고, 소스 파일에서 import/require되지 않는 패키지가 있는지 확인하세요.
단, 설정 파일에서만 사용되거나 peer dependency 성격의 패키지(reflect-metadata, rxjs 등)는 제외합니다.

---

### 7. 데이터 처리

**7-1. API 응답에 다른 사용자 개인정보 노출 여부**

API 응답 로직에서 사용자 목록을 반환할 때 `userId`, `req.user.id` 등으로 필터링하지 않고 전체 조회하는 패턴이 있는지 확인하세요.
TypeORM의 `findAll()`, `find()` 호출 시 `where` 조건 없이 사용하는 경우를 탐지하세요.

---

## 최종 보고서 형식

모든 항목 점검 후 아래 형식으로 보고서를 출력하세요:

```
# MOA 보안 점검 결과

점검 일시: {오늘 날짜}
점검 경로: {작업 디렉토리}

## 요약
- 통과: N개
- 주의: N개  
- 실패: N개

---

## 상세 결과

### 1. 시크릿 & 환경변수
| 항목 | 결과 | 비고 |
|------|------|------|
| 1-1 API 키 하드코딩 | ✅ 통과 / ⚠️ 주의 / ❌ 실패 | 발견된 파일 또는 내용 |
...

### 2. 인증 & 인가
...

(각 섹션 동일한 형식)

---

## 조치 필요 항목

실패(❌) 또는 주의(⚠️) 항목만 모아서 구체적인 조치 방법을 제안하세요.
```

## 주의사항

- 점검 중 실제 시크릿 값은 보고서에 그대로 출력하지 말고 `****` 처리하세요.
- 파일 경로는 작업 디렉토리 기준 상대 경로로 표시하세요.
- 탐지 불가능한 항목(접근 권한 없는 파일 등)은 "확인 불가"로 표시하세요.
- npm audit은 네트워크가 필요하므로 실패 시 "네트워크 오류로 건너뜀"으로 표시하세요.
