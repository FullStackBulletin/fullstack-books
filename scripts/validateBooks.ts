import { readFile } from 'node:fs/promises'
import { dirname, join } from 'node:path'
import Ajv from 'ajv'
import { parse } from 'yaml'

const __dirname = dirname(new URL(import.meta.url).pathname)
const sourcePath = join(__dirname, '..', 'src', 'books.yml')
const schemaPath = join(__dirname, '..', 'src', 'raw-books.schema.json')
const data = parse(await readFile(sourcePath, 'utf-8'))
const schema = parse(await readFile(schemaPath, 'utf-8'))

const ajv = new Ajv.default()

if (!ajv.validate(schema, data)) {
  console.error(ajv.errors)
  process.exit(1)
}
