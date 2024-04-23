import { useState, useMemo, useCallback } from 'react'
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

type CustomElement = { type: 'paragraph'; children: CustomText[] }
type CustomText = { text: string; bold?: true }

declare module 'slate' {
  interface CustomTypes {
    Editor: BaseEditor & ReactEditor
    Element: CustomElement
    Text: CustomText
  }
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

const Element = ({ attributes, children, element }) => {
  switch (element.type) {
    case 'paragraph':
      return <p {...attributes}>{children}</p>
    default:
      return <p {...attributes}>{children}</p>
  }
}

const Leaf: React.FC<any> = ({ attributes, children, leaf }) => {
  if (leaf.bold) {
    return <strong {...attributes}>{children}</strong>
  } else {
    return <span {...attributes}>{children}</span>
  }
}
interface BoldButtonProps {
  onClick: () => void
}

const BoldButton: React.FC<BoldButtonProps> = ({ onClick }) => {
  return (
    <button onClick={onClick}>
      <strong>B</strong>
    </button>
  )
}
interface CustomEditor extends BaseEditor, ReactEditor {
  isBoldMarkActive?: () => boolean
  toggleBoldMark?: () => void
}
const withMarks = (editor: CustomEditor) => {
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

const MyEditor = () => {
  // const editor = useMemo(() => withReact(createEditor()), [])
  const editor = useMemo(() => withMarks(withReact(createEditor())), [])
  const [value, setValue] = useState<Descendant[]>([
    {
      type: 'paragraph',
      children: [{ text: '一段文字文字文字' }],
    },
  ])

  const handleChange = (newValue: any) => {
    setValue(newValue)
  }

  const renderLeaf = useCallback((props) => {
    return <Leaf {...props} />
  }, [])

  const renderElement = useCallback((props) => {
    return <Element {...props} />
  }, [])

  const handleBoldClick = () => {
    //  editor.toggleBoldMark()
    console.log(editor, 'editor')
    const isActive = editor.isBoldMarkActive()
    Transforms.setNodes(
      editor,
      { bold: isActive ? null : true },
      { match: (n) => Text.isText(n), split: true },
    )
  }

  return (
    <>
      <Slate editor={editor} initialValue={value} onChange={handleChange}>
        <InsertParam />
        <div>
          <BoldButton onClick={handleBoldClick} />
        </div>
        <Editable renderElement={renderElement} renderLeaf={renderLeaf} />
      </Slate>
    </>
  )
}

export default MyEditor
