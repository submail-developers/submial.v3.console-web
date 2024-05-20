import {
  useEffect,
  useState,
  useRef,
  useImperativeHandle,
  forwardRef,
} from 'react'
import { Flex } from 'antd'
import MyAddress from '../address'
import MyFile from '../file'
import MyInput from '../input'
import MyArea from '../textarea'
import { API } from 'apis'
import { getSendAddress } from '@/api'
import './index.scss'

// 1从地址簿导入 ｜ 2从文件导入 ｜ 3手动输入 ｜ 4手动粘贴 | 5从主账户地址簿导入
type T = '1' | '2' | '3' | '4' | '5'

type Props = {
  vars: string[]
}

function ContactsTabs(props: Props, ref: any) {
  useImperativeHandle(ref, () => {
    return {
      getValues,
    }
  })

  const addressRef = useRef(null)
  const parentRef = useRef(null)
  const fileRef = useRef(null)
  const inputRef = useRef(null)
  const areaRef = useRef(null)
  const [type, setType] = useState<T>('1')
  const [books, setBooks] = useState<API.AddressbooksItem[][]>([])
  const [parentBooks, setParentBooks] = useState<API.AddressbooksItem[][]>([])

  // addressbook地址簿,file文件,input手动输入框,paste手动粘贴,parent_addressbook主账户地址簿
  const getValues = async () => {
    let values
    switch (type) {
      case '1':
        values = {
          addressmod: 'addressbook',
          address_data: addressRef.current.getValues(),
        }
        break
      case '2':
        values = {
          addressmod: 'file',
          address_data: fileRef.current.getValues(),
        }
        break
      case '3':
        values = {
          addressmod: 'input',
          address_data: await inputRef.current.getValues(),
        }
        break
      case '4':
        values = {
          addressmod: 'paste',
          address_data: await areaRef.current.getValues(),
        }
        break
      case '5':
        values = {
          addressmod: 'parent_addressbook',
          address_data: parentRef.current.getValues(),
        }
        break
    }
    return values
  }
  const getAddress = async () => {
    try {
      const res = await getSendAddress({
        page: 1,
        type: 1,
      })
      if (Array.isArray(res.addressbooks)) {
        setBooks(res.addressbooks)
      } else {
        setBooks(Object.values(res.addressbooks))
      }
      if (res.parent_addressbooks) {
        if (Array.isArray(res.parent_addressbooks)) {
          setParentBooks(res.parent_addressbooks)
        } else {
          setParentBooks(Object.values(res.parent_addressbooks))
        }
      }
    } catch (error) {}
  }
  useEffect(() => {
    getAddress()
  }, [])
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
        {parentBooks.length > 0 && (
          <div
            className={`tabs-item p-x-4 fx-center-center fn14 ${
              type == '5' ? 'active' : ''
            }`}
            onClick={() => setType('5')}>
            从主账户地址簿导入
          </div>
        )}
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

      {type == '1' && <MyAddress ref={addressRef} books={books} />}
      {type == '5' && <MyAddress ref={parentRef} books={parentBooks} />}
      {type == '2' && <MyFile ref={fileRef} vars={props.vars} />}
      {type == '3' && <MyInput ref={inputRef} vars={props.vars} />}
      {type == '4' && <MyArea ref={areaRef} />}
    </div>
  )
}
export default forwardRef(ContactsTabs)
