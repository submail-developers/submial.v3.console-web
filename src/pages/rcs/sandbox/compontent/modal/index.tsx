import {
  useState,
  useEffect,
  useImperativeHandle,
  forwardRef,
  MutableRefObject,
  useMemo,
} from 'react'
import {
  Modal,
  Flex,
  Input,
  Button,
  Form,
  Select,
  Radio,
  Spin,
  App,
} from 'antd'
import { ProFormDependency } from '@ant-design/pro-components'
import { getRcsTempList, createRcsInteractive } from '@/api'
import { API } from 'apis'
import { debounce } from 'lodash'
import type { Options } from '../../chatbot/config/index'

type Props = {
  onOk: () => void
}

// 选择发送模版弹框
function Fn(props: Props, ref: MutableRefObject<any>) {
  useImperativeHandle(ref, () => {
    return {
      openEvent,
    }
  })
  const { message } = App.useApp()
  const [form] = Form.useForm()
  const [open, setOpen] = useState(false)
  const [title, setTitle] = useState('')
  const [tempLoading, settempLoading] = useState(false)
  const [loading, setLoading] = useState(false)
  const [tempList, setTempList] = useState<API.RcsTempListItem[]>([])
  const [options, setOptions] = useState<Options[]>([])
  const openEvent = ({ initValues, title, options = [] }) => {
    setOpen(true)
    setTitle(title)
    setOptions(options)
    setTimeout(() => {
      if (form) {
        form.resetFields()
        form.setFieldsValue(initValues)
      }
    }, 0)
  }
  const onCancel = () => {
    setOpen(false)
  }
  const submit = async () => {
    const flag = await form.validateFields()
    if (!flag) return

    try {
      setLoading(true)
      const values = await form.getFieldsValue()
      // 有id为编辑，无id为新增；有chatbotId为固定菜单，有card_id为模版的按钮
      const {
        id = '',
        title,
        type,
        reply_id,
        chatbotId,
        card_id,
        button,
        keywords,
        match_type,
      } = values
      let options_item = options.find((item) => item.value == button.value)
      let params = {}
      if (type == '1') {
        params = {
          id,
          title,
          type,
          reply_id,
          chatbotId,
          button_data: options_item?.item
            ? JSON.stringify(options_item?.item)
            : null,
        }
      } else if (type == '2') {
        params = {
          id,
          title,
          type,
          reply_id,
          card_id,
          button_data: options_item?.item
            ? JSON.stringify(options_item?.item)
            : null,
        }
      } else if (type == '3') {
        params = {
          type,
          id,
          chatbotId,
          title,
          keywords,
          match_type,
          reply_id,
        }
      } else {
      }

      const res = await createRcsInteractive(params)
      if (res.status == 'success') {
        message.success('保存成功')
        props.onOk()
        setOpen(false)
        setLoading(false)
      }
    } catch (error) {
      setLoading(false)
    }
  }
  const changeSearchKeys = (val) => {
    setTempList([])
    settempLoading(true)
    debounceGetTemp(val)
  }
  const debounceGetTemp = useMemo(() => {
    const getList = (val: string) => {
      getTempList(val)
    }
    return debounce(getList, 800)
  }, [])
  const getTempList = async (keyword = '') => {
    try {
      const res = await getRcsTempList({
        page: 1,
        limit: 10000,
        status: '1',
        keyword: keyword,
      })
      setTempList(res.list)
      settempLoading(false)
    } catch (error) {}
  }
  useEffect(() => {
    if (open) {
      getTempList()
    }
  }, [open])
  return (
    <Modal
      open={open}
      onCancel={onCancel}
      onOk={submit}
      width={560}
      title={title}
      footer={
        <Flex justify='flex-end' align='center' gap={24}>
          <Button onClick={onCancel}>取消</Button>
          <Button type='primary' onClick={submit} loading={loading}>
            确认
          </Button>
        </Flex>
      }
      destroyOnClose>
      <Form
        form={form}
        validateTrigger='onSubmit'
        name='sandbox-config-form'
        autoComplete='off'
        layout='vertical'>
        <Form.Item name='id' label='id' hidden>
          <Input />
        </Form.Item>
        <Form.Item name='chatbotId' label='chatbotId' hidden>
          <Input />
        </Form.Item>
        <Form.Item name='card_id' label='card_id' hidden>
          <Input />
        </Form.Item>
        <Form.Item
          name='title'
          label='交互名称'
          rules={[
            {
              required: true,
            },
          ]}>
          <Input placeholder='请输入' />
        </Form.Item>

        <Form.Item name='type' label='交互类型' hidden>
          <Radio.Group>
            <Radio value={'1'}>chatbot</Radio>
            <Radio value={'2'}>模版</Radio>
            <Radio value={'3'}>内容</Radio>
          </Radio.Group>
        </Form.Item>
        <ProFormDependency name={['type']}>
          {({ type }) => {
            return (
              <>
                {(type == '1' || type == '2') && (
                  <>
                    <Form.Item
                      name='button'
                      label='选择按键'
                      rules={[
                        {
                          required: true,
                        },
                      ]}>
                      <Select
                        options={options}
                        labelInValue
                        placeholder='请选择'></Select>
                    </Form.Item>
                  </>
                )}
                {type == '3' && (
                  <>
                    <Form.Item
                      name='keywords'
                      label='关键字列表'
                      rules={[
                        {
                          required: true,
                        },
                      ]}
                      extra={
                        <div style={{ marginTop: '8px' }}>
                          请每行输入一个交互关键字，关键字不区分大小写；或使用正则表达式输入多个匹配条件。
                        </div>
                      }>
                      <Input.TextArea
                        placeholder='请输入'
                        autoSize={{ minRows: 4, maxRows: 4 }}
                      />
                    </Form.Item>
                    <Form.Item
                      name='match_type'
                      label='触发规则'
                      initialValue={'1'}
                      rules={[
                        {
                          required: true,
                        },
                      ]}>
                      <Radio.Group>
                        <Radio value={'1'}>全文匹配</Radio>
                        <Radio value={'2'}>关键字包含</Radio>
                        <Radio value={'3'}>正则表达式</Radio>
                      </Radio.Group>
                    </Form.Item>
                  </>
                )}
              </>
            )
          }}
        </ProFormDependency>
        <Form.Item
          name='reply_id'
          label='下行模版'
          rules={[
            {
              required: true,
            },
          ]}>
          <Select
            placeholder='请输入搜索关键词'
            filterOption={false}
            showSearch
            onSearch={changeSearchKeys}
            notFoundContent={tempLoading ? <Spin size='small' /> : null}
            fieldNames={{ label: 'title', value: 'id' }}
            options={tempList}></Select>
        </Form.Item>
      </Form>
    </Modal>
  )
}

export default forwardRef(Fn)
