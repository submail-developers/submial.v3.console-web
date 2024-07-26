import { Descriptions, Flex, Popconfirm, Button, Space } from 'antd'
import { NavLink } from 'react-router-dom'
import ACopy from '@/components/aCopy'
import type { DescriptionsProps } from 'antd'
import { API } from 'apis'
import { cancelRcsTask } from '@/api'

type Props = {
  sendlist?: API.GetSendlistReportResInfo
  onRefresh: () => void // 撤销任务刷新状态
}
enum SendStatusEnum {
  '尚未开始' = 0,
  '发送完成' = 1,
  '已撤销' = 9,
}
enum SendStatusColorEnum {
  'waiting-color' = 0,
  'success-color' = 1,
  'error-color' = 9,
}
export default function Fn({ sendlist, onRefresh }: Props) {
  // 撤销任务
  const cancelTask = async (id) => {
    try {
      const res = await cancelRcsTask({ id })
      if (res.status == 'success') {
        onRefresh()
      }
    } catch (error) {}
  }
  const items: DescriptionsProps['items'] = [
    {
      label: '任务名称',
      children: sendlist?.title || '-',
    },
    {
      label: '任务状态',
      children: (
        <Flex justify='space-between' align='center'>
          <span className={SendStatusColorEnum[sendlist?.status]}>
            {SendStatusEnum[sendlist?.status]}
            {sendlist?.type == '2' && (
              <span className='gray-color-sub'>
                (定时时间：{sendlist?.timetosend})
              </span>
            )}
          </span>

          {sendlist?.type == '2' && sendlist?.status == '0' && (
            <Popconfirm
              placement='bottom'
              title='警告'
              description='确定撤销该任务吗？'
              onConfirm={() => cancelTask(sendlist?.id)}
              okText='确定'
              cancelText='取消'>
              <Button type='link' style={{ paddingLeft: 0 }}>
                撤销
              </Button>
            </Popconfirm>
          )}
        </Flex>
      ),
    },
    {
      label: 'Chatbot名称(ID)',
      children: (
        <Space size={0} align='center' wrap style={{ width: 180 }}>
          <div style={{ position: 'relative' }}>
            {sendlist?.chatbot_name ? (
              <>
                <ACopy
                  text={sendlist?.chatbot_name}
                  title='点击复制Chatbot名称'
                />
                {sendlist?.chatbot_name}
              </>
            ) : (
              '-'
            )}
          </div>
          {sendlist?.appid ? (
            <NavLink
              target='__blank'
              to={`/console/rcs/chatbot/detail/${sendlist?.appid}`}
              className='gray-color-sub g-pointer'>
              ({sendlist?.appid})
            </NavLink>
          ) : (
            ''
          )}
        </Space>
      ),
    },
    {
      label: '联系人',
      children: sendlist?.address || '-',
    },
    {
      label: '短信回落',
      children: (
        <span>
          {sendlist ? (
            <>
              {sendlist?.shortMessageSupported == 'true' ? (
                sendlist?.smsBodyText || '-'
              ) : (
                <span className='warning-color'>未配置</span>
              )}
            </>
          ) : (
            '-'
          )}
        </span>
      ),
    },
    {
      label: '彩信回落',
      children: (
        <div>
          {sendlist ? (
            <>
              {sendlist?.multimediaMessageSupported == 'true' ? (
                <>
                  {sendlist?.mmsSubject ? (
                    <span style={{ position: 'relative' }}>
                      【{sendlist?.mmsSubject}】
                      <ACopy
                        text={sendlist?.mmsSubject}
                        title='点击复制彩信标题'
                      />
                    </span>
                  ) : (
                    '-'
                  )}
                </>
              ) : (
                <span className='warning-color'>未配置</span>
              )}
            </>
          ) : (
            '-'
          )}
        </div>
      ),
    },
    {
      label: '提交任务时间',
      children: sendlist?.send || '-',
    },
    {
      label: '任务完成时间',
      children: sendlist?.sent || '-',
    },
  ]
  return (
    <Descriptions
      title=''
      bordered
      column={1}
      style={{ flex: 1 }}
      labelStyle={{ width: 160 }}
      items={items}
    />
  )
}
