import { Route, Routes } from 'react-router-dom'
import EditableNote from './EditableNote'
import Navigator from './Navigator'
import NoteList from './NoteList'

export default function Workspace() {
	return (
		<div className='flex '>
			<Navigator />
			<Routes>
				<Route path='all' element={<NoteList />} />
				<Route path='*' element={<EditableNote noteId='2023-01-31' />} />
			</Routes>
		</div>
	)
}
