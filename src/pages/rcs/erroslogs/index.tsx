import { useState, useEffect } from 'react'
import { Flex, Table, Row, Col, Button, Divider, Image } from 'antd'
import PageContent from '@/components/pageContent'
import { getErrorLogs } from '@/api'
import { API } from 'apis'
import topIco from '@/assets/rcs/errorlogs/err_ico.png'
import './index.scss'

export default function Fn() {
  const [getErrorList, setGetErrorList] = useState()

  // 获取错误日志
  const getList = async () => {
    const res = await getErrorLogs({
      page: 1,
      start: '2022-05-20',
      end: '2024-05-22',
    })
  }
  useEffect(() => {
    getList()
  }, [])

  const dataSource = [
    {
      key: '1',
      name: 'ChatBot1',
      age: 32,
      address: '西湖区湖底公园1号',
    },
    {
      key: '2',
      name: 'ChatBot2',
      age: 42,
      address: '西湖区湖底公园1号',
    },
  ]

  const columns = [
    {
      title: 'ChatBot',
      dataIndex: 'name',
      key: 'name',
      width: 100,
      fixed: true,
      paddingLeft: 30,
    },
    {
      title: 'API',
      dataIndex: 'age',
      key: 'age',
    },
    {
      title: '错误码',
      dataIndex: 'address',
      key: 'address',
    },
    {
      title: '日期',
      dataIndex: 'address',
      key: 'address',
    },
    {
      title: '来源',
      dataIndex: 'address',
      key: 'address',
    },
    {
      title: '详情',
      dataIndex: 'address',
      key: 'address',
    },
  ]

  return (
    <PageContent extClass='api-errorlogs'>
      <>
        <Image src={topIco} preview={false} width={72}></Image>
        <Flex
          justify='space-between'
          align='center'
          style={{ marginTop: '4px' }}>
          <div className='fn22 fw-500'>API错误日志</div>
        </Flex>
        <Divider className='line'></Divider>

        <Row>
          <Col>
            <Button className='m-r-10'>全部chatbotid</Button>
            <Button>日期</Button>
          </Col>
        </Row>

        <Table
          className='theme-cell reset-table'
          columns={columns}
          dataSource={dataSource}
          rowKey={'key'}
          sticky
          pagination={{
            position: ['bottomRight'],
            pageSize: 100,
            pageSizeOptions: [100, 200, 300],
          }}
          scroll={{ x: 'max-content' }}
        />
      </>
    </PageContent>
  )
}
