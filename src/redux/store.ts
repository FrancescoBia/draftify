import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit'

export const store = configureStore({
	reducer: {},
	enhancers: [],
})

export type AppDispatch = typeof store.dispatch
export type RootState = ReturnType<typeof store.getState>
export type AppThunk<ReturnType = void> = ThunkAction<
	ReturnType,
	RootState,
	unknown,
	Action<string>
>
