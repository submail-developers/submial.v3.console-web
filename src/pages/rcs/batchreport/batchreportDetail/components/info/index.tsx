import { Descriptions } from 'antd'
import ACopy from '@/components/aCopy'
import type { DescriptionsProps } from 'antd'
import { API } from 'apis'

type Props = {
  sendlist?: API.GetSendlistReportResInfo
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
export default function Fn({ sendlist }: Props) {
  const items: DescriptionsProps['items'] = [
    {
      label: '任务名称',
      children: sendlist?.title || '-',
    },
    {
      label: '任务状态',
      children: (
        <span className={SendStatusColorEnum[sendlist?.status]}>
          {sendlist?.status ? SendStatusEnum[sendlist?.status] : '-'}
        </span>
      ),
    },
    {
      label: 'Chatbot名称',
      children: sendlist?.chatbot_name || '-',
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
              {sendlist?.shortMessageSupported == 'true'
                ? sendlist?.smsBodyText || '-'
                : '未配置'}
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
                '未配置'
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
