export async function _saveNoteToLocalStorage({ note }: { note: Note }) {
	if (window.electron) {
		window.electron.send('note/save', { note })
	}
}
