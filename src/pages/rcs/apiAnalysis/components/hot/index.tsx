import { API } from 'apis'
import { Table, Row, Col, Space, Progress, Flex } from 'antd'
import type { ColumnsType } from 'antd/es/table'
import './index.scss'
import { useEffect, useState } from 'react'
interface DataTypeP extends API.GetUnionAnalysisResProvinceItem {
  rate?: string | number
}
interface DataTypeC extends API.GetUnionAnalysisResCityItem {
  rate?: string | number
}
type Props = {
  city: API.GetUnionAnalysisResCityItem[]
  province: API.GetUnionAnalysisResProvinceItem[]
}
export default function Fn(props: Props) {
  const [tablePData, settablePData] = useState<DataTypeP[]>([])
  const [tableCData, settableCData] = useState<DataTypeC[]>([])
  const columnsP: ColumnsType<DataTypeP> = [
    {
      title: '热度分析(省份)',
      className: 'paddingL30',
      width: 200,
      render: (_, record) => (
        <Flex align='center' wrap='wrap' gap={12}>
          <div>{record.province}</div>
          <div style={{ width: 100 }}>
            <Progress
              percent={Number(record.rate)}
              showInfo={false}
              size={'small'}
            />
          </div>
        </Flex>
      ),
    },
    {
      title: '数量',
      width: 60,
      sorter: (a, b) => Number(a.cnt) - Number(b.cnt),
      render: (_, record) => <span>{Number(record.cnt).toLocaleString()}</span>,
    },
    {
      title: '占比',
      width: 100,
      className: 'paddingL30',
      render: (_, record) => <span>{record.rate}%</span>,
    },
  ]
  const columnsC: ColumnsType<DataTypeC> = [
    {
      title: '热度分析(城市)',
      width: 200,
      className: 'paddingL30',
      render: (_, record) => (
        <Flex align='center' wrap='wrap' gap={12}>
          <div>{record.city}</div>
          <div style={{ width: 100 }}>
            <Progress
              percent={Number(record.rate)}
              showInfo={false}
              size={'small'}
              strokeColor='rgb(71, 209, 203)'
            />
          </div>
        </Flex>
      ),
    },
    {
      title: '数量',
      width: 60,
      sorter: (a, b) => Number(a.cnt) - Number(b.cnt),
      render: (_, record) => <span>{Number(record.cnt).toLocaleString()}</span>,
    },
    {
      title: '占比',
      className: 'paddingL30',
      width: 100,
      render: (_, record) => <span>{record.rate}%</span>,
    },
  ]

  useEffect(() => {
    let totalP = 0
    let totalC = 0
    let _tablePData: DataTypeP[] = []
    let _tableCData: DataTypeC[] = []

    props.province.forEach((item) => {
      totalP += Number(item.cnt)
    })
    props.city.forEach((item) => {
      totalC += Number(item.cnt)
    })

    props.province.forEach((item) => {
      _tablePData.push({
        ...item,
        rate: totalP > 0 ? ((Number(item.cnt) * 100) / totalP).toFixed(2) : '0',
      })
    })

    props.city.forEach((item) => {
      _tableCData.push({
        ...item,
        rate: totalC > 0 ? ((Number(item.cnt) * 100) / totalC).toFixed(2) : '0',
      })
    })
    settablePData(_tablePData)
    settableCData(_tableCData)
  }, [props.city, props.province])
  return (
    <Row gutter={[24, 24]}>
      <Col span={24} xl={12}>
        <Table
          className='theme-cell reset-table'
          columns={columnsP}
          dataSource={tablePData}
          rowKey={'province'}
          sticky
          pagination={false}
          // scroll={{ y: 600 }}
        />
      </Col>
      <Col span={24} xl={12}>
        <Table
          className='theme-cell reset-table'
          columns={columnsC}
          dataSource={tableCData}
          rowKey={'city'}
          sticky
          pagination={false}
          // scroll={{ y: 600 }}
        />
      </Col>
    </Row>
  )
}
