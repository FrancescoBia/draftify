import { createReducer, createAsyncThunk } from '@reduxjs/toolkit'
import { _fetchNote } from '../controllers/firebase'

type NoteState = Note | null

export const fetchNote = createAsyncThunk(
	'note/fetch',
	async ({ noteId }: { noteId: string }) => {
		const note = await _fetchNote({ noteId })

		return note
	}
)

export default createReducer(null as NoteState, (builder) => {
	builder.addCase(fetchNote.fulfilled, (_, action) => {
		return action.payload
	})
})
