const { execSync } = require('child_process')
const { readFileSync, writeFileSync } = require('fs')
const path = require('path')

function main () {
  const diff = { A: {}, M: {}, D: [] }
  execSync('git config --global core.quotepath false')
  execSync(`git diff ${process.argv[2]} ${process.argv[3]} --name-status`)
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
}

function parseArticle (text) {
  const result = { title: "", content: text }
  let info = text.match(/^```\s*zhenisbusy([\s\S]+?)```$/m)
  if (info && info[1]) {
    result.content = text.replace(info[0], '').trimStart()
    try {
      const infoToJson = JSON.parse(info[1])
      Object.assign(result, infoToJson)
    } catch {
      return void 0
    }
  } else if (!info) return undefined
  return result
}

main()