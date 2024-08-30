import { useContext, createContext, useReducer } from 'react'

import { API } from 'apis'

const StateCtx = createContext(null)
const DispatchCtx = createContext(null)

const reduser = (state, action) => {
  switch (action.type) {
    case 'changeDetail': {
      return {
        ...state,
        detail: action.payload,
        loading: false,
      }
    }
    case 'changeLoading': {
      return {
        ...state,
        loading: action.payload,
      }
    }
  }
}
type InitData = {
  // 当前任务详情
  detail: API.GetVCTaskDetailRes | null
  loading: boolean
}

const initData: InitData = {
  detail: null,
  loading: false,
}

export function StorePage(props: any) {
  const [store, dispatch] = useReducer(reduser, initData)
  return (
    <StateCtx.Provider value={store}>
      <DispatchCtx.Provider value={dispatch}>
        {props.children}
      </DispatchCtx.Provider>
    </StateCtx.Provider>
  )
}

export function useStateStore(): InitData {
  return useContext(StateCtx)
}
export function useStateDispatch() {
  return useContext(DispatchCtx)
}
