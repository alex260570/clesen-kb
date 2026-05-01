import fs from "node:fs"
import os from "node:os"
import path from "node:path"
import matter from "gray-matter"

const args = new Set(process.argv.slice(2))
const repoRoot = process.cwd()
const wikiDir = path.join(repoRoot, "wiki")
const publicDir = path.join(repoRoot, "public")
const allowedContentDir = "wiki"
const blockedSourceDirs = ["raw", ".obsidian", ".claude", ".claudian", ".firecrawl", ".trash"]
const blockedRootMarkdown = ["index.md", "log.md"]

function fail(message, details = []) {
  console.error(`\nPublishing scope check failed: ${message}`)
  for (const detail of details.slice(0, 50)) {
    console.error(`- ${detail}`)
  }
  if (details.length > 50) {
    console.error(`- ...and ${details.length - 50} more`)
  }
  process.exitCode = 1
}

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

function isInside(parent, child) {
  const relative = path.relative(parent, child)
  return relative === "" || (!relative.startsWith("..") && !path.isAbsolute(relative))
}

function stripCodeBlocks(markdown) {
  return markdown.replace(/```[\s\S]*?```/g, "").replace(/~~~[\s\S]*?~~~/g, "")
}

function findLocalAssetReferences(markdown) {
  const refs = []
  const body = stripCodeBlocks(markdown)
  const obsidianEmbed = /!\[\[([^\]|#]+)(?:#[^\]|]+)?(?:\|[^\]]+)?\]\]/g
  const markdownLink = /!?\[[^\]]*?\]\((?!https?:\/\/|mailto:|tel:|#)([^)#]+)(?:#[^)]+)?\)/g

  for (const match of body.matchAll(obsidianEmbed)) refs.push(match[1].trim())
  for (const match of body.matchAll(markdownLink)) refs.push(decodeURI(match[1].trim()))

  return refs.filter((ref) => ref && !ref.endsWith(".md") && path.extname(ref) !== "")
}

function validateSourceScope(root = repoRoot) {
  const errors = []
  const localWikiDir = path.join(root, allowedContentDir)

  if (!fs.existsSync(localWikiDir)) {
    errors.push("Missing required publish folder: wiki/")
  }

  const packagePath = path.join(root, "package.json")
  if (fs.existsSync(packagePath)) {
    const pkg = JSON.parse(fs.readFileSync(packagePath, "utf8"))
    for (const scriptName of ["build", "dev", "preview"]) {
      const script = pkg.scripts?.[scriptName] ?? ""
      if (!script.includes("-d wiki")) {
        errors.push(`package.json script "${scriptName}" must build with "-d wiki"`)
      }
    }
  }

  const wikiFiles = walkFiles(localWikiDir)
  for (const filePath of wikiFiles.filter((file) => file.endsWith(".md"))) {
    const parsed = matter.read(filePath)
    if (parsed.data.publish === false || parsed.data.draft === true) {
      errors.push(
        `${toPosix(path.relative(root, filePath))} is inside wiki/ but has draft/private frontmatter`,
      )
    }
  }

  for (const filePath of wikiFiles.filter((file) => file.endsWith(".md"))) {
    const refs = findLocalAssetReferences(fs.readFileSync(filePath, "utf8"))
    for (const ref of refs) {
      const sourceDir = path.dirname(filePath)
      const resolved = path.resolve(sourceDir, ref)
      if (!isInside(localWikiDir, resolved)) {
        errors.push(
          `${toPosix(path.relative(root, filePath))} references asset outside wiki/: ${ref}`,
        )
      } else if (!fs.existsSync(resolved)) {
        errors.push(`${toPosix(path.relative(root, filePath))} references missing asset: ${ref}`)
      }
    }
  }

  return errors
}

function validateGeneratedOutput(root = repoRoot) {
  const errors = []
  const localPublicDir = path.join(root, "public")
  const localWikiDir = path.join(root, allowedContentDir)
  const contentIndexPath = path.join(localPublicDir, "static", "contentIndex.json")

  if (!fs.existsSync(localPublicDir)) return errors
  if (!fs.existsSync(contentIndexPath)) {
    errors.push("Generated public/static/contentIndex.json is missing")
    return errors
  }

  const contentIndex = JSON.parse(fs.readFileSync(contentIndexPath, "utf8"))
  for (const [slug, entry] of Object.entries(contentIndex)) {
    const filePath = entry.filePath
    if (!filePath || filePath.startsWith("../") || path.isAbsolute(filePath)) {
      errors.push(`Search index entry ${slug} has unsafe filePath: ${filePath}`)
      continue
    }

    const sourcePath = path.resolve(localWikiDir, filePath)
    if (!isInside(localWikiDir, sourcePath) || !fs.existsSync(sourcePath)) {
      errors.push(`Search index entry ${slug} does not map to a file under wiki/: ${filePath}`)
    }
  }

  const generatedFiles = walkFiles(localPublicDir).map((file) =>
    toPosix(path.relative(localPublicDir, file)).toLowerCase(),
  )
  for (const blockedDir of blockedSourceDirs) {
    if (generatedFiles.some((file) => file === blockedDir || file.startsWith(`${blockedDir}/`))) {
      errors.push(`Generated output includes excluded source path: ${blockedDir}/`)
    }
  }

  return errors
}

function runSelfTest() {
  const tempRoot = fs.mkdtempSync(path.join(os.tmpdir(), "wiki-scope-test-"))
  fs.mkdirSync(path.join(tempRoot, "wiki"), { recursive: true })
  fs.mkdirSync(path.join(tempRoot, "raw"), { recursive: true })
  fs.writeFileSync(
    path.join(tempRoot, "package.json"),
    JSON.stringify({
      scripts: {
        build: "quartz build -d wiki",
        dev: "quartz build --serve -d wiki",
        preview: "quartz build --serve -d wiki",
      },
    }),
  )
  fs.writeFileSync(path.join(tempRoot, "index.md"), "# Root should not publish\n")
  fs.writeFileSync(path.join(tempRoot, "raw", "secret.md"), "# Raw Secret\n")
  fs.writeFileSync(
    path.join(tempRoot, "wiki", "bad.md"),
    "---\npublish: false\n---\n![](../raw/file.png)\n",
  )

  const errors = validateSourceScope(tempRoot)
  fs.rmSync(tempRoot, { recursive: true, force: true })

  if (errors.length < 2) {
    fail("self-test did not catch the expected bad fixture", errors)
  } else {
    console.log("Publishing scope self-test passed")
  }
}

if (args.has("--self-test")) {
  runSelfTest()
} else {
  const sourceErrors = validateSourceScope()
  const outputErrors = args.has("--postbuild") ? validateGeneratedOutput() : []
  const errors = [...sourceErrors, ...outputErrors]

  if (errors.length > 0) {
    fail("unsafe content boundary detected", errors)
  } else {
    console.log(
      args.has("--postbuild")
        ? "Publishing scope and search index checks passed"
        : "Publishing scope check passed",
    )
  }
}
