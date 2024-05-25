import { useState, useImperativeHandle, forwardRef, useEffect } from 'react'
import {
  Modal,
  Form,
  App,
  Row,
  Col,
  Input,
  Select,
  DatePicker,
  Space,
  TimePicker,
  InputNumber,
} from 'antd'
import type { TimePickerProps, DatePickerProps } from 'antd'
import { ProFormDependency } from '@ant-design/pro-components'

import { API } from 'apis'
import './editSecDialog.scss'

interface Props {
  open: boolean
  onCancel: () => void
}
interface OpenParams {}
interface InitOpen {
  isAdd: boolean
}

const Dialog = (props: Props, ref: any) => {
  const [form] = Form.useForm()
  const [isAdd, setisAdd] = useState<boolean>(true)
  const onChange: DatePickerProps['onChange'] = (date, dateString) => {
    console.log(date, dateString)
  }
  const { Option } = Select
  type PickerType = 'time' | 'date'
  const PickerWithType = ({
    type,
    onChange,
  }: {
    type: PickerType
    onChange: TimePickerProps['onChange'] | DatePickerProps['onChange']
  }) => {
    if (type === 'time') return <TimePicker onChange={onChange} />
    if (type === 'date') return <DatePicker onChange={onChange} />
    return <DatePicker picker={type} onChange={onChange} />
  }

  const [type, setType] = useState<PickerType>('time')
  const [isModalOpen, setIsModalOpen] = useState(false)

  const open = (initValues: InitOpen) => {
    const { isAdd } = initValues
    setisAdd(isAdd)
    setIsModalOpen(true)
  }

  const handleOk = async () => {}

  const handleCancel = () => {
    props.onCancel()
  }

  useImperativeHandle(ref, () => {
    return {
      open,
    }
  })

  useEffect(() => {
    if (open && form) {
      form.resetFields()
    }
  }, [open, form])
  const onFinish = () => {}
  const onFinishFailed = () => {}

  const secOptions = [
    {
      value: '1',
      label: '回复事件',
    },
    {
      value: '2',
      label: '交互事件',
    },
  ]
  const detailEventData = [
    {
      value: '3',
      label: '链接事件',
    },
    {
      value: '4',
      label: '拨号事件',
    },
    {
      value: '5',
      label: '地图事件',
    },
    {
      value: '6',
      label: '日历事件',
    },
  ]
  const mapFatData = [
    {
      value: '1',
      label: '显示指定地图位置',
    },
    {
      value: '2',
      label: '发送地理位置到Chatbot',
    },
  ]

  const changemeanType = (value) => {
    if (value == 2) {
      form.setFieldValue('detailEvent', '3')
    }
  }

  return (
    <Modal
      open={props.open}
      onCancel={props.onCancel}
      title={isAdd ? '新增二级菜单事件' : '编辑二级菜单事件'}
      width={480}
      style={{ top: 240 }}
      data-class='chose-secEditDialog'
      closable={false}
      destroyOnClose
      wrapClassName='modal-reset'>
      <Form
        name='form-01'
        form={form}
        labelCol={{ span: 8 }}
        wrapperCol={{ span: 24 }}
        layout='vertical'
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        autoComplete='off'>
        <Row gutter={24}>
          <Col span={24}>
            <Form.Item label='二级菜单标题' name='mean-title'>
              <Input
                placeholder='请设置该菜单的标题文本'
                value='二级菜单标题'
              />
            </Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item label='菜单类型' name='meanType'>
              <Select
                placeholder='请选择'
                optionFilterProp='children'
                filterOption={(input, option) =>
                  (option?.label ?? '')
                    .toLowerCase()
                    .includes(input.toLowerCase())
                }
                options={secOptions}
                onChange={changemeanType}
              />
            </Form.Item>
          </Col>

          <ProFormDependency name={['meanType']}>
            {({ meanType }) => {
              return (
                <>
                  <Col span={24}>
                    <Form.Item
                      hidden={meanType != '1'}
                      label='回复事件'
                      name='huifu'
                      required>
                      <Input placeholder='请设置该菜单的回复文本' />
                    </Form.Item>

                    <Form.Item
                      hidden={meanType != '2'}
                      label='详细事件'
                      validateTrigger='onSubmit'
                      name='detailEvent'>
                      <Select
                        placeholder='请选择'
                        optionFilterProp='children'
                        fieldNames={{ label: 'label', value: 'value' }}
                        filterOption={(input, option) =>
                          (option?.label + option.value ?? '')
                            .toLowerCase()
                            .includes(input.toLowerCase())
                        }
                        options={detailEventData}
                      />
                    </Form.Item>
                  </Col>

                  <ProFormDependency name={['detailEvent']}>
                    {({ detailEvent }) => {
                      return (
                        <>
                          <Col span={24}>
                            <Form.Item
                              hidden={detailEvent != '3' || meanType != '2'}
                              label='链接url'
                              name='url'
                              validateTrigger='onSubmit'>
                              <Input placeholder='请输入链接' />
                            </Form.Item>

                            <Form.Item
                              hidden={detailEvent != '4' || meanType != '2'}
                              label='被叫号码'
                              name='mob'>
                              <Input placeholder='请输入手机号码' />
                            </Form.Item>

                            {/* 地图事件 */}
                            <Form.Item
                              hidden={detailEvent != '5' || meanType != '2'}
                              label='地图方式'
                              validateTrigger='onSubmit'
                              name='mapFa'>
                              <Select
                                placeholder='请选择'
                                optionFilterProp='children'
                                defaultValue={mapFatData[0]}
                                fieldNames={{
                                  label: 'label',
                                  value: 'value',
                                }}
                                filterOption={(input, option) =>
                                  (option?.label + option.value ?? '')
                                    .toLowerCase()
                                    .includes(input.toLowerCase())
                                }
                                options={mapFatData}
                              />
                            </Form.Item>
                            <Form.Item
                              hidden={detailEvent != '5' || meanType != '2'}
                              label='地图标签'
                              name='mobTip'>
                              <Input placeholder='请输入地图标签' />
                            </Form.Item>
                            <Form.Item
                              hidden={detailEvent != '5' || meanType != '2'}
                              label='经度'
                              name='jingdu'>
                              <Input placeholder='请输入经度' />
                            </Form.Item>

                            <Form.Item
                              hidden={detailEvent != '5' || meanType != '2'}
                              label='纬度'
                              name='weidu'>
                              <Input placeholder='请输入纬度' />
                            </Form.Item>

                            {/*日历事件  */}
                            <Form.Item
                              hidden={detailEvent != '6' || meanType != '2'}
                              label='日历名称'
                              validateTrigger='onSubmit'
                              name='date'>
                              <div className='startTimeCont'>
                                <label>开始时间</label>
                                <Space direction='vertical'>
                                  <DatePicker onChange={onChange} />
                                </Space>
                                <Space>
                                  <PickerWithType
                                    type={type}
                                    onChange={(value) => console.log(value)}
                                  />
                                </Space>
                              </div>

                              <div className='endTimeCont'>
                                <label>结束时间</label>
                                <Space direction='vertical'>
                                  <DatePicker onChange={onChange} />
                                </Space>
                                <Space>
                                  <PickerWithType
                                    type={type}
                                    onChange={(value) => console.log(value)}
                                  />
                                </Space>
                              </div>
                            </Form.Item>
                          </Col>
                        </>
                      )
                    }}
                  </ProFormDependency>
                </>
              )
            }}
          </ProFormDependency>
        </Row>
      </Form>
    </Modal>
  )
}
export default forwardRef(Dialog)
