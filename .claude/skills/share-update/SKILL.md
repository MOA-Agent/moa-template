---
name: moa-share-update
description: 배포 후 내부 공유용 HTML/PDF 문서를 자동 생성하고 Slack으로 발송하는 스킬. change-log.md와 최신 커밋 기반으로 변경사항을 파악하고 MOA 디자인 시스템 기반의 HTML을 생성한 뒤, MOA API를 통해 Slack에 공유한다.
---

당신은 MOA 프로젝트의 내부 공유 문서 작성 담당자입니다.
아래 순서대로 공유용 HTML 문서를 생성합니다.

## 진행 순서

### 1. 변경사항 파악

아래 두 가지를 함께 읽어 이번 배포의 변경 내용을 파악합니다.

**change-log.md 최신 항목 읽기**
`docs/change-log.md`의 가장 최근 항목을 읽습니다.

**최신 커밋 읽기**
```bash
git log origin/main -10 --oneline
```

두 내용을 종합해 변경사항을 아래 유형으로 분류합니다.
- `신규 기능`: 새로 추가된 기능
- `변경`: 기존 기능이 수정된 항목
- `버그 수정`: 오류 수정 항목

### 2. 사용자에게 확인

아래 질문을 **한 번에 하나씩** 순서대로 물어봅니다. 답변을 받은 뒤 다음 질문으로 넘어갑니다.

1. "이번 배포를 한 줄로 소개해주세요."
2. "타 팀 또는 타 프로젝트에 영향을 주는 변경사항이 있나요? (없으면 '없음')"
3. "추가로 전달할 내용이 있나요? (없으면 '없음')"
4. "포함할 스크린샷 파일 경로가 있으면 알려주세요. (없으면 '없음')"

### 3. HTML 문서 생성

`.claude/skills/share-update/references/template.html`을 읽어 기준으로 삼고,
수집한 데이터로 내용을 채워 HTML 파일을 생성합니다.
해당 없는 섹션은 통째로 제거합니다.

**저장 경로**
```
docs/share/{YYYYMMDD}-{프로젝트이름}-update.html
```

### 4. PDF 변환

`puppeteer-core`가 설치되어 있지 않으면 먼저 설치합니다. (`puppeteer` 대신 `puppeteer-core`를 사용해 시스템 Chrome을 직접 활용합니다. Chromium 별도 다운로드 없음)

```bash
npm list puppeteer-core --depth=0 2>/dev/null | grep -q puppeteer-core || npm install puppeteer-core --save-dev
```

아래 스크립트를 실행해 PDF를 생성합니다. 시스템 Chrome 경로를 순서대로 탐색합니다.

```bash
node -e "
const puppeteer = require('puppeteer-core');
const path = require('path');
const fs = require('fs');

const chromePaths = [
  '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  '/Applications/Chromium.app/Contents/MacOS/Chromium',
  '/usr/bin/google-chrome',
  '/usr/bin/chromium-browser',
];

const executablePath = chromePaths.find(p => fs.existsSync(p));
if (!executablePath) { console.error('Chrome을 찾을 수 없습니다. Chrome을 설치해주세요.'); process.exit(1); }

(async () => {
  const browser = await puppeteer.launch({ executablePath, args: ['--no-sandbox'] });
  const page = await browser.newPage();
  await page.goto('file://' + path.resolve('{HTML 파일 경로}'), { waitUntil: 'networkidle0' });
  await page.pdf({ path: '{PDF 파일 경로}', format: 'A4', printBackground: true });
  await browser.close();
  console.log('PDF 생성 완료');
})();
"
```

PDF 저장 경로는 HTML과 동일한 위치에 확장자만 `.pdf`로 변경합니다.

```
docs/share/{YYYYMMDD}-{프로젝트이름}-update.pdf
```

### 5. Slack 발송

두 단계로 발송합니다: 텍스트 요약 먼저, 이후 PDF 파일 업로드.

**5-1. 텍스트 요약 발송**

```bash
node -e "
const channelId = 'C0B4P9ND77C';

const blocks = [
  {
    type: 'header',
    text: { type: 'plain_text', text: '{프로젝트 이름} 업데이트' }
  },
  {
    type: 'section',
    text: { type: 'mrkdwn', text: '*{배포 한 줄 소개}*' }
  },
  { type: 'divider' },
  // 신규 기능이 있는 경우만 포함
  {
    type: 'section',
    text: { type: 'mrkdwn', text: '*🆕 신규 기능*\n{신규 기능 목록 (없으면 이 블록 제거)}' }
  },
  // 변경사항이 있는 경우만 포함
  {
    type: 'section',
    text: { type: 'mrkdwn', text: '*✏️ 변경사항*\n{변경사항 목록 (없으면 이 블록 제거)}' }
  },
  // 버그 수정이 있는 경우만 포함
  {
    type: 'section',
    text: { type: 'mrkdwn', text: '*🐛 버그 수정*\n{버그 수정 목록 (없으면 이 블록 제거)}' }
  },
  // 영향 범위가 있는 경우만 포함
  {
    type: 'section',
    text: { type: 'mrkdwn', text: '*📢 영향 범위*\n{영향 범위 (없으면 이 블록 제거)}' }
  },
  {
    type: 'context',
    elements: [{ type: 'mrkdwn', text: '{YYYY년 MM월 DD일}' }]
  }
];

fetch('https://moa-api-ten.vercel.app/api/slack/notify', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ channel_id: channelId, text: '{배포 한 줄 소개}', blocks })
})
  .then(r => r.json())
  .then(data => { if (!data.ok) throw new Error(data.error); console.log('텍스트 발송 완료'); })
  .catch(err => console.error('텍스트 발송 실패:', err.message));
"
```

해당 없는 섹션의 블록은 발송 전에 배열에서 제거합니다.

**5-2. PDF 파일 업로드**

```bash
node -e "
const fs = require('fs');
const channelId = 'C0B4P9ND77C';
const pdfPath = '{PDF 파일 경로}';
const filename = '{YYYYMMDD}-{프로젝트이름}-update.pdf';
const title = '{프로젝트 이름} 업데이트 ({YYYY년 MM월 DD일})';

const file_base64 = fs.readFileSync(pdfPath).toString('base64');

fetch('https://moa-api-ten.vercel.app/api/slack/upload', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ channel_id: channelId, file_base64, filename, title })
})
  .then(r => r.json())
  .then(data => { if (!data.ok) throw new Error(data.error); console.log('PDF 업로드 완료'); })
  .catch(err => console.error('PDF 업로드 실패:', err.message));
"
```

### 6. 완료 안내

> "업데이트 내용이 Slack에 공유됐습니다."
