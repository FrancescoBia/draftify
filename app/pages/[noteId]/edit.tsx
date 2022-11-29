import { useRouter } from 'next/router'
import EditableNote from '../../src/components/EditableNote'

type Props = {}

export default function EditPage(props: Props) {
	const { query } = useRouter()

	return (
		<div className='max-w-2xl grow flex flex-col mx-auto'>
			{/* <div className='p-4 flex justify-between items-center'>
				<button onClick={() => {}} type='button' className='button-secondary'>
					<p className=''>Re-lock</p>
				</button>
			</div> */}
			<EditableNote noteId={query.noteId as Note['id']} />
		</div>
	)
}
