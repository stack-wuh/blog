#!/usr/bin/env node
/**
 * 源文件 frontmatter 初始化工具（FRONTMATTER.md v1 配套）
 *
 * 用法：
 *   node scripts/init-frontmatter.cjs plan            # 生成 frontmatter-plan.json / .md（只读，不改文件）
 *   node scripts/init-frontmatter.cjs apply [file]    # 按计划写入（默认 frontmatter-plan.json）
 *
 * 策略（最小显式）：slug 每篇必写；date 尽量钉住（文件名前缀 > git 首次提交日期）；
 * 其余字段靠解析器推导，不写入。已有 frontmatter 的文件做合并（保留已有键）。
 * 幂等：已含相同 slug 的文件自动跳过，可重复执行。
 */
const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');

const ROOT = path.resolve(__dirname, '..');
const DOCS = path.join(ROOT, 'docs');
const EXCLUDE_FILES = new Set(['index.md', 'style-guide.md']);
const SLUG_RE = /^[a-z0-9][a-z0-9-]*$/;

function walk(dir) {
  let out = [];
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    if (e.name === '.vitepress' || e.name === 'node_modules' || e.name === 'assets') continue;
    const p = path.join(dir, e.name);
    if (e.isDirectory()) out = out.concat(walk(p));
    else if (e.name.endsWith('.md') && !EXCLUDE_FILES.has(e.name)) out.push(p);
  }
  return out;
}

function gitFirstDate(rel) {
  try {
    const out = execFileSync(
      'git',
      ['log', '--diff-filter=A', '--format=%as', '--reverse', '--', rel],
      { encoding: 'utf8', cwd: ROOT },
    ).trim();
    return out.split('\n')[0] || null;
  } catch {
    return null;
  }
}

