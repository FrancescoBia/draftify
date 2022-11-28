import { createContext } from 'react'
import '../styles/globals.css'
import '../styles/Editor/index.css'
import type { AppProps } from 'next/app'
import Head from 'next/head'
import { Provider } from 'react-redux'
import { useEffect, useState } from 'react'
import { store } from '../src/redux/store'
import { useRouter } from 'next/router'

export default function App({ Component, pageProps }: AppProps) {
	const router = useRouter()
	const [isElectron, setIsElectron] = useState(false)
	const [isLoading, setIsLoading] = useState(true)

	useEffect(() => {
		setIsElectron(!!window?.electronAPI)
		setIsLoading(false)
	}, [router])

	return (
		<Provider store={store}>
			{isLoading ? (
				<></>
			) : isElectron ? (
				<WorkspaceLayout>
					<Component {...pageProps} />
				</WorkspaceLayout>
			) : (
				//  Not found
				<div className='h-screen w-screen flex justify-center items-center'>
					404
				</div>
			)}
			<Head>
				<title>Journal</title>
				<meta name='description' content='My journal app' />
				<link rel='icon' href='/favicon.ico' />
			</Head>
		</Provider>
	)
}

import { Navigator } from '../src/components/Navigator'
import { Spinner } from '../src/components/Spinner'
import isNoteEmpty from '../src/utils/checkIfNoteIsEmpty'
import { Dispatch, SetStateAction } from 'react'

type WorkspaceLayoutProps = {
	children: React.ReactNode
}

export const NotesContext = createContext<{
	allNotes: NoteList | undefined
	setAllNotes?: Dispatch<SetStateAction<NoteList>>
}>({
	allNotes: undefined,
})

function WorkspaceLayout(props: WorkspaceLayoutProps) {
	const [allNotes, setAllNotes] = useState<NoteList>({})
	const contextValue = { allNotes, setAllNotes }

	useEffect(() => {
		window.electronAPI!.getAllNotes().then((allNotes) => {
			console.log({ notes: allNotes })
			setAllNotes(() => {
				return (
					(Object.keys(allNotes) as Note['id'][])
						// filter out empty notes
						.filter((noteId) => !isNoteEmpty(allNotes[noteId].content!))
						// recompose object
						.reduce<NoteList>((acc, noteId) => {
							return { ...acc, [noteId]: allNotes[noteId] }
						}, {})
				)
			})
		})
	}, [])

	return (
		<div className='h-screen flex flex-col'>
			{/* Electron window frame */}
			<div className='webkit-app-drag h-7 w-full shrink-0' />
			{/* App  */}
			<div className='flex grow'>
				{/* check that initial data has been fetched */}
				{allNotes ? (
					<NotesContext.Provider value={contextValue}>
						<Navigator />
						{props.children}
					</NotesContext.Provider>
				) : (
					<div className='h-full w-full flex items-center justify-center'>
						<Spinner />
					</div>
				)}
			</div>
		</div>
	)
}
