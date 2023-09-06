const { execSync } = require('child_process')
const { readFileSync, writeFileSync } = require('fs')
const path = require('path')

function main () {
  const diff = { A: {}, M: {}, D: [] }
  execSync('git diff origin/master --name-status')
    .toString()
    .split(/\n/)
    .filter(Boolean)
    .forEach(row => {
      const status = row.slice(0, 1), filePath = row.slice(2)
      const filename = path.basename(filePath, '.md')
      if (!/\.md/.test(filePath)) return
      if (status === 'D') diff.D.push(filename)
      else if (status === 'A' || status === 'M') {
        const record = status === 'A' ? diff.A : diff.M
        if (record[filename]) {
          console.error("重复文件名！", filename)
          return
        }
        const text = readFileSync(filePath).toString()
        const data = parseArticle(text)
        if (!data) {
          console.error("解析失败！")
          return
        }
        data.title = filename
        record[filename] = data
      }
    })
  writeFileSync('./diff.json', JSON.stringify(diff))
  execSync('git add diff.json')
  const statusStr = execSync('git status').toString()
  if (/diff.json/.test(statusStr)) execSync('git commit diff.json -m "Article数据自动生成"')
}

function parseArticle (text) {
  const result = { title: "", content: text }
  let info = text.match(/^```\s*zhenisbusy(.*)```$/)
  if (info && info[1]) {
    result.content = text.replace(info[0], '').trimStart()
    try {
      const infoToJson = JSON.parse(info[1])
      Object.assign(result, infoToJson)
    } catch {
      return void 0
    }
  }
  return result
}

main()