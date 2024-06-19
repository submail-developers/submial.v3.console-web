import { useState, useEffect, forwardRef } from 'react'
import {
  Modal,
  Form,
  App,
  Upload,
  Button,
  Input,
  Select,
  Checkbox,
  Row,
  Col,
  Radio,
} from 'antd'
import { createAddressbooks } from '@/api'
import { API } from 'apis'
import './index.scss'
const { Option } = Select
import type { CheckboxChangeEvent } from 'antd/es/checkbox'
interface Props {
  open: boolean
  onCancel: () => void
}
const Extra = (props) => {
  return <div style={{ marginTop: '8px' }}>{props.children}</div>
}
const CheckboxGroup = Checkbox.Group

const Dialog = (props: Props, ref: any) => {
  const [form] = Form.useForm()
  const { message } = App.useApp()
  const [selectedList, setselectedList] = useState<string[]>([])
  const [selectedList2, setselectedList2] = useState<string[]>([])

  useEffect(() => {}, [props.open])

  const handleOk = async () => {}

  const handleCancel = () => {}

  const onFinish = () => {}
  const onFinishFailed = () => {}

  const appidOptions = [
    {
      value: 0,
      label: '全部AppID',
    },
  ]

  const checkList = [
    {
      id: '0',
      name: 'API请求',
    },
    {
      id: '1',
      name: '正在发送',
    },
    {
      id: '2',
      name: '发送成功',
    },
    {
      id: '3',
      name: '发送失败',
    },
    {
      id: '4',
      name: '短信上行',
    },
    {
      id: '5',
      name: '模板审核通过',
    },
    {
      id: '6',
      name: '模板审核拒绝',
    },
  ]
  const huidaoList = [
    {
      id: '111',
      name: 'API请求',
    },
    {
      id: '222',
      name: '正在发送',
    },
  ]

  useEffect(() => {
    let hasChecked = false
    let checkedAll = true

    checkList.forEach((item) => {
      if (selectedList.includes(item.id)) {
        hasChecked = true
      } else {
        checkedAll = false
      }
    })
  }, [checkList, selectedList])
  useEffect(() => {
    let hasChecked = false
    let checkedAll = true

    huidaoList.forEach((item) => {
      if (selectedList2.includes(item.id)) {
        hasChecked = true
      } else {
        checkedAll = false
      }
    })
  }, [huidaoList, selectedList2])

  // 单个checkbox点击
  const onChange = (checkedValues: string[]) => {
    console.log(checkedValues, '1')
    setselectedList(checkedValues)
  }

  const onChange2 = (checkedValues: string[]) => {
    console.log(checkedValues, '2')
    setselectedList2(checkedValues)
  }

  const postOptions = [
    {
      value: 'x-www-form-urlencoded',
      label: 'x-www-form-urlencoded',
    },
    {
      value: 'json',
      label: 'json',
    },
    {
      value: 'form-data',
      label: 'form-data',
    },
  ]

  const resCodeOptions = [
    { label: '100 - 199', value: '100' },
    { label: '200 - 299', value: '200' },
    { label: '300 - 399', value: '300' },
  ]

  return (
    <Modal
      open={props.open}
      onCancel={props.onCancel}
      title='创建SUBHOOK'
      onOk={handleOk}
      width={580}
      data-class='create-subhook'
      closable={false}
      wrapClassName='modal-subhook'>
      <Form
        name='form-subhook'
        form={form}
        labelCol={{ span: 8 }}
        wrapperCol={{ span: 24 }}
        layout='vertical'
        initialValues={{
          appid: 0,
          docType: 'x-www-form-urlencoded',
        }}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        autoComplete='off'>
        <Form.Item
          label='SUBHOOK 名称'
          name='name'
          validateTrigger='onSubmit'
          extra={<Extra>请将 SHUBHOOK 名称控制在32个字符以内</Extra>}>
          <Input placeholder='请输入一个SUBHOOK名称' maxLength={32} />
        </Form.Item>

        <Form.Item
          label='选择 AppID'
          name='appid'
          validateTrigger='onSubmit'
          extra={
            <Extra>
              选择一个Chatbot或选择全部Chatbot,该SUBHOOK将推送指定的Chatbot发送那个的数据
            </Extra>
          }>
          <Select placeholder='全部AppID'>
            {appidOptions.map((option) => (
              <Option key={option.value} value={option.value}>
                {option.label}
              </Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item label='选择事件' name='event' validateTrigger='onSubmit'>
          <CheckboxGroup
            style={{ width: '100%' }}
            value={selectedList}
            onChange={onChange}>
            <Row wrap gutter={8} style={{ width: '100%' }}>
              {checkList.map((item) => (
                <Col key={item.id}>
                  <div className='checkbox-item fx-between-center  m-b-10'>
                    <Checkbox value={item.id} className='fn14 gray-color'>
                      {item.name}
                    </Checkbox>
                  </div>
                </Col>
              ))}
            </Row>
          </CheckboxGroup>
        </Form.Item>

        <Form.Item label='回调方式' name='huidiao' validateTrigger='onSubmit'>
          <CheckboxGroup
            style={{ width: '100%' }}
            value={selectedList2}
            onChange={onChange2}>
            <Row wrap gutter={8} style={{ width: '100%' }}>
              {huidaoList.map((item) => (
                <Col key={item.id}>
                  <div className='checkbox-item fx-between-center  m-b-10'>
                    <Checkbox value={item.id} className='fn14 gray-color'>
                      {item.name}
                    </Checkbox>
                  </div>
                </Col>
              ))}
            </Row>
          </CheckboxGroup>
        </Form.Item>

        <Form.Item
          label='POST 文档类型'
          name='docType'
          validateTrigger='onSubmit'>
          <Select placeholder=''>
            {postOptions.map((option) => (
              <Option key={option.value} value={option.value}>
                {option.label}
              </Option>
            ))}
          </Select>
        </Form.Item>

        <Row justify='space-between'>
          <Col span={24}>
            <Form.Item
              label='响应码'
              name='resCode'
              validateTrigger='onSubmit'
              extra={
                <Extra>
                  请选择SUBHOOK回调响应码，如您的回调借口响应码范围与您选择的响应码范围不符，
                  SUBHOOK会判断失败重推，一般会递增时间重推，最大重试次数为6次。
                </Extra>
              }>
              <Radio.Group options={resCodeOptions} />
            </Form.Item>
          </Col>
        </Row>
        <Form.Item
          label='回调URL'
          name='URL'
          validateTrigger='onSubmit'
          extra={<Extra>请输入回调URL，用于接收SUBHOOK事件推送</Extra>}>
          <Input placeholder='http://' />
        </Form.Item>
      </Form>
    </Modal>
  )
}
export default forwardRef(Dialog)
