import { useRouter } from 'next/router'
import { useContext, useEffect, useState } from 'react'
import { Spinner } from '../../src/components/Spinner'

type LegacyNote = {
	readonly id: `20${number}${number}-${number}${number}-${number}${number}` // YYYY-MM-DD
	readonly dateCreated: string
	lastModified: string
	content: any // serializedJsonData
}

const process = {
	noteId: 'promise',
}

export default function Migrate() {
	const [noteList, setNoteList] = useState<NoteList>({})
	// const router = useRouter()

	useEffect(() => {
		window
			.electronAPI!.getAllNotesFromStore()
			.then((noteList) => setNoteList(noteList))
	}, [])

	return (
		<div className='grow'>
			<div className='hidden'>
				{noteList &&
					Object.values(noteList).map((note: LegacyNote) => {
						return (
							<Editor
								key={note.id}
								noteId={note.id}
								initialText={JSON.stringify(note.content)}
								onChange={(markdownData) => {
									const updatedNote: Note = { ...note, content: markdownData }
									if (markdownData) {
										window.electronAPI!.saveNote({ note: updatedNote })
									}
								}}
							/>
						)
					})}
			</div>
			<div className='h-full w-full flex items-center justify-center'>
				<Spinner />
			</div>
		</div>
	)
}

import { LexicalEditor } from 'lexical'
import { EditorState } from 'lexical'
import { LexicalComposer } from '@lexical/react/LexicalComposer'
import { OnChangePlugin } from '@lexical/react/LexicalOnChangePlugin'
import { $convertToMarkdownString } from '@lexical/markdown'
import { customTransformers } from '../../src/components/Editor/plugins/CustomMarkdownShortcutPlugin'
import { HeadingNode, QuoteNode } from '@lexical/rich-text'
import { TableCellNode, TableNode, TableRowNode } from '@lexical/table'
import { AutoLinkNode, LinkNode } from '@lexical/link'
import { CodeHighlightNode, CodeNode } from '@lexical/code'
import { ListItemNode, ListNode } from '@lexical/list'
import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin'
import { ContentEditable } from '@lexical/react/LexicalContentEditable'
import LexicalErrorBoundary from '@lexical/react/LexicalErrorBoundary'
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext'

type InitialConfig = Parameters<typeof LexicalComposer>[0]['initialConfig']

const Editor = (props: {
	noteId: string
	initialText: string
	onChange: (markdownData: string) => void
}) => {
	const editorConfig: InitialConfig = {
		namespace: props.noteId,
		editorState: props.initialText,
		editable: false,
		onError(error: any) {
			throw error
		},
		nodes: [
			HeadingNode,
			ListNode,
			ListItemNode,
			QuoteNode,
			CodeNode,
			CodeHighlightNode,
			TableNode,
			TableCellNode,
			TableRowNode,
			AutoLinkNode,
			LinkNode,
		],
	}

	function onChange(_: EditorState, editor: LexicalEditor) {
		editor.update(() => {
			// transform to Markdown
			const markdownData = $convertToMarkdownString(customTransformers)
			props.onChange(markdownData)
			// console.log(markdownData)
		})
	}

	return (
		<LexicalComposer initialConfig={editorConfig}>
			<RichTextPlugin
				contentEditable={<ContentEditable className='editor-input' />}
				placeholder={
					<div className='editor-placeholder'>What&apos;s on your mind?</div>
				}
				ErrorBoundary={LexicalErrorBoundary}
			/>
			<OnChangePlugin onChange={onChange} />
			<MyCustomAutoFocusPlugin />
		</LexicalComposer>
	)
}

// this is used to trigger a state update from the editor and read the content
function MyCustomAutoFocusPlugin() {
	const [editor] = useLexicalComposerContext()

	useEffect(() => {
		editor.focus()
	}, [editor])

	return null
}
