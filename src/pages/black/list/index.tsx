import { useState, useEffect } from 'react'
import PageContent from '@/components/pageContent'
import { getMobAddressbookDetail, exportAddress } from '@/api'
import { API } from 'apis'
import {
  Flex,
  Divider,
  Input,
  Image,
  Button,
  Form,
  Row,
  Col,
  Empty,
  Pagination,
} from 'antd'
import faceImg from '@/assets/voiceChatbot/face/black.png'
import AExport from '@/components/aExport'
import { downloadFile } from '@/utils'

import './index.scss'

const items = [
  {
    label: '导出 TXT (仅手机号码)',
    key: 'txt',
  },
  {
    label: '导出 CSV',
    key: 'csv',
  },

  {
    label: '导出 EXCEL',
    key: 'excel',
  },
  {
    label: '导出 JSON',
    key: 'json',
  },

  {
    label: '导出 XML',
    key: 'xml',
  },
]
// 黑名单列表
export default function Fn() {
  const [form] = Form.useForm()
  const [list, setList] = useState<API.GetMobAddressbookDetailItems[]>([])
  const [currentPage, setcurrentPage] = useState<number>(1)
  const [total, setTotal] = useState<number>(0)
  const exportEvent = async (type) => {
    const res = await exportAddress({
      type,
      id: 'unsubscribe',
    })
    if (res.status == 'success') {
      downloadFile()
    }
  }
  const getList = async () => {
    try {
      const values = form.getFieldsValue()
      const res = await getMobAddressbookDetail({
        page: 1,
        id: 'unsubscribe',
        ...values,
      })
      setList(res.addressbook)
      setTotal(res.rows)
    } catch (error) {}
  }
  // 切换页码
  const onChangeCurrentPage = (page: number, pageSize: number) => {
    setcurrentPage(page)
  }
  useEffect(() => {
    getList()
  }, [currentPage])
  return (
    <PageContent extClass='black-list'>
      <Image src={faceImg} preview={false} width={72}></Image>
      <Flex justify='space-between' wrap='wrap' style={{ height: 40 }}>
        <div className='fn22 fw-500'>黑名单管理</div>
        <AExport items={items} onExportEvent={exportEvent} useCode={false} />
      </Flex>
      <Divider />
      <Form
        form={form}
        className='api-history-form'
        name='api-history'
        layout='vertical'
        autoComplete='off'>
        <Flex align='flex-end' wrap='wrap' gap={16}>
          <Form.Item label='手机号码' name='address' className='m-b-0'>
            <Input placeholder='请输入' onPressEnter={getList} />
          </Form.Item>
          <Form.Item label='' className='m-b-0'>
            <Button type='primary' htmlType='submit' onClick={getList}>
              查询
            </Button>
          </Form.Item>
        </Flex>
      </Form>
      <Row wrap gutter={8} style={{ width: '100%' }} className='m-t-24'>
        {list.map((item) => (
          <Col key={item.id} span={8} lg={6} xl={4} xxl={3}>
            <div className='mob-item fx-between-center'>{item.address}</div>
          </Col>
        ))}
        {list.length == 0 && (
          <Col span={24}>
            <Empty className='m-t-40' style={{ margin: '0 auto' }} />
          </Col>
        )}
      </Row>
      <Flex justify='flex-end' className='m-t-24'>
        <Pagination
          current={currentPage}
          pageSize={100}
          total={total}
          showSizeChanger={false}
          showQuickJumper
          onChange={onChangeCurrentPage}
          showTotal={(total) => `共 ${total} 条`}></Pagination>
      </Flex>
    </PageContent>
  )
}
