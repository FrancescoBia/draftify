import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit'
import noteReducer from './note-slice'

export const store = configureStore({
	reducer: {
		note: noteReducer,
	},
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
