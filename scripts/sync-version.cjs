#!/usr/bin/env node
/**
 * 将 package.json 中的版本号同步到 src/index.ts 中的 version 常量
 */

const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const pkg = JSON.parse(fs.readFileSync(path.join(root, 'package.json'), 'utf-8'));
const version = pkg.version;

const indexPath = path.join(root, 'src', 'index.ts');
let content = fs.readFileSync(indexPath, 'utf-8');

const updated = content.replace(
  /^export const version = ['"][^'"]*['"];/m,
  `export const version = '${version}';`
);

if (updated === content) {
  console.log(`[sync-version] version already up to date: ${version}`);
} else {
  fs.writeFileSync(indexPath, updated, 'utf-8');
  console.log(`[sync-version] synced version to ${version}`);
}
