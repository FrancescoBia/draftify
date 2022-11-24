import { useEffect } from 'react'
import { EditorState, LexicalEditor, SerializedEditorState } from 'lexical'
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
	onChange: (jsonData: SerializedEditorState) => any
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

	function onChange(
		editorState: EditorState
		// editor: LexicalEditor
	) {
		// transform to HTML (not in use)
		// editor.update(() => {
		// 	const htmlString = $generateHtmlFromNodes(editor)
		// })

		//
		const jsonData = editorState.toJSON()
		props.onChange(jsonData)
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
