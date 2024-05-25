import { useImperativeHandle, forwardRef, useState, useRef } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Empty, Flex, Pagination } from 'antd'
import { getRcsTempList } from '@/api'
import { useStateDispatch } from '@/pages/rcs/interactive/reducer'
import ACopy from '@/components/aCopy'
import { API } from 'apis'
import './index.scss'

const pageSize = 20
function Fn(props, ref: any) {
  useImperativeHandle(ref, () => {
    return {
      search,
    }
  })
  const dispatch = useStateDispatch()
  const nav = useNavigate()
  const { id } = useParams()
  const [currentPage, setcurrentPage] = useState<number>(1)
  const [total, setTotal] = useState<number>(0)
  const [list, setList] = useState<API.RcsTempListItem[]>([])

  const keywordsRef = useRef('')
  const search = (keywords) => {
    keywordsRef.current = keywords
    setcurrentPage(1)
    getList(1)
  }
  const getList = async (page) => {
    try {
      const res = await getRcsTempList({
        page: page,
        limit: pageSize,
        status: '1',
        keyword: keywordsRef.current,
      })
      setList(res.list)
      setTotal(res.total)
    } catch (error) {}
  }
  const change = (item: API.RcsTempListItem) => {
    dispatch({
      type: 'changeTemplate',
      payload: item,
    })
    nav(`/console/rcs/interactive/template/${item.id}`)
  }

  // 切换页码
  const changePage = (page: number, pageSize: number) => {
    setcurrentPage(page)
    getList(page)
  }

  return (
    <div className='interactive-temp-list m-t-16'>
      <div className='name fx-y-center fw-500 fn16 p-x-16'>模版列表</div>
      <div className='p-x-16 p-b-8 list'>
        {list.map((item) => (
          <Flex
            align='center'
            className={`list-item p-y-8 g-pointer g-transition-300 ${
              id == item.id ? 'color' : ''
            }`}
            onClick={() => change(item)}
            key={item.id}>
            <div className='sign warning-color g-radius-4 m-r-8'>
              {item.sign}
              <ACopy text={item.sign} />
            </div>
            <span className='g-ellipsis' title={item.title}>
              {item.title}
            </span>
          </Flex>
        ))}
        {list.length == 0 && <Empty className='m-t-40' />}
      </div>
      <Flex align='center' justify='flex-end' className='page p-x-12'>
        <Pagination
          defaultCurrent={1}
          current={currentPage}
          defaultPageSize={pageSize}
          pageSizeOptions={[]}
          total={total}
          simple
          size='small'
          onChange={changePage}
          showTotal={(total) => `共${total}条`}
        />
      </Flex>
    </div>
  )
}
export default forwardRef(Fn)
