import { useState, useMemo, useCallback, useRef } from 'react'
import { Flex, Space, Tabs, Checkbox, Divider, Image } from 'antd'
import type { TabsProps } from 'antd'
import { useParams, useLocation, useSearchParams } from 'react-router-dom'
import Meteial from '../components/meteial'
import Page from '../page'
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
import RichInput, { withMarks, CustomEditor } from '../components/slate'
import Tools from '../components/slate/tools'
import './index.scss'

export default function Fn() {
  const [searchParams] = useSearchParams()
  const name = decodeURIComponent(searchParams.get('name'))
  // 标题
  const titleEditor = useMemo(() => withMarks(withReact(createEditor())), [])
  const titleToolRef = useRef(null)
  const [titleVal, setTitleVal] = useState<Descendant[]>([
    {
      type: 'paragraph',
      children: [{ text: '一段文字文字文字', bold: true }],
    },
  ])
  // 描述
  const descriptionEditor = useMemo(
    () => withMarks(withReact(createEditor())),
    [],
  )
  const descriptionToolRef = useRef(null)
  const [descriptionVal, setDescriptionVal] = useState<Descendant[]>([
    {
      type: 'paragraph',
      children: [{ text: '一段文字文字文字' }],
    },
  ])
  const [activeKey, setactiveKey] = useState('1')
  const onChange = (key: string) => {
    setactiveKey(key)
  }
  const items: TabsProps['items'] = [
    {
      key: '1',
      label: (
        <>
          <span
            className='icon iconfont icon-card fn18'
            style={{ marginRight: '2px' }}></span>
          <span>模版配置</span>
        </>
      ),
      children: (
        <div>
          <div className='title'>单卡片</div>
          <div>卡片缩略图</div>
          <div>
            不选择缩略图 <Checkbox></Checkbox>
          </div>
          <Divider />
          <div>正文</div>
          <div ref={titleToolRef}></div>
          <div>文本文字</div>
          <div ref={descriptionToolRef}></div>
          <Divider />
          <div>按钮</div>
          <Divider />
          <div>悬浮框</div>
        </div>
      ),
    },
    {
      key: '2',
      label: (
        <>
          <span
            className='icon iconfont icon-jiaohu fn18'
            style={{ marginRight: '2px' }}></span>
          <span>消息回落配置</span>
        </>
      ),
      children: 'Content of Tab Pane 2',
    },
  ]
  const renderTabBar: TabsProps['renderTabBar'] = (props, DefaultTabBar) => (
    <div className='tabs'>
      {items.map((item) => (
        <div
          key={item.key}
          className={`tab-item ${activeKey == item.key ? 'active' : ''}`}
          onClick={() => setactiveKey(item.key)}>
          {item.label}
        </div>
      ))}
    </div>
  )

  return (
    <Page
      left={<Meteial />}
      content={
        <>
          <div className='center-content card-center-content'>
            <div className='banner'></div>
            <div className='card-title'>
              <RichInput
                editor={titleEditor}
                value={titleVal}
                ref={titleToolRef}
                onChange={(val) => setTitleVal(val)}
              />
            </div>
            <div className='card-des'>
              <RichInput
                editor={descriptionEditor}
                value={descriptionVal}
                ref={descriptionToolRef}
                onChange={(val) => setDescriptionVal(val)}
              />
            </div>
            <div className='button'>btn</div>
          </div>
          <Space className='float-content'>
            <div className='float-item'>悬浮1</div>
            <div className='float-item'>悬浮2</div>
          </Space>
        </>
      }
      right={
        <Tabs
          renderTabBar={renderTabBar}
          activeKey={activeKey}
          items={items}
          onChange={onChange}
        />
      }
      submit={() => {}}></Page>
  )
}
