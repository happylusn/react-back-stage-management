const http = require('http')
const _map = require('./interfaceMap')
const _filter = require('./interfaceFilter')
const Mock = require('mockjs')
const qrcode = require('qr-image')
const url = require('url')

http.createServer((req, res) => {
  const psurl = url.parse(req.url,true)
  const pathname =  psurl.pathname
  if (pathname === '/qrcode') {
    let jumpURL = "http://localhost:1234/scanned?t="+psurl.query.t
    // 生成二维码(size：图片大小， margin: 边框留白)
    let img = qrcode.image(jumpURL, {size :7, margin: 2})
    res.writeHead(200, {
      'Content-Type': 'image/png',
    })
    img.pipe(res)
    return
  }
  res.writeHead(200, {
    'Content-Type': 'application/json;charset=utf-8',
    'Access-Control-Allow-Origin': req.headers.origin,
    'Access-Control-Allow-Methods': '*',
    'Access-Control-Allow-Headers': '*',
    'Access-Control-Allow-Credentials': true,
    'Cache-Control': 'no-cache,no-store', // clear cache
  })
  if (req.method === 'OPTIONS') {
    res.end(null)
  }
  if (req.method === 'POST') {
    let postData = ''
    req.addListener('data', dataBuffer => postData += dataBuffer)
    req.addListener('end', () => {
      console.log('url=>', req.url)
      postData = JSON.parse(postData)
      const originData = _map[req.url]
        ? Mock.mock(_map[req.url])
        : ''
      const data = typeof (_filter[req.url]) === 'function'
        ? _filter[req.url](originData, postData)
        : originData
      // const data = originData
      setTimeout(() => {
        res.end(JSON.stringify(data))
      }, parseInt(((Math.random() - 0.5) + 1) * 500, 10)) // 随机数
    })
  }
}).listen(1234)
console.log('listening port 1234')
