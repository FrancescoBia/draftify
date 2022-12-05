import { MarkdownShortcutPlugin } from '@lexical/react/LexicalMarkdownShortcutPlugin'
import {
	ListItemNode,
	ListNode,
	$isListNode,
	$isListItemNode,
	$createListItemNode,
	$createListNode,
} from '@lexical/list'
import { TRANSFORMERS, ElementTransformer } from '@lexical/markdown'

const listExport = (listNode: any, exportChildren: any, depth: any): any => {
	const output = []
	const children = listNode.getChildren()
	let index = 0

	for (const listItemNode of children) {
		if ($isListItemNode(listItemNode)) {
			if (listItemNode.getChildrenSize() === 1) {
				const firstChild = listItemNode.getFirstChild()

				if ($isListNode(firstChild)) {
					output.push(listExport(firstChild, exportChildren, depth + 1))
					continue
				}
			}

			const indent = ' '.repeat(depth * 7)
			const listType = listNode.getListType()
			const prefix =
				listType === 'number'
					? `${listNode.getStart() + index}. `
					: listType === 'check'
					? `- [${listItemNode.getChecked() ? 'x' : ' '}] `
					: '- '
			output.push(indent + prefix + exportChildren(listItemNode))
			index++
		}
	}

	return output.join('\n')
}

const listReplace = (listType: 'bullet' | 'check' | 'number') => {
	return (parentNode: any, children: any, match: any) => {
		const previousNode = parentNode.getPreviousSibling()
		const listItem = $createListItemNode(
			listType === 'check' ? match[3] === 'x' : undefined
		)

		if ($isListNode(previousNode) && previousNode.getListType() === listType) {
			previousNode.append(listItem)
			parentNode.remove()
		} else {
			const list$1 = $createListNode(
				listType,
				listType === 'number' ? Number(match[2]) : undefined
			)
			list$1.append(listItem)
			parentNode.replace(list$1)
		}

		listItem.append(...children)
		listItem.select(0, 0)
		const indent = Math.floor(match[1].length / 7)

		if (indent) {
			listItem.setIndent(indent)
		}
	}
}

const checkListTransformer: ElementTransformer = {
	dependencies: [ListNode, ListItemNode],
	export: (node, exportChildren) => {
		return $isListNode(node) ? listExport(node, exportChildren, 0) : null
	},
	regExp: /^(\s*)(?:-\s?)?\s?(\[(\s|x)?\])\s/i,
	replace: listReplace('check'),
	type: 'element',
}

export const customTransformers = [...TRANSFORMERS, checkListTransformer]

/**
 * WHY THIS FILE?
 * The default <MarkdownShortcutPlugin> currently doesn't support the text transformation for
 * checlists. Or to be more specific, it does support it, but it doesn't work properly.
 * Therefore it has been extracted the methods from the lexical package (check the TRANSFORMER import
 * above for more info) and customize to work with a custom transformation regex.
 * Probably this will be fixed in the future and this will be possible to remove.
 */
export function CustomMarkdownShortcutPlugin() {
	return <MarkdownShortcutPlugin transformers={customTransformers} />
}
