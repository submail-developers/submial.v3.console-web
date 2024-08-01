import { useContext, createContext, useReducer } from 'react'

const StateCtx = createContext(null)
const DispatchCtx = createContext(null)

const reduser = (state, action) => {
  switch (action.type) {
    case 'changeRootPath': {
      return {
        ...state,
        rootPath: action.payload,
      }
    }
  }
}
type InitData = {
  // 当前产品根路径
  rootPath: string
}

const initData: InitData = {
  rootPath: '',
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

export function useStateStore() {
  return useContext(StateCtx)
}
export function useStateDispatch() {
  return useContext(DispatchCtx)
}
