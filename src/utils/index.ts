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
  if (arr[0].length < before + after + 3) {
    name = fileName
  } else {
    const frontPart = arr[0].substring(0, before) // 取前面6位
    const endPart = arr[0].substring(arr[0].length - after) // 取后面4位
    name = `${frontPart}...${endPart}${suffix}`
  }
  return name
}

export const getPhoneLineBreak = (text: string): string => {
  return text.replace(/，|,/g, '\n')
}

// 获取字符串中@var(value)中的value
export const getVars = (str: string): string[] => {
  const regex = /@var\((\w+)\)/g
  let match
  const values = []
  while ((match = regex.exec(str)) !== null) {
    values.push(match[1])
  }
  return values
}

// iframe - 导出文件
export const downloadFile = () => {
  let tempDownloadHtml =
    '<iframe id="exportfileController" width="1" height="1" style="opacity: 0;"></iframe>'
  document.body.insertAdjacentHTML('beforeend', tempDownloadHtml)

  let iframe = document.getElementById('exportfileController')
  iframe.onload = () => {
    console.log('iframe加载成功')
    // 如果需要在下载完成后执行某些操作，可以在这里处理
  }

  // @ts-ignore
  iframe.src =
    'https://www.mysubmail.com/console/api/services/download_export_file'
}

// 获取红色范围的颜色
export const getRandomRedColor = () => {
  const r = Math.floor(Math.random() * 256) // 红色通道的值范围
  const g = Math.floor(Math.random() * 128) // 绿色通道值较小
  const b = Math.floor(Math.random() * 128) // 蓝色通道值较小
  return `rgb(${r}, ${g}, ${b})`
}
