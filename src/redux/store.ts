import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit'
import editableNote from './editableNote-slice'
import notesReducer from './notes-slice'

export const store = configureStore({
	reducer: {
		note: editableNote,
		allNotes: notesReducer,
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
