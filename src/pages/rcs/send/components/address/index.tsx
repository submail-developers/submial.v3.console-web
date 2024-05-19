import {
  useEffect,
  useState,
  forwardRef,
  useImperativeHandle,
  useRef,
} from 'react'
import { API } from 'apis'
import { getSendAddress } from '@/api'
import AddressCollapse from './addressCollapse'

// 地址簿导入
type Props = {}
const Fn = (props: Props, ref: any) => {
  useImperativeHandle(ref, () => {
    return {
      getValues,
    }
  })
  const addref = useRef(null)
  const [books, setBooks] = useState<API.AddressbooksItem[][]>([])
  const getValues = () => {
    return addref.current.getValues()
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
    } catch (error) {}
  }

  useEffect(() => {
    getAddress()
  }, [])
  return (
    <div className='p-x-24 p-b-24 p-t-16 contacts-content'>
      <AddressCollapse books={books} ref={addref} />
    </div>
  )
}

export default forwardRef(Fn)
