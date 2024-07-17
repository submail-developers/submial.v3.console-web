import {
  useEffect,
  useState,
  useRef,
  memo,
  CSSProperties,
  MutableRefObject,
  forwardRef,
} from 'react'
import { Popconfirm, Input, App } from 'antd'
import { getTextLength } from '@/utils'

import './index.scss'

type Props = {
  text: string
  onChange: (s: string) => void
  onPaste?: (s: string) => void
  onBlur?: (s: string) => void
  style?: CSSProperties
  wrapStyle?: CSSProperties
  max?: number
  min?: number
  chineseLen?: 1 | 2
  label?: string // 输入框
  disable?: boolean
  showInsertParams?: boolean
  active?: boolean
  onFocus?: () => void
}

const BaseInput = forwardRef((props: Props, ref: MutableRefObject<any>) => {
  // 当发生粘贴事件时处理
  const handlePaste = (event) => {
    // 阻止默认粘贴行为
    event.preventDefault()
    // 从剪贴板获取纯文本
    const text = (event.clipboardData || window.Clipboard)
      .getData('text')
      .trim()
    props.onPaste(text)
  }
  // 阻止拖拽图片复制进入输入框
  const onD = (event) => {
    event.preventDefault()
  }
  return (
    <div
      className={`base-input`}
      style={{ ...props.style }}
      contentEditable={!props.disable}
      suppressContentEditableWarning
      dangerouslySetInnerHTML={{ __html: props.text }}
      onPaste={handlePaste}
      onDrag={onD}
      onDrop={onD}
      ref={ref}></div>
  )
})

// 插入参数弹框
const InsetParam = ({ onInsert, onOpen }) => {
  const [value, setValue] = useState('')

  const onOpenChange = (open) => {
    if (open) {
      setValue('')
    }
    onOpen(open)
  }

  const insert = () => {
    onInsert(value)
  }

  const param = (
    <Input
      type='text'
      value={value}
      onChange={(e) => setValue(e.target.value)}
    />
  )

  return (
    <Popconfirm
      title=''
      description={param}
      okText='插入变量'
      overlayClassName='rich-popconfirm'
      okButtonProps={{ type: 'text' }}
      cancelText=''
      trigger={['click']}
      icon={null}
      onConfirm={insert}
      onOpenChange={onOpenChange}
      showCancel={false}>
      <div className='insert-icon'>&lt;/&gt;</div>
    </Popconfirm>
  )
}

