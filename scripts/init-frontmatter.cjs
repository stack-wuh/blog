#!/usr/bin/env node
/**
 * 源文件 frontmatter 结构化工具（FRONTMATTER.md v1 配套）
 *
 * 用法：
 *   node scripts/init-frontmatter.cjs plan            # 生成 frontmatter-plan.json / .md（只读，不改文件）
 *   node scripts/init-frontmatter.cjs apply [file]    # 按计划写入（默认 frontmatter-plan.json）
 *
 * 写入策略（2026-09-04 与站长确认）：
 *   - 每篇显式写入 slug / title / type / date
 *   - post 追加 cover（正文首图，有图才写）；note 精简不打 cover
 *   - tags / summary 留空后补；publish / rssExcluded / updated 走默认不写
 *   - 已有 FM 合并保留未知键；labels: 统一改名 tags:
 * 幂等：字段齐全的文件自动跳过，可重复执行。
 */
const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');

const ROOT = path.resolve(__dirname, '..');
const DOCS = path.join(ROOT, 'docs');
const EXCLUDE_FILES = new Set(['index.md', 'style-guide.md']);
const SLUG_RE = /^[a-z0-9][a-z0-9-]*$/;
// H1 疑似占位符/代码噪音：标题、单个词、序号开头、等号围栏、路径/URL
const JUNK_TITLE_RE = /^(标题|origin|deps)\.?$/i || null;
function isJunkTitle(t) {
  if (/^(标题|origin|deps)\s*$/i.test(t)) return true;
  if (/={3,}/.test(t)) return true;
  if (/^\d+\s*[.、]/.test(t)) return true;
  if (/^\/|^(https?:)?\/\//.test(t)) return true;
  return false;
}

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

function detectType(rel) {
  const seg = rel.split('/');
  if (seg[0] === 'docs' && /^\$/.test(seg[1] || '')) return 'note';
  if (seg[0] === 'docs' && /^20\d{2}$/.test(seg[1] || '')) return 'post';
  return null;
}

/** 解析已有 frontmatter，返回 { lines: string[]|null, bodyStart } */
function parseFrontmatter(text) {
  if (!text.startsWith('---')) return { lines: null, bodyStart: 0 };
  const end = text.indexOf('\n---', 3);
  if (end < 0) return { lines: null, bodyStart: 0 };
  const lines = text.slice(4, end).split('\n');
  const bodyStart = text.indexOf('\n', end + 1) + 1;
  return { lines, bodyStart };
}

function hasKey(lines, key) {
  return lines.some((l) => new RegExp(`^${key}:`).test(l));
}

function firstHeadingText(body) {
  const m = body.match(/^#{1,6}\s+(.+?)\s*$/m);
  return m ? m[1].trim() : null;
}

function firstImage(body) {
  const m = body.match(/!\[[^\]]*\]\(([^)\s]+)/);
  return m ? m[1] : null;
}

function stemTitle(rel) {
  let stem = path.basename(rel, '.md');
  if (/^\d{8}$/.test(stem)) stem = `${stem.slice(0, 4)}-${stem.slice(4, 6)}-${stem.slice(6)}`;
  return stem;
}

function collect() {
  return walk(DOCS)
    .sort()
    .map((abs) => {
      const rel = path.relative(ROOT, abs).replace(/\\/g, '/');
      let raw = fs.readFileSync(abs, 'utf8');
      const hasBom = raw.charCodeAt(0) === 0xfeff;
      raw = raw.replace(/^\uFEFF/, '');
      const { lines, bodyStart } = parseFrontmatter(raw);
      const body = raw.slice(bodyStart);
      const base = path.basename(rel, '.md');
      const fileDate = (base.match(/^(\d{4}-\d{2}-\d{2})/) || [])[1] || null;
      const h1 = firstHeadingText(body);
      const h1Usable = h1 && !isJunkTitle(h1);
      const type = detectType(rel);
      return {
        rel,
        hasBom,
        hasFm: !!lines,
        existing: {
          slug: lines && hasKey(lines, 'slug') ? (lines.find((l) => l.startsWith('slug:')) || '').replace(/^slug:\s*/, '').trim() : null,
          date: lines && hasKey(lines, 'date') ? (lines.find((l) => l.startsWith('date:')) || '').replace(/^date:\s*/, '').trim() : null,
          title: lines && hasKey(lines, 'title') ? (lines.find((l) => l.startsWith('title:')) || '').replace(/^title:\s*/, '').trim() : null,
          type: lines && hasKey(lines, 'type') ? (lines.find((l) => l.startsWith('type:')) || '').replace(/^type:\s*/, '').trim() : null,
          cover: lines && hasKey(lines, 'cover') ? (lines.find((l) => l.startsWith('cover:')) || '').replace(/^cover:\s*/, '').trim() : null,
          labelsToRename: !!(lines && hasKey(lines, 'labels') && !hasKey(lines, 'tags')),
        },
        fileDate,
        h1,
        h1Usable: !!h1Usable,
        type,
        firstImage: type === 'post' ? firstImage(body) : null,
      };
    });
}

function buildPlan() {
  const items = collect().map((it) => {
    // slug：已有 > 覆盖阶段已写入
    const slug = it.existing.slug || it.h1Usable && it.h1 || stemTitle(it.rel);
    // title：FM 已有 > 可用 H1 > 文件名
    const titleFrom = it.existing.title ? 'fm' : it.h1Usable ? 'h1' : 'filename';
    const title = it.existing.title || (it.h1Usable ? it.h1 : stemTitle(it.rel));
    const type = it.existing.type || it.type;
    const cover = it.existing.cover || (it.type === 'post' ? it.firstImage : null);

    const add = [];
    if (!it.existing.slug) add.push('slug');
    if (!it.existing.title) add.push('title');
    if (!it.existing.type) add.push('type');
    if (!it.existing.date) add.push('date');
    if (it.type === 'post' && !it.existing.cover && it.firstImage) add.push('cover');

    const date = it.existing.date || it.fileDate || gitFirstDate(it.rel);
    return {
      path: it.rel,
      slug,
      title,
      titleFrom,
      type,
      cover: cover || null,
      date: date || null,
      status: add.length || it.existing.labelsToRename ? 'update' : 'complete',
      add,
      labelsToRename: it.existing.labelsToRename,
    };
  });
  return { generatedAt: new Date().toISOString(), spec: 'FRONTMATTER.md v1', items };
}

function writePlan(plan) {
  const jsonPath = path.join(ROOT, 'frontmatter-plan.json');
  const mdPath = path.join(ROOT, 'frontmatter-plan.md');
  fs.writeFileSync(jsonPath, JSON.stringify(plan, null, 2) + '\n');
  const rows = plan.items
    .map((it) => {
      const flags = [];
      if (it.titleFrom === 'filename') flags.push('⚠title来自文件名');
      if (it.labelsToRename) flags.push('labels→tags');
      return `| ${it.path} | ${String(it.title).slice(0, 32)} | ${it.type || '—'} | ${it.cover ? '✓' : ''} | ${it.status}${flags.length ? '(' + flags.join(',') + ')' : ''} |`;
    })
    .join('\n');
  fs.writeFileSync(
    mdPath,
    `# frontmatter 结构化计划\n\n> 审完修改 frontmatter-plan.json 后运行：node scripts/init-frontmatter.cjs apply\n\n| 文件 | title | type | cover | 状态 |\n|---|---|---|---|---|\n${rows}\n`,
  );
  const pending = plan.items.filter((i) => i.status !== 'complete').length;
  console.log(`plan: ${plan.items.length} items（待写入 ${pending}）-> frontmatter-plan.json`);
}

function apply(planPath) {
  const plan = JSON.parse(fs.readFileSync(path.join(ROOT, planPath || 'frontmatter-plan.json'), 'utf8'));
  const seen = new Map();
  for (const it of plan.items) {
    if (!SLUG_RE.test(it.slug)) throw new Error(`slug 不合法: ${it.path} -> "${it.slug}"`);
    if (seen.has(it.slug)) throw new Error(`slug 重复: "${it.slug}" -> ${it.path} 与 ${seen.get(it.slug)}`);
    seen.set(it.slug, it.path);
  }

  let updated = 0, skipped = 0;
  for (const it of plan.items) {
    const abs = path.join(ROOT, it.path);
    let raw = fs.readFileSync(abs, 'utf8').replace(/^\uFEFF/, '');
    const { lines, bodyStart } = parseFrontmatter(raw);
    const body = raw.slice(bodyStart);
    if (!lines) throw new Error(`缺少 frontmatter（先跑 slug/date 轮）: ${it.path}`);

    const add = [];
    if (!hasKey(lines, 'slug')) add.push(`slug: ${it.slug}`);
    if (!hasKey(lines, 'title') && it.title) add.push(`title: ${it.title}`);
    if (!hasKey(lines, 'type') && it.type) add.push(`type: ${it.type}`);
    if (!hasKey(lines, 'date') && it.date) add.push(`date: ${it.date}`);
    if (it.type === 'post' && !hasKey(lines, 'cover') && it.cover) add.push(`cover: ${it.cover}`);
    const rename = hasKey(lines, 'labels') && !hasKey(lines, 'tags');

    if (!add.length && !rename) { skipped++; continue; }

    const nextLines = lines
      .map((l) => (rename && /^labels:/.test(l) ? l.replace(/^labels:/, 'tags:') : l))
      .concat(add);
    const next = ['---', ...nextLines, '---', '', body].join('\n').replace(/\n{3,}$/, '\n\n');
    fs.writeFileSync(abs, next);
    updated++;
  }
  console.log(`apply 完成: 更新 ${updated} / 跳过 ${skipped}`);
}

const mode = process.argv[2] || 'plan';
if (mode === 'plan') writePlan(buildPlan());
else if (mode === 'apply') apply(process.argv[3]);
else { console.error('用法: node scripts/init-frontmatter.cjs plan | apply [plan.json]'); process.exit(1); }
