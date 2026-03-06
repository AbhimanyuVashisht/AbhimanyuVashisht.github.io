const fs = require('fs');
const path = require('path');

const ROOT = process.cwd();
const DIST = path.join(ROOT, 'dist');
const IGNORE = new Set([
  '.git',
  '.github',
  'node_modules',
  'scripts',
  'dist',
  '.DS_Store',
  '.idea'
]);

function shouldIgnore(name) {
  return IGNORE.has(name);
}

function copyRecursive(src, dest) {
  const stat = fs.statSync(src);
  if (stat.isDirectory()) {
    if (!fs.existsSync(dest)) fs.mkdirSync(dest, { recursive: true });
    const entries = fs.readdirSync(src);
    for (const entry of entries) {
      if (shouldIgnore(entry)) continue;
      copyRecursive(path.join(src, entry), path.join(dest, entry));
    }
    return;
  }

  fs.copyFileSync(src, dest);
}

function ensureDir(dirPath) {
  if (!fs.existsSync(dirPath)) fs.mkdirSync(dirPath, { recursive: true });
}

function writeRouteEntries(html) {
  const routes = ['about', 'contact', 'work'];
  for (const route of routes) {
    const outPath = path.join(DIST, `${route}.html`);
    fs.writeFileSync(outPath, html, 'utf8');
  }
}

function build() {
  fs.rmSync(DIST, { recursive: true, force: true });
  ensureDir(DIST);

  copyRecursive(ROOT, DIST);

  const indexPath = path.join(DIST, 'index.html');
  if (!fs.existsSync(indexPath)) {
    throw new Error('index.html not found in dist');
  }

  const indexHtml = fs.readFileSync(indexPath, 'utf8');
  writeRouteEntries(indexHtml);
}

build();
