import { useEffect, useState } from 'react'
import {
  Flex,
  Button,
  Divider,
  Form,
  Input,
  Select,
  Row,
  Col,
  Image,
  Space,
  Pagination,
} from 'antd'
import { useNavigate } from 'react-router-dom'
import PageContent from '@/components/pageContent'
import { PlusOutlined } from '@ant-design/icons'
import codeImg from '@/assets/rcs/5g2.png'
import { delRcsMeteial, getRcsTempList } from '@/api'
import SelectTypeModal from './selectTypeModal'
import Item from './item'

import { API } from 'apis'
import './index.scss'

export default function Fn() {
  const [form] = Form.useForm()
  const [currentPage, setcurrentPage] = useState<number>(1)
  const [pageSize, setpageSize] = useState<number>(11)
  const [total, setTotal] = useState<number>(0)
  const [list, setList] = useState<API.RcsTempListItem[]>([])
  const [loading, setLoading] = useState(false)

  // 审核状态
  const [status, setStatus] = useState('all')

  const [openTypeModal, setopenTypeModal] = useState(false)

  const getList = async () => {
    try {
      const formValues = await form.getFieldsValue()
      const res = await getRcsTempList({
        ...formValues,
        page: currentPage,
        limit: pageSize,
        status,
      })
      setList(res.list)
      setTotal(res.total)
      setLoading(false)
    } catch (error) {
      setLoading(false)
    }
  }

  // 切换页码
  const onChangeCurrentPage = (page: number, pageSize: number) => {
    setcurrentPage(page)
    setpageSize(pageSize)
  }

  const handleSearch = () => {
    setLoading(true)
    getList()
  }
  // 除搜索关键字，其他字段改变直接搜索
  const onValuesChange = (changedValues, allValues) => {
    if (!('keywords' in changedValues)) {
      if (currentPage == 1) {
        handleSearch()
      } else {
        setcurrentPage(1)
      }
    }
  }
  const changeStatus = (value) => {
    setcurrentPage(1)
    setStatus(value)
  }

  useEffect(() => {
    getList()
  }, [currentPage, pageSize, status])

  return (
    <PageContent extClass='template-list' xxl={1400} xl={1100}>
      <Image src={codeImg} preview={false} width={72}></Image>
      <Flex
        justify='space-between'
        wrap='wrap'
        gap={12}
        style={{ marginTop: '4px' }}>
        <Space align='baseline'>
          <div className='fn22 fw-500'>5G 消息模版</div>
        </Space>
      </Flex>
      <Divider className='line'></Divider>

      <Form
        name='rcs-template-list-form'
        className='template-list-form'
        form={form}
        layout='vertical'
        initialValues={{ type: 'all' }}
        onValuesChange={onValuesChange}
        autoComplete='off'>
        <Flex align='flex-end' gap={16}>
          <Form.Item name='type' label='模版类型'>
            <Select
              placeholder='请选择'
              options={[
                { value: 'all', label: '全部' },
                { value: 1, label: '文本' },
                { value: 2, label: '单卡片' },
                { value: 3, label: '多卡片' },
                // { value: 4, label: '文件' },
              ]}
              popupMatchSelectWidth={120}
              style={{ width: 120 }}
            />
          </Form.Item>
          <Form.Item name='keyword' label='模版名称/ID'>
            <Input placeholder='请输入' onPressEnter={handleSearch} />
          </Form.Item>
          <Form.Item label=' '>
            <Button
              type='primary'
              htmlType='submit'
              loading={loading}
              onClick={handleSearch}>
              查询
            </Button>
          </Form.Item>
        </Flex>
      </Form>
      <Flex align='center' justify='space-between'>
        <Space wrap>
          <div
            className={`status-item ${
              status == 'all' ? 'color-status-primary' : ''
            }`}
            onClick={() => changeStatus('all')}>
            全部模版
          </div>
          <div
            className={`status-item ${
              status == '1' ? 'color-status-primary' : ''
            }`}
            onClick={() => changeStatus('1')}>
            审核通过
          </div>
          <div
            className={`status-item ${
              status == '2' ? 'color-status-primary' : ''
            }`}
            onClick={() => changeStatus('2')}>
            审核驳回
          </div>
          <div
            className={`status-item ${
              status == '0' ? 'color-status-primary' : ''
            }`}
            onClick={() => changeStatus('0')}>
            审核中
          </div>
        </Space>
      </Flex>
      <Row gutter={[16, 16]} wrap style={{ marginTop: '24px' }}>
        <Col
          xxl={6}
          xl={8}
          lg={12}
          md={24}
          sm={24}
          xs={24}
          // style={{ minWidth: '302px' }}
        >
          <div className='rcs-temp-item'>
            <div
              className='temp-item-content create-btn'
              onClick={() => setopenTypeModal(true)}>
              <div className='create-card'>
                <PlusOutlined
                  rev={null}
                  style={{ fontSize: '40px', marginBottom: '24px' }}
                />
                <div>创建模版</div>
              </div>
            </div>
          </div>
        </Col>
        {list.map((item, index) => (
          <Col
            xxl={6}
            xl={8}
            lg={12}
            md={24}
            sm={24}
            xs={24}
            // style={{ minWidth: '302px' }}
            key={item.id}>
            <Item item={item} onDel={() => getList()} />
          </Col>
        ))}
      </Row>
      <Flex justify='flex-end' align='center' style={{ marginTop: '32px' }}>
        <Pagination
          defaultCurrent={1}
          current={currentPage}
          defaultPageSize={pageSize}
          pageSizeOptions={[]}
          total={total}
          showQuickJumper
          onChange={onChangeCurrentPage}
          showTotal={(total) => `共 ${total} 条`}
        />
      </Flex>
      <SelectTypeModal
        open={openTypeModal}
        onCancel={() => setopenTypeModal(false)}
      />
    </PageContent>
  )
}
