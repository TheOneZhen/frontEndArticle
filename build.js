const { readdirSync, statSync, copyFileSync, existsSync, mkdirSync } = require('fs')
const { resolve } = require('path')

const __STATIC__ = 'static'

function main (dir) {
  readdirSync(dir)
    .forEach(name => {
      const path = resolve(dir, name)
      const status = statSync(path)
      if (status.isDirectory()) main(path)
      else if (/\.(png|svg|jpg|jpeg)/i.test(name)) {
        copyFileSync(path, resolve(__STATIC__, name))
      }
    })
}

if (!existsSync(__STATIC__)) mkdirSync(__STATIC__)

main('./articles')