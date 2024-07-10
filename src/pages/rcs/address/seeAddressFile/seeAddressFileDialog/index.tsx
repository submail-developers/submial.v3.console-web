import { useState, forwardRef, useEffect, useRef } from 'react'
import { Modal, Form, App, Button, Input, Select, Transfer, Flex } from 'antd'
import type { TransferProps } from 'antd'
import { getMobAddressbooks, moveAddressBook } from '@/api'
import { uniqBy } from 'lodash'
import './index.scss'
import { getAddressPath } from '../../type'
const { Option } = Select

interface Props {
  open: boolean
  onCancel: () => void
  onSearch: () => void
  folderTitle: string
  folderId: string
  foldetAddressList: any[]
}
const options = [
  { label: '全部标签', value: 'all', color: '#1764ff' },
  { label: '默认标签', value: 'tag-blue', color: '#1764ff' },
  { label: '红色标签', value: 'tag-red', color: '#ff4446' },
  { label: '紫色标签', value: 'tag-purple', color: '#6f42c1' },
  { label: '青色标签', value: 'tag-cyan', color: '#17a2b8' },
  { label: '绿色标签', value: 'tag-green', color: '#17c13d' },
  { label: '黄色标签', value: 'tag-yellow', color: '#ffba00' },
]

const Dialog = (props: Props, ref: any) => {
  const [form] = Form.useForm()
  const { message } = App.useApp()
  const [currentPage, setcurrentPage] = useState<number>(1)
  const [pageSize, setpageSize] = useState<number>(9)
  // const [total, setTotal] = useState<number>(0)
  // const [loading, setLoading] = useState(false)
  const [moveLoading, setMoveLoading] = useState(false)

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

  const renderItem = (item: any) => {
    const customLabel = (
      <div className='custom-item fx-y-center'>
        <img
          className='m-r-10'
          width='32'
          src={getAddressPath(Number(item.tag))}
          alt=''
        />
        <span className='fw-500'>{item.name}</span>
        <span className='num-p m-l-10 m-r-10 fn14 gray-color'>
          {' '}
          {item.address} 个联系人
        </span>{' '}
      </div>
    )
    return {
      label: customLabel,
      value: item.id,
    }
  }

  const handleSearch = () => {
    getAddressList()
  }
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

      // setTotal(res.rows)
      // setLoading(false)
    } catch (error) {
      // setLoading(false)
      console.log(error)
    }
  }

  const handleOk = async () => {
    setMoveLoading(true)
    try {
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
      if (addArr.length > 0) {
        // 移出
        await moveAddressBook({
          ids: addArr.join(','),
          folder: props.folderId,
          type: 1,
          flag: 2,
        })
      }
      if (delArr.length > 0) {
        // 移入
        await moveAddressBook({
          ids: delArr.join(','),
          folder: props.folderId,
          type: 1,
          flag: 1,
        })
      }
      props.onCancel()
      props.onSearch()
      message.success('保存成功')
      setMoveLoading(false)
    } catch (error) {
      setMoveLoading(false)
    }
  }

  return (
    <Modal
      open={props.open}
      onCancel={props.onCancel}
      onOk={handleOk}
      confirmLoading={moveLoading}
      width={820}
      data-class='create-address'
      closable={false}
      wrapClassName='modal-create-address'
      title={
        <Form
          form={form}
          className='cuploadMms-form w-100'
          name='cuploadMms-account'
          layout='vertical'
          autoComplete='off'>
          <Flex
            justify='space-between'
            align='center'
            gap={12}
            wrap='wrap'
            className='p-y-8'>
            <div className='fn18'>移入地址簿</div>
            <div style={{ display: 'flex' }}>
              <Form.Item name='tag' style={{ margin: 0, width: '120px' }}>
                <Select placeholder='所有标签' onChange={handleSearch}>
                  {options.map((option) => (
                    <Option key={option.value} value={option.value}>
                      {option.label}
                    </Option>
                  ))}
                </Select>
              </Form.Item>

              <Form.Item
                label=''
                name='keywords'
                className='m-l-10 m-r-10'
                style={{ marginBottom: '0' }}>
                <Input
                  placeholder='地址簿名称'
                  allowClear
                  style={{ width: 120 }}></Input>
              </Form.Item>
              <Button
                style={{
                  width: '100px',
                  lineHeight: 'inherit',
                }}
                type='primary'
                htmlType='submit'
                onClick={handleSearch}>
                搜索
              </Button>
            </div>
          </Flex>
        </Form>
      }>
      <Transfer
        style={{ width: 'fit-content', margin: '0 auto' }}
        listStyle={{
          height: 460,
          width: 363,
        }}
        titles={['地址簿公海', props.folderTitle]}
        rowKey={(record) => record.id}
        dataSource={dataSource}
        targetKeys={targetKeys}
        onChange={onChange}
        // render={(item) => item.name}
        oneWay={oneWay}
        render={renderItem}
      />
    </Modal>
  )
}
export default forwardRef(Dialog)
