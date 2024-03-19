import path from 'node:path'
import fs from 'node:fs'
import {Writable} from 'node:stream';
import * as cheerio from 'cheerio'
import slugify from 'slugify'
import TurndownService from 'turndown'
import * as yaml from 'yaml'

const __dirname = path.dirname(new URL(import.meta.url).pathname)
const coversDir = path.join(__dirname, '..', 'src', 'covers')
const slug = slugify.default
const turndownService = new TurndownService()

const [, , ...ids] = process.argv

for (const id of ids) {
  const amazon_us = `https://www.amazon.com/dp/${id}`
  const amazon_uk = `https://www.amazon.co.uk/dp/${id}`
  const req = await fetch(amazon_us)
  const content = await req.text()
  const $ = cheerio.load(content)
  const title = $('#productTitle').text().trim()
  const subtitle = title.split(':')[1]?.trim() || null
  const edition = Number.parseInt($('#productSubtitle').text().trim().substring(0,1) || '1') || 1
  const authors = $('#bylineInfo .author')
    .filter((_i, el) => $(el).text().trim().includes('(Author)'))
    .map((_i, el) => $(el).find('.a-link-normal').text().trim())
    .toArray()
  const description = $('#bookDescription_feature_div .a-expander-content')?.html()?.trim() || ''
  const descriptionMd = turndownService.turndown(description)
  const coverUrl = $('#imgTagWrapperId img').attr('src')
  const links = {
    amazon_us,
    amazon_uk,
  }
  const bookSlug = slug(`${title}-${edition}-${authors.join('-')}`, {lower: true, strict: true})

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
    coverUrl,
    coverName,
    links,
    description: descriptionMd,
  }

  console.error(`Imported ${title}`)
  console.log(yaml.stringify([data]))
}