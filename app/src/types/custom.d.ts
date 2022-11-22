interface Window {
	electron?: {
		//
		send(eventName: string, data: any): void
		//
		receive: (
			eventName: string,
			onReceive: (event: any, response?: any) => void
		) => void
	}
}
