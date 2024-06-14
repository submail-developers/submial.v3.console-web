import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useState,
  useRef,
} from 'react'
import { Modal, Flex, Button, Carousel, Image, ConfigProvider } from 'antd'

import step_img_1 from '@/assets/rcs/welcome/1.png'
import step_img_2 from '@/assets/rcs/welcome/2.png'
import step_img_3 from '@/assets/rcs/welcome/3.png'
import step_img_4 from '@/assets/rcs/welcome/4.png'

import './index.scss'

type MyTourProps = {}

const Images = [step_img_1, step_img_2, step_img_3, step_img_4]

function MyTour(props: MyTourProps, ref) {
  useImperativeHandle(ref, () => {
    return {
      open,
    }
  })
  const carouselRef = useRef(null)
  const [show, setShow] = useState(false)
  const [step, setStep] = useState(0)
  const open = () => {
    setShow(true)
  }

  const next = () => {
    if (step == 3) {
      setShow(false)
      window.localStorage.setItem('rcsTour', 'true')
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
        {step == 0 && (
          <>
            <span className='color'>完善</span>客户资料
          </>
        )}
        {step == 1 && (
          <>
            <span className='color'>申请</span>Chatbot
          </>
        )}
        {step == 2 && (
          <>
            <span className='color'>创建&发送</span>模版
          </>
        )}
        {step == 3 && (
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
            className: 'dots-list',
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

      <div className='des m-t-12'>
        {step == 0 && (
          <>
            5G消息服务需要确保您的客户资料完整无缺真实有效，审核团队将对您提供的资料进行核实，请耐心等待审核结果，以保障服务的安全性和个性化体验。
          </>
        )}
        {step == 1 && (
          <>
            根据您的需要申请个性化Chatbot。从而能够提供增强的交互性，保证在高流量时段的快速响应。审核团队将对您提供的申请进行核实，请耐心等待审核结果。
          </>
        )}
        {step == 2 && (
          <>
            创建符合您业务需求的模版并提交审核，审核通过后通过Chatbot将5G消息精准分发至您所选定的地址簿号码中。
          </>
        )}
        {step == 3 && (
          <>
            创建符合您业务需求的模版并提交审核，审核通过后选择Chatbot并通过在线发送功能将5G消息模版精准分发至您所选定的地址簿号码中。
          </>
        )}
      </div>
      <Flex justify='center' className='m-t-12'>
        <ConfigProvider wave={{ disabled: true }}>
          <Button
            // size='small'
            type='primary'
            style={{ width: 120 }}
            onClick={next}>
            {step == 3 ? '我知道了' : '下一步'}
          </Button>
        </ConfigProvider>
      </Flex>
    </Modal>
  )
}

export default forwardRef(MyTour)
