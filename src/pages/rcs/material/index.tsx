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
} from 'antd'
import type { ColumnsType } from 'antd/es/table'
import { NavLink, useNavigate } from 'react-router-dom'
import PageContent from '@/components/pageContent'
import UploadModal from './uploadModal'
import {
  UploadOutlined,
  RedoOutlined,
  DeleteOutlined,
  PlayCircleOutlined,
  EyeOutlined,
} from '@ant-design/icons'
import codeImg from '@/assets/rcs/code.png'
import { usePoint } from '@/hooks'
import { getRcsMeteialList, delRcsMeteial } from '@/api'

import audioTypeImg from '@/assets/rcs/fileType/audio.png'
import imgTypeImg from '@/assets/rcs/fileType/img.png'
import pptTypeImg from '@/assets/rcs/fileType/ppt.png'
import unknowTypeImg from '@/assets/rcs/fileType/unknow.png'
import wordTypeImg from '@/assets/rcs/fileType/word.png'
import xlsTypeImg from '@/assets/rcs/fileType/xls.png'
import zipTypeImg from '@/assets/rcs/fileType/zip.png'

import { API } from 'apis'
import './index.scss'

type MaterialItemProps = {
  item: API.RcsMeteialItem
  onDel: (id: string) => void
}

const MaterialItem = (props: MaterialItemProps) => {
  const [visible, setVisible] = useState(false)
  const [videoRender, setvideoRender] = useState<React.ReactNode>()
  const point = usePoint('lg')

  const previewEvent = () => {
    setVisible(true)
    if (props.item.type == '1') {
      setvideoRender(
        <video
          className='source-video'
          muted
          width={point ? '50%' : '90%'}
          controls
          src={
            'https://libraries.mysubmail.com/public/7405f1e8b0b2be6bccf68741d74dc339/images/541cbd95321944945ffcf3fc5d5a137e.mp4'
          }
        />,
      )
    }
  }

  return (
    <div className='material-item fx-col fx-x-center'>
      <div className='source-item'>
        <div className='source-info'>
          {props.item.type == '1' && (
            <Image
              className='source-img'
              // src={codeImg}
              src={props.item.filePath}
              fallback={imgTypeImg}
              preview={{
                visible: visible,
                onVisibleChange: (visible: boolean, prevVisible: boolean) => {
                  setVisible(visible)
                },
              }}
            />
          )}
          {props.item.type == '2' && (
            <Image className='source-img' src={audioTypeImg} preview={false} />
          )}
          {props.item.type == '3' && (
            <>
              <video
                className='source-video'
                src={
                  'https://libraries.mysubmail.com/public/7405f1e8b0b2be6bccf68741d74dc339/images/541cbd95321944945ffcf3fc5d5a137e.mp4'
                }
              />
              <Image
                className='source-video-preview'
                src=''
                preview={{
                  visible: visible,
                  imageRender: () => videoRender,
                  toolbarRender: () => null,
                  onVisibleChange: (visible: boolean, prevVisible: boolean) => {
                    setvideoRender(null)
                    setVisible(visible)
                  },
                }}
              />
            </>
          )}

          {props.item.type == '4' && (
            <Image className='source-img' src={wordTypeImg} preview={false} />
          )}
          {props.item.type == '5' && (
            <Image className='source-img' src={xlsTypeImg} preview={false} />
          )}
          {props.item.type == '6' && (
            <Image className='source-img' src={pptTypeImg} preview={false} />
          )}
          {props.item.type == '7' && (
            <Image className='source-img' src={zipTypeImg} preview={false} />
          )}
          {props.item.type == '8' && (
            <Image className='source-img' src={unknowTypeImg} preview={false} />
          )}
        </div>
        <div className='modal'>
          <Space className='status fx-y-center' size={4}>
            <span className='icon iconfont icon-shezhi fn12'></span>
            <span className='fn12'>通过</span>
          </Space>
          <div className='time fx-center-center fn13'>期限：7天</div>
          <Space className='handle'>
            <div className='handle-item'>
              <span className='icon iconfont icon-shuaxin fn16'></span>
            </div>
            <Popconfirm
              title='删除素材'
              description='确定删除该素材？'
              onConfirm={() => props.onDel(props.item.id)}
              placement='bottom'
              okText='确定'
              cancelText='取消'>
              <div className='handle-item'>
                <span className='icon iconfont icon-shanchu fn16'></span>
              </div>
            </Popconfirm>
          </Space>
          <div className='preview-btn' onClick={previewEvent}>
            {props.item.type == '1' && (
              <EyeOutlined className='fn24' title='预览' />
            )}

            {props.item.type == '3' && (
              <PlayCircleOutlined className='fn24' title='播放' />
            )}
          </div>
        </div>
      </div>
      <div className='source-name fn16'>{props.item.name}</div>
    </div>
  )
}

