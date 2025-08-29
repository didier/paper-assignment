'use client'
import { fontsAtom } from '@/lib/state/fonts'
import { useAtom } from 'jotai'
import Image from 'next/image'

export default function Favourites() {
	const [fonts, setFonts] = useAtom(fontsAtom)
	return (
		<>
			<h1>Welcome to Paper Assignment</h1>
			<p>Start your journey with us!</p>
		</>
	)
}
