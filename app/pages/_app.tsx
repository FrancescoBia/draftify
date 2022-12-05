import { createContext } from 'react'
import '../styles/globals.css'
import '../styles/Editor/index.css'
import type { AppProps } from 'next/app'
import Head from 'next/head'
import { Provider } from 'react-redux'
import { useEffect, useState } from 'react'
import { store } from '../src/redux/store'
import { useRouter } from 'next/router'
import Logo from '../src/assets/images/logo.png'

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
import Image from 'next/image'

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
	const [vaultIsSet, setVaultIsSet] = useState<boolean>()
	const router = useRouter()

	useEffect(() => {
		// this will load once the app loads for the first time
		window.electronAPI!!.getVaultPath().then((path) => {
			setVaultIsSet(!!path)
		})
		// this will listen for updates on the vault path (set/removed)
		window.electronAPI!.onUpdateVaultPath((_, path) => {
			setVaultIsSet(!!path)
		})

		window.electronAPI!.notifyMain.clientIsReady(true)

		// window.electronAPI!.onMigrationRun((_, version) => {
		// 	console.log('pushing this', { version })

		// 	router.push(`/migrate/${version}`)
		// })
	}, [])

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
				{!vaultIsSet ? (
					<SelectVault />
				) : allNotes ? (
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

// https://tally.so/r/wArxyk

import HelpCircle from '../src/assets/help-circle.svg'
function SelectVault() {
	return (
		<div className='flex flex-col items-center justify-center grow bg-secondary'>
			<div className='w-24 my-4'>
				<Image src={Logo} alt='draftify logo' className='drop-shadow-icon' />
			</div>
			<div className='p-4 rounded-xl max-w-sm'>
				<h2 className='text-secondary text-sm'>
					Select a vault location for your documents:
				</h2>
				<button
					className='p-4 rounded-lg bg-tertiary-int my-4 w-full text-left'
					onClick={() => {
						window.electronAPI!.createVault().then((path) => {
							console.log({ path })
						})
					}}
				>
					<h3 className='font-semibold'>Create a new vault</h3>
					<p className='text-secondary text-sm'>
						Create a new Draftify vault in a folder
					</p>
				</button>
				<button
					className='p-4 rounded-lg bg-tertiary-int w-full text-left'
					onClick={() => {
						window.electronAPI!.selectExistingVault().then((path) => {
							console.log({ path })
						})
					}}
				>
					<h3 className='font-semibold'>Open an existing vault</h3>
					<p className='text-secondary text-sm'>
						Choose an existing Draftify vault in a folder
					</p>
				</button>
				<div className='bg-purple-100 text-purple-700 rounded-lg p-2 px-3 text-sm mt-10 flex gap-x-3 items-center'>
					<div className='w-6'>
						<HelpCircle />
					</div>
					<p className=''>
						If you previously created documents without a vault, these will be
						automatically migrated.
					</p>
				</div>
			</div>
		</div>
	)
}
