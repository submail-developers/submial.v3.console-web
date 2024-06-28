import { useState } from 'react'
import { Space, Switch, Row, Col, Flex, Button, Popconfirm, App } from 'antd'
import { LoadingOutlined } from '@ant-design/icons'
import { API } from 'apis'
import {
  changeRcsSubhookStatus,
  resetRcsSubhookKey,
  delRcsSubhook,
  testRcsSubhook,
} from '@/api'
import './index.scss'
import { usePoint } from '@/hooks'
import { EyeInvisibleOutlined, EyeOutlined } from '@ant-design/icons'
type Props = {
  item: API.RcsSubhookItem
  onRefresh: () => void
  onEdit: () => void
}

export const callbackCode = {
  '100': '100-199',
  '200': '200-299',
  '300': '300-399',
}

export default function Fn(props: Props) {
  const point = usePoint('lg')
  const { message } = App.useApp()
  const [showEye, setShowEye] = useState(false)
  const [switchLoading, setSwitchLoading] = useState(false)
  const [testLoading, settestLoading] = useState(false)
  const [status, setStatus] = useState(props.item.enabled == '0')
  const changeSwitch = async (flag) => {
    setSwitchLoading(true)
    try {
      const res = await changeRcsSubhookStatus({
        id: props.item.id,
        status: flag,
      })
      if (res.status == 'success') {
        setStatus(flag)
        props.onRefresh()
      }
      setSwitchLoading(false)
    } catch (error) {
      setSwitchLoading(false)
    }
  }
  const resetPassword = async () => {
    try {
      const res = await resetRcsSubhookKey({
        id: props.item.id,
      })
      if (res.status == 'success') {
        message.success('重置成功')
        props.onRefresh()
      }
    } catch (error) {}
  }
  const delItem = async () => {
    try {
      const res = await delRcsSubhook({
        id: props.item.id,
      })
      if (res.status == 'success') {
        message.success('删除成功')
        props.onRefresh()
      }
    } catch (error) {}
  }
  const testSubhook = async () => {
    settestLoading(true)
    try {
      const res = await testRcsSubhook({
        id: props.item.id,
      })
      if (res.status == 'success' && res.push_status == 'success') {
        message.success('推送成功')
      } else {
        message.error('推送失败')
      }
      settestLoading(false)
    } catch (error) {
      settestLoading(false)
    }
  }
  return (
    <div className='subhook-item'>
      <Flex
        justify='space-between'
        align='center'
        className='subhook-item-head p-x-20'>
        <Space>
          <Switch
            value={status}
            size='small'
            loading={switchLoading}
            onChange={changeSwitch}
          />
          {props.item.title}
        </Space>
        <Space size={0}>
          <Button
            type='link'
            className='p-r-0'
            onClick={props.onEdit}
            icon={<span className='icon iconfont icon-bianji fn14'></span>}>
            编辑
          </Button>
          <Popconfirm
            placement='bottom'
            title='警告'
            description='确认要删除该 SUBHOOK 吗？'
            onConfirm={delItem}
            okText='确定'
            cancelText='取消'>
            <Button
              type='link'
              className='p-r-0'
              icon={<span className='icon iconfont icon-shanchu fn14'></span>}>
              删除
            </Button>
          </Popconfirm>
        </Space>
      </Flex>
      <div className='subhook-info p-x-16 p-y-16'>
        <Row gutter={[16, 12]} className='line-30 '>
          <Col span={24} xl={14} xxl={12}>
            <Row>
              <Col span={24} lg={8} xl={6}>
                <Flex justify='space-between' align='center'>
                  <span className='gray-color'>SUBHOOK密钥</span>
                  {!point && (
                    <Popconfirm
                      placement='bottom'
                      title='警告'
                      description='确认要重置该 SUBHOOK 密钥吗？'
                      onConfirm={resetPassword}
                      okText='确定'
                      cancelText='取消'>
                      <div className='color g-pointer'>重置</div>
                    </Popconfirm>
                  )}
                </Flex>
              </Col>
              <Col span={24} lg={16} xl={18}>
                <Flex align='center' gap={16}>
                  <Flex
                    justify='space-between'
                    align='center'
                    gap={12}
                    className={`input-password-wrap p-x-8 p-y-2 g-radius-4 ${
                      point ? '' : 'w-100 m-t-8'
                    }`}>
                    <div
                      className='input-password'
                      style={{ transform: showEye ? '' : 'translateY(2px)' }}>
                      {showEye
                        ? props.item.password
                        : '************************'}
                    </div>
                    <div
                      className='g-pointer'
                      onClick={() => setShowEye(!showEye)}>
                      {showEye ? (
                        <EyeInvisibleOutlined
                          rev={null}
                          className='fn16 gray-color-sub'
                        />
                      ) : (
                        <EyeOutlined
                          rev={null}
                          className='fn16 gray-color-sub'
                        />
                      )}
                    </div>
                  </Flex>
                  {point && (
                    <Popconfirm
                      placement='bottom'
                      title='警告'
                      description='确认要重置该 SUBHOOK 密钥吗？'
                      onConfirm={resetPassword}
                      okText='确定'
                      cancelText='取消'>
                      <div className='color g-pointer'>重置</div>
                    </Popconfirm>
                  )}
                </Flex>
              </Col>
            </Row>
          </Col>
          <Col span={24} xl={10} xxl={12}>
            <Row>
              <Col span={8} xl={6} className='gray-color'>
                回调方式
              </Col>
              <Col span={16} xl={18}>
                <Space size={24}>
                  <span>{props.item.request_method}</span>
                  <Space className='color g-pointer' onClick={testSubhook}>
                    {testLoading && <LoadingOutlined rev={false} />}
                    <span>测试推送</span>
                  </Space>
                </Space>
              </Col>
            </Row>
          </Col>
          <Col span={24} xl={14} xxl={12}>
            <Row>
              <Col span={8} xl={6} className='gray-color'>
                Chatbot
              </Col>
              <Col span={16} xl={18}>
                {props.item.appid == 'ALL'
                  ? '全部Chatbot'
                  : props.item.chatbot_name}
              </Col>
            </Row>
          </Col>
          <Col span={24} xl={10} xxl={12}>
            <Row>
              <Col span={8} xl={6} className='gray-color'>
                回调文档类型
              </Col>
              <Col span={16} xl={18}>
                {props.item.request_content_type}
              </Col>
            </Row>
          </Col>
          <Col span={24} xl={14} xxl={12}>
            <Row>
              <Col span={8} xl={6} className='gray-color'>
                http响应码
              </Col>
              <Col span={16} xl={18}>
                {callbackCode[props.item.response_code] || ''}
              </Col>
            </Row>
          </Col>
          <Col span={24} xl={10} xxl={12}>
            <Row>
              <Col span={8} xl={6} className='gray-color'>
                回调URL
              </Col>
              <Col span={16} xl={18}>
                <div className='g-ellipsis-3' title={props.item.url}>
                  {props.item.url}
                </div>
              </Col>
            </Row>
          </Col>
        </Row>
      </div>
    </div>
  )
}
