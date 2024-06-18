import { useEffect, useState } from 'react'
import { Flex, Divider, Space, Row, Col, Button, ConfigProvider } from 'antd'
import { API } from 'apis'
import { useStateDispatch, useStateStore } from '../reducer'
import { TinyColor } from '@ctrl/tinycolor'

import './index.scss'

const colors = ['#ff6062', '#ff4446']
const getHoverColors = (colors: string[]) =>
  colors.map((color) => new TinyColor(color).lighten(5).toString())
const getActiveColors = (colors: string[]) =>
  colors.map((color) => new TinyColor(color).darken(5).toString())

export default function Fn() {
  const state = useStateStore()
  const dispatch = useStateDispatch()
  const [checkedItem, setCheckedItem] = useState<API.RcsPackagesItem>()
  const [number, setNumber] = useState<number>(1)

  const addCar = () => {
    if (!checkedItem) return
    dispatch({
      type: 'changeCar',
      payload: {
        id: checkedItem.id,
        number: number,
      },
    })
    dispatch({
      type: 'changeStep',
      payload: 1,
    })
  }

  useEffect(() => {
    state.packages.length > 0 && setCheckedItem(state.packages[0])
  }, [state.packages])

  useEffect(() => {
    setNumber(state.car[checkedItem?.id] || 1)
  }, [checkedItem])
  return (
    <div className='pay-plp'>
      <Flex className='packages-list' gap={24} wrap='wrap'>
        {state.packages.map((item) => (
          <div
            className={`packages-item fx-center-center g-radius-4 p-x-12 g-pointer ${
              checkedItem?.id == item.id ? 'active' : ''
            }`}
            onClick={() => setCheckedItem(item)}
            key={item.id}>
            {Number(item.credit) / 10000}万条
          </div>
        ))}
      </Flex>
      <Divider />

      <Flex justify='space-between' align='flex-end'>
        <Row gutter={[24, 12]}>
          <Col span={24}>
            <Space className='m-r-24'>
              <span className='icon iconfont icon-square'></span>
              <span>数量</span>
            </Space>
            <Space>
              <div
                className={`handle-btn`}
                onClick={() => number > 1 && setNumber(number - 1)}>
                <span className='icon iconfont icon-jian fn13'></span>
              </div>
              <div className='number'>{number}</div>
              <div
                className={`handle-btn`}
                onClick={() => setNumber(number + 1)}>
                <span className='icon iconfont icon-jia fn13'></span>
              </div>
            </Space>
          </Col>
          <Col span={24} className='error-color'>
            <Space className='m-r-24'>
              <span className='icon iconfont icon-yuan'></span>
              <span>价格</span>
            </Space>
            <Space>
              <div>
                <div className='fn16'>
                  {(Number(checkedItem?.price || 0) * number).toLocaleString()}{' '}
                  元
                </div>
                <div className='m-t-8 gray-color'>
                  {(
                    Number(checkedItem?.price || 0) /
                    Number(checkedItem?.credit || 1)
                  ).toFixed(4)}{' '}
                  元/条
                </div>
              </div>
            </Space>
          </Col>
        </Row>
        <ConfigProvider
          theme={{
            components: {
              Button: {
                colorPrimary: `linear-gradient(180deg, ${colors.join(', ')})`,
                colorPrimaryHover: `linear-gradient(180deg, ${getHoverColors(
                  colors,
                ).join(', ')})`,
                colorPrimaryActive: `linear-gradient(180deg, ${getActiveColors(
                  colors,
                ).join(', ')})`,
                lineWidth: 0,
              },
            },
          }}>
          <Button
            type='primary'
            onClick={addCar}
            icon={<span className='icon iconfont icon-car'></span>}>
            加入购物车
          </Button>
        </ConfigProvider>
      </Flex>
    </div>
  )
}
