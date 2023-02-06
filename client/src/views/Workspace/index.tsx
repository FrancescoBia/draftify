import { Route, Routes } from 'react-router-dom'
import EditableNote from './EditableNote'
import Navigator from './Navigator'

export default function Workspace() {
	return (
		<div className='flex '>
			<Navigator />
			<Routes>
				<Route path='*' element={<EditableNote noteId='2023-01-31' />} />
			</Routes>
		</div>
	)
}
