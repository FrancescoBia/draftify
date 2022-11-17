import { $getRoot, $getSelection } from 'lexical'
import { useEffect } from 'react'

import { EditorState } from 'lexical'
import { LexicalComposer } from '@lexical/react/LexicalComposer'
import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin'
import { PlainTextPlugin } from '@lexical/react/LexicalPlainTextPlugin'
import { ContentEditable } from '@lexical/react/LexicalContentEditable'
import { HistoryPlugin } from '@lexical/react/LexicalHistoryPlugin'
import { OnChangePlugin } from '@lexical/react/LexicalOnChangePlugin'
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext'
import LexicalErrorBoundary from '@lexical/react/LexicalErrorBoundary'

const theme = {
	// Theme styling goes here
	// ...
}

// When the editor changes, you can get notified via the
// LexicalOnChangePlugin!
function onChange(editorState: EditorState) {
	editorState.read(() => {
		// Read the contents of the EditorState here.
		const root = $getRoot()
		const selection = $getSelection()

		console.log(root, selection)
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

export function Editor() {
	const initialConfig = {
		namespace: 'MyEditor',
		theme,
		onError,
	}

	return (
		<LexicalComposer initialConfig={initialConfig}>
			<RichTextPlugin
				contentEditable={<ContentEditable />}
				placeholder={<div>Enter some text...</div>}
				ErrorBoundary={LexicalErrorBoundary}
			/>
			<OnChangePlugin onChange={onChange} />
			<HistoryPlugin />
			<MyCustomAutoFocusPlugin />
		</LexicalComposer>
	)
}
