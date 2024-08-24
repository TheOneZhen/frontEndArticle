import { existsSync, mkdirSync, writeFileSync } from 'node:fs'
import path from 'node:path'
const args = process.argv.slice(2)
const directory = process.cwd()

for (const name of args) {
  const fullPath = path.resolve(directory, name)
  if (existsSync(fullPath)) {
    console.warn(`Folder exist!`)
    continue
  } else {
    mkdirSync(fullPath)
    writeFileSync(path.resolve(fullPath, `${name}.md`), '')
  }
}