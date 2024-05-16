import { useEffect, useState } from 'react'
import { Form, Input, Flex } from 'antd'
import type { FormInstance } from 'antd'
import { ProFormDependency } from '@ant-design/pro-components'
import { usePoint } from '@/hooks'
import MyAddress from '../address'
import MyFile from '../file'
import MyInput from '../input'
import MyArea from '../textarea'
import './index.scss'

type Props = {
  form: FormInstance<any>
}

export type Type = '1' | '2' | '3' | '4' // 1从地址簿导入 ｜ 2从文件导入 ｜ 3手动输入 ｜ 4手动粘贴
type TabsData = {
  address: string
  file: string
  input: string
  textarea: string
}

export default function ContactsTabs(props: Props) {
  const point = usePoint('md')
  const [type, setType] = useState<Type>('4')
  const [tabsData, setTabsData] = useState({
    address: '',
    file: '',
    input: '',
    textarea: '',
  })
  useEffect(() => {
    props.form.setFieldValue('contacts', tabsData[type])
  }, [type, tabsData])
  return (
    <div className='contacts-tabs'>
      <Flex className='p-x-4 fx' gap={4}>
        <div
          className={`tabs-item p-x-4 fx-center-center fn14 ${
            type == '1' ? 'active' : ''
          }`}
          onClick={() => setType('1')}>
          从地址簿导入
        </div>
        <div
          className={`tabs-item p-x-4 fx-center-center fn14 ${
            type == '2' ? 'active' : ''
          }`}
          onClick={() => setType('2')}>
          从文件导入
        </div>
        <div
          className={`tabs-item p-x-4 fx-center-center fn14 ${
            type == '3' ? 'active' : ''
          }`}
          onClick={() => setType('3')}>
          手动输入
        </div>
        <div
          className={`tabs-item p-x-4 fx-center-center fn14 ${
            type == '4' ? 'active' : ''
          }`}
          onClick={() => setType('4')}>
          手动粘贴
        </div>
      </Flex>
      <Form.Item hidden name='contacts'>
        <Input />
      </Form.Item>

      {type == '1' && (
        <MyAddress initValues={tabsData.address} onChange={() => {}} />
      )}
      {type == '2' && <MyFile initValues={tabsData.file} onChange={() => {}} />}
      {type == '3' && (
        <MyInput
          initValues={tabsData.input}
          onChange={(value) => setTabsData({ ...tabsData, input: value })}
        />
      )}
      {type == '4' && (
        <MyArea
          initValues={tabsData.textarea}
          onChange={(value) => setTabsData({ ...tabsData, textarea: value })}
        />
      )}
    </div>
  )
}
