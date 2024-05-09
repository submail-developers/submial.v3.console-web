import { useState } from 'react'
import { Form, Button, Input, Flex } from 'antd'
import RcsInput from '@/components/rcsInput'
import MmsModal from './mmsModal'
import { API } from 'apis'

import './index.scss'

type Props = {
  msg: string
  mmsInfo: API.UploadMmsLibsRes
  onChangeMsg: (msg: string) => void
  onChangeMms: (info: API.UploadMmsLibsRes) => void
}

export default function Fn(props: Props) {
  const [show, setshow] = useState(false)

  return (
    <div className='message-config hide-scrollbar'>
      <div className='fn16 fw-500'>回落配置</div>
      <Form.Item
        label='短信回落信息（选填）'
        colon={false}
        labelCol={{ span: 24 }}
        style={{ margin: '4px 0 0' }}></Form.Item>
      <RcsInput
        text={props.msg}
        onChange={(val) => props.onChangeMsg(val)}
        min={0}
        chineseLen={2}
        label={'短信消息回落'}
        showInsertParams
        active
        style={{
          height: 120,
          lineHeight: '24px',
          backgroundColor: '#fff',
          overflow: 'auto',
          padding: '0',
          border: 'none',
        }}
        wrapStyle={{
          padding: '4px 8px',
          border: '1px solid #ccc',
          // overflow: 'auto',
          borderRadius: '4px',
        }}
      />

      <Form.Item
        label='多媒体彩信回落（选填）'
        colon={false}
        labelCol={{ span: 24 }}
        style={{ margin: '4px 0 0' }}></Form.Item>
      <Input
        value={props.mmsInfo?.mmsSubject || ''}
        disabled
        placeholder='请选择彩信模版'
      />
      <Flex justify='flex-end' className='m-t-16'>
        <Button type='primary' onClick={() => setshow(true)}>
          选择彩信模版
        </Button>
      </Flex>
      <MmsModal
        show={show}
        onCancel={() => setshow(false)}
        onOk={(info) => {
          props.onChangeMms(info)
          setshow(false)
        }}
      />
    </div>
  )
}
