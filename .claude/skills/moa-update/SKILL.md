---
name: moa-update
description: moa-template의 최신 버전을 확인하고 .claude/skills/와 CLAUDE.md를 업데이트하는 스킬.
---

# moa-update

moa-template의 최신 버전을 가져와 현재 프로젝트의 Claude 스킬과 규칙을 업데이트한다.

## 진행 순서

### 1. 최신 버전 확인

```bash
gh api repos/MOA-Agent/moa-template/contents/.claude/VERSION --jq '.content' | base64 -d
```

로컬 버전은 `.claude/VERSION`에서 읽는다.

### 2. 사용자에게 업데이트 안내

아래 형식으로 안내한다.

> "moa-template v{최신버전}이 있습니다. 현재 v{로컬버전}입니다.
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
