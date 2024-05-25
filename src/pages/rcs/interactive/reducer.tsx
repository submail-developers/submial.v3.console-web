import { useContext, createContext, useReducer } from 'react'

import { API } from 'apis'

const StateCtx = createContext(null)
const DispatchCtx = createContext(null)

const reduser = (state, action) => {
  switch (action.type) {
    case 'changeChatbot': {
      return {
        ...state,
        chatbot: action.payload,
        chats: [],
      }
    }
    case 'changeTemplate': {
      return {
        ...state,
        template: action.payload,
        chats: [],
      }
    }
    case 'changeChats': {
      return {
        ...state,
        chats: action.payload,
      }
    }
  }
}
type InitData = {
  // 当前chatbot
  chatbot: API.ChatbotItem | null
  // 当前模版
  template: API.RcsTempListItem | null
  // 模拟交互的信息
  chats: API.GetRcsInteractiveListResItem[]
}

const initData: InitData = {
  chatbot: null,
  template: null,
  chats: [],
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
