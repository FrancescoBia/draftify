const monthNames = [
	'January',
	'February',
	'March',
	'April',
	'May',
	'June',
	'July',
	'August',
	'September',
	'October',
	'November',
	'December',
]

export function getNoteIdFromDate(
	date: string = new Date().toString()
): Note['id'] {
	const isoDate = new Date(date).toISOString()
	const dateKey = isoDate.substring(0, 10)

	return dateKey as Note['id']
}

export function getFormattedDate(date: string = new Date().toString()) {
	return new Date(date).toISOString()
}

export function prettyFormatDate(dateString: string = new Date().toString()) {
	const date = new Date(dateString)
	const day = date.getDate()
	const monthIndex = date.getMonth()
	const monthName = monthNames[monthIndex]

	return `${day} ${monthName}`
}
