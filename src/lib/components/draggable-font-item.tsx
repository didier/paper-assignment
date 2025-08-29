'use client'

// Utils
import { motion } from 'motion/react'

// Components
import FontCard from './font-card'

// State
import { Font } from '../utils'

interface DraggableFontItemProps {
	fontFamily: Font
	isExpanded: boolean
	isFavorited: boolean
	index: number
	onToggleExpanded: () => void
	onToggleFavorite: () => void

	// Drag props
	isDragging?: boolean
	isDragMode?: boolean
	onDragStart?: () => void
	onDragEnd?: () => void
	onDragOver?: (e: React.DragEvent) => void
	onDragLeave?: (e: React.DragEvent) => void
	onDrop?: (e: React.DragEvent) => void
}

export default function DraggableFontItem({
	fontFamily,
	isExpanded,
	isFavorited,
	index,
	onToggleExpanded,
	onToggleFavorite,
	isDragging = false,
	isDragMode = false,
	onDragStart,
	onDragEnd,
	onDragOver,
	onDragLeave,
	onDrop,
}: DraggableFontItemProps) {
	return (
		<motion.li
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
				onDragStart,
				onDragEnd,
				onDragOver,
				onDragLeave,
				onDrop,
			})}
		>
			<FontCard
				fontFamily={fontFamily}
				isExpanded={isExpanded}
				isFavorited={isFavorited}
				onToggleExpanded={onToggleExpanded}
				onToggleFavorite={onToggleFavorite}
			/>
		</motion.li>
	)
}
