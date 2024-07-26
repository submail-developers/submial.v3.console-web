import { ReactNode } from 'react'
import { usePoint } from '@/hooks'
import { Col, Row } from 'antd'

import {
  MsgIcon,
  IntersmsIcon,
  MmsIcon,
  MailIcon,
  VoiceIcon,
  ShortUrlIcon,
  OnepassIcon,
  IdentificationIcon,
  VfmobileIcon,
  RcsIcon,
  MdetectIcon,
  AimIcon,
  NewVisionIcon,
  ConsoleIcon,
  LogoIcon,
} from '@/components/aIcons'
import ProdIcon from '@/components/aIcons/prodIconWrap'

import './index.scss'

type Props = {
  show: boolean
}
type ProdListItem = {
  text: string
  link: string // link为空时禁止点击
  extClass: string
  icon: ReactNode
}

const prodList: ProdListItem[] = [
  {
    text: '短信',
    link: '/console/sms',
    extClass: 'sms-icon',
    icon: <MsgIcon />,
  },
  {
    text: '国际短信',
    link: '/console/intersms',
    extClass: 'intersms-icon',
    icon: <IntersmsIcon />,
  },
  {
    text: '多媒体彩信',
    link: '/console/mms',
    extClass: 'mms-icon',
    icon: <MmsIcon />,
  },
  {
    text: '邮件',
    link: '/console/mail',
    extClass: 'mail-icon',
    icon: <MailIcon />,
  },
  {
    text: '语音',
    link: '/console/voice',
    extClass: 'voice-icon',
    icon: <VoiceIcon />,
  },
  {
    text: '短网址',
    link: '/console/shorturl',
    extClass: 'shorturl-icon',
    icon: <ShortUrlIcon />,
  },
  {
    text: '一键登录',
    link: '/console/onepass',
    extClass: 'onepass-icon',
    icon: <OnepassIcon />,
  },
  {
    text: '身份验证',
    link: '/console/identification',
    extClass: 'identification-icon',
    icon: <IdentificationIcon />,
  },
  {
    text: '本机号码认证',
    link: '/console/vfmobile',
    extClass: 'vfmobile-icon',
    icon: <VfmobileIcon />,
  },
  {
    text: '5G RCS 消息',
    link: '/console/rcs',
    extClass: 'rcs-icon',
    icon: <RcsIcon />,
  },
  {
    text: '空号检测',
    link: '/console/mdetect',
    extClass: 'mdetect-icon',
    icon: <MdetectIcon />,
  },
  {
    text: '5G阅信',
    link: '/console/aim',
    extClass: 'aim-icon',
    icon: <AimIcon />,
  },
  {
    text: '5G新视通',
    link: '/console/newVision',
    extClass: 'newVision-icon',
    icon: <NewVisionIcon />,
  },
  {
    text: '控制台',
    link: '/console',
    extClass: 'console-icon',
    icon: <ConsoleIcon />,
  },
  {
    text: '返回首页',
    link: '/',
    extClass: 'logo-icon',
    icon: (
      <div
        className='fx-center-center'
        style={{
          border: '1px solid #e7e7e7',
          borderRadius: '50%',
          width: '100%',
          height: '100%',
        }}>
        <LogoIcon />
      </div>
    ),
  },
]

export default function ProductNav(props: Props) {
  const point = usePoint('sm')
  return (
    <div
      className={`product-nav ${props.show ? 'show' : ''} ${
        point ? '' : 'mob'
      }`}>
      <Row wrap gutter={[0, 16]}>
        {prodList.map((item, index) => (
          <Col sm={6} xs={8} key={index}>
            {item.link ? (
              <a
                href={item.link}
                className={`prod-item fx-col-center-center ${
                  item.link ? '' : 'disabled'
                }`}>
                <ProdIcon extClass={item.extClass}>{item.icon}</ProdIcon>
                <div className='prod-name'>{item.text}</div>
              </a>
            ) : (
              <div className={`prod-item fx-col-center-center disabled`}>
                <ProdIcon extClass={item.extClass}>{item.icon}</ProdIcon>
                <div className='prod-name'>{item.text}</div>
              </div>
            )}
          </Col>
        ))}
      </Row>
    </div>
  )
}