export default function RcsInput(props: Props) {
  const { message } = App.useApp()
  const ref = useRef(null)
  const [html, setHtml] = useState('')
  const copyHtml = useRef(props.text)
  const [isFocus, setisFocus] = useState(false)
  const [isOpen, setisOpen] = useState(false)

  // 选区位置
  const selectionStart = useRef(null)
  const selectionEnd = useRef(null)

  const onFocus = () => {
    if ('onFocus' in props) {
      props.onFocus()
    }
    setHtml(copyHtml.current)
    setisFocus(true)
  }

  const onBlur = (e) => {
    setHtml(copyHtml.current)
    if (props.onBlur) props.onBlur(copyHtml.current)

    let timer = setTimeout(() => {
      setisFocus(false)
      clearTimeout(timer)
    }, 200)

    const selection = window.getSelection() // 获取选区对象
    if (selection.rangeCount > 0) {
      const range = selection.getRangeAt(0) // 获取第一个选区的范围
      // const startNode = range.startContainer
      // const endNode = range.endContainer
      selectionStart.current = range.startOffset
      selectionEnd.current = range.endOffset
    }
    testLen(e)
  }

  // 验证
  const testLen = (e) => {
    let chineseLen = props.chineseLen || 2
    let text = e.target.textContent || ''

    // 校验签名+文本是否超出
    if ('max' in props) {
      let isExc = textExceed(text, props.max, chineseLen)
      if (isExc > 0) {
        message.warning(
          `${props.label}最多支持输入${props.max}个字符，当前超出${isExc}个字符，一个中文占${chineseLen}个字符！`,
          5,
        )
      }
    }

    // 校验签名+文本是否不足
    if ('min' in props) {
      let len = getTextLength(text, chineseLen)
      if (props.min > len) {
        if (props.min == 1) {
          message.warning(`请输入${props.label}`, 5)
        } else {
          message.warning(
            `${props.label}最少输入${props.min}个字符，当前${len}个字符，一个中文占${chineseLen}个字符！`,
            5,
          )
        }
      }
    }
  }

  // 插入参数
  const onInsert = (value) => {
    if (!value) {
      return
    }
    // 插入参数的node节点
    let inputNode = `@var{${value}}`
    copyHtml.current = `${copyHtml.current.substring(
      0,
      selectionStart.current,
    )}${inputNode}${copyHtml.current.substring(
      selectionEnd.current,
      copyHtml.current.length,
    )}`
    setHtml(copyHtml.current)
    props.onChange(copyHtml.current)
    setCursor(selectionStart.current + inputNode.length)
  }

  // 粘贴事件
  const onPaste = (pasteTxt) => {
    const selection = window.getSelection() // 获取选区对象
    if (selection.rangeCount > 0) {
      const range = selection.getRangeAt(0) // 获取第一个选区的范围
      // const startNode = range.startContainer
      // const endNode = range.endContainer
      selectionStart.current = range.startOffset
      selectionEnd.current = range.endOffset

      copyHtml.current = `${copyHtml.current.substring(
        0,
        selectionStart.current,
      )}${pasteTxt}${copyHtml.current.substring(
        selectionEnd.current,
        copyHtml.current.length,
      )}`
      setHtml(copyHtml.current)
      props.onChange(copyHtml.current)
      setCursor(selectionStart.current + pasteTxt.length)
    }
  }

  // 设置光标位置的函数
  const setCursor = (position) => {
    let timer = setTimeout(() => {
      ref.current.focus()
      const sel = document.getSelection()
      const range = sel.getRangeAt(0)
      range.setStart(ref.current.firstChild, position) // 设置光标起始位置
      range.collapse(true) // 折叠光标
      sel.removeAllRanges() // 清除之前的选择
      sel.addRange(range) // 添加新的选择
      clearTimeout(timer)
    }, 0)
  }

  useEffect(() => {
    if (props.disable) return

    const observer = new MutationObserver(function (mutations) {
      let content = ref.current.innerHTML
      copyHtml.current = content
      props.onChange(content)
    })

    if (ref.current) {
      ref.current.addEventListener('blur', onBlur)
      ref.current.addEventListener('focus', onFocus)
      observer.observe(ref.current, {
        childList: true,
        characterData: true,
        characterDataOldValue: true,
        subtree: true,
        attributeOldValue: true,
        attributes: true,
      })
    }

    return () => {
      ref.current && ref.current.removeEventListener('blur', onBlur)
      ref.current && ref.current.removeEventListener('focus', onFocus)
      observer && observer.disconnect()
    }
  }, [ref.current, props.disable])

  useEffect(() => {
    // console.log('props.text-改变', props.text, copyHtml.current, html)
    if (props.text !== copyHtml.current) {
      copyHtml.current = props.text
      setHtml(props.text)
    }
  }, [props.text])
  useEffect(() => {
    // console.log('初始化')
    setHtml(props.text)
  }, [])
  return (
    <div
      className={`rcs-input ${
        isFocus || isOpen || props.active ? 'active' : ''
      }`}
      style={props.wrapStyle}>
      <BaseInput {...props} text={html} ref={ref} onPaste={onPaste} />
      {(isFocus || isOpen) && props.showInsertParams && (
        <InsetParam onInsert={onInsert} onOpen={(open) => setisOpen(open)} />
      )}
    </div>
  )
}

// 查出超出的字符数
const textExceed = (str: string, max: number, chineseLen = 2) => {
  const regex = /[\u4e00-\u9fa5]/g // 正则表达式匹配中文字符
  const matches = str.match(regex)
  if (matches && chineseLen == 2) {
    return str.length + matches.length - max
  } else {
    return str.length - max
  }
}
