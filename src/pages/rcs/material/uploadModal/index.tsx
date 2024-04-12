import { useEffect, useRef, useState } from 'react'
import { Modal, Button, Flex, App, Space, Upload, Image } from 'antd'
import type { UploadFile } from 'antd'
import { InboxOutlined } from '@ant-design/icons'
import { uploadRcsMeteialFile } from '@/api'
import audioFileImg from '@/assets/rcs/fileType/audio.png'
import imgFileImg from '@/assets/rcs/fileType/img.png'
import pptFileImg from '@/assets/rcs/fileType/ppt.png'
import unknowFileImg from '@/assets/rcs/fileType/unknow.png'
import videoFileImg from '@/assets/rcs/fileType/video.png'
import wordFileImg from '@/assets/rcs/fileType/word.png'
import xlsFileImg from '@/assets/rcs/fileType/xls.png'
import zipFileImg from '@/assets/rcs/fileType/zip.png'

import './index.scss'

type Props = {
  show: boolean
  onCancel: () => void
  onOk: () => void
}

type FaqItem = {
  title: string
  size: number
  suffix: string[] // 文件后缀
  types: string[] // 文件type类型
  img: string
}

const { Dragger } = Upload

const imgTypes = ['image/jpeg', 'image/png', 'image/gif']
const videoTypes = ['video/mp4', 'video/3gpp']
const imgSize = 2
const videoSize = 10
const defaultSize = 5 // 默认文件大小限制

const faq: FaqItem[] = [
  {
    title: '图片',
    size: imgSize,
    suffix: ['jpg', 'jpeg', 'png', 'gif'],
    types: imgTypes,
    img: imgFileImg,
  },
  {
    title: '视频',
    size: videoSize,
    suffix: ['mp4', '3gp'],
    types: videoTypes,
    img: videoFileImg,
  },
  {
    title: '音频',
    size: defaultSize,
    suffix: ['mp3', 'midi', 'wav'],
    types: ['audio/mpeg', 'audio/midi', 'audio/wav'],
    img: audioFileImg,
  },
  {
    title: '文档',
    size: defaultSize,
    suffix: ['doc', 'docx', 'pdf'],
    types: [
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/pdf',
    ],
    img: wordFileImg,
  },
  {
    title: '表格',
    size: defaultSize,
    suffix: ['xls', 'xlsx'],
    types: [
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    ],
    img: xlsFileImg,
  },
  {
    title: '演示文件',
    size: defaultSize,
    suffix: ['ppt', 'pptx'],
    types: [
      'application/vnd.ms-powerpoint',
      'application/vnd.openxmlformats-officedocument.presentationml.presentation',
    ],
    img: pptFileImg,
  },
  {
    title: '压缩文件',
    size: defaultSize,
    suffix: ['zip', 'rar', '7z'],
    types: [
      'application/zip',
      'application/x-rar-compressed',
      'application/x-7z-compressed',
    ],
    img: zipFileImg,
  },
  {
    title: '其他',
    size: defaultSize,
    suffix: [],
    types: [],
    img: unknowFileImg,
  },
]

