import fs from 'node:fs'
import path from 'node:path'
import matter from 'gray-matter'
import { Octokit } from '@octokit/rest'

const REPO_OWNER = 'stack-wuh'
const REPO_NAME = 'blog'

interface Frontmatter {
  title?: string
  labels?: string | string[]
  summary?: string
  cover?: string
  keywords?: string | string[]
}

function parseLabels(raw: unknown): string[] {
  if (!raw) return []
  if (Array.isArray(raw)) return raw.map(String).filter(Boolean)
  if (typeof raw === 'string') return raw.split(',').map((s) => s.trim()).filter(Boolean)
  return []
}

function parseKeywords(raw: unknown): string[] {
  return parseLabels(raw)
}

function buildMetadataBlock(fm: Frontmatter): string {
  const meta: Record<string, unknown> = {}
  if (fm.summary) meta.summary = fm.summary
  if (fm.cover) meta.cover = fm.cover
  if (fm.keywords) meta.keywords = parseKeywords(fm.keywords)
  if (Object.keys(meta).length === 0) return ''
  return `\n\n<!-- wuh-site-metadata: ${JSON.stringify(meta)} -->`
}

async function main() {
  const filePath = process.argv[2]
  if (!filePath) {
    console.error('用法: pnpm publish <markdown-file>')
    process.exit(1)
  }

  const absPath = path.resolve(filePath)
  if (!fs.existsSync(absPath)) {
    console.error(`文件不存在: ${absPath}`)
    process.exit(1)
  }

  const token = process.env.GITHUB_TOKEN
  if (!token) {
    console.error('未设置 GITHUB_TOKEN 环境变量')
    process.exit(1)
  }

  const raw = fs.readFileSync(absPath, 'utf-8')
  const { data: fm, content: body } = matter(raw) as { data: Frontmatter; content: string }

  if (!fm.title) {
    console.error('缺少必填字段: title（请在文件头部 YAML frontmatter 中声明）')
    console.error('示例:')
    console.error('  ---')
    console.error('  title: 文章标题')
    console.error('  labels: [标签1, 标签2]')
    console.error('  summary: 文章摘要')
    console.error('  cover: https://cdn.wuh.site/cover.png')
    console.error('  keywords: [关键词1, 关键词2]')
    console.error('  ---')
    process.exit(1)
  }

  const labels = parseLabels(fm.labels)
  const metadataBlock = buildMetadataBlock(fm)
  const issueBody = body.trim() + metadataBlock

  const octokit = new Octokit({ auth: token })

  console.log(`正在发布: ${fm.title}`)
  if (labels.length > 0) console.log(`  标签: ${labels.join(', ')}`)

  const { data: issue } = await octokit.issues.create({
    owner: REPO_OWNER,
    repo: REPO_NAME,
    title: fm.title,
    body: issueBody,
    labels,
  })

  console.log(`发布成功!`)
  console.log(`  ${issue.html_url}`)
}

main().catch((err) => {
  console.error(`发布失败: ${err.message}`)
  process.exit(1)
})
