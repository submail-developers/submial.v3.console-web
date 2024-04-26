export const test = 1

/**
 * 查询字符数,
 * @param chineseLen 1 | 2 中文占几个个字符
 */
export const getTextLength = (str: string, chineseLen = 2): number => {
  const regex = /[\u4e00-\u9fa5]/g // 正则表达式匹配中文字符
  const matches = str.match(regex)
  if (matches && chineseLen == 2) {
    return str.length + matches.length
  } else {
    return str.length
  }
}
