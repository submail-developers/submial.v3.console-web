import { useState, useEffect, useRef } from 'react'
import { Row, Col, Space, Switch } from 'antd'
import { settingRcs, initSetting } from '@/store/reducers/settingRcs'
import { useAppSelector, useAppDispatch } from '@/store/hook'
import { changeRcsSettingSafe } from '@/api'
import { API } from 'apis'
import ASmsVerify from '@/components/aSmsVerify'
type ListItem = {
  label: string
  key: API.ChangeRcsSettingSafeSwitchType
  value: '0' | '1'
  loading: boolean
}

export default function Fn() {
  const dispatch = useAppDispatch()
  const rcsSetting = useAppSelector(settingRcs)
  const ref = useRef(null)
  const [list, setList] = useState<ListItem[]>([
    {
      label: '导出时需要输入手机验证码',
      key: 'export_confrim',
      value: '0',
      loading: false,
    },
    {
      label: '在历史明细查询或导出时隐藏手机号码',
      key: 'account_mob_display',
      value: '0',
      loading: false,
    },
    {
      label: '地址簿加密',
      key: 'address_mob_display',
      value: '0',
      loading: false,
    },
  ])

  const changeStatus = (key) => {
    setList((prev) => {
      return prev.map((item) => {
        if (item.key == key) {
          item.loading = true
        }
        return item
      })
    })
    ref.current.open()
  }
  const onSuccess = async () => {
    const info = list.find((item) => item.loading)
    if (info) {
      try {
        const res = await changeRcsSettingSafe({
          item: info.key,
          value: info.value == '1' ? '0' : '1',
        })
        if (res.status == 'success') {
          setList((prev) => {
            return prev.map((item) => {
              item.loading = false
              if (item.key == info.key) {
                item.value = info.value == '1' ? '0' : '1'
              }
              return item
            })
          })
          dispatch(initSetting())
        } else {
          onCancel()
        }
      } catch (error) {
        onCancel()
      }
    }
  }

  const onCancel = () => {
    setList((prev) => {
      return prev.map((item) => {
        item.loading = false
        return item
      })
    })
  }

  useEffect(() => {
    if (rcsSetting) {
      setList((prev) => {
        return prev.map((item) => {
          item.value = rcsSetting.settings[item.key]
          return item
        })
      })
    }
  }, [rcsSetting])

  return (
    <>
      <Row gutter={[12, 16]}>
        <Col span={24} lg={6} xl={4}>
          <span className='fw-500 fn16'>安全设置</span>
        </Col>
        <Col span={24} lg={18} xl={20}>
          <Row className='gray-color' gutter={[16, 16]}>
            {list.map((item) => (
              <Col span={24} key={item.key}>
                <Space size={24} align='center'>
                  <Switch
                    size='small'
                    checked={item.value == '1'}
                    onChange={() => changeStatus(item.key)}
                    loading={item.loading}
                  />
                  <div>{item.label}</div>
                </Space>
              </Col>
            ))}
          </Row>
        </Col>
      </Row>
      <ASmsVerify onSuccess={onSuccess} ref={ref} onCancel={onCancel} />
    </>
  )
}
