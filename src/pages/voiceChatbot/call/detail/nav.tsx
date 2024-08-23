import { Flex, Space, Button, ConfigProvider, Popconfirm } from 'antd'
import { useParams, NavLink } from 'react-router-dom'
import { API } from 'apis'
import { changeVCTaskStatus, getVCTaskDetail } from '@/api'
import { useEffect, useState } from 'react'

type Props = {
  onRefresh?: () => void // 点击刷新
}

export default function Fn(props: Props) {
  const { id } = useParams()
  //data.status  新建1  开始执行2  暂停3  取消4   已过期5   已完成6
  const [status, setstatus] = useState('')
  // 获取详情
  const getDetail = async () => {
    try {
      const res = await getVCTaskDetail({
        sendlist: id,
      })
      if (res.status == 'success') {
        setstatus(res.data.status)
      }
    } catch (error) {}
  }
  // 开始执行2  暂停3  取消4
  const updateTask = async (status) => {
    try {
      const res = await changeVCTaskStatus({ sendlist: id, status })
      if (res.status == 'success') {
        reFresh()
      }
    } catch (error) {}
  }
  // 刷新
  const reFresh = () => {
    getDetail()
    props.onRefresh()
  }

  useEffect(() => {
    getDetail()
  }, [])

  return (
    <Flex
      className='g-radius-4 p-x-16 p-y-12 m-t-24'
      style={{ border: '1px solid #eee' }}
      justify='space-between'
      align='center'
      gap={12}>
      <Space size={2} wrap>
        <NavLink
          to={`/console/voiceChatbot/call/detail/${id}/info`}
          className={({ isActive, isPending }) =>
            isActive
              ? 'detail-nav nav-active p-x-12 p-y-6'
              : 'detail-nav text-color p-x-12 p-y-6'
          }>
          发送明细
        </NavLink>
        <NavLink
          to={`/console/voiceChatbot/call/detail/${id}/sendList`}
          className={({ isActive, isPending }) =>
            isActive
              ? 'detail-nav nav-active p-x-12 p-y-6'
              : 'detail-nav text-color p-x-12 p-y-6'
          }>
          任务列表
        </NavLink>
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
          <Popconfirm
            title='警告'
            description='确定取消该任务？'
            onConfirm={() => updateTask('4')}
            okText='确定'
            cancelText='取消'>
            <ConfigProvider
              theme={{
                token: {
                  colorPrimary: '#ff4d4f',
                },
              }}>
              <Button type='primary' size='small'>
                <Space>
                  <span>取消任务</span>
                  <span className='icon iconfont icon-task-cansel fn14'></span>
                </Space>
              </Button>
            </ConfigProvider>
          </Popconfirm>
        )}
        <ConfigProvider
          theme={{
            token: {
              colorPrimary: '#00a97b',
            },
          }}>
          <Button type='primary' size='small' onClick={reFresh}>
            <Space>
              <span>刷新状态</span>
              <span className='icon iconfont icon-zhongzhi fn14'></span>
            </Space>
          </Button>
        </ConfigProvider>
      </Space>
    </Flex>
  )
}
