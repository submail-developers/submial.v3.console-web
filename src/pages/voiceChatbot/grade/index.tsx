import { useState, useEffect } from 'react'
import {
  Flex,
  Divider,
  Image,
  Space,
  Popconfirm,
  Row,
  Col,
  Dropdown,
  Pagination,
  Checkbox,
  Empty,
  Spin,
} from 'antd'
import type { MenuProps } from 'antd'
import type { CheckboxChangeEvent } from 'antd/es/checkbox'
import faceImg from '@/assets/voiceChatbot/face/grade.png'
import mobImg from '@/assets/rcs/address/address_blue.png'
import { getGradeTypePath, GradeType } from './type'

import PageContent from '@/components/pageContent'
import AExport from '@/components/aExport'
import { downloadFile } from '@/utils'
import Card from '@/components/aCard'
import Rate from './rate'
import { API } from 'apis'
import {
  getVCGadeRate,
  getVCGadeList,
  delVCGadeMobile,
  exportVCGadeMobile,
} from '@/api'

import './index.scss'

type GradeItem = {
  type: GradeType
  text: string
}
const CheckboxGroup = Checkbox.Group

const grades: GradeItem[] = [
  {
    type: 'A',
    text: '有明确沟通意向，可作为优先客户发展',
  },
  {
    type: 'B',
    text: '有潜力客户，对产品有一定需求和兴趣',
  },
  {
    type: 'C',
    text: '处于观望状态的客户，可能会对产品感兴趣',
  },
  {
    type: 'D',
    text: '无沟通意向的客户，对产品无需求或不感兴趣',
  },
]

const dropdownItems: MenuProps['items'] = [
  {
    key: 'A',
    label: <div>A类客户</div>,
  },
  {
    key: 'B',
    label: <div>B类客户</div>,
  },
  {
    key: 'C',
    label: <div>C类客户</div>,
  },
  {
    key: 'D',
    label: <div>D类客户</div>,
  },
]

const items: MenuProps['items'] = [
  { label: '导出 TXT', key: 'txt' },
  { label: '导出 CSV', key: 'csv' },
  { label: '导出 EXCEL', key: 'excel' },
  { label: '导出 JSON', key: 'json' },
  { label: '导出 XML', key: 'xml' },
]

