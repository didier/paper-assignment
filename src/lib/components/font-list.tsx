'use client'

import { useAtom } from 'jotai'
import { motion } from 'motion/react'
import { Button } from '@radix-ui/themes'

import FontControls from './font-controls'
import FontCard from './font-card'
import {
	fontsAtom,
	favoritesAtom,
	viewAtom,
	expandedFontsAtom,
	groupedFontsAtom,
	sortedFavoritesAtom,
} from '@/lib/state/fonts'
import { getUserFonts } from '../utils'
import { useDragAndDrop } from '../hooks/use-drag-and-drop'
import { useState } from 'react'

export default function FontList() {
	const [fonts, setFonts] = useAtom(fontsAtom)
	const [favorites, setFavorites] = useAtom(favoritesAtom)
	const [view] = useAtom(viewAtom)
	const [expandedFonts, setExpandedFonts] = useAtom(expandedFontsAtom)
	const [groupedFonts] = useAtom(groupedFontsAtom)
	const [sortedFavorites] = useAtom(sortedFavoritesAtom)
	const [status, setStatus] = useState<'idle' | 'loading' | 'error'>('idle')

	const dragAndDrop = useDragAndDrop({ favorites, setFavorites, sortedFavorites })

	function toggleExpanded(family: string) {
		setExpandedFonts(prev => {
			const newSet = new Set(prev)
			if (newSet.has(family)) {
				newSet.delete(family)
			} else {
				newSet.add(family)
			}
			return newSet
		})
	}

	function toggleFavorite(family: string) {
		if (favorites.includes(family)) {
			setFavorites((prev: string[]) => prev.filter(f => f !== family))
		} else {
			setFavorites((prev: string[]) => [...prev, family])
		}
	}

	async function loadFonts() {
		setStatus('loading')
		try {
			const loadedFonts = await getUserFonts()
			setFonts(loadedFonts)
			setStatus('idle')
		} catch {
			setStatus('error')
		}
	}

	const displayFonts = view === 'favorites' ? dragAndDrop.displayFavorites : groupedFonts

	return (
		<div>
			<FontControls />
			<motion.ul className="grid gap-3 max-w-5xl mx-auto">
				{fonts.length ? (
					displayFonts.map((fontFamily, index) => {
						const isDragMode = view === 'favorites'
						const isDragging = dragAndDrop.draggedItem === fontFamily.family

						return (
							<motion.li
								key={`${fontFamily.family}-${index}`}
								layout
								className={`grid group ${isDragMode ? 'cursor-move' : ''} ${isDragging ? 'opacity-30' : ''}`}
								initial={{ opacity: 0, y: 20 }}
								animate={{
									opacity: isDragging ? 0.3 : 1,
									y: 0,
									transition: {
										delay: index * 0.015,
									},
								}}
								{...(isDragMode && {
									draggable: true,
									onDragStart: () => dragAndDrop.handleDragStart(fontFamily.family),
									onDragEnd: dragAndDrop.handleDragEnd,
									onDragOver: (e: React.DragEvent) =>
										dragAndDrop.handleDragOver(e, fontFamily.family),
									onDragLeave: dragAndDrop.handleDragLeave,
									onDrop: dragAndDrop.handleDrop,
								})}
							>
								<FontCard
									fontFamily={fontFamily}
									isExpanded={expandedFonts.has(fontFamily.family)}
									isFavorited={fontFamily.favorited ?? false}
									onToggleExpanded={() => toggleExpanded(fontFamily.family)}
									onToggleFavorite={() => toggleFavorite(fontFamily.family)}
								/>
							</motion.li>
						)
					})
				) : (
					<div className="col-span-full grid place-items-center">
						<Button className="mx-auto" onClick={loadFonts} loading={status === 'loading'}>
							Load fonts
						</Button>
					</div>
				)}
			</motion.ul>
		</div>
	)
}
