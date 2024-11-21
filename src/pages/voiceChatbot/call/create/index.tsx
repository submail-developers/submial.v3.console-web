import { useEffect, useState, useRef, useMemo } from 'react'
import {
  Button,
  Form,
  Input,
  Select,
  Flex,
  Image,
  Divider,
  App,
  Row,
  Col,
  Checkbox,
  Switch,
  DatePicker,
  TimePicker,
  Popconfirm,
  Spin,
  Space,
  Radio,
} from 'antd'
import { ProFormDependency } from '@ant-design/pro-components'
import type { GetProps } from 'antd'
import { NavLink, useNavigate } from 'react-router-dom'
import faceImg from '@/assets/voiceChatbot/face/call.png'
import PageContent from '@/components/pageContent'
import ContactsTabs from './component/contactsTabs'
import dayjs from 'dayjs'
import { usePoint } from '@/hooks'
import { debounce } from 'lodash'

import {
  getUsableTalkList,
  getVCSendNumber,
  createVCTask,
  getSmsTempList,
  changeVCTaskStatus,
} from '@/api'

import { reCall } from '../type'

import './index.scss'
import { API } from 'apis'

const { RangePicker } = DatePicker
const Option = Select.Option
type RangePickerProps = GetProps<typeof DatePicker.RangePicker>

