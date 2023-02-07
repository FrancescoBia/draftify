import React from 'react'
import ReactDOM from 'react-dom/client'
import { HashRouter } from 'react-router-dom'
import App from './views/App'
import './style/index.css'

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement)
root.render(
	<React.StrictMode>
		{window.electronAPI ? (
			<HashRouter>
				<App />
			</HashRouter>
		) : (
			<div className='flex justify-center items-center h-screen text-red-600'>
				Draftify requires Electron to run
			</div>
		)}
	</React.StrictMode>
)
