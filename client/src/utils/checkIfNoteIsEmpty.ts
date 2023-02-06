import { SerializedEditorState } from 'lexical'

export default function checkIfNoteIsEmpty(jsonData: SerializedEditorState) {
	// this iteratively checks for nodes containing 'text'
	// somehow SerializedEditorState doesn't recognize its own produced object as valid,
	// therefore the type of the argument needs to be set as 'any'
	function _isNodeEmpty({
		rootOrNode: parentNode,
	}: {
		rootOrNode: any
	}): boolean {
		if (parentNode.text) return false
		else {
			return (
				(parentNode.children || [])
					.map((childNode: any) => {
						return _isNodeEmpty({ rootOrNode: childNode })
					})
					// if any of the value contains text (is false), then return false
					.includes(false)
					? false
					: true
			)
		}
	}

	return _isNodeEmpty({ rootOrNode: jsonData.root })
}
