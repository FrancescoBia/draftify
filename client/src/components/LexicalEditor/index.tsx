import { EditorState } from 'lexical'
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
import { CheckListPlugin } from '@lexical/react/LexicalCheckListPlugin'
import { ListPlugin } from '@lexical/react/LexicalListPlugin'
import ListMaxIndentLevelPlugin from './plugins/ListMaxIndentLevelPlugin'
import CodeHighlightPlugin from './plugins/CodeHighlightPlugin'
import AutoLinkPlugin from './plugins/AutoLinkPlugin'
import { LexicalEditor as LexicalEditorType } from 'lexical'
import {
	$convertToMarkdownString,
	$convertFromMarkdownString,
} from '@lexical/markdown'
import {
	CustomMarkdownShortcutPlugin,
	customTransformers,
} from './plugins/CustomMarkdownShortcutPlugin'

import './index.css'

type InitialConfig = Parameters<typeof LexicalComposer>[0]['initialConfig']

type Props = {
	onChange: (markdownData: string) => void
	initialText?: string
	editable?: boolean
	key: string
}

export default function LexicalEditor({ editable = true, ...props }: Props) {
	const editorConfig: InitialConfig = {
		namespace: props.key,
		editorState: () =>
			$convertFromMarkdownString(props.initialText || '', customTransformers),
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

	function onChange(editorState: EditorState, editor: LexicalEditorType) {
		// transform to Markdown
		editor.update(() => {
			const markdownData = $convertToMarkdownString(customTransformers)
			if (markdownData !== props.initialText) {
				props.onChange(markdownData)
			}
		})
	}

	return (
		<LexicalComposer initialConfig={editorConfig}>
			<div className='editor-container'>
				{/* <ToolbarPlugin /> */}
				<RichTextPlugin
					contentEditable={<ContentEditable className='editor-input' />}
					placeholder={
						<div className='editor-placeholder'>What&apos;s on your mind?</div>
					}
					ErrorBoundary={LexicalErrorBoundary}
				/>
				<HistoryPlugin />
				<AutoFocusPlugin />
				<CodeHighlightPlugin />
				<ListPlugin />
				<LinkPlugin />
				<AutoLinkPlugin />
				<CheckListPlugin />
				<OnChangePlugin onChange={onChange} />
				<ListMaxIndentLevelPlugin maxDepth={7} />
				<CustomMarkdownShortcutPlugin />
			</div>
		</LexicalComposer>
	)
}
