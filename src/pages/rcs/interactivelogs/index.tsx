import { useState, useEffect, useRef } from 'react'
import { usePoint } from '@/hooks'
import { Outlet, useNavigate, NavLink } from 'react-router-dom'
import {
  Flex,
  Table,
  Button,
  Divider,
  Image,
  DatePicker,
  Form,
  Select,
  Input,
  App,
  Space,
} from 'antd'
import type { GetProps } from 'antd'
import type { ColumnsType } from 'antd/es/table'
import ACopy from '@/components/aCopy'
import AExport from '@/components/aExport'
import PageContent from '@/components/pageContent'
import SeeModal from '@/pages/rcs/template/seeModal'

import { exportRcsChatbotLogs, getRcsChatbotLogs } from '@/api'
import { API } from 'apis'

import { useAppSelector } from '@/store/hook'
import { settingRcs } from '@/store/reducers/settingRcs'
import dayjs from 'dayjs'
import { downloadFile } from '@/utils'
import { getPresets } from '@/utils/day'
import {
  exportItems,
  searchType,
  EnumSearchTypeTxt,
  EnumSearchTypeColor,
} from './type'

import faceImg from '@/assets/rcs/face/interactivelogs.png'

import './index.scss'

const { RangePicker } = DatePicker
type RangePickerProps = GetProps<typeof DatePicker.RangePicker>
interface DataType extends API.GetRcsChatbotLogsItem {}

// 可选范围【无-今天】
const disabledDate: RangePickerProps['disabledDate'] = (current) => {
  const today = dayjs()
  // const fifteenDaysAgo = today.subtract(90, 'day')
  const currentDate = dayjs(current)
  // return currentDate.isBefore(fifteenDaysAgo) || currentDate.isAfter(today)
  return currentDate.isAfter(today)
}
// 预设日期
const rangePresets = getPresets([0, 1, 3, 7, 15, 30, 90])

