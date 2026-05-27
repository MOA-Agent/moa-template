#!/usr/bin/env node
/**
 * PreToolUse hook — Write / Edit
 * Migration 파일(.sql, supabase/migrations/)에 DROP TABLE / TRUNCATE 구문 차단
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

  const toolInput = input.tool_input || {};
  const filePath = toolInput.file_path || '';

  // Migration 파일 또는 .sql 파일만 검사
  const isMigrationFile =
    /supabase[\\/]migrations[\\/]/i.test(filePath) ||
    filePath.endsWith('.sql');

  if (!isMigrationFile) {
    process.exit(0);
  }

  // Write: content / Edit: new_string
  const content = toolInput.content || toolInput.new_string || '';

  const BLOCK_PATTERNS = [
    /DROP\s+TABLE/i,
    /DROP\s+SCHEMA/i,
    /DROP\s+DATABASE/i,
    /TRUNCATE(\s+TABLE)?/i,
  ];

  for (const pattern of BLOCK_PATTERNS) {
    if (pattern.test(content)) {
      process.stderr.write(
        '🚫 Migration 파일에 DB 삭제 구문이 감지되어 차단되었습니다.\n' +
        'DB 삭제는 Supabase 대시보드 또는 AWS 콘솔에서 직접 진행해주세요.\n'
      );
      process.exit(2);
    }
  }

  process.exit(0);
});
