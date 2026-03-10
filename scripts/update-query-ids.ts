import { readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { runtimeQueryIds } from '../src/lib/runtime-query-ids.js';
import { TARGET_QUERY_ID_OPERATIONS } from '../src/lib/twitter-client-constants.js';

async function main() {
  const info = await runtimeQueryIds.refresh(TARGET_QUERY_ID_OPERATIONS, { force: true });
  if (!info?.snapshot) {
    throw new Error('Failed to refresh runtime query IDs.');
  }

  const outputPath = path.resolve('src/lib/query-ids.json');
  const existing = JSON.parse(await readFile(outputPath, 'utf8'));
  const next = {
    ...existing,
    ...info.snapshot.ids,
  };

  await writeFile(outputPath, `${JSON.stringify(next, null, 2)}\n`, 'utf8');
  console.log(`Updated ${outputPath}`);
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : String(error));
  process.exit(1);
});
