import { useState } from 'react'
import { Button, Input, Flex } from 'antd'
import RcsInput from '@/components/rcsInput'
import MmsModal from './mmsModal'
import { API } from 'apis'

import './index.scss'

type Props = {
  msg: string
  mmsInfo: API.UploadMmsLibsRes
  onChangeMsg: (msg: string) => void
  onChangeMms: (info: API.UploadMmsLibsRes | null) => void
}

export default function Fn(props: Props) {
  const [show, setshow] = useState(false)
  const delMms = () => {
    props.onChangeMms(null)
  }

  return (
    <div className='message-config hide-scrollbar p-12 g-scroll'>
      <div className='fn16 fw-500'>回落配置</div>
      <div className='callback-label fx-y-center m-t-4'>
        短信回落信息（选填）
      </div>
      <RcsInput
        text={props.msg}
        onChange={(val) => props.onChangeMsg(val)}
        min={0}
        chineseLen={2}
        label={'短信消息回落'}
        // 回落暂不支持变量
        showInsertParams={false}
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

      <div className='callback-label fx-y-center m-t-4'>
        多媒体彩信回落（选填）
      </div>
      <div className='mms-wrap'>
        <Input
          value={props.mmsInfo?.mmsSubject || ''}
          disabled
          placeholder='请选择彩信模版'
        />
        {props.mmsInfo && (
          <div className='clear-btn fx-center-center' onClick={delMms}>
            <i
              className='icon iconfont icon-chahao'
              style={{ fontSize: '9px' }}></i>
          </div>
        )}
      </div>
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
