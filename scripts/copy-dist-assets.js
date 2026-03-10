import { cpSync, existsSync, mkdirSync, readdirSync, statSync } from 'node:fs';
import path from 'node:path';

const srcRoot = path.resolve('src');
const distRoot = path.resolve('dist');

function copyJsonTree(currentRel = '') {
  const currentSrc = path.join(srcRoot, currentRel);
  if (!existsSync(currentSrc)) {
    return;
  }
  for (const entry of readdirSync(currentSrc)) {
    const rel = path.join(currentRel, entry);
    const srcPath = path.join(srcRoot, rel);
    const distPath = path.join(distRoot, rel);
    const stat = statSync(srcPath);
    if (stat.isDirectory()) {
      copyJsonTree(rel);
      continue;
    }
    if (!srcPath.endsWith('.json')) {
      continue;
    }
    mkdirSync(path.dirname(distPath), { recursive: true });
    cpSync(srcPath, distPath);
  }
}

copyJsonTree();
