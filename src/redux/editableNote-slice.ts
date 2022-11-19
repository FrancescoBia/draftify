import { createReducer, createAsyncThunk } from '@reduxjs/toolkit'
import { _fetchNote } from '../controllers/firebase'
import { fetchAllNotes } from './notes-slice'

type NoteState = Note | null

/** Currently not used */
export const fetchNote = createAsyncThunk(
	'note/fetch',
	async ({ noteId }: { noteId: string }) => {
		const note = await _fetchNote({ noteId })
		return note
	}
)

export default createReducer(null as NoteState, (builder) => {
	builder
		.addCase(fetchAllNotes.fulfilled, (_, action) => {
			const today = new Date().toISOString()
			const dateKey = today.substring(0, 10)

			const todayNote = action.payload[dateKey]
			return todayNote
		})
		// not in use
		.addCase(fetchNote.fulfilled, (_, action) => {
			return action.payload
		})
})
