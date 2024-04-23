import { useState, useEffect, useRef, MutableRefObject } from 'react'
import { Row, Col, Button, Input, Table, Popconfirm } from 'antd'

import { API } from 'apis'
import { useParams } from 'react-router-dom'
import { getChatbot } from '@/api'
import MainDialog from '../editDialog/editDialog'

import './index.scss'

const { TextArea } = Input
interface DataType extends API.GetChatbotListItem {}
export default function Fn() {
  const { id } = useParams()
  const [tableData, settableData] = useState([
    { name: '1223' },
    { name: '123' },
  ])

  const addDialogRef: MutableRefObject<any> = useRef(null)
  const [detail, setDetail] = useState<API.ChatbotItem>()
  const [isVisible, setIsVisible] = useState(false)
  const getDetail = async () => {
    try {
      const res = await getChatbot({
        page: 1,
        limit: 20,
        appid: id,
        status: 'all',
      })
      if (res.list.length == 1) {
        setDetail(res.list[0])
      }
    } catch (error) {}
  }

  useEffect(() => {
    if (id) {
      getDetail()
    }
  }, [id])

  const list = [
    {
      id: 1,
      event: '交互响应事件',
      secondCont: '二级菜单内容',
      mean: '回复消息事件',
      result: '预订成功',
    },
    {
      id: 2,

      event: '交互响应事件',
      secondCont: '二级菜单内容',
      mean: '链接事件',
      result: 'https://www.mysubmail.com/',
    },
    {
      id: 3,
      event: '无事件',
      secondCont: '',
      mean: '',
      result: '',
    },
  ]
  const columns = [
    {
      title: (
        <>
          <i className='icon iconfont icon-jianpan'></i> 菜单一
        </>
      ),
      width: 160,
      className: 'paddingL20',
      dataIndex: 'event',
      render: (_, recoder) => (
        <>
          <li style={{ listStyle: 'disc', color: '#4f4f4f' }}>
            {recoder.event}
          </li>
        </>
      ),
    },
    {
      title: '下挂巧克力',
      width: 160,
      className: 'paddingL20',
      dataIndex: 'secondCont',
      render: (_, recoder) => (
        <>
          {recoder.event == '无事件' ? (
            <div></div>
          ) : (
            <div className='secondCont'>{recoder.secondCont}</div>
          )}
        </>
      ),
    },
    {
      title: '菜单',
      width: 160,
      className: 'paddingL20',
      dataIndex: 'mean',
    },

    {
      title: '',
      width: 240,
      className: 'paddingL20',
      dataIndex: 'result',
    },

    {
      title: (
        <div>
          <Button
            type='link'
            style={{ paddingLeft: 0 }}
            onClick={() => mainMenu()}>
            <i className='icon iconfont icon-bianji'></i>
          </Button>
          <Popconfirm
            placement='left'
            title='警告'
            description='确定重置吗？'
            // onConfirm={() => deleteEvent(record.id)}
            okText='确定'
            cancelText='取消'>
            <Button type='link'>
              <i className='icon iconfont icon-zhongzhi'></i>
            </Button>
          </Popconfirm>
        </div>
      ),
      width: 140,
      render: (_, record) => (
        <div>
          {record.event != '无事件' ? (
            <div>
              <Button
                type='link'
                style={{ paddingLeft: 0 }}
                // onClick={() => editEvent(record)}
              >
                <i className='icon iconfont icon-bianji'></i>
              </Button>
              <Popconfirm
                placement='left'
                title='警告'
                description='确定重置吗？'
                // onConfirm={() => deleteEvent(record.id)}
                okText='确定'
                cancelText='取消'>
                <Button type='link'>
                  <i className='icon iconfont icon-zhongzhi'></i>
                </Button>
              </Popconfirm>
            </div>
          ) : (
            <Button type='link' style={{ paddingLeft: '0px' }}>
              <i className='icon iconfont icon-jia'></i>
            </Button>
          )}
        </div>
      ),
    },
  ]
  const columns2 = [
    {
      title: (
        <>
          <i className='icon iconfont icon-jianpan'></i> 菜单一
        </>
      ),
      width: 160,
      className: 'paddingL20',
      dataIndex: 'event',
      render: (_, recoder) => (
        <>
          <li style={{ listStyle: 'disc', color: '#4f4f4f' }}>
            {recoder.event}
          </li>
        </>
      ),
    },
    {
      title: '下挂巧克力',
      width: 160,
      className: 'paddingL20',
      dataIndex: 'secondCont',
      render: (_, recoder) => (
        <>
          {recoder.event == '无事件' ? (
            <div></div>
          ) : (
            <div className='secondCont'>{recoder.secondCont}</div>
          )}
        </>
      ),
    },
    {
      title: '菜单',
      width: 160,
      className: 'paddingL20',
      dataIndex: 'mean',
    },

    {
      title: '',
      width: 240,
      className: 'paddingL20',
      dataIndex: 'result',
    },

    {
      title: (
        <div>
          <Button
            type='link'
            style={{ paddingLeft: 0 }}
            // onClick={() => editEvent(record)}
          >
            <i className='icon iconfont icon-bianji'></i>
          </Button>
          <Popconfirm
            placement='left'
            title='警告'
            description='确定重置吗？'
            // onConfirm={() => deleteEvent(record.id)}
            okText='确定'
            cancelText='取消'>
            <Button type='link'>
              <i className='icon iconfont icon-zhongzhi'></i>
            </Button>
          </Popconfirm>
        </div>
      ),
      width: 140,
      render: (_, record) => (
        <div>
          {record.event != '无事件' ? (
            <div>
              <Button
                type='link'
                style={{ paddingLeft: 0 }}
                // onClick={() => editEvent(record)}
              >
                <i className='icon iconfont icon-bianji'></i>
              </Button>
              <Popconfirm
                placement='left'
                title='警告'
                description='确定重置吗？'
                // onConfirm={() => deleteEvent(record.id)}
                okText='确定'
                cancelText='取消'>
                <Button type='link'>
                  <i className='icon iconfont icon-zhongzhi'></i>
                </Button>
              </Popconfirm>
            </div>
          ) : (
            <Button type='link' style={{ paddingLeft: '0px' }}>
              <i className='icon iconfont icon-jia'></i>
            </Button>
          )}
        </div>
      ),
    },
  ]
  const columns3 = [
    {
      title: (
        <>
          <i className='icon iconfont icon-jianpan'></i> 菜单一
        </>
      ),
      width: 160,
      className: 'paddingL20',
      dataIndex: 'event',
      render: (_, recoder) => (
        <>
          <li style={{ listStyle: 'disc', color: '#4f4f4f' }}>
            {recoder.event}
          </li>
        </>
      ),
    },
    {
      title: '下挂巧克力',
      width: 160,
      className: 'paddingL20',
      dataIndex: 'secondCont',
      render: (_, recoder) => (
        <>
          {recoder.event == '无事件' ? (
            <div></div>
          ) : (
            <div className='secondCont'>{recoder.secondCont}</div>
          )}
        </>
      ),
    },
    {
      title: '菜单',
      width: 160,
      className: 'paddingL20',
      dataIndex: 'mean',
    },

    {
      title: '',
      width: 240,
      className: 'paddingL20',
      dataIndex: 'result',
    },

    {
      title: (
        <div>
          <Button
            type='link'
            style={{ paddingLeft: 0 }}
            // onClick={() => editEvent(record)}
          >
            <i className='icon iconfont icon-bianji'></i>
          </Button>
          <Popconfirm
            placement='left'
            title='警告'
            description='确定重置吗？'
            // onConfirm={() => deleteEvent(record.id)}
            okText='确定'
            cancelText='取消'>
            <Button type='link'>
              <i className='icon iconfont icon-zhongzhi'></i>
            </Button>
          </Popconfirm>
        </div>
      ),
      width: 140,
      render: (_, record) => (
        <div>
          {record.event != '无事件' ? (
            <div>
              <Button
                type='link'
                style={{ paddingLeft: 0 }}
                // onClick={() => editEvent(record)}
              >
                <i className='icon iconfont icon-bianji'></i>
              </Button>
              <Popconfirm
                placement='left'
                title='警告'
                description='确定重置吗？'
                // onConfirm={() => deleteEvent(record.id)}
                okText='确定'
                cancelText='取消'>
                <Button type='link'>
                  <i className='icon iconfont icon-zhongzhi'></i>
                </Button>
              </Popconfirm>
            </div>
          ) : (
            <Button type='link' style={{ paddingLeft: '0px' }}>
              <i className='icon iconfont icon-jia'></i>
            </Button>
          )}
        </div>
      ),
    },
  ]

  // 编辑主菜单
  const mainMenu = () => {
    addDialogRef.current.open()
  }

  return (
    <div className='chatbot-edit' style={{ marginTop: '40px' }}>
      <div className='info-title'>固定菜单</div>
      <Row style={{ marginTop: '16px' }} gutter={24}>
        <Col span={24}>
          <Table
            className='theme-cell bg-white'
            columns={columns}
            dataSource={list}
            sticky
            pagination={false}
            rowKey={'id'}
            scroll={{ x: 'max-content' }}
          />
          <Table
            style={{ marginTop: '20px', marginBottom: '20px' }}
            className='theme-cell bg-white'
            columns={columns2}
            dataSource={list}
            sticky
            pagination={false}
            rowKey={'id'}
            scroll={{ x: 'max-content' }}
          />
          <Table
            className='theme-cell bg-white'
            columns={columns3}
            dataSource={list}
            sticky
            pagination={false}
            rowKey={'id'}
            scroll={{ x: 'max-content' }}
          />
        </Col>
      </Row>
      <MainDialog ref={addDialogRef} />
    </div>
  )
}
