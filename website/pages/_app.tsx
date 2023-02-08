import type { AppProps } from 'next/app'
import Head from 'next/head'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import '../styles/globals.css'

export default function App({ Component, pageProps }: AppProps) {
	const router = useRouter()

	useEffect(() => {
		if (window.electronAPI) router.push('/electron')
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
