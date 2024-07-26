const validateEmoji = (_, value) => {
  if (value && /[\uD800-\uDBFF][\uDC00-\uDFFF]/g.test(value)) {
    return Promise.reject(new Error('不可包含表情符号'))
  }
  return Promise.resolve()
}

const validateDoubleQuotation = (_, value) => {
  if (value && value.includes('"')) {
    return Promise.reject(new Error('不可包含英文双引号'))
  }
  return Promise.resolve()
}

const validateBackslash = (_, value) => {
  if (value && value.includes('\\')) {
    return Promise.reject(new Error('不可包含反斜杠'))
  }
  return Promise.resolve()
}

// 禁止输入空格
const validateNoSpace = (_, value) => {
  if (value.match(/\s/g) !== null) {
    return Promise.reject(new Error('不可包含空格'))
  }
  return Promise.resolve()
}

const phoneReg = /^1[3456789]\d{9}$/
const validateMobile = (_, value) => {
  if (value) {
    let flag = phoneReg.test(value)
    if (flag) {
      return Promise.resolve()
    } else {
      return Promise.reject(new Error('请输入正确的手机号码'))
    }
  } else {
    return Promise.reject(new Error('请输入手机号码'))
  }
}
const phonesReg = /^1[3456789]\d{9}$/g
const validateMobiles = (_, value) => {
  if (value) {
    if (value.includes('，')) {
      return Promise.reject(new Error('请使用英文逗号隔开(,)'))
    }
    let phones = value.split(',')
    let isnull = false
    let isok = true
    phones.forEach((item) => {
      if (!item) {
        isnull = true
      }
      if (!phonesReg.test(item)) {
        isok = false
      }
    })
    if (isnull) {
      return Promise.reject(new Error('逗号前后需为11位数字的手机号码'))
    }
    if (!isok) {
      return Promise.reject(new Error('请输入正确的手机号码'))
    }
    if (phones.length > 20) {
      return Promise.reject(new Error('最多输入20个号码'))
    }
    return Promise.resolve()
  } else {
    return Promise.reject(new Error('请输入手机号码'))
  }
}

const chineseReg = /[\u4e00-\u9fa5]/g
const validateNoChinese = (_, value) => {
  if (value && chineseReg.test(value)) {
    return Promise.reject(new Error('请输入正确的电话'))
  }
  return Promise.resolve()
}

const urlReg = /^(https?:\/\/)?([\w.-]+\.[a-zA-Z]{2,})(\/\S*)?$/
const validateUrl = (_, value) => {
  if (value && !urlReg.test(value)) {
    return Promise.reject(new Error('请输入正确的链接地址'))
  }
  return Promise.resolve()
}

const bracketsReg = /^[^\[\]【】]*$/
const validateNoBrackets = (_, value) => {
  if (value && bracketsReg.test(value)) {
    return Promise.reject(new Error('禁止输入中英文中括号(【】[])'))
  }
  return Promise.resolve()
}

// 限制字节数
const validateByteLength = (maxBytes) => (rule, value, callback) => {
  if (value) {
    const byteLen = byteLength(value)
    if (byteLen <= maxBytes) {
      return Promise.resolve()
    } else {
      return Promise.reject(
        new Error(`最多输入${maxBytes}个字节，一个中文占2个字节！`),
      )
    }
  } else {
    return Promise.resolve()
  }
}
const byteLength = (str) => {
  let len = 0
  for (let i = 0; i < str.length; i++) {
    const code = str.charCodeAt(i)
    if (code <= 0xff) {
      len++
    } else {
      len += 2 // 中文字符占两个字节
    }
  }
  return len
}

export default {
  validateEmoji,
  validateDoubleQuotation,
  validateBackslash,
  validateNoSpace,
  validateMobile,
  validateMobiles,
  validateNoChinese,
  validateUrl,
  validateNoBrackets,
  validateByteLength,
  byteLength,
}
