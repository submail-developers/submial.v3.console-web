import { Flex, Row, Col, Divider, Image } from 'antd'
import PageContent from '@/components/pageContent'
import Credits from './components/credits'
import Mob from './components/mob'
import Mail from './components/email'
import Safe from './components/safe'

import faceImg from '@/assets/voiceChatbot/face/settings.png'

import './index.scss'

export default function Fn() {
  return (
    <PageContent extClass='setting'>
      <Image src={faceImg} preview={false} width={72}></Image>
      <Flex justify='space-between' align='center' className='m-t-4'>
        <div className='fn22 fw-500'>
          偏好设置
          <div
            className='fn14 gray-color m-t-10'
            style={{ fontWeight: 'normal' }}>
            配置您的智能语音机器人账户，更改或更新余额共享设置、余额提醒、提醒列表、安全设置以及其他设置。
          </div>
        </div>
      </Flex>
      <Divider />
      <Row gutter={[24, 24]}>
        <Col span={24}>
          {/* 余额 */}
          <Credits />
        </Col>
        <Col span={24}>
          {/* 邮箱 */}
          <Mail />
        </Col>
        <Col span={24}>
          {/* 手机号 */}
          <Mob />
        </Col>
        <Col span={24}>
          <Divider />
        </Col>
        <Col span={24}>
          {/* 安全设置 */}
          <Safe />
        </Col>
      </Row>
    </PageContent>
  )
}
