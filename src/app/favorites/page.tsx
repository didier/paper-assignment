'use client'

import { useAtom } from 'jotai'
import { useEffect } from 'react'
import FontList from '@/lib/components/font-list'
import { viewAtom } from '@/lib/state/fonts'

export default function Favourites() {
	const [, setView] = useAtom(viewAtom)

	useEffect(() => {
		setView('favorites')
		return () => setView('all')
	}, [setView])

	return <FontList />
}
