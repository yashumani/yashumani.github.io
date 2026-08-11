import { readFile, readdir } from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';

const root = process.cwd();
const ignoredDirectories = new Set([
  '.git',
  'node_modules',
  'playwright-report',
  'test-results'
]);
const errors = [];
const warnings = [];

async function walk(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    if (entry.isDirectory() && ignoredDirectories.has(entry.name)) continue;

    const absolutePath = path.join(directory, entry.name);
    if (entry.isDirectory()) {
      files.push(...await walk(absolutePath));
    } else {
      files.push(absolutePath);
    }
  }

  return files;
}

function toRelative(absolutePath) {
  return path.relative(root, absolutePath).split(path.sep).join('/');
}

function attribute(tag, name) {
  const expression = new RegExp(
    `\\b${name}\\s*=\\s*(?:"([^"]*)"|'([^']*)'|([^\\s>]+))`,
    'i'
  );
  const match = tag.match(expression);
  return match ? (match[1] ?? match[2] ?? match[3] ?? '') : null;
}

function unique(values) {
  return [...new Set(values)];
}

function stripHashAndQuery(value) {
  const hashIndex = value.indexOf('#');
  const queryIndex = value.indexOf('?');
  const cutPoints = [hashIndex, queryIndex].filter((index) => index >= 0);
  return cutPoints.length ? value.slice(0, Math.min(...cutPoints)) : value;
}

function extractHash(value) {
  const hashIndex = value.indexOf('#');
  if (hashIndex < 0) return '';
  try {
    return decodeURIComponent(value.slice(hashIndex + 1));
  } catch {
    return value.slice(hashIndex + 1);
  }
}

function isExternal(value) {
  return /^(?:[a-z][a-z0-9+.-]*:|\/\/)/i.test(value);
}

const allAbsoluteFiles = await walk(root);
const allFiles = allAbsoluteFiles.map(toRelative);
const fileSet = new Set(allFiles);
const textCache = new Map();

async function text(relativePath) {
  if (!textCache.has(relativePath)) {
    textCache.set(
      relativePath,
      await readFile(path.join(root, relativePath), 'utf8')
    );
  }
  return textCache.get(relativePath);
}

function resolveTarget(sourceFile, rawPath) {
  const cleanPath = stripHashAndQuery(rawPath).replace(/\\/g, '/');
  let candidate;

  if (!cleanPath) {
    candidate = sourceFile;
  } else if (cleanPath.startsWith('/')) {
    candidate = path.posix.normalize(cleanPath.slice(1));
  } else {
    candidate = path.posix.normalize(
      path.posix.join(path.posix.dirname(sourceFile), cleanPath)
    );
  }

  if (candidate.startsWith('../')) return null;
  if (candidate.endsWith('/')) candidate += 'index.html';

  if (fileSet.has(candidate)) return candidate;
  if (!path.posix.extname(candidate) && fileSet.has(`${candidate}/index.html`)) {
    return `${candidate}/index.html`;
  }

  return candidate;
}

