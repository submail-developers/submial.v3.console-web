import { PayloadAction, createSlice } from '@reduxjs/toolkit'
import { RootState } from '@/store'

interface ChangeBreadcrumbPayload {
  index: number
  title: string
}

interface BreadcrumbItem {
  href?: string
  title?: string
}

// 为 slice state 定义一个类型
interface Breadcrumb {
  list: BreadcrumbItem[]
}

// 使用该类型定义初始 state
const initialState: Breadcrumb = {
  list: [],
}

export const breadcrumbSlice = createSlice({
  name: 'breadcrumb',
  initialState,
  reducers: {
    // 列表
    changeBreadcrumb: (state, actions: PayloadAction<BreadcrumbItem[]>) => {
      state.list = actions.payload
    },
    // 修改某个面包屑，如新增/编辑在同一个页面
    changeBreadcrumbItem: (
      state,
      actions: PayloadAction<ChangeBreadcrumbPayload>,
    ) => {
      if (state.list.length <= actions.payload.index + 1) {
        state.list[actions.payload.index].title = actions.payload.title
      }
    },
  },
})

// 导出action
export const { changeBreadcrumb, changeBreadcrumbItem } =
  breadcrumbSlice.actions

// 导出state
export const breadcrumbStatus = (state: RootState) =>
  state.breadcrumbReducer.list

export default breadcrumbSlice.reducer
