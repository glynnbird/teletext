import fxp from 'fast-xml-parser'
import { stripHtml } from 'string-strip-html'
import { okResponse } from './lib/constants.js'
import { handleCORS } from './lib/checks.js'

const options = {
  ignoreAttributes: false,
  attributeNamePrefix: '@_'
}
const parser = new fxp.XMLParser(options)

export async function onRequest(context) {
  // handle POST/JSON/apikey chcecks
  const r = handleCORS(context.request) 
  if (r) return r

  // load the URL
  let response
  response = await fetch('https://feeds.bbci.co.uk/news/uk/rss.xml')
  const content = await response.text()

  // parse the feed
  let items = parser.parse(content).rss.channel.item
  items.splice(15) // remove everything but the first 15 items
  console.log('parsed', items.length)
  items = items.map((i) => {
    const c = i.content || i.description
    const lines = c.split('\n')
    i.description = stripHtml(lines[0]).result
    const sentences = i.description.split('.')
    if (sentences.length > 1) {
      i.description = sentences[0] + '.'
    }
    if (i['media:thumbnail'] && i['media:thumbnail']['@_url']) {
      i.media = i['media:thumbnail']['@_url']
    }
    if (i['media:content'] && i['media:content'].length > 0) {
      const l = i['media:content'].length
      i.media = i['media:content'][l - 1]['@_url']
    }
    i.pubDate = new Date(i.pubDate).toISOString()
    delete i['media:thumbnail']
    delete i['media:content']
    delete i['dc:creator']
    delete i['dc:date']
    delete i.category
    delete i['content:encoded']
    return i
  })


  // response
  response = {
    ok: true,
    feed: items
  }

  // send response
  return new Response(JSON.stringify(response), okResponse)

}
