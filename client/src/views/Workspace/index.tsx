import { Route, Routes, useParams } from 'react-router-dom'
import EditableNote from './EditableNote'
import Navigator from './Navigator'
import NoteList from './NoteList'

export default function Workspace() {
	return (
		<div className='flex grow'>
			<Navigator />
			<Routes>
				<Route path='/' element={<EditableNote noteId='2023-01-31' />} />
				<Route path='all' element={<NoteList />} />
				<Route path=':date' element={<PastEditableNote />} />
			</Routes>
		</div>
	)
}

function PastEditableNote() {
	const { date } = useParams()
	return <EditableNote noteId={date as Note['id']} />
}
