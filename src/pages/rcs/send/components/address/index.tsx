import { forwardRef, useImperativeHandle, useRef } from 'react'
import { API } from 'apis'
import AddressCollapse from './addressCollapse'

// 地址簿导入
type Props = {
  books: API.AddressbooksItem[][]
}
const Fn = (props: Props, ref: any) => {
  useImperativeHandle(ref, () => {
    return {
      getValues,
    }
  })
  const addref = useRef(null)
  const getValues = () => {
    return addref.current.getValues()
  }

  return (
    <div className='p-x-24 p-b-24 p-t-16 contacts-content'>
      <AddressCollapse books={props.books} ref={addref} />
    </div>
  )
}

export default forwardRef(Fn)
