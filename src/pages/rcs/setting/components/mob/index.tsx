import { useState, useEffect, useRef } from 'react'
import { Flex, Row, Col, Space, Switch, Popconfirm } from 'antd'
import { settingRcs, initSetting } from '@/store/reducers/settingRcs'
import { useAppSelector, useAppDispatch } from '@/store/hook'
import { changeRcsSetting, delRcsSettingMobEmail } from '@/api'
import AddMob from '../addMob'
import { uniqBy } from 'lodash'
import { API } from 'apis'

import { usePoint } from '@/hooks'

export default function Fn() {
  const dispatch = useAppDispatch()
  const pointLg = usePoint('lg')
  const ref = useRef(null)
  const rcsSetting = useAppSelector(settingRcs)
  const [switchLoading, setSwitchLoading] = useState(false)
  const [switchVal, setSwitchVal] = useState(false)
  const [list, setList] = useState<API.SettingReminderItem[]>([])

  const changeRcsSettings = async (
    item: API.ChangeRcsSettingSwitchType,
    value: API.SettingStatus,
  ) => {
    setSwitchLoading(true)
    const res = await changeRcsSetting({ item, value })
    if (res.status == 'success') {
      setSwitchLoading(false)
      setSwitchVal(value == '1')
      dispatch(initSetting())
    }
  }
  const delEvent = async (id: string) => {
    try {
      const res = await delRcsSettingMobEmail({
        id,
      })
      if (res.status == 'success') {
        dispatch(initSetting())
      }
    } catch (error) {}
  }
  useEffect(() => {
    if (rcsSetting) {
      let default_list: API.SettingReminderItem[] = [
        {
          id: '-1',
          type: '1',
          address: rcsSetting.settings.mob,
          status: '0',
        },
      ]
      const _list = rcsSetting.settings.reminder_list.filter(
        (item) => item.type == '1',
      )
      setList(uniqBy([...default_list, ..._list], 'address'))
      setSwitchVal(rcsSetting.settings.reminder_message == '1')
    }
  }, [rcsSetting])
  return (
    <>
      <Row>
        <Col span={12} lg={6} xl={4}>
          <span className='fw-500 fn16'>短信提示</span>
        </Col>
        <Col span={12} lg={18} xl={20}>
          <Flex justify={pointLg ? 'flex-start' : 'flex-end'}>
            <Switch
              size='small'
              checked={switchVal}
              onChange={(flag) =>
                changeRcsSettings('reminder_message', flag ? '1' : '0')
              }
              loading={switchLoading}></Switch>
          </Flex>
        </Col>
        <Col span={24} lg={6} xl={4}></Col>
        <Col span={24} lg={18} xl={20}>
          <Row className='gray-color m-t-12' gutter={[16, 12]}>
            {list.map((item) => (
              <Col span={24} key={item.id}>
                {rcsSetting?.settings.mob == item.address ? (
                  <Space size={24}>
                    <span className='gray-color-sub'>
                      {item.address}（账户手机号不可更改）
                    </span>
                  </Space>
                ) : (
                  <Space size={24}>
                    <span>{item.address}</span>
                    <Popconfirm
                      placement='bottom'
                      title='警告'
                      description='确定删除该手机号吗？'
                      onConfirm={() => delEvent(item.id)}
                      okText='确定'
                      cancelText='取消'>
                      <span className='icon iconfont icon-shanchu color g-pointer fn14'></span>
                    </Popconfirm>
                  </Space>
                )}
              </Col>
            ))}
            <Col span={24}>
              <Space
                align='center'
                className='color g-pointer'
                onClick={() => ref.current.open()}>
                <span className='icon iconfont icon-jia fn13'></span>
                <span>新增</span>
              </Space>
            </Col>
          </Row>
        </Col>
      </Row>
      <AddMob ref={ref} />
    </>
  )
}