async function idsFor(relativePath) {
  const html = await text(relativePath);
  return new Set(
    [...html.matchAll(/\bid\s*=\s*(["'])(.*?)\1/gi)].map((match) => match[2])
  );
}

const legacyHomepageAnchors = new Set(['evidence', 'impact', 'roadmap']);
const htmlFiles = allFiles.filter((file) => file.endsWith('.html'));

for (const htmlFile of htmlFiles) {
  const html = await text(htmlFile);

  if (!/^\s*<!doctype html>/i.test(html)) {
    errors.push(`${htmlFile}: missing HTML5 doctype`);
  }
  if (!/<html\b[^>]*\blang\s*=\s*["'][^"']+["']/i.test(html)) {
    errors.push(`${htmlFile}: missing html[lang]`);
  }
  if (!/<meta\b[^>]*\bname\s*=\s*["']viewport["'][^>]*>/i.test(html)) {
    errors.push(`${htmlFile}: missing viewport metadata`);
  }
  if (!/<title>[\s\S]*?\S[\s\S]*?<\/title>/i.test(html)) {
    errors.push(`${htmlFile}: missing non-empty title`);
  }

  const metaTags = html.match(/<meta\b[^>]*>/gi) ?? [];
  const descriptionTag = metaTags.find(
    (tag) => (attribute(tag, 'name') ?? '').toLowerCase() === 'description'
  );
  if (!descriptionTag || !(attribute(descriptionTag, 'content') ?? '').trim()) {
    errors.push(`${htmlFile}: missing non-empty meta description`);
  }

  if (!/<main\b/i.test(html)) {
    errors.push(`${htmlFile}: missing main landmark`);
  }

  const ids = [...html.matchAll(/\bid\s*=\s*(["'])(.*?)\1/gi)].map(
    (match) => match[2]
  );
  const duplicateIds = unique(ids.filter((id, index) => ids.indexOf(id) !== index));
  for (const id of duplicateIds) {
    errors.push(`${htmlFile}: duplicate id "${id}"`);
  }

  for (const imageTag of html.match(/<img\b[^>]*>/gi) ?? []) {
    if (attribute(imageTag, 'alt') === null) {
      errors.push(`${htmlFile}: img element is missing alt text`);
    }
  }

  for (const anchorTag of html.match(/<a\b[^>]*>/gi) ?? []) {
    if ((attribute(anchorTag, 'target') ?? '').toLowerCase() === '_blank') {
      const rel = (attribute(anchorTag, 'rel') ?? '').toLowerCase().split(/\s+/);
      if (!rel.includes('noopener')) {
        errors.push(`${htmlFile}: target="_blank" link is missing rel="noopener"`);
      }
    }
  }

  const resourceTags = html.match(/<(?:a|link|script|img|source)\b[^>]*>/gi) ?? [];
  for (const tag of resourceTags) {
    const tagName = tag.match(/^<([a-z]+)/i)?.[1]?.toLowerCase();
    const rawValue = tagName === 'script' || tagName === 'img' || tagName === 'source'
      ? attribute(tag, 'src')
      : attribute(tag, 'href');

    if (!rawValue || rawValue.startsWith('#') && rawValue.length === 1) continue;
    if (isExternal(rawValue) || rawValue.startsWith('data:')) continue;

    const target = resolveTarget(htmlFile, rawValue);
    if (!target || !fileSet.has(target)) {
      errors.push(`${htmlFile}: broken local reference "${rawValue}"`);
      continue;
    }

    const hash = extractHash(rawValue);
    if (hash && target.endsWith('.html')) {
      const targetIds = await idsFor(target);
      const isLegacyHomepageRoute = target === 'index.html' && legacyHomepageAnchors.has(hash);
      if (!targetIds.has(hash) && !isLegacyHomepageRoute) {
        errors.push(`${htmlFile}: missing anchor "#${hash}" in ${target}`);
      }
    }
  }
}

const cssFiles = allFiles.filter((file) => file.endsWith('.css'));
for (const cssFile of cssFiles) {
  const css = await text(cssFile);
  const withoutComments = css.replace(/\/\*[\s\S]*?\*\//g, '');
  let depth = 0;

  for (const character of withoutComments) {
    if (character === '{') depth += 1;
    if (character === '}') depth -= 1;
    if (depth < 0) break;
  }

  if (depth !== 0) errors.push(`${cssFile}: unbalanced braces`);

  for (const match of css.matchAll(/@import\s+(?:url\()?\s*["']([^"']+)["']/gi)) {
    const importTarget = path.posix.normalize(
      path.posix.join(path.posix.dirname(cssFile), match[1])
    );
    if (!fileSet.has(importTarget)) {
      errors.push(`${cssFile}: missing imported stylesheet "${match[1]}"`);
    }
  }

  if (/\bmimax\s*\(/i.test(css)) {
    warnings.push(`${cssFile}: contains "mimax("; effective compatibility CSS currently overrides it`);
  }
  if (/overflow-wrap\s*:\s*anywher\b/i.test(css)) {
    warnings.push(`${cssFile}: contains "overflow-wrap: anywher"; effective compatibility CSS currently overrides it`);
  }
}

if (fileSet.has('sitemap.xml')) {
  const sitemap = await text('sitemap.xml');
  const locations = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/gi)].map(
    (match) => match[1].trim()
  );

  for (const location of locations) {
    let url;
    try {
      url = new URL(location);
    } catch {
      errors.push(`sitemap.xml: invalid URL "${location}"`);
      continue;
    }

    if (url.hostname !== 'yashumani.github.io') continue;
    let localPath = url.pathname.replace(/^\//, '');
    if (!localPath || localPath.endsWith('/')) localPath += 'index.html';
    if (!fileSet.has(localPath)) {
      errors.push(`sitemap.xml: "${location}" does not map to a local file`);
    }
  }
}

if (fileSet.has('robots.txt')) {
  const robots = await text('robots.txt');
  if (!/^Sitemap:\s*https:\/\/yashumani\.github\.io\/sitemap\.xml\s*$/mi.test(robots)) {
    errors.push('robots.txt: missing canonical sitemap declaration');
  }
}

for (const warning of unique(warnings)) {
  console.warn(`WARN: ${warning}`);
}

if (errors.length) {
  for (const error of unique(errors)) console.error(`ERROR: ${error}`);
  console.error(`\nSite validation failed with ${unique(errors).length} error(s).`);
  process.exit(1);
}

console.log(
  `Validated ${htmlFiles.length} HTML files, ${cssFiles.length} stylesheets, ` +
  `${allFiles.length} repository files, local references, anchors, metadata, and sitemap entries.`
);
