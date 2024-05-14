import { useEffect, useState } from 'react'
import {
  Modal,
  Button,
  Flex,
  App,
  Space,
  Image,
  Form,
  Row,
  Col,
  Input,
  Pagination,
  Empty,
} from 'antd'

import { getMmsMaterialList, uploadMmsLibs } from '@/api'
import { IDIcon } from '@/components/aIcons'

import { API } from 'apis'
import './index.scss'
import ACopy from '@/components/aCopy'
import { usePoint } from '@/hooks'

type Props = {
  show: boolean
  onCancel: () => void
  onOk: (info: API.UploadMmsLibsRes) => void
}

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
        <Image
          className='info-img'
          src={info.content.image.url}
          preview={false}
        />
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
            style={{ color: '#fd29a4', position: 'relative' }}
            size='small'
            icon={
              <IDIcon
                style={{
                  color: '#fd29a4',
                  fontSize: '14px',
                }}
              />
            }>
            {item.sign}
            <ACopy text={item.sign} title='点击复制ID' />
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

type TitleProps = {
  loading: boolean
  onSearch: (str: string) => void
}
const Title = (props: TitleProps) => {
  const [text, setText] = useState<string>()
  return (
    <Flex justify='space-between' align='center'>
      <div>选择彩信模版</div>
      <Space>
        <Input
          placeholder='模版标题/模版ID'
          value={text}
          autoComplete='off'
          onChange={(e) => setText(e.target.value)}
          onPressEnter={() => props.onSearch(text)}
        />
        <Button
          type='primary'
          loading={props.loading}
          onClick={() => props.onSearch(text)}>
          搜索
        </Button>
      </Space>
    </Flex>
  )
}

const pageSize = 6

export default function UploadModal(props: Props) {
  const point = usePoint('sm')
  const { message } = App.useApp()
  const [form] = Form.useForm()
  const [total, setTotal] = useState<number>(0)

  const [loading, setLoading] = useState(false)
  const [uploadLoading, setUploadLoading] = useState(false)
  const [messageList, setMessageList] = useState([])
  const [templatesList, setTemplatesList] = useState<API.getMmsMaterialItem[]>(
    [],
  )
  const [currentPage, setcurrentPage] = useState<number>(1)
  // const [open, setOpen] = useState(false)
  const [checkId, setCheckId] = useState('')
  const [sign, setSign] = useState('')
  // 获取彩信素材模板
  const getList = async () => {
    try {
      const formValues = await form.getFieldsValue()
      const res = await getMmsMaterialList({
        ...formValues,
        page: currentPage,
        // limit: pageSize,
        status: '1',
        search_type: 'all',
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

  // 切换页码
  const onChangeCurrentPage = (page: number, pageSize: number) => {
    setcurrentPage(page)
  }
  // 搜索
  const handleSearch = () => {
    setLoading(true)
    setcurrentPage(1)
    getList()
  }
  const onCheck = (id: string) => {
    setCheckId(id)
  }
  const onSign = (sign: string) => {
    setSign(sign)
  }

  // 将彩信模板上报值运营商
  const netxClck = async () => {
    if (!sign) {
      message.warning('请选择模版')
      return
    }
    setUploadLoading(true)
    try {
      const res = await uploadMmsLibs({ mms_template_id: sign })
      if (res.status == 'success') {
        setUploadLoading(false)
        props.onOk(res.data)
      }
    } catch (error) {
      setUploadLoading(false)
    }
  }

  useEffect(() => {
    if (props.show) {
      getList()
    }
  }, [currentPage, pageSize])

  useEffect(() => {
    if (props.show) {
      setUploadLoading(false)
      setcurrentPage(1)
      getList()
    }
  }, [props.show])

  return (
    <Modal
      width={1092}
      title={<Title loading={loading} onSearch={handleSearch} />}
      footer={
        <Flex justify='space-between' align='center' wrap='wrap'>
          <Pagination
            defaultCurrent={1}
            current={currentPage}
            defaultPageSize={pageSize}
            showSizeChanger={false}
            total={total}
            size={point ? 'default' : 'small'}
            showQuickJumper
            onChange={onChangeCurrentPage}
            showTotal={(total) => `共 ${total} 条`}
          />
          <Space>
            <Button onClick={props.onCancel}>取消</Button>
            <Button type='primary' loading={uploadLoading} onClick={netxClck}>
              下一步
            </Button>
          </Space>
        </Flex>
      }
      wrapClassName='mms-modal'
      closeIcon={null}
      destroyOnClose
      onCancel={props.onCancel}
      open={props.show}>
      <Row className='mms-temp' wrap>
        {templatesList.map((item, index) => (
          <Col span={24} md={12} lg={8} key={item.id}>
            <Item
              item={item}
              checkId={checkId}
              sign={sign}
              onCheck={onCheck}
              onSign={onSign}></Item>
          </Col>
        ))}
        {templatesList.length == 0 && (
          <div className='w-100 m-t-40'>
            <Empty />
          </div>
        )}
      </Row>
    </Modal>
  )
}
