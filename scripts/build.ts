import { cp, readFile, writeFile } from 'node:fs/promises'
import { dirname, join } from 'node:path'
import { marked } from 'marked'
import { mkdirp } from 'mkdirp'
import slugify from 'slugify'
import { parse, stringify } from 'yaml'

const slug = slugify.default
const REPO_URL = 'https://github.com/FullStackBulletin/fullstack-books'
const GH_PAGES_URL = 'https://fullStackbulletin.github.io/fullstack-books'
const baseUrl = process.env.BASE_URL ?? GH_PAGES_URL

const __dirname = dirname(new URL(import.meta.url).pathname)
const destPath = join(__dirname, '..', 'dist')
const booksPath = join(__dirname, '..', 'dist', 'books')
const authorsPath = join(__dirname, '..', 'dist', 'authors')
const srcCoversPath = join(__dirname, '..', 'src', 'covers')
const coversPath = join(__dirname, '..', 'dist', 'covers')

// Creates the `dest` and `dest/quotes` folders if they don't exist
await Promise.all([mkdirp(destPath), mkdirp(booksPath), mkdirp(authorsPath)])
await cp(srcCoversPath, coversPath, { recursive: true })
console.log(`Copied ${srcCoversPath} to ${coversPath}`)

// load and parse package.json
const pkgPath = join(__dirname, '..', 'package.json')
const pkg = JSON.parse(await readFile(pkgPath, 'utf-8'))

// load and parse the openapi spec
const openapiPath = join(__dirname, '..', 'src', 'openapi.yml')
const openApiData = parse(await readFile(openapiPath, 'utf-8'))
openApiData.info.version = pkg.version // sync package.json version with openapi spec
await writeFile(
  `${destPath}/openapi.json`,
  JSON.stringify(openApiData, null, 2),
)
console.log(`Written ${destPath}/openapi.json`)
await writeFile(`${destPath}/openapi.yml`, stringify(openApiData))
console.log(`Written ${destPath}/openapi.yml`)

// load and parse raw data from source file
const sourcePath = join(__dirname, '..', 'src', 'books.yml')
const rawData = parse(await readFile(sourcePath, 'utf-8'))

function mapAuthor(author: string) {
  const authorSlug = slug(author, {
    lower: true,
    strict: true,
  })

  return {
    name: author,
    slug: authorSlug,
    url: `${baseUrl}/authors/${authorSlug}.json`,
  }
}

const books = rawData.map(
  (book: {
    title: string
    slug: string
    description: string
    authors: string[]
    cover: string
  }) => {
    return {
      ...book,
      url: `${baseUrl}/books/${slug(book.slug)}.json`,
      cover: `${baseUrl}/covers/${book.cover}`,
      descriptionHtml: marked.parse(book.description),
      authors: book.authors.map(mapAuthor),
    }
  },
)

const authors = []
const booksByAuthor: Record<string, any> = {}
for (const book of books) {
  for (const author of book.authors) {
    if (!booksByAuthor[author.slug]) {
      booksByAuthor[author.slug] = []
      authors.push(author)
    }
    booksByAuthor[author.slug].push(book)
  }
}

// Creates an index.html file that redirects to the GitHub repo
const index = `<html>
  <head>
    <meta http-equiv="refresh" content="0; url=${REPO_URL}">
  </head>
  <body></body>
</html>`

await writeFile(`${destPath}/index.html`, index)
console.log(`Written ${destPath}/index.html`)

// Creates a 404.html file that says not found
const fourOhFour = `<html>
  <head>
    <title>404 - Not Found</title>
  </head>
  <body>Not found</body>
</html>`

// create books files
await writeFile(`${destPath}/404.html`, fourOhFour)
console.log(`Written ${destPath}/404.html`)

const bookStats = {
  total: books.length,
  all: `${baseUrl}/books/all.json`,
  ids: `${baseUrl}/books/ids.json`,
  urlPrefix: `${baseUrl}/books`,
}

await writeFile(`${booksPath}/stats.json`, JSON.stringify(bookStats, null, 2))
console.log(`Written ${booksPath}/stats.json`)

const bookIds = books.map((book: { slug: string }) => book.slug)
await writeFile(`${booksPath}/ids.json`, JSON.stringify(bookIds, null, 2))
console.log(`Written ${booksPath}/ids.json`)

await writeFile(`${booksPath}/all.json`, JSON.stringify(books, null, 2))
console.log(`Written ${booksPath}/all.json`)

for (const book of books) {
  const dest = join(booksPath, `${book.slug}.json`)
  await writeFile(dest, JSON.stringify(book, null, 2))
  console.log(`Written ${dest}`)
}

// create authors files
const authorStats = {
  total: authors.length,
  all: `${baseUrl}/authors/all.json`,
  ids: `${baseUrl}/authors/ids.json`,
  urlPrefix: `${baseUrl}/authors`,
}

await writeFile(
  `${authorsPath}/stats.json`,
  JSON.stringify(authorStats, null, 2),
)
console.log(`Written ${authorsPath}/stats.json`)

const authorIds = authors.map((author: { slug: string }) => author.slug)
await writeFile(`${authorsPath}/ids.json`, JSON.stringify(authorIds, null, 2))
console.log(`Written ${authorsPath}/ids.json`)

await writeFile(`${authorsPath}/all.json`, JSON.stringify(authors, null, 2))
console.log(`Written ${authorsPath}/all.json`)

for (const author of authors) {
  const authorWithBooks = { ...author, books: booksByAuthor[author.slug] }
  const dest = join(authorsPath, `${author.slug}.json`)
  await writeFile(dest, JSON.stringify(authorWithBooks, null, 2))
  console.log(`Written ${dest}`)
}
