const { logger, file } = require('../utils')
const clog = new logger({ head: 'wbefss' })

const { CONFIG } = require('../config')

module.exports = app => {
  app.get('/efss', (req, res)=>{
    clog.notify((req.headers['x-forwarded-for'] || req.connection.remoteAddress), 'get efss resource')

    if (CONFIG.efss === false) {
      res.end('efss is closed!')
      return
    }
    const efssF = file.get(CONFIG.efss, 'path')
    if (!file.isExist(efssF)) {
      clog.error('efss folder dont exist')
      res.end(efssF + ' dont exist')
      return
    }
    res.writeHead(200, { 'Content-Type': 'text/html;charset=utf-8' })
    res.write(`
    <meta name="HandheldFriendly" content="True">
    <meta name="MobileOptimized" content="320">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1, user-scalable=no, minimal-ui">
    <title>elecV2P file storage system</title>
    <style>
      .efssa {
        text-decoration: none;
        display: flex;
        background: #003153;
        color: #F8F8FF;
        margin: 6px 0;
        padding: 6px;
        border-radius: 6px;
      }
    </style>`)
    file.aList(efssF).forEach(fpath=>{
      const spath = fpath.replace(efssF, '').slice(1).replace(/\\/g, '/')
      res.write(`<a class='efssa' href='/efss/${ spath }' target='_blank'>${ spath }</a>`)      
    })
    res.end()
  })
}