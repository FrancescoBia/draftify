import { createReducer, createAsyncThunk, createAction } from '@reduxjs/toolkit'
import { _fetchNote } from '../controllers/firebase'
import { fetchNote } from './notes-slice'

type NoteState = Note | null

export const makeNoteEditable = createAsyncThunk(
	'editableNote/load',
	async (noteId: Note['id'], { dispatch }) => {
		// make sure to fetch the latest state of the note before making it editable
		const note = dispatch(fetchNote({ noteId })).unwrap()
		return note
	}
)

export const cleanupEditableNote = createAction('editableNote/cleanup')

export default createReducer(null as NoteState, (builder) => {
	builder
		.addCase(makeNoteEditable.fulfilled, (_, action) => {
			return action.payload
		})
		.addCase(cleanupEditableNote, () => null)
})
