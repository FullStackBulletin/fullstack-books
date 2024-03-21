import { exec } from 'node:child_process'
import { readFile, writeFile } from 'node:fs/promises'
import { dirname, join } from 'node:path'

function run(
  command: string,
): Promise<{ error?: Error; stdout: string; stderr: string }> {
  return new Promise((resolve, _reject) => {
    exec(command, (error, stdout, stderr) => {
      if (error) {
        return resolve({ error, stdout, stderr })
      }
      return resolve({ stdout, stderr })
    })
  })
}

const __dirname = dirname(new URL(import.meta.url).pathname)

const bin = join(__dirname, '..', 'node_modules', '.bin', 'openapi-to-md')
const openapiPath = join(__dirname, '..', 'src', 'openapi.yml')
const { error, stdout, stderr } = await run(`${bin} ${openapiPath}`)

if (error) {
  console.error(error)
  console.error('stderr:')
  console.error(stderr)
  process.exit(1)
}

const readmePath = join(__dirname, '..', 'README.md')
const readmeContent = await readFile(readmePath, 'utf-8')
const [before, , after] = readmeContent.split('<!-- openapi -->\n', 3)

const docs = stdout
  .replace(/> Version 1.0.0/g, `> Version ${process.env.npm_package_version}`)
  // Nest all of the titles by one level
  .replace(/^#### /g, '##### ')
  .replace(/^### /g, '#### ')
  .replace(/^## /g, '### ')
  .replace(/^# /g, '## ')

const newContent = `${before}<!-- openapi -->\n${docs}\n<!-- openapi -->\n${after.trimEnd()}`
await writeFile(readmePath, newContent)

console.log('Updated README.md')
