import { useEffect, useRef, useState } from 'react'
import {
  Modal,
  Button,
  Flex,
  App,
  Space,
  Upload,
  Image,
  Form,
  Row,
  Col,
  Input,
  Tooltip,
  Select,
  ConfigProvider,
  Pagination,
} from 'antd'

import { getMmsMaterialList, uploadMmsLibs } from '@/api'
import { IDIcon } from '@/components/aIcons'

import { API } from 'apis'
import './index.scss'
import { divide } from 'lodash'

type Props = {
  show: boolean
  onCancel: () => void
}
interface DataType extends API.getMmsMaterialItem {}

type MessageProps = {
  info: any
}
const Message = ({ info }: MessageProps) => {
  return (
    <div className='info-cont'>
      {info.content.text && (
        <div
          className='info-text'
          dangerouslySetInnerHTML={{ __html: info.content.text }}></div>
      )}
      {info.content.image && (
        <Image className='info-img' src={info.content.image.url} />
      )}
      {info.content.video && (
        <video
          src={info.content.video.url}
          controls={true}
          style={{ width: '100%', objectFit: 'contain' }}
        />
      )}
    </div>
  )
}

type ItemProps = {
  item: any
  checkId: string
  sign: string
  onCheck: (id: string) => void
  onSign: (sign: string) => void
}
const Item = ({ item, checkId, onCheck, onSign }: ItemProps) => {
  const handelChecked = (id, sign) => {
    onCheck(id)
    onSign(sign)
  }
  return (
    <div
      className={`temp-item ${checkId === item.id ? 'active' : ''}`}
      onClick={() => handelChecked(item.id, item.sign)}>
      <div className='temp-item-content'>
        <Flex justify='space-between' align='center'>
          <Button
            className='id-btn'
            style={{ padding: '0 4px', color: '#fd29a4' }}
            size='small'
            icon={
              <IDIcon
                style={{
                  color: '#fd29a4',
                  fontSize: '18px',
                }}
              />
            }>
            {item.sign}
          </Button>
        </Flex>
        <div className='preview-model'>
          <div className='preview-content'>
            <div className='temp-subject'>{item.subject}</div>
            {item.message.map((itm, index) => (
              <Message key={index} info={itm} />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default function UploadModal(props: Props) {
  const { message } = App.useApp()
  const [form] = Form.useForm()
  const [pageSize, setpageSize] = useState<number>(6)
  const [total, setTotal] = useState<number>(0)

  const [loading, setLoading] = useState(false)
  const [messageList, setMessageList] = useState([])
  const [templatesList, setTemplatesList] = useState<API.getMmsMaterialItem[]>(
    [],
  )
  const [currentPage, setcurrentPage] = useState<number>(1)
  // const [open, setOpen] = useState(false)
  const [checkId, setCheckId] = useState('')
  const [sign, setSign] = useState('')
  // 获取彩信素材模板
  const getMmsModel = async () => {
    try {
      const formValues = await form.getFieldsValue()
      const res = await getMmsMaterialList({
        ...formValues,
        page: currentPage,
        // limit: pageSize,
        search_type: 'id',
      })
      setTemplatesList(res.templates)
      // console.log(res)
      setTotal(res.rows)
      let list = res.templates.map((item, index) => {
        item.message = JSON.parse(item.message)
        return item
      })
      // console.log(list)
      setMessageList(list)

      setLoading(false)
    } catch (error) {
      setLoading(false)
    }
  }

  useEffect(() => {
    getMmsModel()
  }, [currentPage, pageSize])
  useEffect(() => {
    if (props.show) {
      setcurrentPage(1)
      setpageSize(6)
      getMmsModel()
    }
  }, [props.show])

  // 切换页码
  const onChangeCurrentPage = (page: number, pageSize: number) => {
    setcurrentPage(page)
    setpageSize(pageSize)
  }
  // 搜索
  const handleSearch = () => {
    getMmsModel()
  }
  const onCheck = (id: string) => {
    setCheckId(id)
  }
  const onSign = (sign: string) => {
    setSign(sign)
  }

  // 将彩信模板上报值运营商
  const uploadMms = async () => {
    try {
      const res = await uploadMmsLibs({ mms_template_id: sign })
      if (res.data.status == 'success') {
        message.success('上传成功！')
        setLoading(false)
      }
    } catch (error) {
      setLoading(false)
    }
  }
  const netxClck = () => {
    setLoading(true)
    setTimeout(() => {
      setLoading(false)
      uploadMms()
    }, 1000)
  }
  const handleCancel = () => {
    props.show == false
  }

  return (
    <Modal
      width={1092}
      title={[
        <>
          <Form
            form={form}
            className='cuploadMms-form w-100'
            name='cuploadMms-account'
            layout='vertical'
            autoComplete='off'>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}>
              <div className='fn18'>选择彩信模板</div>
              <div style={{ display: 'flex' }}>
                <Form.Item
                  label=''
                  name='keywords'
                  style={{ marginRight: 14, marginBottom: '0' }}>
                  <Input placeholder='模板ID'></Input>
                </Form.Item>
                <Form.Item style={{ margin: 0 }}>
                  <Button
                    style={{ height: '38px', lineHeight: 'inherit' }}
                    type='primary'
                    className='w-100'
                    htmlType='submit'
                    onClick={handleSearch}>
                    搜索
                  </Button>
                </Form.Item>
              </div>
            </div>
          </Form>
        </>,
      ]}
      footer={[
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}>
          <Pagination
            defaultCurrent={1}
            current={currentPage}
            defaultPageSize={pageSize}
            pageSizeOptions={[]}
            total={total}
            showQuickJumper
            onChange={onChangeCurrentPage}
            showTotal={(total) => `共 ${total} 条`}
          />
          <Space>
            <Button
              key='back'
              onClick={props.onCancel}
              style={{ lineHeight: 'inherit', height: 38 }}>
              取消
            </Button>

            <Button
              key='submit'
              type='primary'
              onClick={netxClck}
              loading={loading}
              style={{ lineHeight: 'inherit', height: 38 }}>
              下一步
            </Button>
          </Space>
        </div>,
      ]}
      maskClosable={false}
      classNames={{ header: 'upload-header', body: 'upload-body' }}
      wrapClassName='upload-Mmsmodal'
      closeIcon={false}
      destroyOnClose
      onCancel={props.onCancel}
      open={props.show}>
      <div className='mms-temp'>
        {templatesList.map((item, index) => (
          <Item
            key={item.id}
            item={item}
            checkId={checkId}
            sign={sign}
            onCheck={onCheck}
            onSign={onSign}></Item>
        ))}
      </div>
    </Modal>
  )
}
