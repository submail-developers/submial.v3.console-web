import { useState, useImperativeHandle, forwardRef, useEffect } from 'react'
import { Table, Divider, Tooltip, Space } from 'antd'
import { API } from 'apis'
import { getSendlistLogs } from '@/api'
import ACopy from '@/components/aCopy'

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
      updata,
    }
  })
  const [loading, setLoading] = useState(false)
  const [page, setPage] = useState(1)
  const [limit, setLimit] = useState(10)
  const [total, setTotal] = useState(0)
  const [tableData, setTableData] = useState<API.SendLogItem[]>([])
  const updata = () => {
    if (page == 1) {
      getList()
    } else {
      setPage(1)
    }
  }

  const getList = async () => {
    setLoading(true)
    try {
      const res = await getSendlistLogs({
        sendlist: props.id,
        page: page,
        limit: limit,
      })
      if (res.status == 'success') {
        setTableData(res.history)
        setTotal(Number(res.row))
      }
      setLoading(false)
    } catch (error) {
      setLoading(false)
    }
  }

  const changePageInfo = (page, pageSize) => {
    if (pageSize != limit) {
      setPage(1)
      setLimit(pageSize)
    } else {
      setPage(page)
    }
  }

  useEffect(() => {
    getList()
  }, [page, limit])

  const columns = [
    {
      title: '手机号',
      fixed: true,
      width: 140,
      className: 'paddingL20',
      render: (_, record) => (
        <Space style={{ height: 40 }} className='fx-y-center'>
          <span>{record.to}</span>
          <Tooltip
            title={
              <>
                {record.mobileType}
                {record.mobileArea
                  ? `/${record.mobileArea.split(' ').join(' ')}`
                  : '-'}
              </>
            }
            placement='bottom'
            trigger={['hover', 'click']}>
            <span className='icon iconfont icon-gps gray-color-sub'></span>
          </Tooltip>
        </Space>
      ),
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
          pageSizeOptions: [10, 20, 50],
          total: total,
          onChange: changePageInfo,
        }}
        scroll={{ x: 'max-content' }}
      />
    </>
  )
}

export default forwardRef(Fn)