function firstH1(text) {
  const m = text.match(/^#\s+(.+?)\s*$/m);
  return m ? m[1].trim() : null;
}

/** 解析已有 frontmatter，返回 { lines: string[]|null, bodyStart } */
function parseFrontmatter(text) {
  if (!text.startsWith('---')) return { lines: null, bodyStart: 0 };
  const end = text.indexOf('\n---', 3);
  if (end < 0) return { lines: null, bodyStart: 0 };
  const block = text.slice(4, end);
  const lines = block.split('\n');
  const bodyStart = text.indexOf('\n', end + 1) + 1;
  return { lines, bodyStart };
}

function hasKey(lines, key) {
  return lines.some((l) => new RegExp(`^${key}:`).test(l));
}

function detectType(rel) {
  const seg = rel.split(path.sep);
  if (seg[0] === 'docs' && /^\$/.test(seg[1] || '')) return 'note';
  if (seg[0] === 'docs' && /^20\d{2}$/.test(seg[1] || '')) return 'post';
  return null;
}

function collect() {
  return walk(DOCS)
    .sort()
    .map((abs) => {
      const rel = path.relative(ROOT, abs);
      let raw = fs.readFileSync(abs, 'utf8');
      const hasBom = raw.charCodeAt(0) === 0xfeff;
      raw = raw.replace(/^\uFEFF/, '');
      const base = path.basename(rel, '.md');
      const fileDate = (base.match(/^(\d{4}-\d{2}-\d{2})/) || [])[1] || null;
      const { lines } = parseFrontmatter(raw);
      const existingSlug = lines && hasKey(lines, 'slug')
        ? (lines.find((l) => l.startsWith('slug:')) || '').replace(/^slug:\s*/, '').trim()
        : null;
      const existingDate = lines && hasKey(lines, 'date')
        ? (lines.find((l) => l.startsWith('date:')) || '').replace(/^date:\s*/, '').trim()
        : null;
      return {
        rel: rel.replace(/\\/g, '/'),
        title: firstH1(raw) || base,
        hasBom,
        hasFm: !!lines,
        existingSlug,
        existingDate,
        fileDate,
        type: detectType(rel),
      };
    });
}

function buildPlan() {
  const items = collect().map((it) => {
    const date = it.existingDate || it.fileDate || gitFirstDate(it.rel);
    let slug = it.existingSlug;
    let status;
    if (slug) {
      status = 'keep-existing-slug';
    } else {
      slug = it.title
        .toLowerCase()
        .replace(/[^\p{Script=Latin}\p{Script=Han}0-9]+/gu, '-')
        .replace(/^-+|-+$/g, '') || path.basename(it.rel, '.md').toLowerCase();
      status = 'candidate';
    }
    return {
      path: it.rel,
      slug,
      date: date || null,
      title: it.title,
      type: it.type,
      status,
      actions: [
        it.hasBom && !it.hasFm ? 'strip-bom+insert' : it.hasBom ? 'strip-bom+merge' : it.hasFm ? 'merge' : 'insert',
      ],
    };
  });
  return { generatedAt: new Date().toISOString(), spec: 'FRONTMATTER.md v1', items };
}

function writePlan(plan) {
  const jsonPath = path.join(ROOT, 'frontmatter-plan.json');
  const mdPath = path.join(ROOT, 'frontmatter-plan.md');
  fs.writeFileSync(jsonPath, JSON.stringify(plan, null, 2) + '\n');
  const rows = plan.items
    .map((it) => `| ${it.path} | ${it.title.slice(0, 40)} | ${it.slug} | ${it.date || '—'} | ${it.type || '—'} | ${it.status} |`)
    .join('\n');
  fs.writeFileSync(
    mdPath,
    `# frontmatter 初始化计划\n\n> 修改 slug 后运行：node scripts/init-frontmatter.cjs apply\n\n| 文件 | 标题 | slug | date | type | 状态 |\n|---|---|---|---|---|---|\n${rows}\n`,
  );
  console.log(`plan: ${plan.items.length} items -> ${path.basename(jsonPath)}, ${path.basename(mdPath)}`);
}

function apply(planPath) {
  const plan = JSON.parse(fs.readFileSync(path.join(ROOT, planPath || 'frontmatter-plan.json'), 'utf8'));
  const items = plan.items;
  const seen = new Map();
  for (const it of items) {
    if (!SLUG_RE.test(it.slug)) {
      throw new Error(`slug 不合法（需 ^[a-z0-9][a-z0-9-]*$）: ${it.path} -> "${it.slug}"`);
    }
    if (seen.has(it.slug)) throw new Error(`slug 重复: "${it.slug}" -> ${it.path} 与 ${seen.get(it.slug)}`);
    seen.set(it.slug, it.path);
    if (it.date && !/^\d{4}-\d{2}-\d{2}$/.test(it.date)) {
      throw new Error(`date 不合法: ${it.path} -> "${it.date}"`);
    }
  }

  let inserted = 0, merged = 0, skipped = 0, bomStripped = 0;
  for (const it of items) {
    const abs = path.join(ROOT, it.path);
    let raw = fs.readFileSync(abs, 'utf8');
    const hadBom = raw.charCodeAt(0) === 0xfeff;
    raw = raw.replace(/^\uFEFF/, '');
    const { lines, bodyStart } = parseFrontmatter(raw);
    const body = raw.slice(bodyStart);

    if (lines) {
      if (hasKey(lines, 'slug') && hasKey(lines, 'date')) { skipped++; continue; }
      const add = [];
      if (!hasKey(lines, 'slug')) add.push(`slug: ${it.slug}`);
      if (!hasKey(lines, 'date') && it.date) add.push(`date: ${it.date}`);
      const next = ['---', ...add, ...lines, '---', '', body].join('\n').replace(/\n{3,}$/, '\n\n');
      fs.writeFileSync(abs, next);
      merged++;
      if (hadBom) bomStripped++;
      continue;
    }

    const fmLines = ['---', `slug: ${it.slug}`];
    if (it.date) fmLines.push(`date: ${it.date}`);
    fmLines.push('---', '', body);
    fs.writeFileSync(abs, fmLines.join('\n').replace(/\n{3,}$/, '\n\n'));
    inserted++;
    if (hadBom) bomStripped++;
  }
  console.log(`apply 完成: 插入 ${inserted} / 合并 ${merged} / 跳过 ${skipped} / 去 BOM ${bomStripped}`);
}

const mode = process.argv[2] || 'plan';
if (mode === 'plan') writePlan(buildPlan());
else if (mode === 'apply') apply(process.argv[3]);
else { console.error('用法: node scripts/init-frontmatter.cjs plan | apply [plan.json]'); process.exit(1); }
