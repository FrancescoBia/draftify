import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './style/index.css'
import App from './views/App'

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement)
root.render(
	<React.StrictMode>
		{window.electronAPI ? (
			<BrowserRouter>
				<App />
			</BrowserRouter>
		) : (
			<div className='flex justify-center items-center h-screen text-red-600'>
				Draftify requires Electron to run
			</div>
		)}
	</React.StrictMode>
)
