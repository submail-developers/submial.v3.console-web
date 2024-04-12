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
} from 'antd'
import type { ColumnsType } from 'antd/es/table'
import { NavLink, useNavigate } from 'react-router-dom'
import PageContent from '@/components/pageContent'
import {
  UploadOutlined,
  RedoOutlined,
  DeleteOutlined,
  PlayCircleOutlined,
  EyeOutlined,
} from '@ant-design/icons'
import codeImg from '@/assets/rcs/code.png'
import { usePoint } from '@/hooks'

import { API } from 'apis'
import './index.scss'

type Item = {
  id: string | number
  type: string
}
type MaterialItemProps = {
  item: Item
}

const MaterialItem = (props: MaterialItemProps) => {
  const [visible, setVisible] = useState(false)
  const [videoRender, setvideoRender] = useState<React.ReactNode>()
  const point = usePoint('lg')

  const previewEvent = () => {
    setVisible(true)
    if (props.item.type == 'video') {
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
          {props.item.type == 'image' && (
            <Image
              className='source-img'
              src={codeImg}
              preview={{
                visible: visible,
                onVisibleChange: (visible: boolean, prevVisible: boolean) => {
                  setVisible(visible)
                },
              }}
            />
          )}
          {props.item.type == 'video' && (
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
        </div>
        <div className='modal'>
          <Space className='status fx-y-center' size={4}>
            <span className='icon iconfont icon-shezhi fn12'></span>
            <span className='fn12'>通过</span>
          </Space>
          <div className='time fx-center-center fn13'>期限：7天</div>
          <Space className='handle'>
            <div className='handle-item'>
              <RedoOutlined rev={null} />
            </div>
            <div className='handle-item'>
              <DeleteOutlined rev={null} />
            </div>
          </Space>
          <div className='preview-btn' onClick={previewEvent}>
            {props.item.type == 'image' && (
              <EyeOutlined rev={null} className='fn24' title='预览' />
            )}

            {props.item.type == 'video' && (
              <PlayCircleOutlined rev={null} className='fn24' title='播放' />
            )}
          </div>
        </div>
      </div>
      <div className='source-name fn16'>xxx.img</div>
    </div>
  )
}

export default function Fn() {
  const point = usePoint('lg')
  const nav = useNavigate()
  const [form] = Form.useForm()

  const [list, setList] = useState<Item[]>([
    {
      id: 1,
      type: 'image',
    },
    {
      id: 2,
      type: 'video',
    },
    {
      id: 3,
      type: 'txt',
    },
    {
      id: 4,
      type: 'image',
    },
    {
      id: 5,
      type: 'image',
    },
    {
      id: 6,
      type: 'image',
    },
  ])

  // 审核状态
  const [status, setStatus] = useState(0)

  const toCreate = () => {
    nav('/console/rcs/chatbot/create/0')
  }
  return (
    <PageContent extClass='material-list'>
      <Image src={codeImg} preview={false} width={60}></Image>
      <Flex justify='space-between' align='center' wrap='wrap' gap={12}>
        <Space align='baseline' size={[24, 0]} wrap>
          <div className='fn24'>5G 消息资源库</div>
          <div className='fn14'>
            素材通过后单次有效期7天，单个上传素材不超过10M。
          </div>
        </Space>
        <Button
          type='primary'
          size={point ? 'large' : 'middle'}
          onClick={toCreate}
          icon={<UploadOutlined rev={null} className='fn18' />}>
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
        autoComplete='off'>
        <Row gutter={16}>
          <Col span={10} md={10} lg={8} xl={6}>
            <Form.Item name='key' label='素材名称'>
              <Input placeholder='请输入' />
            </Form.Item>
          </Col>
          <Col span={8} md={8} lg={6} xl={4}>
            <Form.Item name='status' label='素材类型'>
              <Select
                placeholder='请选择'
                options={[
                  { value: 'jack', label: 'Jack' },
                  { value: 'lucy', label: 'Lucy' },
                  { value: 'Yiminghe', label: 'yiminghe' },
                ]}
              />
            </Form.Item>
          </Col>
          <Col span={6} md={4} xl={3}>
            <Form.Item label=' '>
              <Button type='primary' className='w-100'>
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
        {status == 2 && (
          <Button type='primary' danger>
            删除全部驳回素材
          </Button>
        )}
      </Flex>
      <Row gutter={[16, 16]} wrap style={{ marginTop: '24px' }}>
        {list.map((item, index) => (
          <Col span={12} lg={8} xl={6} key={index}>
            <MaterialItem item={item} />
          </Col>
        ))}
      </Row>
    </PageContent>
  )
}
