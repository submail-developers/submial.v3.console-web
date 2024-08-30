import { useState, useEffect } from 'react'
import {
  Flex,
  Table,
  Button,
  Form,
  Select,
  Pagination,
  Row,
  Col,
  Empty,
} from 'antd'
import type { GetProps, MenuProps } from 'antd'
import { PlusOutlined, EyeOutlined } from '@ant-design/icons'
import { exportVCTaskCallingList, getVCTaskCallingList } from '@/api'
import { API } from 'apis'
import { downloadFile } from '@/utils'
import type { ColumnsType } from 'antd/es/table'
import { useParams } from 'react-router-dom'
import AExport from '@/components/aExport'

import './index.scss'

interface DataType extends API.GetVCTaskCallingListItem {}

const items: MenuProps['items'] = [
  { label: '导出 TXT', key: 'txt' },
  { label: '导出 CSV', key: 'csv' },
  { label: '导出 EXCEL', key: 'excel' },
  { label: '导出 JSON', key: 'json' },
  { label: '导出 XML', key: 'xml' },
]

export default function Fn() {
  const { id } = useParams()
  const [page, setPage] = useState<number>(1)
  const [limit, setLimit] = useState<number>(100)
  const [total, setTotal] = useState<number>(0)
  const [list, setList] = useState<DataType[]>([])

  const getList = async () => {
    try {
      const res = await getVCTaskCallingList({
        sendlist: id,
        page,
        limit,
      })
      if (res.status == 'success') {
        setList(res.list)
        setTotal(res.row)
      }
    } catch (error) {}
  }

  // 切换页码
  const onChangeCurrentPage = (page: number, pageSize: number) => {
    setPage(page)
    setLimit(pageSize)
  }

  // 导出
  const exportEvent = async (file_type) => {
    const res = await exportVCTaskCallingList({
      type: file_type,
      sendlist: id,
    })
    if (res.status == 'success') {
      downloadFile()
    }
  }

  useEffect(() => {
    getList()
  }, [limit, page])

  return (
    <div className='vc-calling'>
      <Flex
        justify='flex-end'
        align='flex-end'
        className='m-t-24'
        wrap='wrap'
        gap={16}>
        <AExport items={items} onExportEvent={exportEvent} useCode={false} />
      </Flex>

      <Row wrap gutter={8} className='m-t-24'>
        {list.map((item) => (
          <Col key={item.to} span={8} lg={6} xl={4} xxl={3}>
            <div className='checkbox-item fx-between-center'>{item.to}</div>
          </Col>
        ))}
        {list.length == 0 && (
          <Empty className='m-t-40' style={{ margin: '0 auto' }} />
        )}
      </Row>
      <Flex justify='flex-end' align='center' className='m-t-24'>
        <Pagination
          defaultCurrent={1}
          current={page}
          defaultPageSize={limit}
          pageSizeOptions={[]}
          total={total}
          showSizeChanger={false}
          showQuickJumper
          onChange={onChangeCurrentPage}
          showTotal={(folderTotal) => `共 ${folderTotal} 条`}
        />
      </Flex>
    </div>
  )
}
