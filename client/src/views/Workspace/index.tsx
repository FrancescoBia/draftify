import { Route, Routes } from 'react-router-dom'
import EditableNote from './EditableNote'

export default function Workspace() {
	return (
		<div className=''>
			<div className=''> Hellloooooo</div>
			<Routes>
				<Route path='/' element={<EditableNote noteId='2023-01-31' />} />
			</Routes>
		</div>
	)
}
