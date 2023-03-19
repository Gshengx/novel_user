// 转换字符串，undefined,null等转化为''
export function praseStrEmpty(str) {
    if (!str || str === 'undefined' || str === 'null') {
      return ''
    }
    return str
}