export default function Fn() {
  const point = usePoint('lg')
  const nav = useNavigate()
  const [form] = Form.useForm()

  const [currentPage, setcurrentPage] = useState<number>(1)
  const [pageSize, setpageSize] = useState<number>(12)
  const [total, setTotal] = useState<number>(0)
  const [list, setList] = useState<API.RcsMeteialItem[]>([])
  const [loading, setLoading] = useState(false)

  // 审核状态
  const [status, setStatus] = useState(0)
  // 上传文件弹框
  const [showUpload, setShowUpload] = useState(false)

  const getList = async () => {
    try {
      const formValues = await form.getFieldsValue()
      const res = await getRcsMeteialList({
        ...formValues,
        page: currentPage,
        limit: pageSize,
      })
      setList(res.libs)
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
  }, [currentPage, pageSize])

  return (
    <PageContent extClass='material-list'>
      <Image src={codeImg} preview={false} width={60}></Image>
      <Flex justify='space-between' wrap='wrap' gap={12}>
        <Space align='baseline'>
          <div className='fn24'>5G 消息资源库</div>
          <div className='fn14'>
            <div>素材通过后单次有效期7天。</div>
          </div>
        </Space>
        <Button
          type='primary'
          size={point ? 'large' : 'middle'}
          onClick={() => setShowUpload(true)}
          icon={<UploadOutlined className='fn18' />}>
          上传素材
        </Button>
      </Flex>
      <Divider className='line'></Divider>

      <Form
        name='material-list-form'
        className='material-list-form'
        form={form}
        layout='vertical'
        size={point ? 'large' : 'middle'}
        initialValues={{ type: 'all' }}
        autoComplete='off'>
        <Row gutter={16}>
          <Col span={10} md={10} lg={8} xl={6}>
            <Form.Item name='keyword' label='素材名称'>
              <Input placeholder='请输入' />
            </Form.Item>
          </Col>
          <Col span={8} md={8} lg={6} xl={4}>
            <Form.Item name='type' label='素材类型'>
              <Select
                placeholder='请选择'
                options={[
                  { value: 'all', label: '全部' },
                  { value: '1', label: '图片' },
                  { value: '3', label: '视频' },
                  { value: '2', label: '音频' },
                  { value: '4', label: '文档' },
                  { value: '5', label: '表格' },
                  { value: '6', label: '演示文件' },
                  { value: '7', label: '压缩文件' },
                  { value: '8', label: '其他' },
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
            className={`status-item ${status == 0 ? 'active' : ''}`}
            onClick={() => setStatus(0)}>
            全部模版
          </div>
          <div
            className={`status-item ${status == 1 ? 'active' : ''}`}
            onClick={() => setStatus(1)}>
            审核通过
          </div>
          <div
            className={`status-item ${status == 2 ? 'active' : ''}`}
            onClick={() => setStatus(2)}>
            审核驳回
          </div>
          <div
            className={`status-item ${status == 3 ? 'active' : ''}`}
            onClick={() => setStatus(3)}>
            审核中
          </div>
        </Space>
        {status == 2 && list.length > 0 && (
          <Popconfirm
            title='删除素材'
            description='确定删除全部驳回素材？'
            onConfirm={() => {}}
            placement='bottom'
            okText='确定'
            cancelText='取消'>
            <Button type='primary' danger>
              删除全部驳回素材
            </Button>
          </Popconfirm>
        )}
      </Flex>
      <Row gutter={[16, 16]} wrap style={{ marginTop: '24px' }}>
        {list.map((item, index) => (
          <Col span={12} lg={8} xl={6} key={item.id}>
            <MaterialItem item={item} onDel={delEvent} />
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
      <UploadModal
        show={showUpload}
        onOk={() => getList()}
        onCancel={() => setShowUpload(false)}
      />
    </PageContent>
  )
}
