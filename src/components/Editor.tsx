import { $getRoot, $getSelection, LexicalCommand } from 'lexical'
import { useEffect } from 'react'

import { InitialEditorStateType } from '@lexical/react/LexicalComposer'
import { EditorState } from 'lexical'
import { LexicalComposer } from '@lexical/react/LexicalComposer'
import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin'
import { ContentEditable } from '@lexical/react/LexicalContentEditable'
import { HistoryPlugin } from '@lexical/react/LexicalHistoryPlugin'
import { OnChangePlugin } from '@lexical/react/LexicalOnChangePlugin'
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext'
import LexicalErrorBoundary from '@lexical/react/LexicalErrorBoundary'
import { defaulTheme } from './theme'

// When the editor changes, you can get notified via the
// LexicalOnChangePlugin!
function onChange(editorState: EditorState, setText: Function) {
	editorState.read(() => {
		// Read the contents of the EditorState here.
		const root = $getRoot()
		const selection = $getSelection()

		// console.log(root, selection)
		// setText(editorState.)
		const jsonData = editorState.toJSON()
		setText(JSON.stringify(jsonData))
	})
}

// Lexical React plugins are React components, which makes them
// highly composable. Furthermore, you can lazy load plugins if
// desired, so you don't pay the cost for plugins until you
// actually use them.
function MyCustomAutoFocusPlugin() {
	const [editor] = useLexicalComposerContext()

	useEffect(() => {
		// Focus the editor when the effect fires!
		editor.focus()
	}, [editor])

	return null
}

// Catch any errors that occur during Lexical updates and log them
// or throw them as needed. If you don't throw them, Lexical will
// try to recover gracefully without losing user data.
function onError(error: any) {
	console.error(error)
}

type Props = {
	setText: Function
	initialText: string
}

type InitialConfig = Parameters<typeof LexicalComposer>[0]['initialConfig']

export default function Editor(props: Props) {
	const initialConfig: InitialConfig = {
		namespace: 'MyEditor',
		theme: defaulTheme,
		onError,
		editorState: props.initialText,
	}

	return (
		<LexicalComposer initialConfig={initialConfig}>
			<div className='editor-container'>
				<RichTextPlugin
					contentEditable={<ContentEditable className='editor-input' />}
					placeholder={
						<div className='editor-placeholder'>Enter some text...</div>
					}
					ErrorBoundary={LexicalErrorBoundary}
				/>
				<OnChangePlugin onChange={(es) => onChange(es, props.setText)} />
				<HistoryPlugin />
				<MyCustomAutoFocusPlugin />
			</div>
		</LexicalComposer>
	)
}
