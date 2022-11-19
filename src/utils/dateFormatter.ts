export function getNoteIdFromDate(date: string = new Date().toString()) {
	const isoDate = new Date(date).toISOString()
	const dateKey = isoDate.substring(0, 10)

	return dateKey
}
