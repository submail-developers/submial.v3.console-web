import { useEffect, useState, useRef } from 'react'
import {
  Button,
  Form,
  Input,
  Select,
  Flex,
  Pagination,
  Popconfirm,
  Dropdown,
  Tooltip,
  Space,
  Image,
  Divider,
  Table,
  App,
  Row,
  Col,
  Checkbox,
  Switch,
  DatePicker,
  TimePicker,
} from 'antd'
import type { GetProps } from 'antd'
import { NavLink, useNavigate } from 'react-router-dom'
import faceImg from '@/assets/rcs/face/history.png'
import PageContent from '@/components/pageContent'
import ContactsTabs from './component/contactsTabs'
import dayjs from 'dayjs'
import { usePoint } from '@/hooks'

import { getUsableTalkList } from '@/api'

import './index.scss'
import { API } from 'apis'

const { RangePicker } = DatePicker
type RangePickerProps = GetProps<typeof DatePicker.RangePicker>

const reCall = {
  // 外呼结果 disabled=true不展示
  resOptions: [
    {
      label: '成功',
      value: '0',
      disabled: true,
    },
    {
      label: '无法接通',
      value: '1',
    },
    {
      label: '机器人挂机',
      value: '2',
      disabled: true,
    },
    {
      label: '用户主动挂机',
      value: '3',
      disabled: true,
    },
    {
      label: '呼叫失败',
      value: '4',
      disabled: true,
    },
    {
      label: '关机',
      value: '5',
      disabled: true,
    },
    {
      label: '空号',
      value: '6',
      disabled: true,
    },
    {
      label: '无人接听',
      value: '7',
    },
    {
      label: '停机',
      value: '8',
      disabled: true,
    },
    {
      label: '正在通话中',
      value: '9',
    },
    {
      label: '无法接听',
      value: '10',
    },
    {
      label: '用户拒接',
      value: '11',
      disabled: true,
    },
    {
      label: '超时',
      value: '12',
    },
    {
      label: '线路超频',
      value: '13',
    },
  ],
  // 外呼次数
  numOptions: [
    {
      label: '1次',
      value: '1',
    },
    {
      label: '2次',
      value: '2',
    },
    {
      label: '3次',
      value: '3',
    },
    {
      label: '4次',
      value: '4',
    },
    {
      label: '5次',
      value: '5',
    },
    {
      label: '6次',
      value: '6',
    },
    {
      label: '7次',
      value: '7',
    },
    {
      label: '8次',
      value: '8',
    },
    {
      label: '9次',
      value: '9',
    },
    {
      label: '10次',
      value: '10',
    },
  ],
  // 间隔时间 单位毫秒
  timesOptions: [
    {
      label: '立即',
      value: 1000,
    },
    {
      label: '15分钟',
      value: 900000,
    },
    {
      label: '30分钟',
      value: 900000 * 2,
    },
    {
      label: '45分钟',
      value: 900000 * 3,
    },
    {
      label: '60分钟',
      value: 900000 * 4,
    },
    {
      label: '120分钟',
      value: 900000 * 8,
    },
    {
      label: '180分钟',
      value: 900000 * 12,
    },
  ],
}

// 可选范围【无-今天】
const disabledDate: RangePickerProps['disabledDate'] = (current) => {
  const today = dayjs().subtract(1, 'day')
  // const fifteenDaysAgo = today.subtract(90, 'day')
  const currentDate = dayjs(current)
  // return currentDate.isBefore(fifteenDaysAgo) || currentDate.isAfter(today)
  return currentDate.isBefore(today)
}

// 只允许选择早上8-12点
const disabledStartTime = () => {
  return {
    disabledHours: () => [
      ...Array.from({ length: 8 }, (_, i) => i),
      ...Array.from({ length: 12 }, (_, i) => i + 12),
    ],
    disabledMinutes: () => [],
    disabledSeconds: () => [],
  }
}
// 只允许选择上午12点-晚上9点
const disabledEndTime = () => {
  return {
    disabledHours: () => [
      ...Array.from({ length: 12 }, (_, i) => i),
      ...Array.from({ length: 3 }, (_, i) => i + 21),
    ],
    disabledMinutes: () => [],
    disabledSeconds: () => [],
  }
}

// 获取当前日期
const today = dayjs().startOf('day')

// 定义 start 和 end 时间
const work_start_0 = today.set('hour', 9).set('minute', 0).set('second', 0)
const work_start_1 = today.set('hour', 11).set('minute', 59).set('second', 59)
const work_end_0 = today.set('hour', 13).set('minute', 0).set('second', 0)
const work_end_1 = today.set('hour', 17).set('minute', 0).set('second', 0)

// 初始化表单数据
const initialValues = {
  work_morning_times: [work_start_0, work_start_1],
  work_afternoon_times: [work_end_0, work_end_1],
}

