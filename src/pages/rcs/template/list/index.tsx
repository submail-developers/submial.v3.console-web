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
  Table,
  Image,
  Space,
  Pagination,
  Popconfirm,
  App,
  Tooltip,
} from 'antd'
import type { ColumnsType } from 'antd/es/table'
import { NavLink, useNavigate, Link } from 'react-router-dom'
import PageContent from '@/components/pageContent'
import {
  UploadOutlined,
  RedoOutlined,
  DeleteOutlined,
  PlayCircleOutlined,
  EyeOutlined,
  PlusOutlined,
} from '@ant-design/icons'
import codeImg from '@/assets/rcs/code.png'
import { usePoint } from '@/hooks'
import { getRcsMeteialList, delRcsMeteial, getRcsTempList } from '@/api'
import { IDIcon } from '@/components/aIcons'
import ACopy from '@/components/aCopy'
import SelectTypeModal from './selectTypeModal'

import audioTypeImg from '@/assets/rcs/fileType/audio.png'
import imgTypeImg from '@/assets/rcs/fileType/img.png'
import pptTypeImg from '@/assets/rcs/fileType/ppt.png'
import unknowTypeImg from '@/assets/rcs/fileType/unknow.png'
import wordTypeImg from '@/assets/rcs/fileType/word.png'
import xlsTypeImg from '@/assets/rcs/fileType/xls.png'
import zipTypeImg from '@/assets/rcs/fileType/zip.png'

import { API } from 'apis'
import './index.scss'

type ItemProps = {
  item: any
  onDel: (id: string) => void
}

export default function Fn() {
  const point = usePoint('lg')
  const nav = useNavigate()
  const [form] = Form.useForm()

  const [currentPage, setcurrentPage] = useState<number>(1)
  const [pageSize, setpageSize] = useState<number>(12)
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

  const delEvent = async (id) => {
    const res = await delRcsMeteial({ id })
    if (res.status == 'success') {
      getList()
    }
  }

  useEffect(() => {
    getList()
  }, [currentPage, pageSize, status])

  return (
    <PageContent extClass='template-list' xxl={1400} xl={980}>
      <Image src={codeImg} preview={false} width={60}></Image>
      <Flex justify='space-between' wrap='wrap' gap={12}>
        <Space align='baseline'>
          <div className='fn24'>5G 消息模版</div>
        </Space>
      </Flex>
      <Divider className='line'></Divider>

      <Form
        name='rcs-template-list-form'
        className='template-list-form'
        form={form}
        layout='vertical'
        size={point ? 'large' : 'middle'}
        initialValues={{ type: 'all', keyword: '' }}
        autoComplete='off'>
        <Row gutter={16}>
          <Col span={10} md={10} lg={8} xl={6}>
            <Form.Item name='keyword' label='模版名称/ID'>
              <Input placeholder='请输入' />
            </Form.Item>
          </Col>
          <Col span={8} md={8} lg={6} xl={4}>
            <Form.Item name='type' label='模版类型'>
              <Select
                placeholder='请选择'
                options={[
                  { value: 'all', label: '全部' },
                  { value: '1', label: '文本' },
                  { value: '2', label: '单卡片' },
                  { value: '3', label: '多卡片' },
                  { value: '4', label: '文件' },
                ]}
              />
            </Form.Item>
          </Col>
          <Col span={6} md={4} xl={3}>
            <Form.Item label=' '>
              <Button
                type='primary'
                className='w-100'
                htmlType='submit'
                loading={loading}
                onClick={handleSearch}>
                查询
              </Button>
            </Form.Item>
          </Col>
        </Row>
      </Form>
      <Flex align='center' justify='space-between'>
        <Space wrap>
          <div
            className={`status-item ${status == 'all' ? 'active' : ''}`}
            onClick={() => setStatus('all')}>
            全部模版
          </div>
          <div
            className={`status-item ${status == '1' ? 'active' : ''}`}
            onClick={() => setStatus('1')}>
            审核通过
          </div>
          <div
            className={`status-item ${status == '2' ? 'active' : ''}`}
            onClick={() => setStatus('2')}>
            审核驳回
          </div>
          <div
            className={`status-item ${status == '0' ? 'active' : ''}`}
            onClick={() => setStatus('0')}>
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
          <div className='temp-item'>
            <div
              className='temp-item-content create-btn'
              onClick={() => setopenTypeModal(true)}>
              <div className='create-card'>
                <PlusOutlined
                  style={{ fontSize: '40px', marginBottom: '24px' }}
                  rev={undefined}
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
            <div className='temp-item'>
              <Tooltip title={'审核备注'} placement='bottom'>
                <div className='temp-item-content'>
                  <div className='name g-ellipsis'>{item.title}</div>
                  <div className='time'>创建时间：{item.createAt}</div>
                  <div
                    className={`status ${
                      item.checked == '0'
                        ? 'fail'
                        : item.checked == '1'
                        ? 'success'
                        : 'waiting'
                    }`}>
                    {item.checked == '0' && '未通过'}
                    {item.checked == '1' && '通过'}
                    {(item.checked == '8' || item.checked == '9') && '审核中'}
                  </div>
                  <div className='preview-model'>
                    <div className='preview-content'>
                      {/* <PreviewCard data={item} showName /> */}
                    </div>
                  </div>
                  <Flex
                    justify='space-between'
                    align='center'
                    style={{ paddingTop: '12px' }}>
                    <Button
                      className='id-btn'
                      style={{ padding: '0 4px', color: '#fd29a4' }}
                      size='small'
                      icon={
                        <IDIcon
                          style={{
                            color: '#fd29a4',
                            fontSize: '14px',
                          }}
                        />
                      }>
                      {item.sign}
                    </Button>
                  </Flex>
                </div>
              </Tooltip>
            </div>
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
