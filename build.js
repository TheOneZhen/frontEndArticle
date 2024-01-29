const { readdirSync, statSync, copyFileSync, existsSync, mkdirSync } = require('fs')
const { resolve } = require('path')
const { update } = require('package.json')
/**
 * Github Actions只负责打包，然后将文件变更信息交给后端处理。
 */

const __DIST__ = 'dist'
const __RESOURCE__ = resolve(__DIST__, 'resource')
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
      else if (/\.(png|svg|jpg|jpeg)/i.test(name)) copyFileSync(path, resolve(__RESOURCE__, name))
      else if (/\.md/i.test(name)) copyFileSync(path, resolve(__ARTICLE__, name))
    })
}
/**
 * 生成比较文件（diff.json）。每次文章更新时，`package.json`会设置一个`update`属性用来设置更新的内容（包含标签的更新），这样可以保证内容的可控。
 * @param {string} beforeCommit 
 * @param {string} afterCommit 
 */
function genDiff (beforeCommit = '', afterCommit = '') {
  const diff = { A: [], C: [], M: [], D: [],}
  execSync('git config --global core.quotepath false')
  execSync(`git diff ${beforeCommit} ${afterCommit} --name-status`)
    .toString()
    .split(/\n/)
    .filter(Boolean)
    .forEach(row => {
      const sta
    })
}

mkdirSync(__DIST__)
mkdirSync(__RESOURCE__)
mkdirSync(__ARTICLE__)

move('./articles')

update !== undefined && genDiff (process.argv[2], process.argv[3])
/**
 * result directory S
 * - dist
 *  - resource
 *  - article
 *  - diff.json
 */