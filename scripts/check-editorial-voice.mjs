import { readFile, readdir, stat } from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';

const root = process.cwd();
const targets = ['index.html', '404.html', 'resume.html', 'professional-profile.html', 'blogs', 'projects'];
const blockedPhrases = [
  'this paper proposes',
  'this paper presents',
  'the more useful question',
  'it is important to note',
  'furthermore',
  'moreover',
  'additionally',
  'serves as a testament',
  'stands as',
  'delve',
  'showcases',
  'pivotal',
  'crucial'
];

async function collect(relative) {
  const absolute = path.join(root, relative);
  const info = await stat(absolute);
  if (info.isFile()) return relative.endsWith('.html') ? [relative] : [];
  const files = [];
  for (const entry of await readdir(absolute, { withFileTypes: true })) {
    const child = path.posix.join(relative, entry.name);
    if (entry.isDirectory()) files.push(...await collect(child));
    else if (entry.name.endsWith('.html')) files.push(child);
  }
  return files;
}

function textOnly(html) {
  return html
    .replace(/<script\b[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style\b[\s\S]*?<\/style>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/gi, ' ')
    .replace(/&amp;/gi, '&')
    .replace(/\s+/g, ' ')
    .toLowerCase();
}

const files = (await Promise.all(targets.map(collect))).flat();
const errors = [];
for (const file of files) {
  const text = textOnly(await readFile(path.join(root, file), 'utf8'));
  for (const phrase of blockedPhrases) {
    if (text.includes(phrase)) errors.push(`${file}: remove or rewrite "${phrase}"`);
  }
}

if (errors.length) {
  for (const error of errors) console.error(`ERROR: ${error}`);
  process.exit(1);
}
console.log(`Editorial voice check passed for ${files.length} public HTML pages.`);
