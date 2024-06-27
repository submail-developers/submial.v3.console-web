import { PayloadAction, createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { RootState } from '@/store'
import { getRcsSetting } from '@/api'
import { API } from 'apis'

// 为 slice state 定义一个类型
interface Breadcrumb {
  setting: API.RcsSettingRes
}

// 使用该类型定义初始 state
const initialState: Breadcrumb = {
  setting: null,
}

// 创建一个异步 action 来获取设置数据
const initSetting = createAsyncThunk(
  'settingRcs/initSetting',
  async (params, thunkAPI) => {
    try {
      // 进行异步请求获取设置数据，例如使用 fetch 或者 axios
      const res = await getRcsSetting()
      if (!(res.status == 'success')) {
        throw new Error('Network response was not ok')
      }
      return res // 返回获取的设置数据
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message) // 返回错误信息
    }
  },
)

export const settingRcsSlice = createSlice({
  name: 'settingRcs',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    // 处理异步 action 的状态变化
    builder
      .addCase(initSetting.pending, (state) => {})
      .addCase(initSetting.fulfilled, (state, action) => {
        state.setting = action.payload // 设置获取到的设置数据
      })
      .addCase(initSetting.rejected, (state, action) => {})
  },
})

// 导出action
// export const { initSetting } = settingRcsSlice.actions

// 导出state
export const settingRcs = (state: RootState) => state.settingRcsReducer.setting
export { initSetting }

export default settingRcsSlice.reducer
