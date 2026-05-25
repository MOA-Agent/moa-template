---
name: moa-update
description: moa-template의 최신 버전을 확인하고 .claude/skills/, CLAUDE.md, 디자인 시스템을 업데이트하는 스킬.
---

# moa-update

moa-template의 최신 버전을 가져와 현재 프로젝트의 Claude 스킬과 규칙을 업데이트한다.

## 진행 순서

### 1. 최신 버전 확인

```bash
# 템플릿 버전
gh api repos/MOA-Agent/moa-template/contents/.claude/VERSION --jq '.content' | base64 -d

# 디자인 시스템 버전
gh api repos/MOA-Agent/moa-template/contents/.claude/skills/moa-design/package.json --jq '.content' | base64 -d | jq -r '.version'
```

로컬 버전은 `.claude/VERSION`과 `.claude/skills/moa-design/package.json`에서 읽는다.

### 2. 사용자에게 업데이트 안내

업데이트가 필요한 항목만 표시한다.

> "업데이트가 있습니다.
> - moa-template: v{로컬} → v{최신} _(있는 경우만)_
> - 디자인 시스템: v{로컬} → v{최신} _(있는 경우만)_
>
> 업데이트하면 `.claude/skills/`와 `CLAUDE.md`가 최신 버전으로 교체됩니다.
> 업데이트할까요?"

### 3. 업데이트 실행

사용자가 확인하면 아래 순서로 진행한다.

```bash
# 템플릿 tarball 다운로드
gh api repos/MOA-Agent/moa-template/tarball/main > /tmp/moa-tpl.tar.gz

# 압축 해제
mkdir -p /tmp/moa-tpl && tar -xzf /tmp/moa-tpl.tar.gz -C /tmp/moa-tpl --strip-components=1

# skills 교체
cp -r /tmp/moa-tpl/.claude/skills/ .claude/skills/

# CLAUDE.md 교체
cp /tmp/moa-tpl/CLAUDE.md ./CLAUDE.md

# VERSION 업데이트
cp /tmp/moa-tpl/.claude/VERSION .claude/VERSION

# 임시 파일 정리
rm -rf /tmp/moa-tpl /tmp/moa-tpl.tar.gz
```

### 4. 완료 안내

> "moa-template v{최신버전}으로 업데이트 완료됐습니다."
