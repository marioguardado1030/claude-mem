#!/usr/bin/env node
// Updates the <!-- AUTO:version --> block in CLAUDE.md to match package.json version.
// Run: node scripts/update-claude-md.cjs
// Called by .github/workflows/update-claude-md.yml for version consistency checks.
const fs = require('fs');
const path = require('path');

const ROOT = process.cwd();
const CLAUDE_MD = path.join(ROOT, 'CLAUDE.md');
const PKG_PATH = path.join(ROOT, 'package.json');

if (!fs.existsSync(PKG_PATH)) {
  console.error('package.json not found at', PKG_PATH);
  process.exit(1);
}

const { version } = JSON.parse(fs.readFileSync(PKG_PATH, 'utf8'));
const newBlock = `<!-- AUTO:version -->\n**Version:** ${version}\n<!-- /AUTO:version -->`;

if (!fs.existsSync(CLAUDE_MD)) {
  console.error('CLAUDE.md not found at', CLAUDE_MD);
  process.exit(1);
}

const content = fs.readFileSync(CLAUDE_MD, 'utf8');
const updated = content.replace(
  /<!-- AUTO:version -->[\s\S]*?<!-- \/AUTO:version -->/,
  newBlock
);

if (updated === content) {
  console.log('No AUTO:version markers found - no changes made.');
  console.log('Add <!-- AUTO:version --> and <!-- /AUTO:version --> markers to CLAUDE.md to enable auto-update.');
  process.exit(0);
}

fs.writeFileSync(CLAUDE_MD, updated);
console.log(`Updated CLAUDE.md version to ${version}.`);
