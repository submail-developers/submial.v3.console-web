import { useState, useMemo, useCallback } from 'react'
import { Button, Space, Select } from 'antd'
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

import './tools.scss'

export interface CustomEditor extends BaseEditor, ReactEditor {
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

const MarkButton = ({ format, icon, editor }) => {
  return (
    <div
      className={`mark-button ${isMarkActive(editor, format) ? 'active' : ''}`}
      onMouseDown={(event) => {
        event.preventDefault()
        toggleMark(editor, format)
      }}>
      <span className={`icon iconfont ${icon}`}></span>
    </div>
  )
}

const toggleMark = (editor, format) => {
  const isActive = isMarkActive(editor, format)

  if (isActive) {
    Editor.removeMark(editor, format)
  } else {
    Editor.addMark(editor, format, true)
  }
}

const isMarkActive = (editor, format) => {
  const marks = Editor.marks(editor)
  return marks ? marks[format] === true : false
}

const Tools = () => {
  const editor = useSlate()
  return (
    <Space className='rich-input-tools'>
      <MarkButton format='bold' icon='icon-b' editor={editor}></MarkButton>
      <MarkButton format='italic' icon='icon-i' editor={editor}></MarkButton>
      <MarkButton format='underline' icon='icon-u' editor={editor}></MarkButton>
    </Space>
  )
}

export default Tools
