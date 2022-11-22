interface Window {
	electron?: {
		//
		send(eventName: string, data: any): void
		//
		receive: (
			eventName: string,
			onReceive: (event: any, response?: any) => void
		) => void
		/**
		 * returns promise with status of the save operation
		 */
		saveNote: (d: { note: Note }) => Promise<void>
	}
}
