import { Outlet, useNavigate } from 'react-router-dom'
import { Flex, Divider, Image, Button } from 'antd'
import PageContent from '@/components/pageContent'
import faceImg from '@/assets/rcs/face/history.png'

import './index.scss'

export default function Fn() {
  const nav = useNavigate()
  return (
    <PageContent extClass='call-detail' xxl={'90%'} xl={'100%'}>
      <Image src={faceImg} preview={false} width={72}></Image>
      <Flex justify='space-between' align='center'>
        <div className='fn22 fw-500'>外呼任务详情</div>
        <Button
          onClick={() => nav('/console/voiceChatbot/call/index')}
          type='primary'>
          返回列表
        </Button>
      </Flex>
      <Divider />
      <Outlet />
    </PageContent>
  )
}
