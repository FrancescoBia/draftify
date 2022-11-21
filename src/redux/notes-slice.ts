import { createReducer, createAsyncThunk } from '@reduxjs/toolkit'
import { _fetchNote, _fetchAllNotes } from '../controllers/firebase'
import { getNoteIdFromDate } from '../utils/dateFormatter'
import { getFormattedDate } from '../utils/dateFormatter'

export type NoteListState = {
	[noteId: Note['id']]: Note
}

const noteId: Note['id'] = getNoteIdFromDate()
const currentDate = getFormattedDate()
const todaysNote: Note = {
	id: noteId,
	dateCreated: currentDate,
	lastModified: currentDate,
	content: undefined,
}

export const fetchNote = createAsyncThunk(
	'note/fetch',
	async ({ noteId }: { noteId: string }) => {
		const note = await _fetchNote({ noteId })
		return note
	}
)

export const fetchAllNotes = createAsyncThunk('noteList/fetch', async () => {
	const allNotes = await _fetchAllNotes()
	return { [todaysNote.id]: todaysNote, ...allNotes } as NoteListState
})

export default createReducer({} as NoteListState, (builder) => {
	builder
		.addCase(fetchAllNotes.fulfilled, (state, action) => {
			return { ...state, ...action.payload }
		})
		.addCase(fetchNote.fulfilled, (state, action) => {
			const note = action.payload
			return { ...state, [note.id]: note }
		})
		// ------------------------------------
		// Actions from other slices
		.addCase('editableNote/save/fulfilled', (state, action) => {
			const note = (action as any).payload
			return { ...state, [note.id]: note }
		})
})
