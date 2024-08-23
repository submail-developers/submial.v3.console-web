import { useState, useEffect } from 'react'
import {
  Flex,
  Row,
  Col,
  Button,
  Space,
  Switch,
  InputNumber,
  Statistic,
  ConfigProvider,
} from 'antd'
import type { StatisticProps } from 'antd'
import { settingRcs, initSetting } from '@/store/reducers/settingRcs'
import { useAppSelector, useAppDispatch } from '@/store/hook'
import { changeRcsSetting, changeRcsSettingLess } from '@/api'
import { API } from 'apis'

import CountUp from 'react-countup'
import { usePoint } from '@/hooks'

const formatter: StatisticProps['formatter'] = (value) => (
  <CountUp end={value as number} separator=',' />
)

export default function Fn() {
  const dispatch = useAppDispatch()
  const pointLg = usePoint('lg')
  const rcsSetting = useAppSelector(settingRcs)
  const [editing, setEditing] = useState(false)
  const [lessNumber, setLessNumber] = useState(0)
  const [saveLessLoading, setSaveLessLoading] = useState(false)
  const [switchLoading, setSwitchLoading] = useState(false)
  const [switchVal, setSwitchVal] = useState(false)

  const changeRcsSettings = async (
    item: API.ChangeRcsSettingSwitchType,
    value: API.SettingStatus,
  ) => {
    try {
      setSwitchLoading(true)
      const res = await changeRcsSetting({ item, value })
      if (res.status == 'success') {
        setSwitchLoading(false)
        setSwitchVal(value == '1')
        dispatch(initSetting())
      } else {
        setSwitchLoading(false)
      }
    } catch (error) {
      setSwitchLoading(false)
    }
  }
  const changeLess = async () => {
    setSaveLessLoading(true)
    try {
      const res = await changeRcsSettingLess({
        item: 'reminder_less',
        value: lessNumber,
      })
      if (res.status == 'success') {
        setSaveLessLoading(false)
        setEditing(false)
        dispatch(initSetting())
      } else {
        setSaveLessLoading(false)
      }
    } catch (error) {
      setSaveLessLoading(false)
    }
  }
  useEffect(() => {
    if (rcsSetting) {
      setLessNumber(Number(rcsSetting.settings?.reminder_less || 0))
      setSwitchVal(rcsSetting?.settings.credits_reminder == '1')
    }
  }, [editing, rcsSetting])
  return (
    <Row>
      <Col span={12} lg={6} xl={4}>
        <span className='fw-500 fn16'>余额提醒</span>
      </Col>
      <Col span={12} lg={18} xl={20}>
        <Flex justify={pointLg ? 'flex-start' : 'flex-end'}>
          <Switch
            size='small'
            checked={switchVal}
            onChange={(flag) =>
              changeRcsSettings('credits_reminder', flag ? '1' : '0')
            }
            loading={switchLoading}></Switch>
        </Flex>
      </Col>
      <Col span={24} lg={6} xl={4}></Col>
      <Col span={24} lg={18} xl={20}>
        <Space className='gray-color m-t-12'>
          当前余额
          <ConfigProvider
            theme={{
              components: {
                Statistic: {
                  contentFontSize: 14,
                },
              },
            }}>
            <Statistic
              title=''
              value={
                rcsSetting ? Number(rcsSetting?.settings?.credits || 0) : 0
              }
              formatter={formatter}
            />
          </ConfigProvider>
          条
        </Space>
        <div className='gray-color m-t-4' style={{ height: 30 }}>
          <Space align='center' className='h-100'>
            <span>发出提醒当余额低于</span>
            {editing ? (
              <>
                <InputNumber
                  size='small'
                  value={lessNumber}
                  onChange={(value) => setLessNumber(value)}
                  min={0}
                />
                <span>条</span>
                <Button
                  loading={saveLessLoading}
                  type='primary'
                  size='small'
                  onClick={changeLess}>
                  保存
                </Button>
                <div
                  className='gray-color g-pointer'
                  onClick={() => setEditing(false)}>
                  取消
                </div>
              </>
            ) : (
              <>
                <span>{rcsSetting && lessNumber.toLocaleString()}</span>
                <span>条</span>
                <div
                  className='color g-pointer'
                  onClick={() => setEditing(true)}>
                  更改
                </div>
              </>
            )}
          </Space>
        </div>
      </Col>
    </Row>
  )
}
