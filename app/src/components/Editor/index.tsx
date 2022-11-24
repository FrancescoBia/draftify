import { useEffect } from 'react'
import { EditorState, LexicalEditor } from 'lexical'
import { defaulTheme } from './theme'
import { LexicalComposer } from '@lexical/react/LexicalComposer'
import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin'
import { ContentEditable } from '@lexical/react/LexicalContentEditable'
import { HistoryPlugin } from '@lexical/react/LexicalHistoryPlugin'
import { OnChangePlugin } from '@lexical/react/LexicalOnChangePlugin'
import { AutoFocusPlugin } from '@lexical/react/LexicalAutoFocusPlugin'
import LexicalErrorBoundary from '@lexical/react/LexicalErrorBoundary'
// import ToolbarPlugin from './plugins/ToolbarPlugin'
import { HeadingNode, QuoteNode } from '@lexical/rich-text'
import { TableCellNode, TableNode, TableRowNode } from '@lexical/table'
import { ListItemNode, ListNode } from '@lexical/list'
import { CodeHighlightNode, CodeNode } from '@lexical/code'
import { AutoLinkNode, LinkNode } from '@lexical/link'
import { LinkPlugin } from '@lexical/react/LexicalLinkPlugin'
import { ListPlugin } from '@lexical/react/LexicalListPlugin'
import { MarkdownShortcutPlugin } from '@lexical/react/LexicalMarkdownShortcutPlugin'
import { TRANSFORMERS } from '@lexical/markdown'
import ListMaxIndentLevelPlugin from './plugins/ListMaxIndentLevelPlugin'
// import CodeHighlightPlugin from './plugins/CodeHighlightPlugin'
import AutoLinkPlugin from './plugins/AutoLinkPlugin'
import { $generateHtmlFromNodes } from '@lexical/html'
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext'

type InitialConfig = Parameters<typeof LexicalComposer>[0]['initialConfig']

type Props = {
	onChange: (htmlString: string) => any
	initialText?: string
	editable?: boolean
	key: string
}

export default function Editor({ editable = true, ...props }: Props) {
	const editorConfig: InitialConfig = {
		namespace: props.key,
		editorState: props.initialText,
		editable,
		// -----
		// default stuff below
		theme: defaulTheme,
		/** Catch any errors that occur during Lexical updates and log them
		 * or throw them as needed. If you don't throw them, Lexical will
		 * try to recover gracefully without losing user data. */
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

	// function _onChange(
	// 	editorState: EditorState,
	// 	handleChange: Function,
	// 	initialText?: string
	// ) {
	// 	console.log('text has changed')

	// 	// const jsonData = editorState.toJSON()
	// 	// const parsedInitialState = JSON.parse(
	// 	// 	initialText ||
	// 	// 		'{"root":{"children":[],"direction":null,"format":"","indent":0,"type":"root","version":1}}'
	// 	// )

	// 	// // this is important to avoid saving an initial state (that might be empty or not fully loaded).
	// 	// if (!isEqual(jsonData, parsedInitialState)) {
	// 	// 	handleChange(JSON.stringify(jsonData))
	// 	// }
	// }

	function onChange(editorState: EditorState, editor: LexicalEditor) {
		//
		editor.update(() => {
			const htmlString = $generateHtmlFromNodes(editor)
			props.onChange(htmlString)
		})
	}

	return (
		<LexicalComposer initialConfig={editorConfig}>
			<div className='editor-container'>
				{/* <ToolbarPlugin /> */}
				<div className='editor-inner'>
					<RichTextPlugin
						contentEditable={<ContentEditable className='editor-input' />}
						placeholder={
							<div className='editor-placeholder'>
								What&apos;s on your mind?
							</div>
						}
						ErrorBoundary={LexicalErrorBoundary}
					/>
					<HistoryPlugin />
					<AutoFocusPlugin />
					{/* <CodeHighlightPlugin /> */}
					<ListPlugin />
					<LinkPlugin />
					<AutoLinkPlugin />
					<OnChangePlugin onChange={onChange} />
					<ListMaxIndentLevelPlugin maxDepth={7} />
					<MarkdownShortcutPlugin transformers={TRANSFORMERS} />
				</div>
			</div>
		</LexicalComposer>
	)
}
