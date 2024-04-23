import React, {
  useState,
  useMemo,
  useCallback,
  useEffect,
  ReactNode,
  Ref,
  useLayoutEffect,
} from 'react'
import { createPortal } from 'react-dom'

import {
  createEditor,
  Editor,
  Transforms,
  Descendant,
  Node,
  Text,
  BaseEditor,
} from 'slate'
import { Slate, Editable, withReact, useSlate, ReactEditor } from 'slate-react'
import isHotkey from 'is-hotkey'
import Tools from './tools'

import './index.scss'

type OrNull<T> = T | null
export type CustomElement = { type: 'paragraph'; children: CustomText[] }
export type CustomText = { text: string; bold?: true }

export interface CustomEditor extends BaseEditor, ReactEditor {
  isBoldMarkActive?: () => boolean
  toggleBoldMark?: () => void
}

declare module 'slate' {
  interface CustomTypes {
    Editor: BaseEditor & ReactEditor
    Element: CustomElement
    Text: CustomText
  }
}

type Props = {
  editor: CustomEditor
  value: Descendant[]
  onChange: (any) => void
}

const HOTKEYS = {
  'mod+b': 'bold',
  'mod+i': 'italic',
  'mod+u': 'underline',
  // 'mod+`': 'code',
}

export const withMarks = (editor: CustomEditor) => {
  const { isInline } = editor

  editor.isBoldMarkActive = () => {
    const [match] = Editor.nodes(editor, {
      match: (n: Text) => n.bold === true,
      universal: true,
    })
    return !!match
  }

  editor.toggleBoldMark = () => {
    const isActive = editor.isBoldMarkActive()
    Transforms.setNodes(
      editor,
      { bold: isActive ? null : true },
      { match: (n) => Text.isText(n), split: true },
    )
  }

  return editor
}

const InsertParam: React.FC = () => {
  const editor = useSlate()
  const insertFixedText = () => {
    const text = '固定文本' // 设置你想要插入的固定文本内容
    editor.insertText(text)
  }

  return (
    <div>
      <button onClick={insertFixedText}>插入固定文本</button>
    </div>
  )
}

const Leaf: React.FC<any> = ({ attributes, children, leaf }) => {
  // 加粗
  if (leaf.bold) {
    children = <strong {...attributes}>{children}</strong>
  }

  // 斜体
  if (leaf.italic) {
    children = <em>{children}</em>
  }

  // 下划线
  if (leaf.underline) {
    children = <u>{children}</u>
  }

  return <span {...attributes}>{children}</span>
}

const Element = ({ attributes, children, element }) => {
  switch (element.type) {
    case 'paragraph':
      return <div {...attributes}>{children}</div>
    default:
      return <p {...attributes}>{children}</p>
  }
}

const RichInput = React.forwardRef(
  ({ editor, value, onChange }: Props, ref: any) => {
    const renderLeaf = useCallback((props) => {
      return <Leaf {...props} />
    }, [])

    const renderElement = useCallback((props) => {
      return <Element {...props} />
    }, [])

    return (
      <div
        className='rich-input'
        onMouseDown={(e) => {
          // prevent toolbar from taking focus away from editor
          // e.preventDefault()
        }}>
        <Slate
          editor={editor}
          initialValue={value}
          onChange={(val) => onChange(val)}>
          {/* <InsertParam /> */}
          <Portal ref={ref}>
            <Tools />
          </Portal>
          <Editable
            renderElement={renderElement}
            renderLeaf={renderLeaf}
            onKeyDown={(event) => {
              for (const hotkey in HOTKEYS) {
                if (isHotkey(hotkey, event as any)) {
                  event.preventDefault()
                  const mark = HOTKEYS[hotkey]
                  toggleMark(editor, mark)
                }
              }
            }}
          />
        </Slate>
      </div>
    )
  },
)

const Portal = React.forwardRef(
  (
    {
      children,
    }: {
      children: ReactNode
    },
    ref: any,
  ) => {
    const [popupContainer, setPopupContainer] = useState(null)
    useEffect(() => {
      if (ref.current) {
        setPopupContainer(ref.current)
      }
    }, [ref])
    return popupContainer ? createPortal(children, popupContainer) : null
  },
)

const isMarkActive = (editor, format) => {
  const marks = Editor.marks(editor)
  return marks ? marks[format] === true : false
}

const toggleMark = (editor, format) => {
  const isActive = isMarkActive(editor, format)

  if (isActive) {
    Editor.removeMark(editor, format)
  } else {
    Editor.addMark(editor, format, true)
  }
}

export default RichInput
