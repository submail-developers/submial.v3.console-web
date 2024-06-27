import { useState, useEffect } from 'react'
import { Row, Col, Space, Switch } from 'antd'
import { settingRcs, initSetting } from '@/store/reducers/settingRcs'
import { useAppSelector, useAppDispatch } from '@/store/hook'
import { changeRcsSettingSafe } from '@/api'
import { API } from 'apis'

type ItemProps = {
  value: boolean
  label: string
  type: API.ChangeRcsSettingSafeSwitchType
}
const SafeItem = (props: ItemProps) => {
  const dispatch = useAppDispatch()
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)

  const change = async (flag) => {
    setLoading(true)
    try {
      const res = await changeRcsSettingSafe({
        item: props.type,
        value: flag ? '1' : '0',
      })
      if (res.status == 'success') {
        setLoading(false)
        setOpen(flag)
        dispatch(initSetting())
      }
    } catch (error) {
      setLoading(false)
    }
  }

  useEffect(() => {
    setOpen(props.value)
  }, [props.value])
  return (
    <Col span={24}>
      <Space size={24} align='center'>
        <Switch
          checkedChildren='开启'
          unCheckedChildren='关闭'
          size='default'
          checked={open}
          onChange={change}
          loading={loading}
        />
        <div>{props.label}</div>
      </Space>
    </Col>
  )
}

export default function Fn() {
  const rcsSetting = useAppSelector(settingRcs)
  return (
    <Row gutter={[12, 16]}>
      <Col span={24} lg={6} xl={4}>
        <span className='fw-500 fn16'>安全设置</span>
      </Col>
      <Col span={24} lg={18} xl={20}>
        <Row className='gray-color' gutter={[16, 16]}>
          <SafeItem
            value={rcsSetting?.settings.message_send_confirm == '1'}
            label='在线批量发送时需要输入手机验证码'
            type='message_send_confirm'
          />
          <SafeItem
            value={rcsSetting?.settings.message_sent_reminder == '1'}
            label='在线发送完成时提醒我'
            type='message_sent_reminder'
          />
          <SafeItem
            value={rcsSetting?.settings.export_confrim == '1'}
            label='导出时需要输入手机验证码'
            type='export_confrim'
          />
          <SafeItem
            value={rcsSetting?.settings.account_verify_code_display == '1'}
            label='在历史明细查询或导出时隐藏验证码'
            type='account_verify_code_display'
          />
          <SafeItem
            value={rcsSetting?.settings.account_mob_display == '1'}
            label='在历史明细查询或导出时隐藏手机号码'
            type='account_mob_display'
          />
          <SafeItem
            value={rcsSetting?.settings.address_mob_display == '1'}
            label='地址簿加密'
            type='address_mob_display'
          />
        </Row>
      </Col>
    </Row>
  )
}
