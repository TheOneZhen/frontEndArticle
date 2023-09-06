const { readdirSync, statSync, copyFileSync } = require('fs')
const { resolve } = require('path')

function main (dir) {
  readdirSync(dir)
    .forEach(name => {
      const path = resolve(dir, name)
      const status = statSync(path)
      if (status.isDirectory()) main(path)
      else if (/\.(png|svg|jpg|jpeg)/i.test(name)) {
        copyFileSync(path, resolve('static', name))
      }
    })
}

main('./articles')