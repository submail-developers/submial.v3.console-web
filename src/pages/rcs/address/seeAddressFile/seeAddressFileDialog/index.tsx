import {
  useState,
  useImperativeHandle,
  forwardRef,
  useEffect,
  useRef,
} from 'react'
import {
  Modal,
  Form,
  App,
  Upload,
  Button,
  Input,
  Select,
  Switch,
  Transfer,
} from 'antd'
import type { TransferProps } from 'antd'
import { getMobAddressbooks } from '@/api'
import { divide, uniqBy } from 'lodash'
import { API } from 'apis'
import './index.scss'
const { Option } = Select

interface Props {
  open: boolean
  // isEdit: boolean
  // onCancel: () => void
  // onOk: () => void
  foldetAddressList: any[]
}
interface RecordType {
  key: string
  title: string
  description: string
  chosen: boolean
}
const { Search } = Input

const Dialog = (props: Props, ref: any) => {
  const [form] = Form.useForm()
  const { message } = App.useApp()
  const [currentPage, setcurrentPage] = useState<number>(1)
  const [pageSize, setpageSize] = useState<number>(9)
  const [total, setTotal] = useState<number>(0)
  const [loading, setLoading] = useState(false)
  const [oneWay, setOneWay] = useState(false)
  const [dataSource, setdataSource] = useState([])
  const [targetKeys, setTargetKeys] = useState<React.Key[]>([])
  const targetItemsRef = useRef([])

  useEffect(() => {
    if (props.open) {
      targetItemsRef.current = props.foldetAddressList
      getAddressList()
      let _targetKeys = []
      props.foldetAddressList.forEach((item) => {
        _targetKeys.push(item.id)
      })
      setTargetKeys(_targetKeys)
    }
  }, [props.open])
  const onChange: TransferProps['onChange'] = (
    newTargetKeys,
    direction,
    moveKeys,
  ) => {
    targetItemsRef.current = dataSource.filter((item) =>
      newTargetKeys.includes(item.id),
    )

    setTargetKeys(newTargetKeys)
  }

  const handleSearch = () => {}
  // 获取公共地址簿
  const getAddressList = async () => {
    try {
      const formValues = await form.getFieldsValue()
      const res = await getMobAddressbooks({
        ...formValues,
        page: currentPage,
        limit: pageSize,
      })

      setdataSource(
        uniqBy(
          [
            ...targetItemsRef.current,
            ...res.addressbooks,
            ...props.foldetAddressList,
          ],
          'id',
        ),
      )

      setTotal(res.rows)
      setLoading(false)
    } catch (error) {
      setLoading(false)
      console.log(error)
    }
  }

  const options = [
    { label: '无标签', value: 'none', color: '#282b31' },
    { label: '红色', value: 'red', color: '#ff4446' },
    { label: '紫色', value: 'purple', color: '#6f42c1' },
    { label: '青色', value: 'cyan', color: '#17a2b8' },
    { label: '蓝色', value: 'blue', color: '#1764ff' },
    { label: '绿色', value: 'green', color: '#17c13d' },
    { label: '黄色', value: 'yellow', color: '#ffba00' },
  ]

  const handleOk = () => {
    // props.onCancel()
    let propsArr: React.Key[] = []
    props.foldetAddressList.forEach((item, index) => {
      propsArr.push(item.id as React.Key)
    })
    let addArr: React.Key[] = propsArr.filter(
      (item) => !targetKeys.includes(item),
    )
    let delArr: React.Key[] = targetKeys.filter(
      (item) => !propsArr.includes(item),
    )
    console.log(propsArr, targetKeys, addArr, delArr)
  }

  const handleCancel = () => {
    // props.onCancel()
  }

  const onFinish = () => {}
  const onFinishFailed = () => {}

  return (
    <Modal
      open={props.open}
      // onCancel={props.onCancel}
      title={
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
            <div className='fn18'>移入地址簿</div>
            <div style={{ display: 'flex' }}>
              <Form.Item
                label=''
                name='keywords'
                style={{ marginRight: 14, marginBottom: '0' }}>
                <Input placeholder='名称/ID'></Input>
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
      }
      onOk={handleOk}
      width={480}
      style={{ top: 240 }}
      data-class='create-address'
      closable={false}
      wrapClassName='modal-create-address'>
      <>
        <Transfer
          rowKey={(record) => record.id}
          dataSource={dataSource}
          targetKeys={targetKeys}
          onChange={onChange}
          render={(item) => item.name}
          oneWay={oneWay}
        />
      </>
    </Modal>
  )
}
export default forwardRef(Dialog)
