import path from 'node:path'
import fs from 'node:fs'
import {readFile} from 'node:fs/promises'
import {Writable} from 'node:stream';
import * as cheerio from 'cheerio'
import slugify from 'slugify'
import TurndownService from 'turndown'
import * as yaml from 'yaml'

const __dirname = path.dirname(new URL(import.meta.url).pathname)
const srcDir = path.join(__dirname, '..', 'src')
const coversDir = path.join(srcDir, 'covers')
const slug = slugify.default
const turndownService = new TurndownService()

const rawBooksContent = await readFile(path.join(srcDir, 'books.yml'), 'utf8')
const rawBooks = yaml.parse(rawBooksContent)
const rawBooksSlugs = new Set((rawBooks || []).map((book: {slug: string}) => book.slug))

const [, , ...ids] = process.argv

for (const id of ids) {
  const amazon_us = `https://www.amazon.com/dp/${id}`
  const amazon_uk = `https://www.amazon.co.uk/dp/${id}`
  const req = await fetch(amazon_us, {
    headers: {
      Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7',
      'Accept-Encoding': 'gzip, deflate, br, zstd',
      'Accept-Language': 'en-US,en;q=0.9',
      'Cache-Control': 'no-cache',
      'Device-Memory': '8',
      Downlink: '10',
      Dpr: '2.2',
      Ect: '4g',
      Rtt: '0',
      'Sec-Ch-Device-Memory': '8',
      'Sec-Ch-Dpr': '2.2',
      'Sec-Ch-Ua': '"Chromium";v="122", "Not(A:Brand";v="24", "Google Chrome";v="122"',
      'Sec-Ch-Ua-Mobile': '?0',
      'Sec-Ch-Ua-Platform': '"macOS"',
      'Sec-Ch-Ua-Platform-Version': '"14.3.1"',
      'Sec-Ch-Viewport-Width': '336',
      'Sec-Fetch-Dest': 'document',
      'Sec-Fetch-Mode': 'navigate',
      'Sec-Fetch-Site': 'none',
      'Sec-Fetch-User': '?1',
      'Upgrade-Insecure-Requests': '1',
      'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
      'Viewport-Width': '336'
    }
  })
  const content = await req.text()

  if (content.includes("Sorry, we just need to make sure you're not a robot")) {
    console.error(`Skipping ${id} (captcha check!)`)
    continue
  }

  const $ = cheerio.load(content)
  const [title, subtitle] = $('#productTitle').text().trim().split(':', 2).map(s => s?.trim())

  const edition = Number.parseInt($('#productSubtitle').text().trim().substring(0,1) || '1') || 1
  const authors = $('#bylineInfo .author')
    .filter((_i, el) => $(el).text().trim().includes('(Author)'))
    .map((_i, el) => $(el).find('.a-link-normal').text().trim())
    .toArray()
  const description = $('#bookDescription_feature_div .a-expander-content')?.html()?.trim() || ''

  const descriptionMd = turndownService.turndown(description)
    .split('\n')
    .map(l => l.trimEnd())  
    .join('\n')
    .replace(/\n\r?(\n\r?)+/g, '\n')
    .replace(/’/g, '\'')
    .replace(/ /g, ' ')
    .replace(/–/g, '-')
    
  const coverUrl = $('#imgTagWrapperId img').attr('src')
  const links = {
    amazon_us,
    amazon_uk,
  }

  const bookSlug = slug(`${title}-${edition}-${authors.join('-')}`, {lower: true, strict: true})
  if (rawBooksSlugs.has(bookSlug)) {
    console.error(`Skipping "${title}" (already exists)`)
    continue
  }

  // download the cover
  const coverName = `${bookSlug}.jpg`
  const coverPath = path.join(coversDir, coverName)
  const req2 = await fetch(coverUrl as string)
  await req2.body?.pipeTo(Writable.toWeb(fs.createWriteStream(coverPath)))

  const data = {
    slug: bookSlug,
    title,
    subtitle,
    edition,
    authors,
    coverName,
    links,
    description: descriptionMd,
  }

  console.error(`Imported ${title}`)
  console.log(yaml.stringify([data]))
}