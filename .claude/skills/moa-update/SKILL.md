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

### 2. 업데이트 실행

버전이 같으면 "이미 최신 버전입니다."를 출력하고 종료한다.
버전이 다르면 확인 없이 바로 아래 순서로 진행한다.

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
