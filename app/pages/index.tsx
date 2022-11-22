import { useEffect } from 'react'
import { useRouter } from 'next/router'

export default function Home() {
	const router = useRouter()

	console.log(window.electron)

	useEffect(() => {
		router.push('/today')
	}, [router])

	return <></>
}
