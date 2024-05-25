import { useState, useEffect, useRef, MutableRefObject } from 'react'
import { Row, Col, Button, Input, Table, Popconfirm, Tooltip } from 'antd'

import { API } from 'apis'
import { useParams } from 'react-router-dom'
import { getChatbot } from '@/api'
import MainDialog from './editDialog/editDialog'
import SecDialog from './editSecDialog/editSecDialog'

import './index.scss'

const { TextArea } = Input
interface DataType extends API.GetChatbotListItem {}

interface Props {
  onGetStatsu: any
}

export default function Fn(props: Props) {
  const { id } = useParams()
  const [openTypeModal, setopenTypeModal] = useState(false)
  const [openTypeModal2, setopenTypeModal2] = useState(false)

  const [editList, setEditList] = useState<API.ChatbotItem>()
  const [isVisible, setIsVisible] = useState(false)
  const [chatbotId, setChatbotId] = useState('')
  const [tip, setTip] = useState()
  //

  const getDetail = async () => {
    try {
      const res = await getChatbot({
        page: 1,
        limit: 20,
        appid: id,
        status: 'all',
      })
      if (res.list.length == 1) {
        setEditList(res.list[0])
        setChatbotId(res.list[0].id)
      }
    } catch (error) {}
  }
  const addSecMenu = () => {
    setopenTypeModal(true)
  }
  const updateMenu = (tip) => {
    setopenTypeModal(true)
    setTip(tip)
  }

  useEffect(() => {
    if (id) {
      getDetail()
    }
  }, [id])

  const list = [
    {
      id: 1,
      event: '二级菜单',
      secondCont: '二级菜单内容',
      mean: '回复消息事件',
      result: '预订成功',
    },
    {
      id: 2,

      event: '二级菜单',
      secondCont: '二级菜单内容',
      mean: '链接事件',
      result: 'https://www.mysubmail.com/',
    },
    {
      id: 3,
      event: '二级菜单',
      secondCont: '',
      mean: '',
      result: '',
    },
    {
      id: 4,
      event: '二级菜单',
      secondCont: '',
      mean: '',
      result: '',
    },
    {
      id: 5,
      event: '二级菜单',
      secondCont: '',
      mean: '',
      result: '',
    },
  ]
  const list2 = [
    {
      id: 1,
      event: '无事件',
      secondCont: '',
      mean: '',
      result: '',
    },
    {
      id: 2,

      event: '无事件',
      secondCont: '',
      mean: '',
      result: '',
    },
    {
      id: 3,
      event: '无事件',
      secondCont: '',
      mean: '',
      result: '',
    },
    {
      id: 4,
      event: '无事件',
      secondCont: '',
      mean: '',
      result: '',
    },
    {
      id: 5,
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
          <i className='icon iconfont icon-jianpan'></i> 主菜单一
        </>
      ),
      width: 160,
      className: 'paddingL20',
      dataIndex: 'event',
      render: (_, recoder) => (
        <>
          {recoder.secondCont == '' ? (
            <span style={{ color: '#999' }}>
              <i className='icon iconfont icon-a-erjicaidan2'></i>二级菜单
            </span>
          ) : (
            <span>
              <i className='icon iconfont icon-a-erjicaidan2'></i>二级菜单
            </span>
          )}
        </>
      ),
    },
    {
      title: '',
      width: 160,
      className: 'paddingL20',
      dataIndex: 'secondCont',
      render: (_, recoder) => (
        <>
          {recoder.secondCont == '' ? (
            <div></div>
          ) : (
            <div className='secondCont'>{recoder.secondCont}</div>
          )}
        </>
      ),
    },
    {
      title: '',
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
          <Tooltip title='编辑'>
            <Button
              type='link'
              style={{ paddingLeft: 0 }}
              onClick={() => setopenTypeModal(true)}>
              <i className='icon iconfont icon-jia'></i>
            </Button>
          </Tooltip>
          <Tooltip title='重置'>
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
          </Tooltip>
        </div>
      ),
      width: 160,
      render: (_, record) => (
        <div>
          {record.secondCont != '' ? (
            <div>
              <Tooltip title='编辑1'>
                <Button
                  type='link'
                  style={{ paddingLeft: 0 }}
                  onClick={addSecMenu}>
                  <i className='icon iconfont icon-jia'></i>
                </Button>
              </Tooltip>
              <Tooltip title='重置'>
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
              </Tooltip>
            </div>
          ) : (
            <Button
              disabled
              type='link'
              style={{ paddingLeft: '0px' }}
              onClick={() => setopenTypeModal2(true)}>
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
          <i className='icon iconfont icon-jianpan'></i> 主菜单二
        </>
      ),
      width: 160,
      className: 'paddingL20',
      dataIndex: 'event',
      render: (_, recoder) => (
        <>
          {recoder.secondCont == '' ? (
            <span style={{ color: '#999' }}>
              <i className='icon iconfont icon-a-erjicaidan2'></i>二级菜单
            </span>
          ) : (
            <span>
              <i className='icon iconfont icon-a-erjicaidan2'></i>二级菜单
            </span>
          )}
        </>
      ),
    },
    {
      title: '下挂巧克力2',
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
      title: '菜单2',
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
          <Tooltip title='编辑'>
            <Button
              type='link'
              style={{ paddingLeft: 0 }}
              // onClick={() => editEvent(record)}
            >
              <i className='icon iconfont icon-bianji'></i>
            </Button>
          </Tooltip>
          <Tooltip title='重置'>
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
          </Tooltip>
        </div>
      ),
      width: 160,
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
            <Button disabled type='link' style={{ paddingLeft: '0px' }}>
              <i className='icon iconfont icon-jia'></i>
            </Button>
          )}
        </div>
      ),
    },
  ]

  const editStatus = false

  return (
    <div className='chatbot-edit' style={{ marginTop: '40px' }}>
      <div className='info-title'>固定菜单2</div>
      <Row style={{ marginTop: '16px' }} gutter={24}>
        <Col span={24}>
          <div style={{ border: '1px solid', height: '600px' }}>
            <div>
              主菜单1
              <Button onClick={() => updateMenu('Mainmenu1')}>
                <i className='icon iconfont icon-jia'></i>
              </Button>
            </div>
            <div>
              主菜单2
              <Button onClick={() => updateMenu('Mainmenu2')}>
                <i className='icon iconfont icon-jia'></i>
              </Button>
            </div>
            <div>
              主菜单3
              <Button onClick={() => updateMenu('Mainmenu3')}>
                <i className='icon iconfont icon-jia'></i>
              </Button>
            </div>
          </div>

          <Table
            className='tbale2'
            columns={columns2}
            dataSource={list2}
            pagination={false}
            rowKey={'id'}
            scroll={{ x: 'max-content' }}
          />
          <div className='mean-botm'>
            <Button
              className='cancle'
              type='primary'
              size='large'
              style={{ width: 120, marginRight: '12px' }}
              onClick={() => props.onGetStatsu(editStatus)}>
              取消编辑
            </Button>
            <Button
              className='save'
              type='primary'
              size='large'
              style={{ width: 120 }}>
              保存
            </Button>
          </div>
        </Col>
      </Row>

      <MainDialog
        tip={tip}
        chatbotId={chatbotId}
        open={openTypeModal}
        editList={editList}
        onCancel={() => setopenTypeModal(false)}
      />
      <SecDialog
        open={openTypeModal2}
        onCancel={() => setopenTypeModal2(false)}
      />
    </div>
  )
}
