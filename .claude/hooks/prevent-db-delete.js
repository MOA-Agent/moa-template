#!/usr/bin/env node
/**
 * PreToolUse hook — Bash
 * DROP TABLE / TRUNCATE / DELETE (no WHERE) / supabase db reset 차단
 */

const chunks = [];
process.stdin.on('data', d => chunks.push(d));
process.stdin.on('end', () => {
  let input;
  try {
    input = JSON.parse(Buffer.concat(chunks).toString());
  } catch {
    process.exit(0);
  }

  const command = (input.tool_input && input.tool_input.command) || '';

  const BLOCK_PATTERNS = [
    /DROP\s+TABLE/i,
    /DROP\s+SCHEMA/i,
    /DROP\s+DATABASE/i,
    /TRUNCATE(\s+TABLE)?/i,
    /supabase\s+db\s+reset/i,
  ];

  for (const pattern of BLOCK_PATTERNS) {
    if (pattern.test(command)) {
      process.stderr.write(
        '🚫 DB 삭제 명령이 차단되었습니다.\n' +
        'DB 삭제는 Supabase 대시보드 또는 AWS 콘솔에서 직접 진행해주세요.\n'
      );
      process.exit(2);
    }
  }

  process.exit(0);
});
