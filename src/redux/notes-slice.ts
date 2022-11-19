import { createReducer, createAsyncThunk } from '@reduxjs/toolkit'
import { _fetchAllNotes } from '../controllers/firebase'
import { getNoteIdFromDate } from '../utils/dateFormatter'

type NoteListState = {
	[noteId: Note['id']]: Note
}

const noteId: Note['id'] = getNoteIdFromDate()
const todaysNote: Note = {
	id: noteId,
	dateCreated: noteId,
	lastModified: noteId,
	content: undefined,
}

export const fetchAllNotes = createAsyncThunk('noteList/fetch', async () => {
	const allNotes = await _fetchAllNotes()
	return { [todaysNote.id]: todaysNote, ...allNotes }
})

export default createReducer({} as NoteListState, (builder) => {
	builder.addCase(fetchAllNotes.fulfilled, (state, action) => {
		return { ...state, ...action.payload }
	})
})
