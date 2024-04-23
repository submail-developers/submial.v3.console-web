import { useState, useImperativeHandle, forwardRef } from 'react'
import { Modal, Form, App, Row, Col, Input, Select } from 'antd'
import type { RadioChangeEvent } from 'antd'
import { ProFormDependency } from '@ant-design/pro-components'

import { API } from 'apis'
import './editDialog.scss'

interface Props {
  // onSearch: () => void
}
interface OpenParams {}

const Dialog = ({}: Props, ref: any) => {
  const [form] = Form.useForm()
  interface Props {
    // onSearch: () => void
  }
  interface OpenParams {}

  const { message } = App.useApp()

  useImperativeHandle(ref, () => {
    return {
      open,
    }
  })
  const [isModalOpen, setIsModalOpen] = useState(false)

  const onChange = (e: RadioChangeEvent) => {
    console.log('checked = ', e)
  }

  const open = (params: OpenParams) => {
    setIsModalOpen(true)
  }

  const handleOk = async () => {}

  const handleCancel = () => {
    setIsModalOpen(false)
  }

  const onFinish = () => {}
  const onFinishFailed = () => {}

  const mainOptions = [
    {
      value: '1',
      label: '菜单',
    },
    {
      value: '2',
      label: '回复事件',
    },
    {
      value: '3',
      label: '交互事件',
    },
  ]
  const detailEventData = [
    {
      value: '4',
      label: '链接事件',
    },
    {
      value: '5',
      label: '拨号事件',
    },
    {
      value: '6',
      label: '地图事件',
    },
    {
      value: '7',
      label: '日历事件',
    },
  ]

  return (
    <Modal
      title='编辑主菜单事件'
      width={480}
      style={{ top: 240 }}
      data-class='chose-avatar'
      closable={false}
      onCancel={handleCancel}
      wrapClassName='modal-reset'
      open={isModalOpen}>
      <Form
        name='form-0'
        form={form}
        labelCol={{ span: 8 }}
        wrapperCol={{ span: 24 }}
        layout='vertical'
        initialValues={{ enabled: '1', meanType: '1' }}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        autoComplete='off'>
        <Row gutter={24}>
          <Col span={24}>
            <Form.Item label='菜单标题' name='mean-title'>
              <Input placeholder='请设置该菜单的标题文本' />
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
                options={mainOptions}
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
                      label=''
                      name='account'
                      validateTrigger='onSubmit'></Form.Item>

                    <Form.Item
                      hidden={meanType != '2'}
                      label='回复事件'
                      name='huifu'
                      required>
                      <Input placeholder='请设置该菜单的回复文本' />
                    </Form.Item>

                    <Form.Item
                      hidden={meanType != '3'}
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
                              hidden={detailEvent != '4'}
                              label='链接url'
                              name='url'
                              validateTrigger='onSubmit'>
                              <Input placeholder='请输入链接' />
                            </Form.Item>

                            <Form.Item
                              hidden={detailEvent != '5'}
                              label='被叫号码'
                              name='huifu'>
                              <Input placeholder='请输入手机号码' />
                            </Form.Item>

                            <Form.Item
                              hidden={detailEvent != '6'}
                              label='地图'
                              validateTrigger='onSubmit'
                              name='map'></Form.Item>
                            <Form.Item
                              hidden={detailEvent != '7'}
                              label='日历名称'
                              validateTrigger='onSubmit'
                              name='date'></Form.Item>
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
