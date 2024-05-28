import { useState, useEffect } from 'react'
import {
  Flex,
  Row,
  Col,
  Button,
  Divider,
  Image,
  Form,
  Select,
  Switch,
  Space,
} from 'antd'
import PageContent from '@/components/pageContent'

// import { getErrorLogs } from '@/api'
import { API } from 'apis'
import topIco from '@/assets/rcs/subhook/subhook_ico.png'
import './index.scss'
import CreateSubhook from './createSubhookDialog/index'
import { useSize, usePoint } from '@/hooks'
const { Option } = Select

export default function Fn() {
  const size = useSize()
  const point = usePoint('lg')
  const [form] = Form.useForm()
  const [getErrorList, setGetErrorList] = useState()
  const [isModalOpen, setIsModalOpen] = useState(false)

  // 获取错误日志
  // const getList = async () => {
  //   const res = await getErrorLogs({
  //     page: 1,
  //     start: '2022-05-20',
  //     end: '2024-05-22',
  //   })
  // }

  useEffect(() => {
    // getList()
  }, [])

  const creatSubhook = () => {
    setIsModalOpen(true)
  }
  const handleCancel = () => {
    setIsModalOpen(false)
  }

  return (
    <PageContent extClass='subhook'>
      <Form
        form={form}
        className='subhook-form'
        name='subhook'
        layout='vertical'
        autoComplete='off'>
        <Image src={topIco} preview={false} width={72}></Image>
        <Flex
          justify='space-between'
          align='center'
          style={{ marginTop: '4px' }}>
          <div className='fn22 fw-500'>SUBHOOK 状态推送</div>

          <Button
            type='primary'
            size={point ? 'large' : 'middle'}
            onClick={creatSubhook}>
            <i className='icon iconfont icon-jia m-r-10'></i>
            创建 SUBHOOK
          </Button>
        </Flex>
        <Divider className='line'></Divider>

        <Row gutter={16} className='m-b-20'>
          <Col span={8} md={24} xl={12} xxl={12}>
            <div className='sub-view'>
              <div className='view-head'>
                <div className='fx-between-center'>
                  <div className='fn16'>SUBHOOK1</div>
                  <div className='fx-y-center'>
                    <Switch size='small' defaultChecked className='m-r-6' />
                    开启
                  </div>
                </div>
              </div>
              <div className='view-body'>
                <span className='gray-color-sub'>SUBHOOK 密钥</span>
                <div className='set-pas fx-between-center m-t-10'>
                  <div className='gray-color-sub p-t-2'>******************</div>
                  <i className='icon iconfont icon-xianshi gray-color-sub fn12'></i>
                </div>
                <div className='update-pas'>修改密钥</div>
                <span className='gray-color-sub m-t-10'>已选中的事件</span>
                <div className='m-t-10 fx fx-wrap'>
                  <span className='checkEvent'>
                    <i className='icon iconfont icon-yes fn12'></i>
                    成功下发并回落为短信
                  </span>
                  <span className='checkEvent'>
                    <i className='icon iconfont icon-yes fn12'></i>
                    消息撤回
                  </span>
                  <span className='checkEvent'>
                    <i className='icon iconfont icon-yes fn12'></i>
                    成功下发并回落为短信
                  </span>
                  <span className='checkEvent'>
                    <i className='icon iconfont icon-yes fn12'></i>
                    成功下发并回落为短信
                  </span>
                </div>

                <table className='table-chat'>
                  <tbody>
                    <tr>
                      <td className='gray-color-sub'>ChatBot</td>
                      <td>全部ChatBot</td>
                    </tr>
                    <tr>
                      <td className='gray-color-sub'>回调文档类型</td>
                      <td>x-www-form-urlencoded</td>
                    </tr>
                    <tr>
                      <td className='gray-color-sub'>回调URL</td>
                      <td>213124324135324141</td>
                    </tr>
                    <tr>
                      <td className='gray-color-sub'>回调方式</td>
                      <td>POST</td>
                    </tr>
                    <tr>
                      <td className='gray-color-sub'>http响应码</td>
                      <td>
                        200 - 299 <span className='color p-l-30'>测试推送</span>
                      </td>
                    </tr>
                  </tbody>
                </table>

                <div className='set-btom fx-between-center m-t-30'>
                  <Button>
                    <i className='icon iconfont icon-bianji m-r-6'></i> 编辑
                  </Button>
                  <Button>
                    <i className='icon iconfont icon-shanchu m-r-6'></i>删除
                  </Button>
                </div>
              </div>
            </div>
          </Col>
        </Row>
      </Form>
      <CreateSubhook open={isModalOpen} onCancel={handleCancel} />
    </PageContent>
  )
}
