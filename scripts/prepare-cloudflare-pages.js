import fs from "node:fs"
import path from "node:path"

const source = path.join("cloudflare", "_headers")
const destination = path.join("public", "_headers")

fs.mkdirSync(path.dirname(destination), { recursive: true })
fs.copyFileSync(source, destination)

console.log(`Copied ${source} to ${destination}`)
