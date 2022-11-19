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
			<Workspace>
				<Component {...pageProps}>
					<Head>
						<title>Journal</title>
						<meta name='description' content='My journal app' />
						<link rel='icon' href='/favicon.ico' />
					</Head>
				</Component>
			</Workspace>
		</Provider>
	)
}

import { useAppDispatch } from '../src/redux/hooks'
import { fetchAllNotes } from '../src/redux/actions'

type WorkspaceProps = {
	children: React.ReactNode
}
function Workspace(props: WorkspaceProps) {
	const dispatch = useAppDispatch()

	useEffect(() => {
		dispatch(fetchAllNotes())
	}, [dispatch])

	return <>{props.children}</>
}
