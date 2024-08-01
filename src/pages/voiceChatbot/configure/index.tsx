import { Button, Space, Checkbox } from 'antd'
import PageContent from '@/components/pageContent'
import Card from '@/pages/voiceChatbot/welcome/components/card'
import { AimIcon } from '@/components/aIcons'
import { useState } from 'react'
export default function Fn() {
  const [checked, setChecked] = useState(false)
  return (
    <PageContent>
      <div className='m-t-40 p-t-40 m-x-12'>
        <Card title='开通产品'>
          <div className='p-x-12'>
            <div style={{ fontSize: 54 }}>
              <AimIcon />
            </div>
            <div className='fn18 fw-500'>智能语音机器人</div>
            <div className='m-t-24'>
              <Space align='start' className='fn13'>
                <Checkbox
                  checked={checked}
                  onChange={(e) => setChecked(e.target.checked)}></Checkbox>
                <span>
                  我已阅读并同意
                  <a href='/documents/QBVE31' target='__blank'>
                    《SUBMAIL 产品服务协议》
                  </a>
                  以及
                  <a href='/documents/F70oc3' target='__blank'>
                    《SUBMAIL 开发者公约》
                  </a>
                  。
                </span>
              </Space>
            </div>
            <Button type='primary' className='m-t-20'>
              开通产品
            </Button>
          </div>
        </Card>
      </div>
    </PageContent>
  )
}
