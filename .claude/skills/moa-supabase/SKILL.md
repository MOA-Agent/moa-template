---
name: moa-supabase
description: Supabase 프로젝트 연결 스킬. "/moa-supabase", "supabase 연결", "supabase 세팅", "DB 연결해줘" 등 Supabase 프로젝트를 실제로 연결하거나 세팅하는 요청이 들어오면 이 스킬을 실행한다. 기존 Supabase 프로젝트 연결과 신규 프로젝트 생성 두 가지 흐름을 지원하며, 인프라 담당자 논의가 필요한 경우 체크리스트를 생성한다.
---

# moa-supabase

Supabase 프로젝트를 실제로 연결하는 스킬.
moa-init에서 Supabase를 선택했지만 연결을 미뤄둔 경우, 이 스킬로 마저 진행한다.

## 사전 확인

실행 전 `lib/supabase.ts`가 존재하는지 확인한다.
없으면 "moa-init에서 Supabase를 먼저 선택해주세요"라고 안내하고 중단한다.

## 동작 순서

1. 기존/신규 분기 질문
2. 분기에 따라 연결 또는 체크리스트 생성
3. 완료 안내

## 분기 질문

> 연결할 Supabase 프로젝트가 이미 있나요?
> 선택지: **있음 (기존 연결)** / **없음 (신규 생성 필요)**

---

**있음 → `references/link-existing.md` 참고**

**없음 → `references/create-new.md` 참고**

## 실패 처리

| 상황 | 처리 방식 |
|---|---|
| `supabase` CLI 미설치 | 설치 안내 후 중단: `brew install supabase/tap/supabase` |
| Supabase 인증 안 된 경우 | `supabase login` 실행 안내 후 중단 |
| link 실패 | 오류 메시지 출력 후 Supabase 대시보드에서 project-ref 재확인 안내 |
