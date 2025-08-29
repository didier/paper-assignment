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
	filteredFontsAtom,
	filteredFavoritesAtom,
} from '@/lib/state/fonts'
import { getUserFonts } from '../utils'
import { useDragAndDrop } from '../hooks/use-drag-and-drop'
import { useState } from 'react'
import clsx from 'clsx'

export default function FontList() {
	const [fonts, setFonts] = useAtom(fontsAtom)
	const [favorites, setFavorites] = useAtom(favoritesAtom)
	const [view] = useAtom(viewAtom)
	const [expandedFonts, setExpandedFonts] = useAtom(expandedFontsAtom)
	const [filteredFonts] = useAtom(filteredFontsAtom)
	const [filteredFavorites] = useAtom(filteredFavoritesAtom)
	const [status, setStatus] = useState<'idle' | 'loading' | 'error'>('idle')

	const dragAndDrop = useDragAndDrop({ favorites, setFavorites, sortedFavorites: filteredFavorites })

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

	const displayFonts = view === 'favorites' ? dragAndDrop.displayFavorites : filteredFonts

	return (
		<div className="max-w-3xl mx-auto px-4 grid gap-4 py-8">
			<FontControls />
			<motion.ul className="grid gap-3 w-full max-w-full">
				{fonts.length ? (
					displayFonts.map((fontFamily, index) => {
						const isDragMode = view === 'favorites'
						const isDragging = dragAndDrop.draggedItem === fontFamily.family

						return (
							<motion.li
								initial={{ opacity: 0, y: '1rem' }}
								animate={{
									opacity: isDragging ? 0.3 : 1,
									y: 0,
									transition: {
										delay: 0.1 + index * 0.025,
										duration: 0.2,
										ease: 'easeOut',
									},
								}}
								exit={{ opacity: 0, y: '1rem', scale: 0.75 }}
								layout
								layoutId={fontFamily.family}
								key={`${fontFamily.family}-${index}`}
								className={clsx(
									'grid group relative transition-all duration-200 ease-out',
									isDragMode && 'cursor-grab active:cursor-grabbing',
									isDragging && 'z-50'
								)}
								{...(isDragMode && {
									draggable: true,
									onDragStart: (e: React.DragEvent) => {
										e.dataTransfer.effectAllowed = 'move'
										e.dataTransfer.setData('text/plain', fontFamily.family)
										dragAndDrop.handleDragStart(fontFamily.family)
									},
									onDragEnd: dragAndDrop.handleDragEnd,
									onDragOver: (e: React.DragEvent) => {
										e.preventDefault()
										e.dataTransfer.dropEffect = 'move'
										dragAndDrop.handleDragOver(e, fontFamily.family)
									},
									onDragLeave: dragAndDrop.handleDragLeave,
									onDrop: dragAndDrop.handleDrop,
								})}
							>
								{/* Drop indicator line */}
								{dragAndDrop.dragOverItem === fontFamily.family && !isDragging && (
									<div className="absolute -top-1 left-0 right-0 h-0.5 bg-teal-500 rounded-full shadow-lg shadow-teal-500/50 z-10" />
								)}

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
					<motion.div className="col-span-full grid place-items-center p-4 py-12 aspect-video bg-card rounded-2xl place-content-center gap-5">
						<div className="grid gap-2 max-w-sm text-balance text-center">
							<h1 className="font-medium">Font Book</h1>
							<p className="text-neutral-600">
								This is a simple system font viewed built in assignment for Paper.
							</p>
						</div>
						<Button className="mx-auto mt-4" onClick={loadFonts} loading={status === 'loading'}>
							Load fonts
						</Button>
					</motion.div>
				)}
			</motion.ul>
		</div>
	)
}
