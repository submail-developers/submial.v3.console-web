import { Flex, Space, Button, ConfigProvider, Popconfirm } from 'antd'
import { SyncOutlined } from '@ant-design/icons'
import { useParams, NavLink, useLocation, useNavigate } from 'react-router-dom'
import { changeVCTaskStatus, getVCTaskDetail } from '@/api'
import { useEffect, useRef, useState } from 'react'
import { useStateDispatch } from './reducer'
import { API } from 'apis'
import { useStateStore } from './reducer'

export default function Fn() {
  const store = useStateStore()
  const nav = useNavigate()
  const { id } = useParams()
  const loc = useLocation()
  const dispatch = useStateDispatch()
  //data.status  新建1  开始执行2  暂停3  取消4   已过期5   已完成6
  const [status, setstatus] = useState('')
  const detailRef = useRef<API.GetVCTaskDetailRes>(null)
  const [index, setIndex] = useState(0)
  // 获取详情
  const getDetail = async () => {
    try {
      dispatch({
        type: 'changeLoading',
        payload: true,
      })
      const res = await getVCTaskDetail({
        sendlist: id,
      })
      if (res.status == 'success') {
        setstatus(res.data.status)
        detailRef.current = res.data
        dispatch({
          type: 'changeDetail',
          payload: res.data,
        })
      }
    } catch (error) {}
  }
  const changeDetailLoading = () => {
    if (loc.pathname.includes('/info')) {
      setIndex(0)
      getDetail()
    } else {
      setIndex(1)
      if (!store.detail) {
        getDetail()
      }
    }
  }
  // 开始执行2  暂停3  取消4
  const updateTask = async (status) => {
    try {
      const res = await changeVCTaskStatus({ sendlist: id, status })
      if (res.status == 'success') {
        setstatus(status)
        dispatch({
          type: 'changeDetail',
          payload: {
            ...detailRef.current,
            status,
          },
        })
        getDetail()
      }
    } catch (error) {}
  }

  useEffect(() => {
    changeDetailLoading()
  }, [loc])

  return (
    <Flex
      className='g-radius-4 p-x-16 p-y-12 m-t-24'
      style={{ border: '1px solid #eee' }}
      justify='space-between'
      align='center'
      gap={12}>
      <Space size={2} wrap>
        <div
          onClick={() => nav(`/console/voiceChatbot/call/detail/${id}/info`)}
          className={
            index == 0
              ? 'detail-nav nav-active p-x-12'
              : 'detail-nav text-color p-x-12'
          }>
          任务概览
        </div>
        <div
          onClick={() =>
            nav(`/console/voiceChatbot/call/detail/${id}/sendList/called`)
          }
          className={
            index == 1
              ? 'detail-nav nav-active p-x-12'
              : 'detail-nav text-color p-x-12'
          }>
          外呼明细
        </div>
      </Space>
      <Space wrap size={[12, 12]}>
        {status == '6' && (
          <ConfigProvider
            theme={{
              token: {
                colorPrimary: '#00E0DF',
              },
            }}>
            <Button type='primary' size='small'>
              <Space className='text-color'>
                <span>一键重呼</span>
                <span className='icon iconfont icon-recall fn14'></span>
              </Space>
            </Button>
          </ConfigProvider>
        )}

        {status == '2' && (
          <ConfigProvider
            theme={{
              token: {
                colorPrimary: '#f19d25',
              },
            }}>
            <Button type='primary' size='small' onClick={() => updateTask('3')}>
              <Space>
                <span>暂停任务</span>
                <span className='icon iconfont icon-task-stop fn14'></span>
              </Space>
            </Button>
          </ConfigProvider>
        )}
        {status == '3' && (
          <Button type='primary' size='small' onClick={() => updateTask('2')}>
            <Space>
              <span>开始执行</span>
              <span className='icon iconfont icon-task-start fn14'></span>
            </Space>
          </Button>
        )}

        {['1', '2', , '3'].includes(status) && (
          <ConfigProvider
            theme={{
              token: {
                colorPrimary: '#ff4d4f',
              },
            }}>
            <Popconfirm
              title='警告'
              description='确定取消该任务？'
              onConfirm={() => updateTask('4')}
              placement='bottom'
              okText='确定'
              cancelText='取消'>
              <Button type='primary' size='small'>
                <Space>
                  <span>取消任务</span>
                  <span className='icon iconfont icon-task-cansel fn14'></span>
                </Space>
              </Button>
            </Popconfirm>
          </ConfigProvider>
        )}
        <ConfigProvider
          theme={{
            token: {
              colorPrimary: '#00a97b',
            },
          }}>
          <Button
            type='primary'
            size='small'
            onClick={() => {
              getDetail()
            }}
            style={{ boxShadow: 'none' }}>
            <Space>
              <span>刷新状态</span>
              <SyncOutlined rev={null} spin={store.loading} />
            </Space>
          </Button>
        </ConfigProvider>
      </Space>
    </Flex>
  )
}
