import fs from "node:fs"
import os from "node:os"
import path from "node:path"

const args = new Set(process.argv.slice(2))
const repoRoot = process.cwd()
const wikiDir = path.join(repoRoot, "wiki")

function toPosix(filePath) {
  return filePath.split(path.sep).join("/")
}

function walkFiles(dir) {
  if (!fs.existsSync(dir)) return []
  const entries = fs.readdirSync(dir, { withFileTypes: true })
  return entries.flatMap((entry) => {
    const fullPath = path.join(dir, entry.name)
    if (entry.isDirectory()) return walkFiles(fullPath)
    return [fullPath]
  })
}

function stripCodeBlocks(markdown) {
  return markdown.replace(/```[\s\S]*?```/g, "").replace(/~~~[\s\S]*?~~~/g, "")
}

function slugFor(filePath, root = wikiDir) {
  return toPosix(path.relative(root, filePath)).replace(/\.md$/i, "")
}

function buildIndexes(root = wikiDir) {
  const mdFiles = walkFiles(root).filter((file) => file.endsWith(".md"))
  const slugs = new Set(mdFiles.map((file) => slugFor(file, root)))
  const folders = new Set()
  for (const file of walkFiles(root)) {
    const dir = toPosix(path.relative(root, path.dirname(file)))
    if (!dir) continue
    const parts = dir.split("/")
    for (let i = 1; i <= parts.length; i++) {
      folders.add(parts.slice(0, i).join("/"))
    }
  }
  const basenameToSlugs = new Map()

  for (const slug of slugs) {
    const basename = path.posix.basename(slug).toLowerCase()
    basenameToSlugs.set(basename, [...(basenameToSlugs.get(basename) ?? []), slug])
  }

  return { mdFiles, slugs, folders, basenameToSlugs }
}

function extractLinks(markdown) {
  const links = []
  const body = stripCodeBlocks(markdown)
  const wikiLink = /!?\[\[([^\]|#]+)?(?:#[^\]|]+)?(?:\|[^\]]+)?\]\]/g
  const markdownLink = /!?\[[^\]]*?\]\((?!https?:\/\/|mailto:|tel:|#)([^)#]+)(?:#[^)]+)?\)/g

  for (const match of body.matchAll(wikiLink)) {
    if (match[1]) links.push({ type: "wikilink", target: match[1].trim() })
  }

  for (const match of body.matchAll(markdownLink)) {
    links.push({ type: "markdown", target: decodeURI(match[1].trim()) })
  }

  return links.filter((link) => link.target && !link.target.startsWith("^"))
}

function resolveLink(link, sourceFile, indexes, root = wikiDir) {
  const target = link.target.replace(/\\/g, "/")
  if (!target || target.startsWith("#")) return true

  if (path.posix.extname(target) && path.posix.extname(target).toLowerCase() !== ".md") {
    const sourceDir = path.dirname(sourceFile)
    return fs.existsSync(path.resolve(sourceDir, target))
  }

  const withoutExt = target.replace(/\.md$/i, "")
  const sourceDirSlug = toPosix(path.relative(root, path.dirname(sourceFile)))
  const candidates = []

  if (withoutExt.startsWith("/")) {
    candidates.push(withoutExt.slice(1))
  } else if (withoutExt.includes("/")) {
    candidates.push(path.posix.normalize(path.posix.join(sourceDirSlug, withoutExt)))
    candidates.push(path.posix.normalize(withoutExt))
  } else {
    candidates.push(path.posix.normalize(path.posix.join(sourceDirSlug, withoutExt)))
    candidates.push(withoutExt)
    candidates.push(...(indexes.basenameToSlugs.get(withoutExt.toLowerCase()) ?? []))
  }

  return candidates.some(
    (candidate) => indexes.slugs.has(candidate) || indexes.folders.has(candidate),
  )
}

function validateLinks(root = wikiDir) {
  const indexes = buildIndexes(root)
  const errors = []

  for (const filePath of indexes.mdFiles) {
    const links = extractLinks(fs.readFileSync(filePath, "utf8"))
    for (const link of links) {
      if (!resolveLink(link, filePath, indexes, root)) {
        errors.push(
          `${toPosix(path.relative(root, filePath))} has broken ${link.type}: ${link.target}`,
        )
      }
    }
  }

  return errors
}

function runSelfTest() {
  const tempRoot = fs.mkdtempSync(path.join(os.tmpdir(), "wiki-link-test-"))
  fs.mkdirSync(path.join(tempRoot, "sub"), { recursive: true })
  fs.writeFileSync(path.join(tempRoot, "index.md"), "[[sub/good]]\n[[missing]]\n")
  fs.writeFileSync(path.join(tempRoot, "sub", "good.md"), "[Back](../index.md)\n")

  const errors = validateLinks(tempRoot)
  fs.rmSync(tempRoot, { recursive: true, force: true })

  if (errors.length !== 1 || !errors[0].includes("missing")) {
    console.error(errors)
    console.error("Broken-link self-test failed")
    process.exit(1)
  }

  console.log("Broken-link self-test passed")
}

if (args.has("--self-test")) {
  runSelfTest()
} else {
  const errors = validateLinks()
  if (errors.length > 0) {
    const strict = args.has("--strict")
    console.error("\nBroken link check found issues:")
    for (const error of errors.slice(0, 100)) console.error(`- ${error}`)
    if (errors.length > 100) console.error(`- ...and ${errors.length - 100} more`)
    console.error(
      strict
        ? "\nBroken link check failed in strict mode"
        : "\nBroken link check completed with warnings",
    )
    if (strict) process.exit(1)
  } else {
    console.log("Broken link check passed")
  }
}