// 可选范围【无-今天】
const disabledDate: RangePickerProps['disabledDate'] = (current) => {
  const today = dayjs().subtract(1, 'day')
  // const fifteenDaysAgo = today.subtract(90, 'day')
  const currentDate = dayjs(current).subtract(1, 'hour')
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

// 只能选择当前时间1-72小时以内的时间
const validateRange = (_, value) => {
  const startTime = value[0]
  if (startTime) {
    if (
      startTime.valueOf() >= dayjs().add(72, 'hour').valueOf() ||
      startTime.valueOf() <= dayjs().add(50, 'minute').valueOf()
    ) {
      return Promise.reject(new Error('预设开始时间范围：当前时间1-72小时以内'))
    }
  }
  return Promise.resolve()
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
  life_start_type: 1,
}

export default function Fn() {
  const { message } = App.useApp()
  const pointXl = usePoint('xl')
  const [form] = Form.useForm()
  const nav = useNavigate()
  const tabsRef = useRef(null) // 添加联系人tab
  const [varsKeys, setVarsKeys] = useState<string[]>([]) // 模版的参数
  const [usableTalkList, setusableTalkList] = useState<API.UsableTalkItem[]>([]) // 话术列表

  const [sendNum, setSendNum] = useState(0) // 发送数量
  const [openConfirm, setOpenConfirm] = useState(false) // 显示数量弹框
  const [confirmLoading, setConfirmLoading] = useState(false) // 数量弹框-确定的loading
  const [sendNumLoading, setSendNumLoading] = useState(false) // 获取数量弹框的loading
  const [tempLoading, settempLoading] = useState(false)
  const [tempList, setTempList] = useState([])

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

  const getTempList = async (keywords = '') => {
    try {
      const res = await getSmsTempList({
        page: 1,
        tag: 'all',
        status: '1',
        order_by: 'update',
        search_type: 'all',
        keywords: keywords,
      })
      if (res.status == 'success') {
        setTempList(res.templates)
      }
    } catch (error) {}
  }

  // 获取话术列表
  const initTalkOptions = async () => {
    try {
      const res = await getUsableTalkList()
      if (res.status == 'success') {
        setusableTalkList(res.data)
      }
    } catch (error) {}
  }

  // 获取发送数量
  const getSendNum = async (open) => {
    if (open) {
      try {
        await form.validateFields()
        setSendNumLoading(true)
        const { address_data, addressmod, addressfile_oss_path } =
          await tabsRef.current.getValues()
        let flag = false
        switch (addressmod) {
          case 'addressbook':
          case 'parent_addressbook':
            if (address_data.length == 0) {
              message.warning('请选择地址簿')
              flag = true
            }
            break
          case 'file':
            if (address_data.length == 0) {
              message.warning('请上传文件')
              flag = true
            }
            break
          case 'input':
          case 'paste':
            if (!address_data || address_data.length == 0) {
              message.warning('请输入手机号')
              flag = true
            }
            break
        }
        if (flag) {
          setSendNumLoading(false)
          setOpenConfirm(false)
          return
        }
        const res = await getVCSendNumber({
          address_data:
            typeof address_data == 'string'
              ? address_data
              : JSON.stringify(address_data),
          addressmod,
        })
        setSendNum(Number(res.price || 0))
        let timer = setTimeout(() => {
          setSendNumLoading(false)
          clearTimeout(timer)
        }, 500)
        setOpenConfirm(true)
      } catch (error) {
        console.log(error)
        setSendNumLoading(false)
      }
    }
  }

  const submit = async () => {
    try {
      const values = await form.validateFields()
      const {
        address_data,
        addressmod,
        addressfile_oss_path = '',
      } = await tabsRef.current.getValues()
      setConfirmLoading(true)
      let {
        life_start,
        life_start_type,
        life_end,
        work_morning_times,
        work_afternoon_times,
      } = values
      let ifCurrentStart = true // 判断是否立即启动任务，默认立即启动
      if (life_start_type == 1) {
        life_start = dayjs().format('YYYY-MM-DD HH:mm:ss')
      } else {
        // 非当天的任务
        if (dayjs().format('YYYY-MM-DD') != life_start.format('YYYY-MM-DD')) {
          ifCurrentStart = false
        }
        life_start = dayjs(life_start).format('YYYY-MM-DD HH:mm:ss')
      }
      life_end = life_end.format('YYYY-MM-DD') + ' 23:59:59'
      const work_morning_start = dayjs(work_morning_times[0]).format('HH:mm:ss')
      const work_morning_end = dayjs(work_morning_times[1]).format('HH:mm:ss')
      const work_afternoon_start = dayjs(work_afternoon_times[0]).format(
        'HH:mm:ss',
      )
      const work_afternoon_end = dayjs(work_afternoon_times[1]).format(
        'HH:mm:ss',
      )
      let params = {
        title: values.title,
        life_start: life_start,
        life_end: life_end,
        work_morning_start: work_morning_start,
        work_morning_end: work_morning_end,
        work_afternoon_start: work_afternoon_start,
        work_afternoon_end: work_afternoon_end,
        speechSkillId: values.speechSkillId,
        maxTimes: values.maxTimes,
        interval: values.interval,
        results: values.results?.join(',') || '',
        skipHolidays: values.skipHolidays ? 'true' : 'false',
        smsIntentions: values.smsIntentions?.join(',') || '',
        smsTemplate: values.smsTemplate,
        address_data:
          typeof address_data == 'string'
            ? address_data
            : JSON.stringify(address_data),
        addressmod,
        addressfile_oss_path,
      }
      const res = await createVCTask(params)
      // 创建成功，直接将状态改为正在执行
      if (res.status == 'success') {
        if (ifCurrentStart) {
          await changeVCTaskStatus({ sendlist: res.id, status: '2' })
        }
        setConfirmLoading(false)
        message.success('创建成功')
        nav('/console/voiceChatbot/call/index', {
          replace: true,
        })
      }
    } catch (error) {
      setConfirmLoading(false)
      console.error(error)
    }
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
        name='create-vc-task'
        form={form}
        layout='vertical'
        validateTrigger='onChange'
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
              name='title'
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
          <Col span={24}>
            <Form.Item name='smsIntentions' label='挂机短信（意向客户）'>
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

          <ProFormDependency name={['smsIntentions']}>
            {({ smsIntentions }) => {
              return (
                <Col span={24} xl={12} xxl={6}>
                  <Form.Item name='smsTemplate' label='挂机短信模版'>
                    <Select
                      disabled={!(smsIntentions && smsIntentions.length > 0)}
                      placeholder='请输入关键词搜索短信模版'
                      filterOption={false}
                      showSearch
                      onSearch={changeSearchKeys}
                      notFoundContent={
                        tempLoading ? <Spin size='small' /> : null
                      }>
                      {tempList.map((item) => (
                        <Option
                          key={item.sign}
                          value={item.sign}
                          title={`模版内容：${item.signature}${item.message}`}>
                          {item.title || ''}
                          {item.signature}
                          {item.message}
                        </Option>
                      ))}
                    </Select>
                  </Form.Item>
                </Col>
              )
            }}
          </ProFormDependency>
          <Col span={24}>
            <Flex align='flex-end' wrap>
              <Form.Item
                name='life_start_type'
                label='预设开始时间'
                rules={[
                  {
                    required: true,
                  },
                ]}>
                <Radio.Group>
                  <Radio value={1}>立即开始</Radio>
                  <Radio value={2}>自定义时间</Radio>
                </Radio.Group>
              </Form.Item>
              <ProFormDependency name={['life_start_type']}>
                {({ life_start_type }) => {
                  return (
                    <>
                      {life_start_type == 1 ? (
                        <></>
                      ) : (
                        <Form.Item
                          name='life_start'
                          label=''
                          rules={[
                            {
                              required: true,
                            },
                          ]}>
                          <DatePicker
                            style={{ width: 180 }}
                            placeholder='预设开始时间'
                            disabledDate={disabledDate}
                          />
                        </Form.Item>
                      )}
                    </>
                  )
                }}
              </ProFormDependency>
            </Flex>
          </Col>
          <Col span={24}>
            <Form.Item
              name='life_end'
              label='预设结束时间'
              rules={[
                {
                  required: true,
                },
              ]}>
              <DatePicker
                placeholder='预设结束时间'
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
          <Col span={24}>
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
            <Popconfirm
              title='此次外呼任务'
              description={
                <div>
                  预扣费：
                  {Number(sendNum).toLocaleString()}元
                </div>
              }
              open={openConfirm}
              onConfirm={submit}
              onOpenChange={getSendNum}
              okButtonProps={{ loading: confirmLoading }}
              trigger='click'
              onCancel={() => {
                setConfirmLoading(false)
                setOpenConfirm(false)
              }}
              overlayStyle={{ minWidth: 320 }}>
              <Button type='primary' loading={sendNumLoading}>
                提交外呼任务
              </Button>
            </Popconfirm>
          </Flex>
        </Col>
      </Row>
    </PageContent>
  )
}
