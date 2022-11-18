import '../styles/globals.css'
import '../styles/editorTheme.css'
import type { AppProps } from 'next/app'
import { Provider } from 'react-redux'
import { store } from '../src/redux/store'

export default function App({ Component, pageProps }: AppProps) {
	return (
		<Provider store={store}>
			<Component {...pageProps} />
		</Provider>
	)
}