export default function UploadModal(props: Props) {
  const { message: messageApi } = App.useApp()
  const [status, setSatus] = useState<0 | 1 | 2>(0) // 0未上传 1上传中 2上传结束
  const [fileList, setFileList] = useState<UploadFile[]>([])
  const listRef = useRef<UploadFile[]>([])
  const propsDragger = {
    name: 'file',
    maxCount: 10,
    multiple: true,
    fileList: fileList,
    disabled: status == 1,
    onRemove: (file) => {
      if (status == 1) return
      const index = fileList.indexOf(file)
      listRef.current = fileList.slice()
      listRef.current.splice(index, 1)
      setFileList(listRef.current)
    },
    beforeUpload: (file) => {
      if (listRef.current.length >= 10 && status == 0) {
        messageApi.warning('一次最多上传10个素材')
        return false
      }

      if (status == 2) {
        listRef.current = []
        setSatus(0)
        setFileList([])
      }

      // 图片限制2M
      const currentSize = (file.size / 1024 / 1024).toFixed(2)
      if (imgTypes.includes(file.type)) {
        if (file.size > imgSize * 1024 * 1024) {
          file.status = 'error'
          file.response = `该图片大小超出2M限制，当前文件${currentSize}M`
        }
      } else if (videoTypes.includes(file.type)) {
        // 视频限制10M
        if (file.size > videoSize * 1024 * 1024) {
          file.status = 'error'
          file.response = `该视频大小超出10M限制，当前文件${currentSize}M`
        }
      } else {
        // 视频限制10M
        if (file.size > defaultSize * 1024 * 1024) {
          file.status = 'error'
          file.response = `该文件大小超出5M限制，当前文件${currentSize}M`
        }
      }

      listRef.current = [...listRef.current, file]
      setFileList([...listRef.current])
      return false
    },
  }

  // 递归-上传事件
  const uploadEvent = async (index = 0) => {
    try {
      if (fileList.length < index + 1) {
        setSatus(2)
        if (fileList.find((item) => item.status == 'error')) {
          messageApi.warning('存在上传失败的素材，其余上传成功', 5)
        } else {
          messageApi.success(
            '全部上传成功，继续上传可直接选择文件或拖拽文件',
            5,
          )
        }
        return
      }
      if (fileList[index].status == 'error') {
        uploadEvent(index + 1)
      } else {
        setFileList(
          fileList.map((item, idx) => {
            if (idx == index) item.status = 'uploading'
            return item
          }),
        )
        const res = await uploadRcsMeteialFile({ file: fileList[index] })
        if (res.status == 'success') {
          setFileList(
            fileList.map((item, idx) => {
              if (idx == index) {
                item.status = 'done'
                item.response = '上传成功'
              }
              return item
            }),
          )
        } else {
          setFileList(
            fileList.map((item, idx) => {
              if (idx == index) {
                item.status = 'error'
                item.response = res.message || ''
              }
              return item
            }),
          )
        }
        uploadEvent(index + 1)
      }
    } catch (error) {
      setFileList(
        fileList.map((item, idx) => {
          if (idx == index) {
            item.status = 'error'
            item.response = error.message || error || '上传失败'
          }
          return item
        }),
      )
      uploadEvent(index + 1)
    }
  }

  // 点击上传
  const onOk = async () => {
    if (fileList.length > 0) {
      if (fileList.filter((item) => item.status != 'error').length > 0) {
        setSatus(1)
        uploadEvent(0)
      } else {
        messageApi.warning('素材文件大小不符合要求，请重新选择文件', 4)
      }
    } else {
      messageApi.warning('请选择要上传的素材文件', 4)
    }
  }

  // 初始化比例和质量
  useEffect(() => {
    return () => {
      setSatus(0)
      setFileList([])
    }
  }, [props.show])

  return (
    <Modal
      width={1092}
      title='上传素材'
      footer={null}
      maskClosable={false}
      classNames={{ header: 'upload-header', body: 'upload-body' }}
      wrapClassName='upload-modal'
      destroyOnClose
      onCancel={props.onCancel}
      open={props.show}>
      <Flex justify='space-between' gap={24} className='modal-content'>
        <div className='img-layer-canvas'>
          <Dragger {...propsDragger} className='dragger'>
            <p className='ant-upload-drag-icon'>
              <InboxOutlined rev={null} />
            </p>
            <p className='ant-upload-text'>点击选择文件或拖拽文件到此区域</p>
            <p className='ant-upload-hint'>
              支持批量上传，单次上传最多10个素材文件
            </p>
          </Dragger>
        </div>
        <div className='img-editor-wrap'>
          <div className='' style={{ color: 'rgba(0, 0, 0, 0.45)' }}>
            <div className='color-default'>上传文件说明：</div>
            <div className='fn14'>
              5G消息支持任意格式文件上传。可识别文件为以下格式：
            </div>
            {faq.map((item) => {
              return (
                <Space key={item.title} style={{ padding: '6px 0' }}>
                  <Image preview={false} src={item.img} width={46} />
                  <div>
                    <div className='fn13 color-default'>{item.title}</div>
                    <div className='fn12'>
                      {item.suffix.length > 0
                        ? `支持${item.suffix.join('、')}， 单个素材不超过${
                            item.size
                          }M。`
                        : `其他不可识别类型文件， 单个素材不超过${item.size}M。`}
                    </div>
                  </div>
                </Space>
              )
            })}
          </div>
          <Flex justify='space-between' style={{ marginTop: '0' }}>
            <Button style={{ width: '140px' }} onClick={props.onCancel}>
              取消
            </Button>
            <Button
              style={{ width: '140px' }}
              type='primary'
              onClick={onOk}
              loading={status == 1}>
              上传
            </Button>
          </Flex>
        </div>
      </Flex>
    </Modal>
  )
}