export default function Fn() {
  const [rateLoading, setRateLoading] = useState(false)
  const [rateInfo, setRateInfo] = useState<API.VCGadeRateItem[]>([]) // 意向客户占比
  const [activeKey, setactiveKey] = useState<GradeType>('A')
  const [currentPage, setcurrentPage] = useState<number>(1)
  const [pageSize, setpageSize] = useState<number>(100)
  const [total, setTotal] = useState<number>(0)
  const [list, setList] = useState<API.VCGadeListItem[]>([])
  const [loading, setLoading] = useState(false)

  // 全选
  const [selectedList, setselectedList] = useState<string[]>([])
  const [indeterminate, setIndeterminate] = useState(false) //控制半选状态
  const [checkAll, setCheckAll] = useState(false) //控制全选状态

  // 获取意向客户占比
  const getInfo = async () => {
    setRateLoading(true)
    try {
      const res = await getVCGadeRate()
      if (res.status == 'success') {
        setRateInfo(res.list)
      }
      setRateLoading(false)
    } catch (error) {
      setRateLoading(false)
    }
  }

  // 切换客户类型
  const changeType = (e) => {
    setactiveKey(e.key)
  }

  // 单个checkbox点击
  const onChange = (checkedValues: string[]) => {
    setselectedList(checkedValues)
  }
  // 全选点击
  const onCheckAllChange = (e: CheckboxChangeEvent) => {
    setCheckAll(e.target.checked)
    if (e.target.checked) {
      let _select = []
      list.forEach((item) => {
        _select.push(item.mobile)
      })
      setselectedList(_select)
    } else {
      setselectedList([])
    }
  }

  // 单个删除
  const delEvent = async (mobile) => {
    try {
      const res = await delVCGadeMobile({
        mobiles: mobile,
      })
      if (res.status == 'success') {
        getList()
        setselectedList((pre) => {
          return pre.filter((item) => item != mobile)
        })
      }
    } catch (error) {}
  }
  // 批量删除
  const delChecked = async () => {
    try {
      const res = await delVCGadeMobile({
        mobiles: selectedList.join(','),
      })
      if (res.status == 'success') {
        setselectedList([])
        getList()
      }
    } catch (error) {}
  }
  // 导出
  const exportEvent = async (type) => {
    const res = await exportVCGadeMobile({
      type,
      intention: activeKey,
    })
    if (res.status == 'success') {
      downloadFile()
    }
  }

  const getList = async () => {
    try {
      setLoading(true)
      const res = await getVCGadeList({
        page: currentPage,
        limit: pageSize,
        intention: activeKey,
      })
      setList(res.list)
      setTotal(res.row)
      setLoading(false)
    } catch (error) {}
  }

  // 切换页码
  const onChangeCurrentPage = (page: number, pageSize: number) => {
    setcurrentPage(page)
    // setpageSize(pageSize)
  }

  useEffect(() => {
    setselectedList([])
    getList()
  }, [activeKey, currentPage])

  // 全选操作
  useEffect(() => {
    let hasChecked = false
    let checkedAll = true
    if (list.length === 0 || selectedList.length == 0) {
      setIndeterminate(false)
      setCheckAll(false)
      return
    }
    list.forEach((item) => {
      if (selectedList.includes(item.mobile)) {
        hasChecked = true
      } else {
        checkedAll = false
      }
    })
    setIndeterminate(!checkedAll && hasChecked)
    setCheckAll(checkedAll)
  }, [list, selectedList])

  useEffect(() => {
    getInfo()
  }, [])

  return (
    <PageContent extClass='grade-list'>
      <Image src={faceImg} preview={false} width={72}></Image>
      <Flex justify='space-between' align='center'>
        <div className='fn22 fw-500'>意向客户管理</div>
      </Flex>
      <Divider />
      <Row gutter={[16, 16]} className='m-t-24'>
        <Col span={24} xl={12}>
          <Row gutter={[16, 16]}>
            {grades.map((item) => (
              <Col span={24} xl={12} key={item.type}>
                <div className='grade-item g-radius-4 p-x-16 p-y-24'>
                  <Space>
                    <Image
                      src={getGradeTypePath(item.type)}
                      width={46}
                      preview={false}
                    />
                    <Flex vertical>
                      <b className='fn16 fw-500'>{item.type}类客户</b>
                      <span className='gray-color-sub m-t-4'>{item.text}</span>
                    </Flex>
                  </Space>
                </div>
              </Col>
            ))}
          </Row>
        </Col>
        <Col span={24} xl={12}>
          <Card title='意向客户占比' loading={rateLoading} minHeight={180}>
            <Rate data={rateInfo} />
          </Card>
        </Col>
      </Row>
      <Flex
        className='m-t-24 p-x-16 p-y-12 g-radius-4 color-tab'
        justify='space-between'
        align='center'
        wrap='wrap'
        gap={12}>
        <Space align='center'>
          <Image
            src={getGradeTypePath(activeKey)}
            preview={false}
            height={32}></Image>
          <Dropdown
            trigger={['click']}
            menu={{
              items: dropdownItems,
              selectable: true,
              onClick: changeType,
            }}>
            <div className='g-pointer'>
              {`${activeKey}类客户`}
              <i
                className='icon iconfont icon-xiangxia m-l-8 fn8 g-rotate-90'
                style={{ transform: 'translateY(4px)' }}></i>
            </div>
          </Dropdown>
        </Space>
        <Space align='center' wrap size={[12, 12]}>
          <Checkbox
            indeterminate={indeterminate}
            onChange={onCheckAllChange}
            checked={checkAll}>
            全选
          </Checkbox>

          <Popconfirm
            placement='bottom'
            title='警告'
            description='确定删除选中的号码？'
            onConfirm={delChecked}
            okText='确定'
            cancelText='取消'>
            <span
              className={`g-pointer error-color fx-center-center ${
                indeterminate || checkAll ? '' : 'disabled'
              }`}>
              <i className='icon iconfont icon-shanchu m-r-8'></i>删除
            </span>
          </Popconfirm>

          <Divider type='vertical' style={{ height: 16 }} />
          <AExport
            items={items}
            onExportEvent={exportEvent}
            useCode={true}
            dropDownProps={{ placement: 'bottomRight' }}>
            <div className='g-pointer color'>
              导出
              <i
                className='icon iconfont icon-xiangxia m-l-8 fn8 g-rotate-90'
                style={{ transform: 'translateY(4px)' }}></i>
            </div>
          </AExport>
        </Space>
      </Flex>

      <CheckboxGroup
        style={{ width: '100%', marginTop: '20px', position: 'relative' }}
        value={selectedList}
        onChange={onChange}>
        {loading && (
          <div
            style={{
              position: 'absolute',
              top: 24,
              left: '50%',
              transform: 'translateX(-50%)',
            }}>
            <Spin />
          </div>
        )}
        <Row wrap gutter={8} style={{ width: '100%' }}>
          {list.map((item) => (
            <Col key={item.id} span={12} lg={8} xl={6} xxl={4}>
              <div className='checkbox-item fx-between-center'>
                <Checkbox value={item.mobile} className='fn16'>
                  {item.mobile}
                </Checkbox>
                <Popconfirm
                  placement='bottom'
                  title='警告'
                  description='确定删除该号码？'
                  onConfirm={() => delEvent(item.mobile)}
                  okText='确定'
                  cancelText='取消'>
                  <i className='icon iconfont icon-shanchu g-pointer'></i>
                </Popconfirm>
              </div>
            </Col>
          ))}
          {list.length == 0 && (
            <Empty className='m-t-40' style={{ margin: '0 auto' }} />
          )}
        </Row>
      </CheckboxGroup>

      <Flex justify='flex-end' align='center' style={{ marginTop: '32px' }}>
        <Pagination
          defaultCurrent={1}
          current={currentPage}
          defaultPageSize={pageSize}
          showSizeChanger={false}
          total={total}
          showQuickJumper
          onChange={onChangeCurrentPage}
          showTotal={(total) => `共 ${total} 条`}
        />
      </Flex>
    </PageContent>
  )
}
