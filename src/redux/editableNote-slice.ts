import { createReducer, createAsyncThunk, createAction } from '@reduxjs/toolkit'
import { _fetchNote, _saveNote } from '../controllers/firebase'
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

export const saveNote = createAsyncThunk(
	'editableNote/save',
	async ({ updatedNote }: { updatedNote: Note }) => {
		const notePromise = await _saveNote({ note: updatedNote }).then(
			() => updatedNote
		)

		return notePromise
	}
)

export const cleanupEditableNote = createAction('editableNote/cleanup')

export default createReducer(null as NoteState, (builder) => {
	builder
		.addCase(makeNoteEditable.fulfilled, (_, action) => action.payload)
		.addCase(saveNote.fulfilled, (_, action) => action.payload)
		.addCase(cleanupEditableNote, () => null)
})