export default function Fn() {
  const pointXl = usePoint('xl')
  const [form] = Form.useForm()
  const nav = useNavigate()
  const tabsRef = useRef(null) // 添加联系人tab
  const [varsKeys, setVarsKeys] = useState<string[]>([]) // 模版的参数
  const [usableTalkList, setusableTalkList] = useState<API.UsableTalkItem[]>([]) // 话术列表

  // 获取话术列表
  const initTalkOptions = async () => {
    try {
      const res = await getUsableTalkList()
      if (res.status == 'success') {
        setusableTalkList(res.data)
      }
    } catch (error) {}
  }

  useEffect(() => {
    initTalkOptions()
  }, [])

  return (
    <PageContent extClass='voiceChatbot-call-create'>
      <Image src={faceImg} preview={false} width={72}></Image>
      <Flex justify='space-between' align='center'>
        <div className='fn22 fw-500'>创建外呼任务</div>
        <Button onClick={() => nav(-1)} type='primary'>
          返回列表
        </Button>
      </Flex>
      <Divider />
      <Form
        name='setting-add-mob'
        form={form}
        layout='vertical'
        validateTrigger='onSubmit'
        initialValues={initialValues}
        autoComplete='off'>
        <Row gutter={[24, 0]} className='m-t-24'>
          <Col span={24}>
            <Flex align='center'>
              <div className='color-btn g-radius-50 step-number fx-center-center color fn16'>
                1
              </div>
              <span className='fw-500 m-l-8 fn16'>任务</span>
            </Flex>
          </Col>
          <Col span={24}>
            <Divider className='m-y-16' />
          </Col>
          <Col span={24} xl={12}>
            <Form.Item
              label='任务名称'
              name='name'
              validateTrigger='onBlur'
              rules={[
                {
                  required: true,
                },
                {
                  pattern: /^[\u4e00-\u9fa5a-zA-Z0-9_-]+$/,
                  message: '任务名称只能包含汉字、字母、数字、下划线和短横线',
                },
              ]}>
              <Input placeholder='请输入' />
            </Form.Item>
          </Col>
          <Col span={24} xl={12}>
            <Form.Item
              name='speechSkillId'
              label='话术选择'
              rules={[
                {
                  required: true,
                },
              ]}>
              <Select
                placeholder='请选择'
                options={usableTalkList}
                fieldNames={{ label: 'name', value: 'id' }}></Select>
            </Form.Item>
          </Col>

          <Col span={24}>
            <Flex align='center'>
              <div className='color-btn g-radius-50 step-number fx-center-center color fn16'>
                2
              </div>
              <span className='fw-500 m-l-8 fn16'>外呼设置</span>
            </Flex>
          </Col>
          <Col span={24}>
            <Divider className='m-y-16' />
          </Col>
          <Col span={24} xl={12}>
            <Form.Item name='results' label='未接通再次外呼'>
              <Select
                mode='multiple'
                placeholder='外呼结果（多选）'
                options={reCall.resOptions.filter(
                  (item) => !item.disabled,
                )}></Select>
            </Form.Item>
          </Col>
          <Col span={12} xl={6}>
            <Form.Item name='maxTimes' label={pointXl ? ' ' : ''}>
              <Select
                placeholder='外呼次数'
                options={reCall.numOptions}></Select>
            </Form.Item>
          </Col>
          <Col span={12} xl={6}>
            <Form.Item name='interval' label={pointXl ? ' ' : ''}>
              <Select
                placeholder='外呼间隔时间'
                options={reCall.timesOptions}></Select>
            </Form.Item>
          </Col>
          <Col span={24} xl={12} xxl={6}>
            <Form.Item name='smsIntentions' label='挂机短信'>
              <Checkbox.Group
                options={[
                  { label: 'A', value: 'A' },
                  { label: 'B', value: 'B' },
                  { label: 'C', value: 'C' },
                  { label: 'D', value: 'D' },
                ]}
              />
            </Form.Item>
          </Col>
          <Col span={24} xl={12} xxl={6}>
            <Form.Item name='smsTemplate' label='挂机短信模版'>
              <Select placeholder='请选择' options={[]}></Select>
            </Form.Item>
          </Col>
          <Col span={24} xl={12}>
            <Form.Item
              name='life_times'
              label='预设时间'
              rules={[
                {
                  required: true,
                },
              ]}>
              <RangePicker
                allowClear={false}
                className='w-100'
                placeholder={['预设开始时间', '预设结束时间']}
                showTime
                showNow
                disabledDate={disabledDate}
              />
            </Form.Item>
          </Col>
          <Col span={24} xl={12} xxl={6}>
            <Form.Item name='work_morning_times' label='机器人工作时间'>
              <TimePicker.RangePicker
                allowClear={false}
                className='w-100'
                disabledTime={disabledStartTime}
                use12Hours
              />
            </Form.Item>
          </Col>
          <Col span={24} xl={12} xxl={6}>
            <Form.Item name='work_afternoon_times' label={pointXl ? ' ' : ''}>
              <TimePicker.RangePicker
                allowClear={false}
                className='w-100'
                disabledTime={disabledEndTime}
                use12Hours
              />
            </Form.Item>
          </Col>
          <Col span={24} xl={12}>
            <Form.Item name='skipHolidays' label='是否跳过节假日'>
              <Switch />
            </Form.Item>
          </Col>
        </Row>
      </Form>
      <Row gutter={[24, 0]}>
        <Col span={24}>
          <Flex align='center'>
            <div className='color-btn g-radius-50 step-number fx-center-center color fn16'>
              3
            </div>
            <span className='fw-500 m-l-8 fn16'>添加联系人</span>
          </Flex>
        </Col>
        <Col span={24}>
          <Divider className='m-y-16' />
        </Col>
        <Col span={24}>
          <ContactsTabs vars={varsKeys} ref={tabsRef} />
        </Col>

        <Col span={24}>
          <Flex justify='flex-end' className='m-t-32'>
            <Button
              type='primary'
              icon={<span className='icon iconfont icon-fasong'></span>}>
              提交外呼任务
            </Button>
          </Flex>
        </Col>
      </Row>
    </PageContent>
  )
}
