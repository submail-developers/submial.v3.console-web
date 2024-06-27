import { useState, useEffect, useRef } from 'react'
import { Flex, Row, Col, Space, Switch, Popconfirm } from 'antd'
import { settingRcs, initSetting } from '@/store/reducers/settingRcs'
import { useAppSelector, useAppDispatch } from '@/store/hook'
import { changeRcsSetting, delRcsSettingMobEmail } from '@/api'
import AddEmail from '../addEmail'
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
          type: '0',
          address: rcsSetting.settings.account,
          status: '0',
        },
      ]
      const _list = rcsSetting.settings.reminder_list.filter(
        (item) => item.type == '0',
      )
      setList(uniqBy([...default_list, ..._list], 'address'))
      setSwitchVal(rcsSetting.settings.reminder_mail == '1')
    }
  }, [rcsSetting])
  return (
    <>
      <Row>
        <Col span={12} lg={6} xl={4}>
          <span className='fw-500 fn16'>邮件提示</span>
        </Col>
        <Col span={12} lg={18} xl={20}>
          <Flex justify={pointLg ? 'flex-start' : 'flex-end'}>
            <Switch
              checkedChildren='开启'
              unCheckedChildren='关闭'
              size='default'
              checked={switchVal}
              onChange={(flag) =>
                changeRcsSettings('reminder_mail', flag ? '1' : '0')
              }
              loading={switchLoading}></Switch>
          </Flex>
        </Col>
        <Col span={24} lg={6} xl={4}></Col>
        <Col span={24} lg={18} xl={20}>
          <Row className='gray-color m-t-12' gutter={[16, 12]}>
            {list.map((item) => (
              <Col span={24} key={item.id}>
                {rcsSetting?.settings.account == item.address ? (
                  <Space size={24}>
                    <span className='gray-color-sub'>
                      {item.address}（账户邮箱不可更改）
                    </span>
                  </Space>
                ) : (
                  <Space size={24}>
                    <span>{item.address}</span>
                    <Popconfirm
                      placement='bottom'
                      title='警告'
                      description='确定删除该邮箱吗？'
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
      <AddEmail ref={ref} />
    </>
  )
}
