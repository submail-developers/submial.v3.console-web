import React, { useEffect, forwardRef, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Modal, Form, App, Input, DatePicker, Select, Radio, Flex } from 'antd'
import { ProFormDependency } from '@ant-design/pro-components'
import type { GetProps } from 'antd'
import dayjs from 'dayjs'
import {
  reCreateVCTask,
  getRecallMobileNumber,
  changeVCTaskStatus,
} from '@/api'
import { useStateStore } from '../reducer'
import { reCall } from '../../type'
import { cloneDeep } from 'lodash'

interface Props {
  open: boolean
  onCancel: () => void
}
const { RangePicker } = DatePicker

type RangePickerProps = GetProps<typeof DatePicker.RangePicker>

// 可选范围【无-今天】
const disabledDate: RangePickerProps['disabledDate'] = (current) => {
  const today = dayjs().subtract(1, 'day')
  // const fifteenDaysAgo = today.subtract(90, 'day')
  const currentDate = dayjs(current).subtract(1, 'hour')
  // return currentDate.isBefore(fifteenDaysAgo) || currentDate.isAfter(today)
  return currentDate.isBefore(today)
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

export default function Fn(props: Props) {
  const { id } = useParams()
  const store = useStateStore()
  const [form] = Form.useForm()
  const nav = useNavigate()
  const { message } = App.useApp()
  const [loading, setLoading] = useState(false)
  const [options, setOptions] = useState([])

  const getNumbers = async () => {
    try {
      const res = await getRecallMobileNumber({
        sendlist: id,
      })
      if (res.status == 'success') {
        const _data = [
          {
            call_result: `99`,
            cnt: res.outband_num || 0,
          },
        ]
        setOptions((pres) => {
          return pres.map((item) => {
            let obj = [...res.data, ..._data].find(
              (im) => im.call_result == item.value,
            )
            if (obj && obj.cnt > 0) {
              item.disabled = false
              item.label = `${item.label}(${obj.cnt})`
            } else {
              item.label = `${item.label}(0)`
              item.disabled = true
            }
            return item
          })
        })
      }
    } catch (error) {}
  }

  useEffect(() => {
    if (props.open && store.detail) {
      getNumbers()
      setOptions(
        cloneDeep([
          { label: '未外呼', value: '99', disabled: true },
          ...reCall.resOptions,
        ])
          .filter((item) => item.value != '0')
          .map((item) => {
            item.disabled = true
            return item
          }),
      )
      form.resetFields()
      form.setFieldValue('title', `${store.detail.title}-重呼`)
    }
  }, [props.open, store.detail])

  const handleOk = async () => {
    setLoading(true)
    try {
      let { title, life_start_type, life_start, life_end, call_results } =
        await form.validateFields()
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
      if (dayjs(life_end).isBefore(dayjs(life_start))) {
        setLoading(false)
        form.setFields([
          {
            name: 'life_end',
            errors: ['预设重呼结束时间应在预设重呼开始时间之后'],
          },
        ])
        return
      }
      const res = await reCreateVCTask({
        title,
        life_start,
        life_end,
        sendlist: id,
        call_results: call_results.join(','),
      })
      setLoading(false)
      if (res.status == 'success') {
        if (ifCurrentStart) {
          await changeVCTaskStatus({ sendlist: res.id, status: '2' })
        }
        message.success({
          content: (
            <span>
              创建成功，
              <a
                href={`/console/voiceChatbot/call/detail/${res.id}/info`}
                className='color pointer-color'>
                查看任务详情
              </a>
            </span>
          ),
          duration: 5,
        })
        props.onCancel()
      }
    } catch (error) {
      setLoading(false)
    }
  }

  return (
    <Modal
      open={props.open}
      onCancel={props.onCancel}
      title='一键重呼'
      onOk={handleOk}
      confirmLoading={loading}
      width={600}
      data-class='create-recall'
      closable={false}
      maskClosable={false}
      wrapClassName='modal-create-recall'>
      <Form
        name='form-create-recall'
        form={form}
        labelCol={{ span: 24 }}
        wrapperCol={{ span: 24 }}
        layout='vertical'
        initialValues={{
          recognitionModel: 'general',
          type: 1,
          life_start_type: 1,
        }}
        validateTrigger='onSubmit'
        autoComplete='off'>
        <Form.Item
          label='任务名称'
          name='title'
          rules={[
            {
              required: true,
            },
            {
              pattern: /^[\u4e00-\u9fa5a-zA-Z0-9_-]+$/,
              message: '任务名称只能包含汉字、字母、数字、下划线和短横线',
            },
          ]}>
          <Input placeholder='请输入' autoFocus />
        </Form.Item>
        <Flex align='flex-end' wrap>
          <Form.Item
            name='life_start_type'
            label='预设重呼开始时间'
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
                        placeholder='预设重呼开始时间'
                        disabledDate={disabledDate}
                      />
                    </Form.Item>
                  )}
                </>
              )
            }}
          </ProFormDependency>
        </Flex>
        <Form.Item
          name='life_end'
          label='预设重呼结束时间'
          rules={[
            {
              required: true,
            },
          ]}>
          <DatePicker
            style={{ width: 180 }}
            placeholder='预设重呼结束时间'
            disabledDate={disabledDate}
          />
        </Form.Item>
        {/* <Form.Item
          name='life_times'
          label='预设时间'
          rules={[
            {
              required: true,
            },
            {
              validator: validateRange,
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
        </Form.Item> */}
        <Form.Item
          name='call_results'
          label='重呼类型'
          rules={[
            {
              required: true,
            },
          ]}>
          <Select
            mode='multiple'
            placeholder='外呼结果(号码量)（多选）'
            options={options}></Select>
        </Form.Item>
      </Form>
    </Modal>
  )
}
