import { Modal, Form, Input, Space, Button, Flex, FormProps } from 'antd'
import utils from '@/utils/formRules'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import './index.scss'

type Props = {
  open: boolean
  onCancel: () => void
}

// 模版类型
type T = 1 | 2 | 3 | 4

type ListItem = {
  icon: string
  name: string
  des: string
  type: T
}
const list: ListItem[] = [
  {
    icon: 'icon-text',
    name: '纯文本',
    des: '模版类型描述',
    type: 1,
  },
  {
    icon: 'icon-card',
    name: '单卡片',
    des: '模版类型描述',
    type: 2,
  },
  {
    icon: 'icon-cards',
    name: '多卡片',
    des: '模版类型描述',
    type: 3,
  },
]

type FieldType = {
  name?: string // 模版名称
  type?: T // 模版类型
}

const Extra = (props) => {
  return <div style={{ marginTop: '8px' }}>{props.children}</div>
}

// 选择新建-模版消息类型
export default function Fn(props: Props) {
  const nav = useNavigate()
  const [type, setType] = useState<T>(1)
  const [form] = Form.useForm()

  const onFinish: FormProps<FieldType>['onFinish'] = (values) => {
    let path = `/console/rcs/template/create/${
      values.type
    }/0?name=${encodeURIComponent(values.name)}`
    props.onCancel()
    nav(path)
  }

  useEffect(() => {
    if (form && props.open) {
      form.setFieldValue('type', type)
    }
  }, [type, form, props.open])

  return (
    <Modal
      open={props.open}
      onCancel={props.onCancel}
      width={500}
      title='新建5G消息模版'
      footer={null}
      maskClosable={false}
      classNames={{ header: 'modal-header', body: 'modal-body' }}
      wrapClassName='select-rcs-type-modal'
      destroyOnClose>
      <Form
        className='modal-content'
        name='select-rcs-type'
        layout='vertical'
        form={form}
        onFinish={onFinish}
        autoComplete='off'>
        <Form.Item
          name='name'
          label='模版名称'
          rules={[
            { required: true },
            { max: 20 },
            {
              validator: utils.validateEmoji,
            },
            {
              validator: utils.validateDoubleQuotation,
            },
            {
              validator: utils.validateBackslash,
            },
          ]}
          extra={<Extra>不可携带英文双引号、\、emoji，模版名称不能为空</Extra>}>
          <Input />
        </Form.Item>
        <Form.Item name='type' hidden>
          <Input />
        </Form.Item>
        <Form.Item required label='模版类型'>
          {list.map((item) => (
            <div
              className={`fx-between-center type-item ${
                item.type == type ? 'active' : ''
              }`}
              key={item.type}
              onClick={() => setType(item.type)}>
              <Space size={6}>
                <span
                  className={`icon iconfont ${item.icon} fn18 fw-500`}></span>
                <span className='fw-500'>{item.name}</span>
                <span className='des'>{item.des}</span>
              </Space>
              <div>
                <span className='icon iconfont icon-jia fn12 fw-500'></span>
              </div>
            </div>
          ))}
        </Form.Item>
        <Form.Item>
          <Flex justify='flex-end'>
            <Space size={16}>
              <Button
                type='primary'
                onClick={() => props.onCancel()}
                style={{
                  background: '#ECEFF2',
                  color: '#3063F6',
                  minWidth: '100px',
                }}>
                取消
              </Button>
              <Button
                type='primary'
                htmlType='submit'
                style={{ background: '#3063F6', minWidth: '100px' }}>
                下一步
              </Button>
            </Space>
          </Flex>
        </Form.Item>
      </Form>
    </Modal>
  )
}
