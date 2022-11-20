export function getNoteIdFromDate(
	date: string = new Date().toString()
): Note['id'] {
	const isoDate = new Date(date).toISOString()
	const dateKey = isoDate.substring(0, 10)

	return dateKey as Note['id']
}
