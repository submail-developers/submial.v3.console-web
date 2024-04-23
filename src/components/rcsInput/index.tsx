import {
  useEffect,
  useState,
  useRef,
  memo,
  CSSProperties,
  MutableRefObject,
  forwardRef,
} from 'react'
import { Popconfirm, Input } from 'antd'

import './index.scss'

type Props = {
  text: string
  onChange: (s: string) => void
  onBlur: (s: string) => void
  style?: CSSProperties
  disable?: boolean
}

const BaseInput = memo(
  forwardRef((props: Props, ref: MutableRefObject<any>) => {
    // 当发生粘贴事件时处理
    // const handlePaste = (event) => {
    //   // 阻止默认粘贴行为
    //   event.preventDefault()

    //   // 从剪贴板获取纯文本
    //   const text = (event.clipboardData || window.Clipboard).getData('text')

    //   // 将纯文本插入到可编辑div中
    //   if (document.queryCommandSupported('insertText')) {
    //     document.execCommand('insertText', false, text) // 使用命令插入文本
    //   } else {
    //     inputRef.current.innerText += text // 如果不支持，则直接添加文本
    //   }
    // }
    return (
      <div
        className={`base-input`}
        style={props.style}
        contentEditable={!props.disable}
        suppressContentEditableWarning
        dangerouslySetInnerHTML={{ __html: props.text }}
        // onPaste={handlePaste}
        ref={ref}></div>
    )
  }),

  (prevProps, nextProps) => {
    return nextProps.text === prevProps.text
  },
)

// 插入参数弹框
const InsetParam = ({ onInsert }) => {
  const [value, setValue] = useState('')
  const [open, setOpen] = useState(false)

  const onOpenChange = (open) => {
    setOpen(open)
  }

  const insert = () => {
    onInsert(value)
  }

  useEffect(() => {
    if (open) {
      setValue('')
    }
  }, [open])
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
      okButtonProps={{ type: 'text' }}
      cancelText=''
      trigger={['click', 'hover']}
      icon={null}
      onConfirm={insert}
      onOpenChange={onOpenChange}
      showCancel={false}>
      <div className='insert-icon'>&lt;/&gt;</div>
    </Popconfirm>
  )
}

export default function RcsInput(props: Props) {
  const ref = useRef(null)
  const [html, setHtml] = useState('')
  const copyHtml = useRef(props.text)

  // 选区位置
  const selectionStart = useRef(null)
  const selectionEnd = useRef(null)

  const onFocus = () => {
    setHtml(copyHtml.current)
  }

  const onBlur = () => {
    setHtml(copyHtml.current)
    props.onBlur(copyHtml.current)

    const selection = window.getSelection() // 获取选区对象
    if (selection.rangeCount > 0) {
      const range = selection.getRangeAt(0) // 获取第一个选区的范围
      // const startNode = range.startContainer
      // const endNode = range.endContainer
      selectionStart.current = range.startOffset
      selectionEnd.current = range.endOffset
    }
  }

  // 插入参数
  const onInsert = (value) => {
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
    <div className='rcs-input'>
      <BaseInput {...props} text={html} ref={ref} />
      <InsetParam onInsert={onInsert} />
    </div>
  )
}
