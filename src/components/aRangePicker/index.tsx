import { useState, useCallback, ReactNode } from 'react'
import { Space, DatePicker, ConfigProvider } from 'antd'
import type { FormInstance } from 'antd'
import dayjs from 'dayjs'
import type { Dayjs } from 'dayjs'

import { usePoint } from '@/hooks'
import { NamePath } from 'antd/lib/form/interface'

type Presets = {
  label: ReactNode
  value: [Dayjs, Dayjs]
}[]

type RenderExtraFooter = {
  onChange: (value: [Dayjs, Dayjs]) => void
  presets: Presets
}

/**
 * @param initValue [Dayjs, Dayjs] 初始值
 * @param form FormInstance [form] = useForm()
 * @param name NamePath
 * @param presets { label: React.ReactNode, value: Dayjs[] }[] 预设时间范围快捷选择
 * @param onRangeChange (dates: [Dayjs, Dayjs]) => void 修改
 * @param rangePickerProps RangePicker组件的参数
 */
type ARangePickerProps = {
  initValue?: [Dayjs, Dayjs]
  form?: FormInstance<any>
  name?: NamePath
  presets?: Presets
  onRangeChange?: (dates: [Dayjs, Dayjs]) => void
  rangePickerProps?: {
    [key in string]: any
  }
}

const { RangePicker } = DatePicker

export default function ARangePicker(props: ARangePickerProps) {
  const point = usePoint('xs')
  const [value, setValue] = useState<[Dayjs, Dayjs]>(props.initValue)
  const [open, setOpen] = useState(false)
  const onRangeChange = (dates: [Dayjs, Dayjs]) => {
    console.log('cnage')
    if (props.form && props.name) {
      props.form.setFieldValue(props.name, dates)
    }
    if (props.onRangeChange) {
      props.onRangeChange(dates)
    }
    setValue(dates)
    setOpen(false)
  }
  const changeTime = useCallback((dates: [Dayjs, Dayjs]) => {
    if (props.form && props.name) {
      props.form.setFieldsValue({
        rangePicker: dates,
      })
    }
    if (props.onRangeChange) {
      props.onRangeChange(dates)
    }
    setValue(dates)
    setOpen(false)
  }, [])
  const onOpenChange = (o) => {
    setOpen(o)
  }
  const onCalendarChange = (dates, dateStrings, info) => {
    if (props.onRangeChange) {
      props.onRangeChange(dates)
    }
    setValue(dates)
    setOpen(false)
  }
  return (
    <ConfigProvider
      theme={{
        components: {
          DatePicker: {
            cellWidth: point ? 22 : 36,
            cellHeight: point ? 22 : 24,
          },
        },
      }}>
      <RangePicker
        {...props.rangePickerProps}
        open={open}
        value={
          props.form && props.name
            ? props.form.getFieldValue(props.name)
            : value
        }
        presets={!point && props.presets}
        renderExtraFooter={() => (
          <>
            {point && (
              <RenderExtraFooter
                onChange={changeTime}
                presets={props.presets || []}
              />
            )}
          </>
        )}
        onChange={onRangeChange}
        onOpenChange={onOpenChange}
        onCalendarChange={onCalendarChange}></RangePicker>
    </ConfigProvider>
  )
}

const RenderExtraFooter = ({ onChange, presets }: RenderExtraFooter) => {
  const changeTime = (value) => {
    onChange(value)
  }
  return (
    <>
      {presets.length > 0 && (
        <Space wrap size={[12, 12]}>
          {presets.map((item, index) => (
            <div
              key={index}
              className='color g-pointer'
              onClick={() => changeTime(item.value)}>
              {item.label}
            </div>
          ))}
        </Space>
      )}
    </>
  )
}
