import '../styles/globals.css'
import '../styles/editorTheme.css'
import type { AppProps } from 'next/app'
import Head from 'next/head'
import { Provider } from 'react-redux'
import { useEffect, useState } from 'react'
import { store } from '../src/redux/store'
import { useRouter } from 'next/router'

export default function App({ Component, pageProps }: AppProps) {
	const router = useRouter()
	const [isElectron, setIsElectron] = useState(false)

	useEffect(() => {
		if (!window?.electronAPI) router.push('/404', undefined, { shallow: true })
		setIsElectron(!!window?.electronAPI)
	}, [router])

	return (
		<Provider store={store}>
			{isElectron ? (
				<WorkspaceLayout>
					<Component {...pageProps} />
				</WorkspaceLayout>
			) : (
				<Component {...pageProps} />
			)}
			<Head>
				<title>Journal</title>
				<meta name='description' content='My journal app' />
				<link rel='icon' href='/favicon.ico' />
			</Head>
		</Provider>
	)
}

import { useAppDispatch, useAppSelector } from '../src/redux/hooks'
import { fetchAllNotes } from '../src/redux/notes-slice'
import { Navigator } from '../src/components/Navigator'
import { Spinner } from '../src/components/Spinner'

type WorkspaceLayoutProps = {
	children: React.ReactNode
}

function WorkspaceLayout(props: WorkspaceLayoutProps) {
	const dispatch = useAppDispatch()
	const { allNotes } = useAppSelector((s) => s)

	useEffect(() => {
		// dispatch(fetchAllNotes())
	}, [dispatch])

	return (
		<div className='h-screen flex'>
			<div className='webkit-app-drag fixed h-7 w-full' />

			{/* check that initial data has been fetched */}
			{/* {Object.keys(allNotes) && Object.keys(allNotes).length > 0 ? ( */}
			<>
				{/* <Navigator
						notesIdList={Object.keys(allNotes).sort().reverse() as Note['id'][]}
					/> */}
				{props.children}
			</>
			{/* ) : (
				<div className='h-full w-full flex items-center justify-center'>
					<Spinner />
				</div>
			)} */}
		</div>
	)
}
