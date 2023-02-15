import {
	createContext,
	Dispatch,
	SetStateAction,
	useState,
	useEffect,
} from 'react'
import SelectVault from './SelectVault'
import Workspace from './Workspace'
import Spinner from '../components/Spinner'

export const NotesContext = createContext<{
	allNotes: NoteList | undefined
	setAllNotes?: Dispatch<SetStateAction<NoteList>>
}>({
	allNotes: undefined,
})

export default function App() {
	const [allNotes, setAllNotes] = useState<NoteList>({})
	const [isVaultSet, setIsVaultSet] = useState<boolean>()
	const contextValue = { allNotes, setAllNotes }

	useEffect(() => {
		// this will load once the app loads for the first time
		window.electronAPI.getVaultPath().then((path) => {
			setIsVaultSet(!!path)
		})
		// this will listen for updates on the vault path (set/removed)
		window.electronAPI.onUpdateVaultPath((_, path) => {
			setIsVaultSet(!!path)
		})
	}, [])

	useEffect(() => {
		if (isVaultSet) {
			window.electronAPI.getAllNotes().then((allNotes) => {
				console.log({ notes: allNotes })
				setAllNotes(() => {
					return (
						(Object.keys(allNotes) as Note['id'][])
							// filter out empty notes
							.filter((noteId) => allNotes[noteId].content)
							// recompose object
							.reduce<NoteList>((acc, noteId) => {
								return { ...acc, [noteId]: allNotes[noteId] }
							}, {})
					)
				})
			})
		}
	}, [isVaultSet])

	return (
		<>
			{/* Electron window frame */}
			<div className='webkit-app-drag h-7 w-full shrink-0 fixed z-30 cursor-default backdrop-blur-xs bg-gray-200 dark:bg-gray-800 opacity-0 hover:opacity-100 bg-opacity-50 transition-opacity duration-200' />

			{/* check that initial data has been fetched */}
			{isVaultSet === false ? (
				<SelectVault />
			) : allNotes && isVaultSet ? (
				<NotesContext.Provider value={contextValue}>
					<Workspace />
				</NotesContext.Provider>
			) : (
				<div className='h-full w-full flex items-center justify-center'>
					<Spinner />
				</div>
			)}
		</>
	)
}
