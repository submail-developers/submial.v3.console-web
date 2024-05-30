import { useEffect } from 'react'
import { useParams } from 'react-router-dom'
import {
  useStateStore,
  useStateDispatch,
} from '@/pages/rcs/interactive/reducer'
import Config from './config'
import { getRcsTempList } from '@/api'

export default function Fn() {
  const state = useStateStore()
  const dispatch = useStateDispatch()
  const { id } = useParams()
  // 获取交互详情
  useEffect(() => {
    if (!state.template) {
      getInfo()
    }
  }, [state.template])
  const getInfo = async () => {
    try {
      const res = await getRcsTempList({
        page: 1,
        limit: 10,
        id: id,
        keyword: '',
        status: '1', // 默认all     0等待审核，1通过，2驳回
      })
      if (res.list.length == 1) {
        dispatch({
          type: 'changeTemplate',
          payload: {
            ...res.list[0],
          },
        })
      }
    } catch (error) {}
  }
  return <Config />
}
