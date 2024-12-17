import { useState } from 'react'
import { Descriptions, Image, App, Space } from 'antd'
import type { DescriptionsProps } from 'antd'
import { API } from 'apis'
import { refreshAppkey } from '@/api'
import { actualIssueIndustryOptions } from '@/pages/rcs/chatbot/type'

type Props = {
  detail?: API.ChatbotItem
  reloadEvent: () => void
}

const span = {
  xs: 2,
  sm: 2,
  md: 2,
  lg: 1,
  xl: 1,
  xxl: 1,
}

export default function Fn({ detail, reloadEvent }: Props) {
  const { message } = App.useApp()
  const [isVisibleAppkey, setIsVisibleAppkey] = useState(false)
  const items: DescriptionsProps['items'] = [
    {
      label: 'Chatbot名称',
      span: 2,
      children: detail.name,
    },
    {
      label: '应用ID',
      span: span,
      children: detail.id,
    },
    {
      label: '提供者开关',
      span: span,
      children: detail.providerSwitchCode == '1' ? '显示' : '不显示',
    },
    {
      label: 'Appkey',
      span: 2,
      children: (
        <Space>
          <div className='fn14'>
            {isVisibleAppkey
              ? detail.appkey
              : '*************************************'}
          </div>
          <div
            className='fn12 g-pointer color'
            onClick={() => setIsVisibleAppkey(!isVisibleAppkey)}>
            {isVisibleAppkey ? '隐藏' : '显示'}
          </div>
          <div
            className='fn12 g-pointer color'
            onClick={() => resetAppkey(detail.id)}>
            重置
          </div>
        </Space>
      ),
    },
    {
      label: '行业类型',
      span: span,
      children: detail.category,
    },
    {
      label: '实际下发行业',
      span: span,
      children: actualIssueIndustryOptions.find(
        (item) => item.value == detail.actualIssueIndustry,
      )?.label,
    },
    {
      label: '消息回落签名',
      span: span,
      children: <>【{detail.autograph}】</>,
    },
    {
      label: '服务方邮箱',
      span: span,
      children: detail.email,
    },
    {
      label: '服务描述',
      span: 2,
      children: detail.description,
    },
    {
      label: '服务方名称',
      span: 2,
      children: detail.provider,
    },
    {
      label: '服务方电话',
      span: span,
      children: detail.callback,
    },
    {
      label: '服务方官网',
      span: 2,
      children: detail.website,
    },
    {
      label: '服务条款链接',
      span: 2,
      children: detail.tcPage,
    },
    {
      label: '服务方详细地址',
      span: 2,
      children: detail.address,
    },
    {
      label: '背景图',
      span: span,
      children: (
        <>
          {detail.backgroundImage && (
            <Image
              className='info-img'
              src={detail.backgroundImage}
              style={{ width: '60px', height: '60px' }}
            />
          )}
        </>
      ),
    },
    {
      label: 'Chatbot头像',
      span: span,
      children: (
        <>
          {detail.logo && (
            <Image
              className='info-img'
              src={detail.logo}
              preview={false}
              style={{ width: 40 }}
            />
          )}
        </>
      ),
    },
    {
      label: '证明材料',
      span: 2,
      children: (
        <>
          {detail.attachment ? (
            <>
              <span className='icon iconfont icon-lianjie fn12 m-r-4 gray-color'></span>
              <a
                className='fn14 fw-400'
                style={{ textDecoration: 'underline' }}
                href={detail.attachment}
                download={detail.attachment}>
                查看文件
              </a>
            </>
          ) : (
            '-'
          )}
        </>
      ),
    },
    {
      label: 'Chatbot调试白名单',
      span: 2,
      children: detail.debugWhiteAddress,
    },
  ]

  const resetAppkey = async (id) => {
    try {
      let params = {
        appid: id,
      }
      const res = await refreshAppkey(params)
      if (res.status == 'success') {
        message.success('重置成功')
        reloadEvent()
      }
    } catch (error) {}
  }

  return (
    <Descriptions
      className='m-t-24'
      title=''
      bordered
      column={2}
      labelStyle={{
        width: 180,
        backgroundColor: 'var(--table-bg)',
        fontSize: '15px',
      }}
      contentStyle={{ fontWeight: 500 }}
      items={items}
    />
  )
}
