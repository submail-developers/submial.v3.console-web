import { useState, useEffect } from 'react'
import {
  Input,
  Upload,
  Form,
  App,
  Flex,
  Space,
  Button,
  Image as AntdImage,
} from 'antd'
import type { UploadFile, UploadProps } from 'antd'
import { UploadOutlined } from '@ant-design/icons'
import { Link } from 'react-router-dom'
import ADel from '@/components/aDel'
import em1Src from '@/assets/rcs/account/em1.jpg'
import em2Src from '@/assets/rcs/account/em2.jpg'
import em3_1Src from '@/assets/rcs/account/em3_1.jpg'
import em3_2Src from '@/assets/rcs/account/em3_2.jpg'

import './index.scss'

type Props = {
  fileList: UploadFile[]
  onChangeFile: (fileList: UploadFile[]) => void
  onDelFile: () => void
}

// 文件限制
const maxFileSize = 5 * 1024 * 1024 // 5M
const accept = '.jpg,.jpeg,.gif,.doc,.docx,.pdf,.zip,.rar'

// 证明材料上传
export default function Fn(props: Props) {
  const { message } = App.useApp()
  const [uploading, setUploading] = useState(false)
  // 选择上传文件
  const uploadProps: UploadProps = {
    accept: accept,
    onRemove: (file) => {
      props.onDelFile()
    },
    beforeUpload: (file) => {
      setUploading(true)
      const isLt50k = file.size < maxFileSize
      try {
        if (!isLt50k) {
          setUploading(false)
          message.error('上传文件最大5M', 4)
          return false
        }
        props.onChangeFile([file])
      } catch (error) {
        setUploading(false)
      }
      return false
    },
    fileList: props.fileList,
    maxCount: 1,
  }

  return (
    <div className='upload-attachment'>
      <Form.Item
        label='证明材料'
        name='attachment'
        rules={[
          {
            required: true,
            message: '请提供证明材料',
          },
        ]}
        extra={
          <div>
            <div>
              您可上传的文件类型包含：pdf、doc、jpg、jpeg、gif、docx、rar、zip，单个附件大小限5M，限上传1个文件。
            </div>
            <div
              className='p-x-16 p-y-12 g-radius-8 m-t-4 color-tab gray-color'
              style={{ lineHeight: 2 }}>
              1.Chatbot 名称为商标名称的，请提供与
              <Link to='/console/rcs/account/index' target='__blank'>
                客户管理资料
              </Link>
              中的客户名称相同的商标注册证明。（示例1）
              <br />
              2.Chatbot 名称为公司名称的，请提供与
              <Link to='/console/rcs/account/index' target='__blank'>
                客户管理资料
              </Link>
              中的客户名称相同的营业执照。（示例2）
              <br />
              3.Chatbot 名称为关联公司名称的，请提供与
              <Link to='/console/rcs/account/index' target='__blank'>
                客户管理资料
              </Link>
              中的客户名称相关联的合同首尾页。（示例3）
              <br />
              4.Chatbot 名称为无相关名称的，请联系客服沟通。
              <Flex wrap gap={16} className='m-t-8 em-wrap'>
                <div className='g-radius-8 em-item'>
                  <AntdImage src={em1Src} width={90} height={100} />
                  <div className='em-tips'>示例1</div>
                </div>
                <div className='g-radius-8 em-item'>
                  <AntdImage src={em2Src} width={90} height={100} />
                  <div className='em-tips'>示例2</div>
                </div>
                <div className='g-radius-8 em-item'>
                  <AntdImage src={em3_1Src} width={90} height={100} />
                  <div className='em-tips'>示例3(首页)</div>
                </div>
                <div className='g-radius-8 em-item'>
                  <AntdImage src={em3_2Src} width={90} height={100} />
                  <div className='em-tips'>示例3(尾页)</div>
                </div>
              </Flex>
            </div>
          </div>
        }>
        <Upload {...uploadProps}>
          <Button icon={<UploadOutlined rev={undefined} />} className='upload'>
            上传
          </Button>
        </Upload>
      </Form.Item>
    </div>
  )
}
