import { Button, Space, Checkbox } from 'antd'
import PageContent from '@/components/pageContent'
import Card from '@/components/aCard'
import Logo from '@/assets/voiceChatbot/logo.svg'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { openVoiseChatbot } from '@/api'
export default function Fn() {
  const [checked, setChecked] = useState(false)
  const nav = useNavigate()
  const open = async () => {
    try {
      const res = await openVoiseChatbot()
      if (res.status == 'success') {
        nav('/console/voiceChatbot/welcome', {
          replace: true,
        })
      }
    } catch (error) {}
  }
  return (
    <PageContent>
      <div className='m-t-40 p-t-40 m-x-12'>
        <Card title='开通产品'>
          <div className='p-x-12'>
            <img src={Logo} width={80} alt='' />
            <div className='fn18 fw-500 m-t-12'>智能语音机器人</div>
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
            <Button
              disabled={!checked}
              type='primary'
              className='m-t-20'
              onClick={open}>
              开通产品
            </Button>
          </div>
        </Card>
      </div>
    </PageContent>
  )
}
