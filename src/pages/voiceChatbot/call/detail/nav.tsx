import { Flex, Space, Button } from 'antd'
import { useState, useEffect } from 'react'
import { useParams, NavLink } from 'react-router-dom'
import {} from '@ant-design/icons'

// 00E0DF
export default function Fn() {
  const { id } = useParams()
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
        <Button
          type='primary'
          size='small'
          style={{ backgroundColor: '#00E0DF', color: 'var(--text-color)' }}>
          <Space>
            <span>一键重呼</span>
            <span className='icon iconfont icon-gps fn14'></span>
          </Space>
        </Button>
        <Button type='primary' size='small'>
          <Space>
            <span>导出报表</span>
            <span className='icon iconfont icon-upload fn14'></span>
          </Space>
        </Button>
        <Button
          type='primary'
          size='small'
          style={{ backgroundColor: 'var(--waiting-color' }}>
          <Space>
            <span>暂停任务</span>
            <span className='icon iconfont icon-gps fn14'></span>
          </Space>
        </Button>
        <Button
          type='primary'
          size='small'
          style={{ backgroundColor: 'var(--success-color' }}>
          <Space>
            <span>刷新状态</span>
            <span className='icon iconfont icon-zhongzhi fn14'></span>
          </Space>
        </Button>
      </Space>
    </Flex>
  )
}
