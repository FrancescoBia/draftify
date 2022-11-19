import { createReducer, createAsyncThunk } from '@reduxjs/toolkit'
import { _fetchAllNotes } from '../controllers/firebase'
import { getNoteIdFromDate } from '../utils/dateFormatter'

type NoteListState = {
	[noteId: Note['id']]: Note
}

export const fetchAllNotes = createAsyncThunk('noteList/fetch', async () => {
	const allNotes = await _fetchAllNotes()
	return allNotes
})

const noteId: Note['id'] = getNoteIdFromDate()
const initialState: NoteListState = {
	[noteId]: {
		dateCreated: noteId,
		lastModified: noteId,
	} as Note,
}

export default createReducer(initialState, (builder) => {
	builder.addCase(fetchAllNotes.fulfilled, (state, action) => {
		return { ...state, ...action.payload }
	})
})
