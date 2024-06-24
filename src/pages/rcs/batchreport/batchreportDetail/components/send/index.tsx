import { useRef, useState, useImperativeHandle, forwardRef } from 'react'
import { Table, Divider } from 'antd'
import { API } from 'apis'
import { getSendlistLogs } from '@/api'

type Props = {
  id: string
}

enum statusNum {
  '无状态' = 0,
  '成功',
  '失败',
  '已撤回',
}
enum statusStyle {
  'text-color' = 0,
  'success-color',
  'error-color',
  'gray-color',
}

function Fn(props: Props, ref) {
  useImperativeHandle(ref, () => {
    return {
      init,
    }
  })
  const [loading, setLoading] = useState(false)
  const [page, setPage] = useState(1)
  const [limit, setLimit] = useState(10)
  const [total, setTotal] = useState(0)
  const [tableData, setTableData] = useState<API.SendLogItem[]>([])
  const dataRef = useRef<API.SendLogItem[]>([])
  const init = () => {
    setPage(1)
    initData()
  }

  const initData = async () => {
    setLoading(true)
    try {
      const res = await getSendlistLogs({ sendlist: props.id })
      dataRef.current = res.history
      setTotal(Number(res.row))
      changePage(1, 10)
      setLoading(false)
    } catch (error) {
      setLoading(false)
    }
  }

  const changePage = (_page, pageSize) => {
    setPage(_page)
    setTableData(dataRef.current.slice((_page - 1) * limit, _page * limit))
  }

  const columns = [
    {
      title: '手机号',
      fixed: true,
      width: 140,
      className: 'paddingL20',
      render: (_, record) => (
        <div style={{ height: 40 }} className='fx-y-center'>
          {record.to}
        </div>
      ),
    },
    {
      title: '号码详情',
      width: 200,
      render: (_, record) => (
        <div>
          {record.mobileType}/{record.mobileArea}
        </div>
      ),
    },
    {
      title: '模板ID',
      dataIndex: 'sign',
      width: 100,
    },
    {
      title: '发送时间',
      dataIndex: 'send',
      width: 180,
    },
    {
      title: '送达时间',
      dataIndex: 'sent',
      width: 180,
    },
    {
      title: '计费',
      width: 100,
      render: (_, record) => <div>{record.status == '1' ? '1' : '0'}</div>,
    },
    {
      title: '送达状态',
      dataIndex: 'status',
      width: 140,
      render: (_, record) => (
        <div className={statusStyle[record.status]}>
          {statusNum[record.status]}
        </div>
      ),
    },
  ]
  return (
    <>
      <Divider
        children='发送明细'
        orientation='left'
        orientationMargin={0}
        style={{ margin: '0 0 24px' }}
      />
      <Table
        loading={loading}
        className='theme-cell reset-table'
        columns={columns}
        dataSource={tableData}
        rowKey={'sendID'}
        pagination={{
          position: ['bottomRight'],
          current: page,
          pageSize: limit,
          showQuickJumper: true,
          showSizeChanger: false,
          total: total,
          onChange: changePage,
        }}
        scroll={{ x: 'max-content' }}
      />
    </>
  )
}

export default forwardRef(Fn)
