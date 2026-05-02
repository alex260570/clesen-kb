import fs from "node:fs"
import path from "node:path"

const args = new Set(process.argv.slice(2))
const shouldWrite = args.has("--write")
const wikiDir = path.join(process.cwd(), "wiki")

function walkFiles(dir) {
  if (!fs.existsSync(dir)) return []
  const entries = fs.readdirSync(dir, { withFileTypes: true })
  return entries.flatMap((entry) => {
    const fullPath = path.join(dir, entry.name)
    if (entry.isDirectory()) return walkFiles(fullPath)
    return [fullPath]
  })
}

function toPosix(filePath) {
  return filePath.split(path.sep).join("/")
}

function yamlString(value) {
  if (/^[A-Za-z0-9][A-Za-z0-9\s()&'./-]*$/.test(value)) {
    return value
  }

  return JSON.stringify(value)
}

const markdownFiles = walkFiles(wikiDir).filter((file) => file.endsWith(".md"))
const mismatches = []
const missing = []

for (const filePath of markdownFiles) {
  const markdown = fs.readFileSync(filePath, "utf8")
  const titleMatch = markdown.match(/^title:\s*(.+)$/m)
  const headingMatch = markdown.match(/^#\s+(.+)$/m)
  const relativePath = toPosix(path.relative(process.cwd(), filePath))

  if (!headingMatch) {
    missing.push(`${relativePath} has no H1 heading`)
    continue
  }

  if (!titleMatch) {
    missing.push(`${relativePath} has no frontmatter title`)
    continue
  }

  const title = titleMatch[1].trim().replace(/^["']|["']$/g, "")
  const heading = headingMatch[1].trim()

  if (title !== heading) {
    mismatches.push(`${relativePath}: title "${title}" should match H1 "${heading}"`)

    if (shouldWrite) {
      const updated = markdown.replace(/^title:\s*.+$/m, `title: ${yamlString(heading)}`)
      fs.writeFileSync(filePath, updated)
    }
  }
}

if (shouldWrite && mismatches.length > 0) {
  console.log(`Updated ${mismatches.length} wiki title${mismatches.length === 1 ? "" : "s"}`)
}

if (missing.length > 0 || (!shouldWrite && mismatches.length > 0)) {
  console.error("\nWiki title check failed")
  for (const detail of [...missing, ...mismatches].slice(0, 80)) {
    console.error(`- ${detail}`)
  }
  if (missing.length + mismatches.length > 80) {
    console.error(`- ...and ${missing.length + mismatches.length - 80} more`)
  }
  console.error("\nRun `npm run fix:titles` to sync frontmatter titles from page headings.")
  process.exitCode = 1
} else if (!shouldWrite) {
  console.log("Wiki title check passed")
}
