import { $getRoot, $getSelection } from 'lexical'
import { useEffect } from 'react'

import { EditorState } from 'lexical'
import { LexicalComposer } from '@lexical/react/LexicalComposer'
import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin'
import { ContentEditable } from '@lexical/react/LexicalContentEditable'
import { HistoryPlugin } from '@lexical/react/LexicalHistoryPlugin'
import { OnChangePlugin } from '@lexical/react/LexicalOnChangePlugin'
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext'
import LexicalErrorBoundary from '@lexical/react/LexicalErrorBoundary'
import { MarkdownShortcutPlugin } from '@lexical/react/LexicalMarkdownShortcutPlugin'
import { TRANSFORMERS } from '@lexical/markdown'
import { defaulTheme } from './theme'
import { HeadingNode, QuoteNode } from '@lexical/rich-text'
import { TableCellNode, TableNode, TableRowNode } from '@lexical/table'
import { ListItemNode, ListNode } from '@lexical/list'
import { CodeHighlightNode, CodeNode } from '@lexical/code'
import { AutoLinkNode, LinkNode } from '@lexical/link'

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
	setText: (value: string) => any
	initialText?: string
	placeholder?: string
	editable?: boolean
}

type InitialConfig = Parameters<typeof LexicalComposer>[0]['initialConfig']

export default function Editor({ editable = true, ...props }: Props) {
	const initialConfig: InitialConfig = {
		namespace: 'MyEditor',
		theme: defaulTheme,
		onError,
		editable,
		editorState: props.initialText,
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

	return (
		<LexicalComposer initialConfig={initialConfig}>
			<div className='editor-container'>
				<RichTextPlugin
					contentEditable={<ContentEditable className='editor-input' />}
					placeholder={
						<div className='editor-placeholder'>{props.placeholder}</div>
					}
					ErrorBoundary={LexicalErrorBoundary}
				/>
				<OnChangePlugin onChange={(es) => onChange(es, props.setText)} />
				<HistoryPlugin />
				<MyCustomAutoFocusPlugin />
				<MarkdownShortcutPlugin transformers={TRANSFORMERS} />
			</div>
		</LexicalComposer>
	)
}
