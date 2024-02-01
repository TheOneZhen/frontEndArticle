const { execSync } = require('child_process')
const { readdirSync, statSync, copyFileSync, mkdirSync, writeFileSync, readFileSync, existsSync } = require('fs')
const { resolve } = require('path')

/**
 * Github Actions只负责打包，然后将文件变更信息交给后端处理，目录结构如下：
 * - dist
 *    - static
 *    - update.json
 *    - change.md
 */

const __DIST__ = 'dist'
const __STATIC__ = resolve(__DIST__, 'static')
const __UPDATE__ = resolve(__DIST__, 'update.json')
const __CHANGE__ = resolve(__DIST__, 'change.md')

const articleMap = new Map()

/**
 * 迁移静态资源文件
 * @param {string} targetDir 
 */
function move (targetDir) {
  readdirSync(targetDir)
    .forEach(name => {
      const path = resolve(targetDir, name)
      const status = statSync(path)
      
      if (status.isDirectory()) move(path)
      else if (/\.(png|svg|jpg|jpeg)/i.test(name)) copyFileSync(path, resolve(__STATIC__, name))
      else if(/\.(md)/i.test(name)) articleMap.set(name, path)
    })
}

function genUpadte () {
  /** 后端处理数据直接根据数组的数据来就行了 */
  execSync('git config --global core.quotepath false')
  // 判断change.md文件是否更新
  const changeStatus = execSync(`git diff ${process.argv[2]} ${process.argv[3]} --name-status change.md`).toString()
  const updateStatus = execSync(`git diff ${process.argv[2]} ${process.argv[3]} --name-status update.json`).toString()

  console.log(`the change status is: ${changeStatus} and update is: ${updateStatus}`)

  if (changeStatus.slice(0, 1) === 'M') copyFileSync('change.md', __CHANGE__)
  
  if (updateStatus.slice(0, 1) === 'M') {
    const data = parseChange()
    
    if (data === undefined) return void 1
    
    const articles = data.articles
    
    if (articles !== undefined) {
      articles.forEach(item => {
        const fileName = (item.data.title || item.title) + '.md' // 优先使用更新的名称
        if (!articleMap.has(fileName)) {
          console.error(`Can't find the file ${fileName}, please check it!`)
        } else {
          const filePath = articleMap.get(fileName)
          const data = item.data || {}
          if (data.title === undefined) data.title = item.title
          if (existsSync(filePath)) data.content = readFileSync(filePath).toString()
          item.data = data
        }
      })
    }

    writeFileSync(__UPDATE__, JSON.stringify(data))
  }
}

function parseChange (filePath = 'update.json') {
  const text = readFileSync(filePath).toString()
  let result = undefined
  
  try {
    result = JSON.parse(text)
  } catch {
    console.error(`Parse file update.json failed, please check it!`)
  }
    
  return result
}

mkdirSync(__DIST__)
mkdirSync(__STATIC__)

move('./articles')

genUpadte()