#!/usr/bin/env node
/**
 * check-no-fake-data.js
 * 
 * Zero Fake Data Policy Verification Script for Nodal-Connector.
 * Scans client/src and server/src to verify that NO mockups, dummy users,
 * fake phone numbers, lorem ipsum placeholders, or test domains exist in
 * production source code.
 */

const fs = require('fs');
const path = require('path');

const ROOT_DIR = path.resolve(__dirname, '..');
const TARGET_DIRS = [
  path.join(ROOT_DIR, 'client', 'src'),
  path.join(ROOT_DIR, 'server', 'src')
];

// Patterns indicative of unauthorized dummy/fake/placeholder data in UI or logic
const PROHIBITED_PATTERNS = [
  { name: 'Lorem Ipsum Placeholder', regex: /lorem\s+ipsum/i },
  { name: 'Generic Dummy Name (John/Jane Doe)', regex: /\b(john|jane)\s+doe\b/i },
  { name: 'Fake Test Phone (555-01xx / 123-456-7890)', regex: /\b555-01\d{2}\b|\b123-456-7890\b|\+1234567890\b/ },
  { name: 'Example Domain Placeholder (@example.com)', regex: /@example\.com\b/i },
  { name: 'Fictional Corporation (Acme Corp)', regex: /\bacme\s+corp/i },
  { name: 'Foobar Dummy Token', regex: /\bfoobar\b/i }
];

// File extensions to inspect
const EXTENSIONS = new Set(['.ts', '.tsx', '.js', '.jsx', '.json', '.html']);

// Files or lines explicitly exempt (e.g. self-checking scripts or comments discussing the policy)
const EXEMPT_LINES = [
  'Zero Fake Data Policy',
  'check-no-fake-data',
  'cleanup-fake-data',
  'Never returns fake',
  'purging legacy mockups',
  'All fake mockups',
  'cleansed of all mockups'
];

let totalFiles = 0;
let violations = [];

function scanDirectory(dir) {
  if (!fs.existsSync(dir)) return;

  const entries = fs.readdirSync(dir, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);

    if (entry.isDirectory()) {
      if (entry.name !== 'node_modules' && entry.name !== '.git' && entry.name !== 'dist' && entry.name !== 'build') {
        scanDirectory(fullPath);
      }
    } else if (entry.isFile()) {
      const ext = path.extname(entry.name).toLowerCase();
      if (EXTENSIONS.has(ext)) {
        totalFiles++;
        checkFile(fullPath);
      }
    }
  }
}

function checkFile(filePath) {
  const relativePath = path.relative(ROOT_DIR, filePath);
  const content = fs.readFileSync(filePath, 'utf-8');
  const lines = content.split('\n');

  lines.forEach((line, index) => {
    // Check if line contains exemption comment
    const isExempt = EXEMPT_LINES.some(ex => line.includes(ex));
    if (isExempt) return;

    for (const pattern of PROHIBITED_PATTERNS) {
      if (pattern.regex.test(line)) {
        violations.push({
          file: relativePath,
          line: index + 1,
          rule: pattern.name,
          content: line.trim()
        });
      }
    }
  });
}

console.log('====================================================');
console.log('   Nodal-Connector: Zero Fake Data Policy Check     ');
console.log('====================================================');
console.log(`Scanning target directories: client/src, server/src...`);

for (const target of TARGET_DIRS) {
  scanDirectory(target);
}

console.log(`Audited ${totalFiles} source files.`);

if (violations.length === 0) {
  console.log('\n[PASS] 0 violations found.');
  console.log('✓ Zero Fake Data Policy passed: All production source files contain zero fake, mock, or placeholder data.\n');
  process.exit(0);
} else {
  console.error(`\n[FAIL] Found ${violations.length} prohibited fake/dummy data occurrence(s):\n`);
  violations.forEach((v, i) => {
    console.error(`  ${i + 1}. [${v.rule}] in ${v.file}:${v.line}`);
    console.error(`     "${v.content}"`);
  });
  console.error('\nPlease purge all fake/placeholder data before deploying to production.\n');
  process.exit(1);
}
