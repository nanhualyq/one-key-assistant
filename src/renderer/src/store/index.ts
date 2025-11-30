import { configureStore } from '@reduxjs/toolkit'
import settingsSlice from './settings.slice'

const store = configureStore({
  reducer: {
    settings: settingsSlice.reducer
  }
})
export default store

// 导出 RootState 和 AppDispatch 类型
// 从 store 本身推断 RootState
export type RootState = ReturnType<typeof store.getState>
// 从 store 本身推断 AppDispatch 类型
export type AppDispatch = typeof store.dispatch
