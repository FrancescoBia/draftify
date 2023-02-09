import type { AppProps } from 'next/app'
import { useEffect } from 'react'
import { useRouter } from 'next/router'
import Head from 'next/head'
import '../styles/globals.css'

export default function App({ Component, pageProps }: AppProps) {
	const router = useRouter()

	useEffect(() => {
		// redirect to page if electron is detected
		// (initial verions of Draftify had hosted client with nextjs - this shows
		// an alert to any users who still might have the old version)
		const electronPage = '/electron'
		if (window.electronAPI && router.pathname !== electronPage) {
			router.push(electronPage)
		}
	}, [router])

	return (
		<>
			<Head>
				<title>Journal</title>
				<meta content='Draftify' />
				<link rel='icon' href='/favicon.ico' />
			</Head>
			<Component {...pageProps} />
		</>
	)
}
