import { useEffect } from 'react'

type Props = {
	notesIdList: Array<Note['id']>
}

const Navigator = (props: Props) => {
	// useEffect(() => {
	// 	console.log('navigator render')

	// 	return () => {}
	// }, [])

	return (
		<div className='h-full w-12 bg-gray-100 dark:bg-gray-900 group'>
			<div className='absolute z-10 top-0 left-0 w-56 bg-white dark:bg-gray-900 h-screen shadow-lg hidden group-hover:block opacity-0 hover:opacity-100 transition-opacity duration-500'>
				<div className='flex flex-col'>
					{props.notesIdList.map((noteId) => (
						<NoteItem key={'note-item-' + noteId} noteId={noteId} />
					))}
				</div>
			</div>
		</div>
	)
}

type NoteItemProps = {
	noteId: Note['id']
}

const NoteItem = (props: NoteItemProps) => {
	return <button className='px-4 py-2 text-left'>{props.noteId}</button>
}

export { Navigator }
