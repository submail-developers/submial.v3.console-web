import {
  useEffect,
  useState,
  useRef,
  useImperativeHandle,
  forwardRef,
} from 'react'
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
  // form: FormInstance<any>
  vars: string[]
}

export type Type = '1' | '2' | '3' | '4' // 1从地址簿导入 ｜ 2从文件导入 ｜ 3手动输入 ｜ 4手动粘贴
type TabsData = {
  address: string
  file: string
  input: any[]
  textarea: string
}

function ContactsTabs(props: Props, ref: any) {
  const [form] = Form.useForm()
  useImperativeHandle(ref, () => {
    return {
      getValues,
    }
  })

  const addressRef = useRef(null)
  const fileRef = useRef(null)
  const inputRef = useRef(null)
  const areaRef = useRef(null)
  const [type, setType] = useState<Type>('1')
  const [tabsData, setTabsData] = useState<TabsData>({
    address: '',
    file: '',
    input: [],
    textarea: '',
  })
  const getValues = () => {
    let values

    switch (type) {
      case '1':
        values = addressRef.current.getValues()
        break
      case '2':
        values = fileRef.current.getValues()
        break
      case '3':
        values = inputRef.current.getValues()
        break
      case '4':
        values = areaRef.current.getValues()
        break
    }
    return values
  }
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

      {type == '1' && <MyAddress ref={addressRef} />}
      {type == '2' && <MyFile ref={fileRef} vars={props.vars} />}
      {type == '3' && <MyInput ref={inputRef} vars={props.vars} />}
      {type == '4' && <MyArea ref={areaRef} />}
    </div>
  )
}
export default forwardRef(ContactsTabs)
