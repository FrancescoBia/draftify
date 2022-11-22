import { createReducer, createAsyncThunk, createAction } from '@reduxjs/toolkit'
import { _fetchNote, _saveNote } from '../controllers/firebase'
import { fetchNote } from './notes-slice'
import { getNoteIdFromDate } from '../utils/dateFormatter'
import { RootState } from './store'

type NoteState = Note | null

export const makeNoteEditable = createAsyncThunk(
	'editableNote/load',
	async (noteId: Note['id'], { dispatch, getState }) => {
		// fetch the latest state of the note before making it editable
		const note = await dispatch(fetchNote({ noteId }))
			.unwrap()
			// if no note is found (e.g. today's note)
			.catch((err) => {
				const today = getNoteIdFromDate()
				// check if user is trying to load today's note
				if (noteId === today) {
					// check if it has already been loaded up (it should be created by the notes-slice reducer)
					const todaysNote = (getState() as RootState).allNotes[today]
					// if found, return it
					if (todaysNote) return todaysNote
				}
				// otherwise, if note is not today's and/or is not found in local state, reject
				return Promise.reject(err)
			})

		return note
	}
)

export const saveNote = createAsyncThunk(
	'editableNote/save',
	async ({ updatedNote }: { updatedNote: Note }) => {
		window.electronAPI
			?.saveNote({ note: updatedNote })
			.then(() => console.log('notesaved on localstorage'))
			.catch((err) => console.log(err))

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
