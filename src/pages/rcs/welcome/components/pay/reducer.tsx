import { useContext, createContext, useReducer } from 'react'

import { API } from 'apis'

const StateCtx = createContext<InitData>(null)
const DispatchCtx = createContext(null)

const reduser = (state, action) => {
  switch (action.type) {
    // 初始化资源包
    case 'initPackages': {
      return {
        ...state,
        packages: action.payload,
        car: {},
        carsId: [],
        step: 0,
        orderInfo: null,
      }
    }
    // 修改购物车资源包数量 payload: {id,number}
    case 'changeCar': {
      let carsId = [...state.carsId]
      if (!carsId.includes(action.payload.id)) {
        carsId.push(action.payload.id)
      }
      // 删除资源包
      if (action.payload.number == 0) {
        carsId = carsId.filter((item) => item != action.payload.id)
      }
      return {
        ...state,
        car: {
          ...state.car,
          [action.payload.id]: action.payload.number,
        },
        carsId: carsId,
      }
    }
    // 修改步骤
    case 'changeStep': {
      return {
        ...state,
        step: action.payload,
      }
    }
    // 发票列表
    case 'initInvoiceList': {
      return {
        ...state,
        invoiceList: action.payload,
      }
    }
    // 选择发票
    case 'changeInvoiceId': {
      return {
        ...state,
        invoiceId: action.payload,
      }
    }
    // 订单
    case 'changeOrder': {
      return {
        ...state,
        orderInfo: action.payload,
      }
    }
    // 再次购买
    case 'rePay': {
      return {
        ...state,
        car: {},
        carsId: [],
        step: 0,
        orderInfo: null,
      }
    }
  }
}
type InitData = {
  // 资源包
  packages: API.RcsPackagesItem[]
  // 购物车，key值为id，value值为数量
  car: {
    [key in string]: number
  }
  // 购物车id
  carsId: string[]
  step: -1 | 0 | 1 | 2 | 3
  // 发票列表
  invoiceList: API.InvoiceItem[]
  // 选择发票
  invoiceId: string
  // 订单
  orderInfo: API.CreateOrderRes
}

const initData: InitData = {
  packages: [],
  car: {},
  carsId: [],
  step: -1,
  invoiceList: [],
  invoiceId: '',
  orderInfo: null,
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
