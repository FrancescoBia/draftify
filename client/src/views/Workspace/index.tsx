import { Route, Routes } from 'react-router-dom'
import EditableNote from './EditableNote'
import Navigator from './Navigator'
import NoteList from './NoteList'

export default function Workspace() {
	return (
		<div className='flex grow'>
			<Navigator />
			<Routes>
				<Route path='/' element={<EditableNote />} />
				<Route path='all' element={<NoteList />} />
				<Route path=':date' element={<EditableNote />} />
			</Routes>
		</div>
	)
}
