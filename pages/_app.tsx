import '../styles/globals.css'
import '../styles/editorTheme.css'
import type { AppProps } from 'next/app'
import Head from 'next/head'
import { Provider } from 'react-redux'
import { useEffect } from 'react'
import { store } from '../src/redux/store'

export default function App({ Component, pageProps }: AppProps) {
	return (
		<Provider store={store}>
			<WorkspaceLayout>
				<Component {...pageProps}>
					<Head>
						<title>Journal</title>
						<meta name='description' content='My journal app' />
						<link rel='icon' href='/favicon.ico' />
					</Head>
				</Component>
			</WorkspaceLayout>
		</Provider>
	)
}

import { useAppDispatch, useAppSelector } from '../src/redux/hooks'
import { fetchAllNotes } from '../src/redux/actions'
import { Navigator } from '../src/components/Navigator'
type WorkspaceLayoutProps = {
	children: React.ReactNode
}
function WorkspaceLayout(props: WorkspaceLayoutProps) {
	const dispatch = useAppDispatch()
	const { allNotes } = useAppSelector((s) => s)

	useEffect(() => {
		dispatch(fetchAllNotes())
	}, [dispatch])

	return (
		<div className='h-screen flex'>
			<Navigator
				notesIdList={Object.keys(allNotes).sort().reverse() as Note['id'][]}
			/>
			{props.children}
		</div>
	)
}