export default function Fn() {
  const pointXs = usePoint('xs')
  const nav = useNavigate()
  const { message } = App.useApp()
  const rcsSetting = useAppSelector(settingRcs)
  const [form] = Form.useForm()

  const [loading, setLoading] = useState(false)
  const [page, setPage] = useState<number>(1)
  const [limit, setLimit] = useState<number>(10)
  const [total, setTotal] = useState<number>(0)
  const [tableData, setTableData] = useState<DataType[]>()

  // 获取任务发送报告
  const getList = async () => {
    setLoading(true)
    try {
      const fromValues = await form.getFieldsValue()
      const start = fromValues.time[0].format('YYYY-MM-DD')
      const end = fromValues.time[1].format('YYYY-MM-DD')
      let params = {
        start,
        end,
        type: fromValues.type,
        mobile: fromValues.mobile,
        keyword: fromValues.keyword,
        page: page,
        limit: limit,
      }

      const res = await getRcsChatbotLogs(params)
      setTableData(res.data)
      setTotal(res.rows)
      setLoading(false)
    } catch (error) {
      setLoading(false)
    }
  }

  const changePageInfo = (page, pageSize) => {
    setPage(page)
    setLimit(pageSize)
  }

  // 除搜索关键字，其他字段改变直接搜索
  const onValuesChange = (changedValues, allValues) => {
    let changeKey = Object.keys(changedValues)[0]
    if (!['keyword', 'mobile'].includes(changeKey)) {
      if (page == 1) {
        getList()
      } else {
        setPage(1)
      }
    }
  }

  const search = () => {
    setLoading(true)
    if (page == 1) {
      getList()
    } else {
      setPage(1)
    }
  }

  // 导出
  const exportEvent = async (file_type) => {
    const fromValues = await form.getFieldsValue()
    const start = fromValues.time[0].format('YYYY-MM-DD')
    const end = fromValues.time[1].format('YYYY-MM-DD')
    let params = {
      file_type,
      start,
      end,
      type: fromValues.type,
      mobile: fromValues.mobile,
      keyword: fromValues.keyword,
    }
    const res = await exportRcsChatbotLogs(params)
    if (res.status == 'success') {
      downloadFile()
    }
  }

  useEffect(() => {
    getList()
  }, [limit, page])

  const columns: ColumnsType<DataType> = [
    {
      title: '手机号',
      fixed: true,
      width: 140,
      className: 'paddingL20',
      render: (_, record) => (
        <div className='p-r-16 fx-y-center' style={{ minHeight: 40 }}>
          {record.senderAddress}
        </div>
      ),
    },
    {
      title: '交互时间',
      width: 180,
      dataIndex: 'dateTime',
    },
    {
      title: 'Chatbot名称(ID)',
      width: 200,
      render: (_, record) => (
        <Space size={0} align='center' wrap style={{ width: 180 }}>
          <div style={{ position: 'relative' }}>
            <ACopy text={record.chatbot_name} title='点击复制Chatbot名称' />
            {record.chatbot_name}
          </div>
          <NavLink
            target='__blank'
            to={`/console/rcs/chatbot/detail/${record.chatbot}`}
            className='gray-color-sub g-pointer'>
            ({record.chatbot})
          </NavLink>
        </Space>
      ),
    },
    {
      title: '模版',
      width: 260,
      render: (_, record) => (
        <Space size={0} align='center'>
          {record.template_sign ? (
            <>
              <div style={{ position: 'relative', minWidth: 80 }}>
                <ACopy text={record.template_sign} />【{record.template_sign}】
              </div>
              <SeeModal sign={record.template_sign}>
                <div className='g-ellipsis' style={{ maxWidth: 160 }}>
                  {record.template_name}
                </div>
              </SeeModal>
            </>
          ) : (
            <span className='p-l-8'>-</span>
          )}
        </Space>
      ),
    },
    {
      title: '触发规则',
      width: 120,
      render: (_, record) => (
        <div
          className={`w-100 ${EnumSearchTypeColor[record.match_type]}`}
          style={{ position: 'relative' }}>
          {EnumSearchTypeTxt[record.match_type]}
        </div>
      ),
    },
    {
      title: '按钮名称/关键字',
      width: 130,
      render: (_, record) => <div>{record.match_keyword}</div>,
    },
    {
      title: '回复内容',
      width: 180,
      className: 'paddingR20',
      dataIndex: 'bodyText',
    },
    {
      title: '下行模版',
      width: 260,
      render: (_, record) => (
        <Space className='w-100' size={0}>
          {record.replyMessage_sign ? (
            <>
              <div style={{ position: 'relative', minWidth: 80 }}>
                <ACopy text={record.replyMessage_sign} />【
                {record.replyMessage_sign}】
              </div>
              <SeeModal sign={record.replyMessage_sign}>
                <div className='g-ellipsis' style={{ maxWidth: 160 }}>
                  {record.replyMessage_name}
                </div>
              </SeeModal>
            </>
          ) : (
            <span className='p-l-8'>-</span>
          )}
        </Space>
      ),
    },
  ]

  return (
    <PageContent extClass='interactivelogs' xl={'100%'} xxl={'90%'}>
      <Image src={faceImg} preview={false} width={72}></Image>
      <Flex justify='space-between' align='center'>
        <div className='fn22 fw-500'>上行交互日志</div>
        <AExport
          items={exportItems}
          onExportEvent={exportEvent}
          useCode={rcsSetting?.settings?.export_confrim == '1'}
        />
      </Flex>
      <Divider />
      <Form
        form={form}
        className='interactivelogs-form'
        name='interactivelogs'
        layout='vertical'
        autoComplete='off'
        onValuesChange={onValuesChange}
        initialValues={{
          type: 'all',
          time: rangePresets[2].value,
        }}>
        <Flex align='flex-end' wrap='wrap' gap={16}>
          <Form.Item name='type' label='触发规则' className='m-b-0'>
            <Select
              placeholder='触发规则'
              popupMatchSelectWidth={200}
              style={{ width: 200 }}
              suffixIcon={
                <i className='icon iconfont icon-paixu color fn14'></i>
              }
              options={searchType}></Select>
          </Form.Item>
          <Form.Item name='time' label='时间范围' className='m-b-0'>
            <RangePicker
              presets={!pointXs && rangePresets}
              allowClear={false}
              disabledDate={disabledDate}
            />
          </Form.Item>
          <Form.Item
            label='手机号'
            name='mobile'
            style={{ marginBottom: '0px' }}>
            <Input placeholder='请输入' onPressEnter={search} />
          </Form.Item>
          <Form.Item
            label='Chatbot/模版'
            name='keyword'
            style={{ marginBottom: '0px' }}>
            <Input placeholder='请输入' onPressEnter={search} />
          </Form.Item>
          <Form.Item label='' className='m-b-0'>
            <Button
              type='primary'
              className='w-100'
              htmlType='submit'
              onClick={search}>
              查询
            </Button>
          </Form.Item>
        </Flex>

        <Table
          loading={loading}
          className='theme-cell reset-table m-t-24'
          columns={columns}
          dataSource={tableData}
          rowKey={'id'}
          sticky
          pagination={{
            position: ['bottomRight'],
            current: page,
            pageSize: limit,
            showQuickJumper: true,
            pageSizeOptions: [10, 20, 50],
            total: total,
            showTotal: (total) => `共 ${total} 条`,
            onChange: changePageInfo,
          }}
          scroll={{ x: 'fit-content' }}
        />
      </Form>
      <Outlet />
    </PageContent>
  )
}
