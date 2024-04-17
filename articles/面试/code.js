// 矩阵匹配
const rl = require("readline").createInterface({ input: process.stdin })
const it = rl[Symbol.asyncIterator]()
const readline = async () => (await it.next()).value

void (async function () {
  const [n, m, k] = (await readline()).split(" ").map(Number)
  let min = 1, max = -Infinity
  const matrix = []

  for (let i = 0; i < n; ++i) {
    matrix.push((await readline()).split(" ").map(Number))
    max = Math.max(max, ...matrix[i])
  }

  while (min <= max) {
    const mid = (min + max) >> 1
    if (check(min)) max = mid - 1
    else min = mid + 1
  }

  console.log(min)

  function check (value) {
    let smallerCount = 0
    const matched = Array(m).fill(-1)

    for (let i = 0; i < n; ++i) {
      const visted = Array(m).fill(false)
      
      if (dfs(i, value, matched, visted)) smallerCount++
    }

    return smallerCount >= n - k + 1
  }

  function dfs (i, value, matched, visted) {
    for (let j = 0; j < m; ++j) {
      if (!visted[j] && matrix[i][j] <= value) {
        visted[j] = true

        if (matched[j] === -1 || dfs(matched[j], value, matched, visted)) {
          matched[j] = i
          return true
        }
      }
    }

    return false
  }
})()