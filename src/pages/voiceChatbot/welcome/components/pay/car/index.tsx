import { useEffect, useState } from 'react'
import { NavLink } from 'react-router-dom'
import { Flex, Space, Row, Col, Button, Table } from 'antd'
import { API } from 'apis'
import { useStateDispatch, useStateStore } from '../reducer'
import type { ColumnsType } from 'antd/es/table'
import { getInvoices } from '@/api'

import { SyncOutlined } from '@ant-design/icons'

interface DataType extends API.RcsPackagesItem {}

type Props = {}

export default function Fn(props: Props) {
  const dispatch = useStateDispatch()
  const state = useStateStore()
  const [total, setTotal] = useState(0)
  const [list, setList] = useState<DataType[]>([])
  const [loading, setLoading] = useState(false)

  const jianCar = (id) => {
    if (state.car[id] == 1) return
    dispatch({
      type: 'changeCar',
      payload: {
        id: id,
        number: state.car[id] - 1,
      },
    })
  }
  const jiaCar = (id) => {
    dispatch({
      type: 'changeCar',
      payload: {
        id: id,
        number: state.car[id] + 1,
      },
    })
  }
  const delCar = (id) => {
    dispatch({
      type: 'changeCar',
      payload: {
        id: id,
        number: 0,
      },
    })
  }

  // 获取发票列表
  const getInvoiceList = async () => {
    setLoading(true)
    try {
      const res = await getInvoices()
      let timer = setTimeout(() => {
        setLoading(false)
        clearTimeout(timer)
      }, 1500)
      if (res?.invoices) {
        dispatch({
          type: 'initInvoiceList',
          payload: res.invoices,
        })
      }
    } catch (error) {
      setLoading(false)
    }
  }

  const columns: ColumnsType<DataType> = [
    {
      title: '资源包',
      className: 'paddingL30',
      width: 200,
      render: (_, record) => (
        <div className='w-100'>{record.credit} 储值资费包</div>
      ),
    },
    {
      title: '单价(元)',
      width: 100,
      render: (_, record) => (
        <div className='w-100'>{Number(record.price).toLocaleString()}</div>
      ),
    },
    {
      title: '数量',
      width: 100,
      render: (_, record) => (
        <div className='w-100 fx-y-center'>
          <div className={`handle-btn`} onClick={() => jianCar(record.id)}>
            <span className='icon iconfont icon-jian fn13'></span>
          </div>
          <div className='number'>{state.car[record.id]}</div>
          <div className={`handle-btn`} onClick={() => jiaCar(record.id)}>
            <span className='icon iconfont icon-jia fn13'></span>
          </div>
        </div>
      ),
    },
    {
      title: '总价(元)',
      width: 100,
      render: (_, record) => (
        <div className='w-100'>
          {(Number(record?.price || 0) * state.car[record.id]).toLocaleString()}
        </div>
      ),
    },
    {
      title: '操作',
      width: 80,
      render: (_, record) => (
        <div className='w-100'>
          <div
            className='g-pointer fx-y-center'
            onClick={() => delCar(record.id)}
            style={{ width: 32, height: 24 }}>
            <span className='icon iconfont icon-shanchu fn14'></span>
          </div>
        </div>
      ),
    },
  ]

  useEffect(() => {
    let _total = 0
    let _list: DataType[] = []
    state.packages.forEach((item) => {
      _total += Number(item.price) * Number(state.car[item.id] || 0)
    })
    setTotal(_total)

    state.carsId.forEach((item) => {
      let _package = state.packages.find((i) => i.id == item)
      if (_package) {
        _list.push(_package)
      }
    })
    setList(_list)
  }, [state.car, state.packages, state.carsId])

  return (
    <div className='pay-car'>
      <Flex className='total fn16' justify='space-between' align='center'>
        <Space>
          <span className='icon iconfont icon-car'></span>
          <span>购物车</span>
        </Space>
        <span className='error-color'>合计：{total.toLocaleString()} 元</span>
      </Flex>
      <Table
        className='theme-cell reset-table m-t-24'
        columns={columns}
        dataSource={list}
        rowKey={'id'}
        pagination={false}
        scroll={{ x: 400 }}
      />
      <Flex justify='space-between' align='center' className='m-t-24'>
        <Space>
          <span className='icon iconfont icon-fapiao'></span>
          <span className='fn16'>选择发票</span>
        </Space>
        <Space className='color'>
          <NavLink to='/console/account/invoice' target='__blank'>
            <span className='icon iconfont icon-jia fn13 m-r-4'></span>
            <span>新增发票</span>
          </NavLink>
          <Button className='m-x-0' type='link' onClick={getInvoiceList}>
            <SyncOutlined spin={loading} rev={null} />
            <span>刷新</span>
          </Button>
        </Space>
      </Flex>
      <div className='invoice-wrap p-x-16 g-radius-4'>
        <div
          className={`invoice-item m-y-16 p-y-24 p-x-24 g-pointer g-radius-2 invoice-no text-center ${
            state.invoiceId ? '' : 'active'
          }`}
          onClick={() =>
            dispatch({
              type: 'changeInvoiceId',
              payload: '',
            })
          }>
          <div className='checked-icon fx-center-center'>
            <div className='icon iconfont icon-right fn10'></div>
          </div>
          暂不需要
        </div>
        {state.invoiceList.map((item) => (
          <div
            className={`invoice-item m-y-16 p-t-16 p-l-24 p-r-12 g-pointer g-radius-2 ${
              item.id == state.invoiceId ? 'active' : ''
            }`}
            onClick={() =>
              dispatch({
                type: 'changeInvoiceId',
                payload: item.id,
              })
            }
            key={item.id}>
            <div className='fn20'>{item.invoice_title}</div>
            <div className='checked-icon fx-center-center'>
              <div className='icon iconfont icon-right fn10'></div>
            </div>
            <Row className='m-t-12'>
              <Col span={9}>
                <div className='fn12 gray-color'>纳税人识别号</div>
                <div className='fn16 m-t-4'>{item.invoice_tax_code}</div>
              </Col>
              <Col span={9}>
                <div className='fn12 gray-color'>电子发票接收邮箱</div>
                <div className='fn16 m-t-4'>{item.address}</div>
              </Col>
              <Col span={6}>
                <div className='fn12 gray-color'>电子发票接收手机</div>
                <div className='fn16 m-t-4'>{item.invoice_tel}</div>
              </Col>
            </Row>
            <Flex justify='flex-end'>
              <div className='type'>
                {item.invoice_type == '0' && '增值税普票'}
                {item.invoice_type == '1' && '增值税专票'}
                {item.invoice_type == '2' && '增值税电子普票'}
                {item.invoice_type == '3' && '增值税电子专票'}
              </div>
            </Flex>
          </div>
        ))}
      </div>
    </div>
  )
}
