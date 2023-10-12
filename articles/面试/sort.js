/**
 * 随机生成length = 10W的纯数字数组
 */
function createRandomArray(n = 100000, max = 2E10, min = -1E10) {
  const res = new Array(n);
  for(let i = 0; i < n; ++i) res[i] = Math.floor(Math.random() * (max - min)) + min;
  return res;
}
/**
 * 验证并记时函数
 */
function valid(fn, n, max, min) {
  const arr = createRandomArray(n, max, min);
  console.time(fn.name);
  fn(arr);
  console.timeEnd(fn.name);
  for (let i = 1; i < arr.length; ++i)
    if (arr[i] < arr[i - 1]) throw new Error(`函数${fn.name}排序错误！`);
  console.log(`函数${fn.name}排序正确！`)
}
/**
 * 交换函数
 */
function swap(arr, index1, index2) {
  const mid = arr[index1];
  arr[index1] = arr[index2];
  arr[index2] = mid;
}
/**
 * - 冒泡排序：俩个数相互交换，每次内循环得到一个结果数
 *   - T(n) = O(n ^ 2)
 *   - S(n) = O(1)
 *   - 稳定
 */
function bubble(arr) {
  const len = arr.length;
  for(let i = 0; i < len - 1; ++i)
    for (let j = 0; j < len - i -1; ++j)
      arr[j] > arr[j + 1] && swap(arr, j, j + 1);
}
/**
 * - 选择排序：每次内循环选择一个结果数
 *   - T(n) = O(n ^ 2)
 *   - S(n) = O(1)
 *   - 稳定
 */
function selection(arr) {
  const len = arr.length;
  let min = 0;
  for (let i = 0; i < len - 1; ++i) {
    min = i;
    for (let j = i + 1; j < len; ++j) (arr[j] < arr[min]) && (min = j);
    swap(arr, min, i);
  }
}
/**
 * - 插入排序
 *   - T(n) = O(n ^ 2)
 *   - S(n) = O(1)
 */
function insertion(arr) {
  const len = arr.length;
  for (let i = 0; i < len - 1; ++i) {
    let current = arr[i + 1];
    let index = i;
    while (index >= 0 && arr[index] > current) {
      arr[index + 1] = arr[index];
      --index;
    }
    arr[index + 1] = current;
  }
}
/**
 * - 希尔排序
 *   - T(n) = O(nlogn) ~ O(nlog^2n)
 *   - S(n) = O(1)
 */
function shell(arr) {
  const len = arr.length;
  let gap = len >> 1, mid, preIndex = 0;
  while (gap > 0) {
    for (let i = gap; i < len; ++i) {
      preIndex = i - gap;
      mid = arr[i];
      while (preIndex >= 0 && arr[preIndex] > mid) {
        arr[preIndex + gap] = arr[preIndex];
        preIndex -= gap;
      }
      arr[preIndex + gap] = mid;
    }
    gap >>= 1;
  }
}
/**
 * - 归并排序：每次子排序都是有序排序，时间复杂度为n
 *   - T(n) = O(nlogn)
 *   - S(n) = O(n)，递归栈（logn） + 中间数组（n）（中间数组不可以在递归中重新声明，否则S(n) = O(nlogn)）
 */
function merge(arr, midArr = new Array(arr.length), start = 0, end = arr.length - 1) {
  if (start < end) {
    const mid = (start + end) >> 1;
    merge(arr, midArr, start, mid);
    merge(arr, midArr, mid + 1, end);
    let left = start, right = mid + 1, index = 0;
    while (left <= mid && right <= end)
      midArr[index++] = (arr[left] < arr[right]) ? arr[left++] : arr[right++];
    while (left <= mid) midArr[index++] = arr[left++];
    while (right <= end) midArr[index++] = arr[right++];
    for (let i = 0; i < index; ++i) arr[start + i] = midArr[i];
  }
}
/**
 * - 快速排序：每次循环将比基准小的数移动到前面
 *   - T(n) = O(nlogn) - O(n ^ 2)，最差等同于冒泡排序
 *   - S(n) = O(n) -  O(logn), 主要为递归栈产生的空间
 *   - 不稳定
 */
 function quick (arr, start = 0, end = arr.length - 1) {
  if (start >= end) return;
  const current = arr[start]
  let low = start, high = end
  while (low < high) {
    while (low < high && arr[high] >= current) --high
    swap(arr, low, high)
    while (low < high && arr[low] < current) ++low
    swap(arr, low, high)
  }
  quick(arr, start, low - 1)
  quick(arr, low + 1, end)
}
/**
 * - 堆排序 - 最大堆
 *   - T(n) = O(nlogn)
 *   - S(n) = O(1)
 *   - 不稳定
 */
function heap(arr) {
  const len = arr.length;
  for (let i = len >> 1; i >= 0; --i) adjustHeap(arr, i, len - 1);
  for (let i = 0; i < len; ++i) {
    swap(arr, 0, len - i - 1);
    adjustHeap(arr, 0, len - i - 1);
  }
  
}
function adjustHeap(arr, start, end) {
  const left = start * 2 + 1;
  const right = start * 2 + 2;
  let mid = start;
  if (left < end && arr[left] > arr[mid]) mid = left;
  if (right < end && arr[right] > arr[mid]) mid = right;
  if (mid != start) {
    swap(arr, start, mid);
    adjustHeap(arr, mid, end);
  }
}
/**
 * - 计数排序
 *   - T(n) = O(n + k)
 *   - S(n) = O(n + k)
 *   - 不稳定
 */
function count(arr) {
  let max = -Infinity, min = Infinity;
  arr.forEach(num => {
    max = Math.max(max, num);
    min = Math.min(min, num);
  });
  const count = new Array(max - min + 1).fill(0);
  arr.forEach(num => count[num - min]++);
  let i = 0;
  count.forEach((num, index) => {
    while (num--) arr[i++] = index + min;
  })
}
// 9. 桶排序
// 10. 基数排序