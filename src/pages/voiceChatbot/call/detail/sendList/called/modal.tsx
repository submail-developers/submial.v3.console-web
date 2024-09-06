import { Fragment } from 'react'
import { Modal, Tag, Flex } from 'antd'
import { DownloadOutlined } from '@ant-design/icons'
import { API } from 'apis'
import './modal.scss'
import dayjs from 'dayjs'

interface Props {
  open: boolean
  item: API.GetVCTaskCalledListItem
  onCancel: () => void
}

export default function Fn(props: Props) {
  let showAudio = false // 录音是否已过有效期时间
  let audioEndTime = '' // 录音有效时间
  if (props.open) {
    let time = dayjs()
    let endTime = dayjs(props.item.sent).add(7, 'day')
    audioEndTime = endTime.format('YYYY-MM-DD HH:mm:ss')
    showAudio = time.isBefore(endTime)
  }
  return (
    <Modal
      open={props.open}
      onCancel={props.onCancel}
      footer={null}
      title='对话详情'
      width={600}
      wrapClassName='modal-called'>
      {showAudio ? (
        <>
          <Flex justify='flex-end' align='center' gap={16}>
            <audio controls preload='auto' src={props.item.media_path}></audio>
            <a
              href={props.item.media_path}
              download={props.item.media_path}
              title='下载录音'>
              <DownloadOutlined rev={null} className='fn20' />
            </a>
          </Flex>
          <Flex justify='flex-end' className='gray-color m-t-16'>
            录音有效期至：{audioEndTime}
          </Flex>
        </>
      ) : (
        <Flex justify='flex-end' align='center' gap={16}>
          <div className='warning-color'>
            录音已过期(有效期至：{audioEndTime})
          </div>
        </Flex>
      )}
      <div className='m-t-24 p-x-12 p-y-24 g-radius-8 detail-list'>
        {props.open &&
          props.item.traces &&
          props.item.traces.map((item, index) => (
            <Fragment key={index}>
              {item.traceType == 'NodeTrace' ? (
                <Flex gap={12} className='m-t-16'>
                  <span className='color fn28 icon iconfont icon-jiqiren-filled'></span>
                  <div className='chat-info jiqiren g-radius-4 p-x-8 p-b-6 p-t-8'>
                    <Tag color='blue' className='m-r-0'>
                      {item.name}
                    </Tag>
                    <div className='m-t-8' style={{ minHeight: 22 }}>
                      {item.command.description}
                    </div>
                  </div>
                </Flex>
              ) : (
                <Flex gap={12} justify='flex-end' className='m-t-16'>
                  <Flex
                    vertical
                    align='flex-end'
                    className='chat-info user g-radius-4 p-x-8 p-b-6 p-t-8'>
                    <Tag color='blue' className='m-r-0'>
                      {props.item.traces[index - 1].name}
                    </Tag>
                    <div className='m-t-8' style={{ minHeight: 22 }}>
                      {props.item.traces[index - 1].content}
                    </div>
                    <div
                      className='m-t-8'
                      style={{ color: 'rgba(255,255,255,.7)', minHeight: 22 }}>
                      {item.judge ? `命中节点：${item.name}` : ''}
                    </div>
                  </Flex>
                  <span className='color fn24 icon iconfont icon-user'></span>
                </Flex>
              )}
            </Fragment>
          ))}
      </div>
    </Modal>
  )
}
