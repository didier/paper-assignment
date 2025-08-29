'use client'

// Utils
import { useAtom } from 'jotai'
import { motion } from 'motion/react'

// Components
import { Button } from '@radix-ui/themes'
import FontControls from './font-controls'
import DraggableFontItem from './draggable-font-item'

// State
import { fontsAtom, favoritesAtom } from '@/lib/state/fonts'
import { Font, getUserFonts } from '../utils'
import { useState, useMemo, useRef } from 'react'

export default function FontList() {
	const [fonts, setFonts] = useAtom(fontsAtom)
	const [favorites, setFavorites] = useAtom(favoritesAtom)
	const [status, setStatus] = useState<'idle' | 'loading' | 'error'>('idle')
	const [view, setView] = useState<'all' | 'favorites'>('all')
	const [expandedFonts, setExpandedFonts] = useState<Set<string>>(new Set())
	const [draggedItem, setDraggedItem] = useState<string | null>(null)
	const [dragOverItem, setDragOverItem] = useState<string | null>(null)
	const draggedOverItem = useRef<string | null>(null)
	const dragStartOrder = useRef<Font[]>([])

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
			// Remove from favorites
			setFavorites(prev => prev.filter(f => f !== family))
		} else {
			// Add to favorites at the end
			setFavorites(prev => [...prev, family])
		}
	}

	// Memoize font grouping for performance
	const groupedFonts = useMemo(() => {
		const grouped = new Map()
		fonts.forEach(font => {
			const existing = grouped.get(font.family)
			const isFavorited = favorites.includes(font.family)
			if (!existing) {
				grouped.set(font.family, { ...font, styles: [font], favorited: isFavorited })
			} else {
				existing.styles.push(font)
				existing.favorited = isFavorited
			}
		})
		return Array.from(grouped.values())
	}, [fonts, favorites])

	// Get sorted favorites based on favorites array order
	const sortedFavorites = useMemo(() => {
		return favorites
			.map(familyName => groupedFonts.find(f => f.family === familyName))
			.filter(Boolean)
	}, [groupedFonts, favorites])

	// Use a stable display order during drag
	const displayFavorites = useMemo(() => {
		// If we're dragging, use the frozen order from drag start
		if (draggedItem && dragStartOrder.current.length > 0) {
			return dragStartOrder.current
		}
		return sortedFavorites
	}, [sortedFavorites, draggedItem])

	// Drag handlers
	function handleDragStart(family: string) {
		setDraggedItem(family)
		// Freeze the current order to prevent snapping during drag
		dragStartOrder.current = [...sortedFavorites]
	}

	function handleDragEnd() {
		setDraggedItem(null)
		setDragOverItem(null)
		draggedOverItem.current = null
		dragStartOrder.current = [] // Clear frozen order
	}

	function handleDragOver(e: React.DragEvent, family: string) {
		e.preventDefault()
		if (draggedOverItem.current !== family) {
			draggedOverItem.current = family
			setDragOverItem(family)
		}
	}

	function handleDragLeave(e: React.DragEvent) {
		// Only clear drag over if we're actually leaving the element
		if (!e.currentTarget.contains(e.relatedTarget as Node)) {
			setDragOverItem(null)
		}
	}

	function handleDrop(e: React.DragEvent) {
		e.preventDefault()
		e.stopPropagation()

		if (!draggedItem || !draggedOverItem.current || draggedItem === draggedOverItem.current) {
			setDraggedItem(null)
			setDragOverItem(null)
			draggedOverItem.current = null
			return
		}

		const draggedIndex = favorites.indexOf(draggedItem)
		const targetIndex = favorites.indexOf(draggedOverItem.current)

		if (draggedIndex === -1 || targetIndex === -1) {
			setDraggedItem(null)
			setDragOverItem(null)
			draggedOverItem.current = null
			return
		}

		// Reorder the favorites array
		const newFavorites = [...favorites]
		newFavorites.splice(draggedIndex, 1)
		const insertIndex = targetIndex > draggedIndex ? targetIndex - 1 : targetIndex
		newFavorites.splice(insertIndex, 0, draggedItem)

		setFavorites(newFavorites)
		setDraggedItem(null)
		setDragOverItem(null)
		draggedOverItem.current = null
		dragStartOrder.current = [] // Clear frozen order
	}

	return (
		<div>
			<FontControls view={view} onViewChange={setView} />
			<motion.ul className="grid gap-3 max-w-5xl mx-auto">
				{fonts.length ? (
					(view === 'favorites' ? displayFavorites : groupedFonts).map((fontFamily, index) => {
						return (
							<DraggableFontItem
								key={`${fontFamily.family}-${index}`}
								fontFamily={fontFamily}
								index={index}
								isExpanded={expandedFonts.has(fontFamily.family)}
								isFavorited={fontFamily.favorited}
								onToggleExpanded={() => toggleExpanded(fontFamily.family)}
								onToggleFavorite={() => toggleFavorite(fontFamily.family)}
								isDragging={draggedItem === fontFamily.family}
								isDragMode={view === 'favorites'}
								onDragStart={() => handleDragStart(fontFamily.family)}
								onDragEnd={() => handleDragEnd()}
								onDragOver={(e: React.DragEvent) => handleDragOver(e, fontFamily.family)}
								onDragLeave={(e: React.DragEvent) => handleDragLeave(e)}
								onDrop={(e: React.DragEvent) => handleDrop(e)}
							/>
						)
					})
				) : (
					<div className="col-span-full grid place-items-center">
						<Button
							className="mx-auto"
							onClick={() => {
								getUserFonts().then(fonts => {
									console.log('Loaded fonts sample:', JSON.stringify(fonts.slice(0, 3), null, 2))
									setFonts(fonts)
								})
								setStatus('loading')
							}}
							loading={status === 'loading'}
						>
							Load fonts
						</Button>
					</div>
				)}
			</motion.ul>
		</div>
	)
}
