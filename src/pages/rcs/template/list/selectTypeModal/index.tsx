import { Modal, Form, Input } from 'antd'
import utils from '@/utils/formRules'

type Props = {
  open: boolean
  onCancel: () => void
}

type ListItem = {
  icon: string
  name: string
  des: string
}
const list: ListItem[] = [
  {
    icon: 'icon-text',
    name: '纯文本',
    des: '模版类型描述',
  },
  {
    icon: 'icon-card',
    name: '单卡片',
    des: '模版类型描述',
  },
  {
    icon: 'icon-cards',
    name: '多卡片',
    des: '模版类型描述',
  },
]

const Extra = (props) => {
  return <div style={{ marginTop: '8px' }}>{props.children}</div>
}
export default function Fn(props: Props) {
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
      <Form className='modal-content' name='select-rcs-type' layout='vertical'>
        <Form.Item
          name='title'
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
          extra={
            <Extra>不可携带英文双引号、\、emoji，Chatbot名称不能为空</Extra>
          }>
          <Input />
        </Form.Item>
        <Form.Item name='type' hidden>
          <Input />
        </Form.Item>
        <Form.Item required label='模版类型'>
          {list.map((item) => (
            <div className='fx-between-center' key={item.name}>
              <div>
                <span className={`icon iconfont ${item.icon}`}></span>
                <span>{item.name}</span>
                <span>{item.des}</span>
              </div>
              <div>+</div>
            </div>
          ))}
        </Form.Item>
      </Form>
    </Modal>
  )
}
