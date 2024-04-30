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

/**
 * 截取文件名,
 * @param fileName 文件名称
 * @param before 取前面几个名称
 * @param after 取后面几个名称
 */
type FetFileNameProps = {
  fileName: string
  before?: number
  after?: number
}
export const getFileName = ({
  fileName,
  before = 6,
  after = 4,
}: FetFileNameProps) => {
  let name = ''
  let str = fileName
  let arr = str.split('.')
  let suffix = '' // 取后缀名
  if (arr[1]) {
    suffix = '.' + arr[1]
  }
  if (arr[0].length < before + after + 5) {
    name = fileName
  } else {
    const frontPart = arr[0].substring(0, 6) // 取前面6位
    const endPart = arr[0].substring(arr[0].length - 4) // 取后面4位
    name = `${frontPart}...${endPart}${suffix}`
  }
  return name
}
