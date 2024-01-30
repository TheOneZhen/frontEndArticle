const { readdirSync, statSync, copyFileSync, existsSync, mkdirSync, writeFileSync } = require('fs')
const { resolve } = require('path')

/**
 * Github Actions只负责打包，然后将文件变更信息交给后端处理。
 */

const __DIST__ = 'dist'
const __STATIC__ = resolve(__DIST__, 'static')
const __ARTICLE__ = resolve(__DIST__, 'article')

/**
 * 迁移并分类文件
 * @param {string} targetDir 
 */
function move (targetDir) {
  readdirSync(targetDir)
    .forEach(name => {
      const path = resolve(targetDir, name)
      const status = statSync(path)
      if (status.isDirectory()) move(path)
      else if (/\.(png|svg|jpg|jpeg)/i.test(name)) copyFileSync(path, resolve(__STATIC__, name))
    })
}

function genUpadte () {
  /**  */
  /** 后端处理该数据顺序：先删除，再新增，最后修改 */
  const diff = []
  execSync('git config --global core.quotepath false')
  execSync(`git diff ${ process.argv[2] || '' } ${ process.argv[3] || '' } --name-status`)
    .toString()
    .split(/\n/)
    .filter(Boolean)
    .forEach(row => {
      const status = row.slice(0, 1), tokens = row.split(' ').filter(Boolean)
      /** 如果是重命名，需要先删除再添加 */
      if (status === 'D') {
        diff.push({
          type: "delete",
          title: tokens[1]
        })
      } else if (status === 'A') {
        diff.push({
          type: "add",
          title: ""
        })
      }
      if (status === 'R') {
        const oldName = 
      }
    })
}

mkdirSync(__DIST__)
mkdirSync(__STATIC__)
mkdirSync(__ARTICLE__)

move('./articles')

genUpadte()
/**
 * result directory S
 * - dist
 *  - static
 *  - update.json
 */