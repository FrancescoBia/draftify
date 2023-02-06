import { BrowserRouter, Route, Routes } from 'react-router-dom'
import EditableNote from './EditableNote'

export default function Workspace() {
	return (
		<BrowserRouter>
			<Routes>
				<Route path='/' element={<EditableNote noteId='2023-01-31' />} />
			</Routes>
		</BrowserRouter>
	)
}
