import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useState,
  useRef,
} from 'react'
import {
  Modal,
  Flex,
  Button,
  Carousel,
  Image,
  ConfigProvider,
  Space,
} from 'antd'

import tourBannerImg from '@/assets/rcs/welcome/tourBanner.png'
import newImg from '@/assets/rcs/welcome/new.png'

import step_img_0 from '@/assets/rcs/welcome/tourBanner.png'
import step_img_1 from '@/assets/rcs/welcome/1.png'
import step_img_2 from '@/assets/rcs/welcome/2.png'
import step_img_3 from '@/assets/rcs/welcome/3.png'
import step_img_4 from '@/assets/rcs/welcome/4.png'

import { openRcs } from '@/api'

import './index.scss'

type MyTourProps = {
  // 开通产品
  openEvent: () => void
}

const Images = [step_img_0, step_img_1, step_img_2, step_img_3, step_img_4]

function MyTour(props: MyTourProps, ref) {
  useImperativeHandle(ref, () => {
    return {
      open,
    }
  })
  const carouselRef = useRef(null)
  const [show, setShow] = useState(false)
  const [step, setStep] = useState(0)
  const [loading, setLoading] = useState(false)
  const open = () => {
    setShow(true)
  }

  const next = async () => {
    if (step == 4) {
      try {
        setLoading(true)
        await openRcs({ agreement: true })
        setLoading(false)
        setShow(false)
        window.localStorage.setItem('rcsTour', 'true')
        props.openEvent()
      } catch (error) {
        setLoading(false)
        setShow(false)
        props.openEvent()
      }
      return
    }
    setStep(step + 1)
  }

  useEffect(() => {
    if (carouselRef.current && show) {
      carouselRef.current.goTo(step)
    }
    if (!show) {
      setStep(0)
    }
  }, [step, carouselRef, show])
  return (
    <Modal
      open={show}
      onCancel={() => setShow(false)}
      width={500}
      title=''
      footer={null}
      maskClosable={false}
      closable={false}
      classNames={{ header: 'modal-header', body: 'modal-body' }}
      wrapClassName='welcome-tour-modal'
      destroyOnClose>
      <div className='fw-500 text-center fn18'>
        {step == 1 && (
          <>
            <span className='color'>完善</span>客户资料
          </>
        )}
        {step == 2 && (
          <>
            <span className='color'>申请</span>Chatbot
          </>
        )}
        {step == 3 && (
          <>
            <span className='color'>创建&发送</span>模版
          </>
        )}
        {step == 4 && (
          <>
            <span className='color'>智能</span>交互
          </>
        )}
      </div>

      <ConfigProvider
        theme={{
          components: {
            Carousel: {
              dotActiveWidth: 10,
              dotHeight: 10,
              dotWidth: 10,
            },
          },
        }}>
        <Carousel
          ref={carouselRef}
          className='m-t-12'
          infinite={false}
          dots={{
            className: step == 0 ? 'dots-none' : 'dots-list',
          }}>
          {Images.map((item, index) => (
            <Image
              key={index}
              className='g-radius-4'
              src={item}
              preview={false}></Image>
          ))}
        </Carousel>
      </ConfigProvider>

      {step == 0 ? (
        <>
          <Space align='center' className='m-t-12 m-b-4'>
            <span className='fn24 fw-500'>
              <span className='color'>5G</span>
              消息服务
            </span>
            <Image src={newImg} preview={false} width={50} />
          </Space>
          <div className='m-t-8 m-b-4' style={{ color: '#666' }}>
            全面增强版短信，包含多种通信系统和扩展功能接口，跟随引导简单了解5G消息。
          </div>
        </>
      ) : (
        <div className='des m-t-12'>
          {step == 1 && (
            <>
              5G消息需确保您的客户资料完整无缺且真实有效，审核团队将对资料进行核实，以保障服务的安全性。
            </>
          )}
          {step == 2 && (
            <>
              根据您的需要申请/配置个性化
              Chatbot，从而为您的客户提供强交互和快响应的使用体验。
            </>
          )}
          {step == 3 && (
            <>
              创建符合您需求的模版并提交审核，通过后 Chatbot
              将5G消息精准分发至您所选定的地址簿号码中。
            </>
          )}
          {step == 4 && (
            <>
              设置 Chatbot
              交互与模版交互规则，在用户收到5G消息并触发既定规则时，自动完成短信下发流程。
            </>
          )}
        </div>
      )}

      <Flex justify='center' className='m-t-12'>
        <ConfigProvider wave={{ disabled: true }}>
          <Button
            type='primary'
            style={{ width: 120 }}
            onClick={next}
            loading={loading}>
            {step == 0 ? '开始引导' : <>{step == 4 ? '开通产品' : '下一步'}</>}
          </Button>
        </ConfigProvider>
      </Flex>
    </Modal>
  )
}

export default forwardRef(MyTour)
