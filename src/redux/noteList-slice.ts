import { createReducer, createAsyncThunk } from '@reduxjs/toolkit'
import { _fetchAllNotes } from '../controllers/firebase'

type NoteListState = {
	[noteId: Note['id']]: Note
}

export const fetchAllNotes = createAsyncThunk('noteList/fetch', async () => {
	const allNotes = await _fetchAllNotes()
	return allNotes
})

export default createReducer({} as NoteListState, (builder) => {
	builder.addCase(fetchAllNotes.fulfilled, (_, action) => {
		return action.payload
	})
})
