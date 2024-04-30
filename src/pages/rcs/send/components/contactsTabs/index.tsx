import { useEffect, useState } from 'react'
import { Form, Input } from 'antd'
import type { FormInstance } from 'antd'
import { ProFormDependency } from '@ant-design/pro-components'
import { usePoint } from '@/hooks'
import Area from '../textarea'
import './index.scss'

type Props = {
  name: string
  form: FormInstance<any>
}

export type Type = '1' | '2' | '3' | '4' // 1从地址簿导入 ｜ 2从文件导入 ｜ 3手动输入 ｜ 4手动粘贴

export default function ContactsTabs(props: Props) {
  const point = usePoint('md')
  const [type, setType] = useState<Type>('4')
  useEffect(() => {
    props.form.setFieldValue(props.name, type)
  }, [type])
  return (
    <>
      <div className='contacts-tabs fx'>
        <div
          className={`tabs-item p-x-8 fx-center-center fn14 ${
            type == '1' ? 'active' : ''
          }`}
          onClick={() => setType('1')}>
          从地址簿导入
        </div>
        <div
          className={`tabs-item p-x-8 fx-center-center fn14 ${
            type == '2' ? 'active' : ''
          }`}
          onClick={() => setType('2')}>
          从文件导入
        </div>
        <div
          className={`tabs-item p-x-8 fx-center-center fn14 ${
            type == '3' ? 'active' : ''
          }`}
          onClick={() => setType('3')}>
          手动输入
        </div>
        <div
          className={`tabs-item p-x-8 fx-center-center fn14 ${
            type == '4' ? 'active' : ''
          }`}
          onClick={() => setType('4')}>
          手动粘贴
        </div>
      </div>
      <Form.Item hidden name={props.name}>
        <Input />
      </Form.Item>

      <ProFormDependency name={[props.name]}>
        {(dep) => {
          return <>{dep[props.name] == '4' && <Area />}</>
        }}
      </ProFormDependency>
    </>
  )
}
