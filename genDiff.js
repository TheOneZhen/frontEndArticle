/**
 * 1. 根据
 */

const { execSync } = require('child_process')
const { readFileSync } = require('fs')

const data = readFileSync('./diff.json').toString()

const result = {}
const rows = execSync('git diff origin/master --name-status')
  .toString()
  
if (rows.length > 0) {
  rows
    .split(/\n/)
    .filter(Boolean)
    .forEach(row => {
    const status = row.slice(0, 1), filePath = row.slice(2)
    // 只处理markdown文件
    if (/\.md/.test(filePath)) {
      // 读取文件
    }
    if (!result[status]) result[status] = []
    result[status].push(filePath)
  })
}

console.log(result)