import { useState, useRef } from 'react'
import { Font } from '../utils'

export interface UseDragAndDropProps {
	favorites: string[]
	setFavorites: (favorites: string[]) => void
	sortedFavorites: Font[]
}

export function useDragAndDrop({ favorites, setFavorites, sortedFavorites }: UseDragAndDropProps) {
	const [draggedItem, setDraggedItem] = useState<string | null>(null)
	const [dragOverItem, setDragOverItem] = useState<string | null>(null)
	const draggedOverItem = useRef<string | null>(null)
	const dragStartOrder = useRef<Font[]>([])

	const displayFavorites = draggedItem && dragStartOrder.current.length > 0 ? dragStartOrder.current : sortedFavorites

	function handleDragStart(family: string) {
		setDraggedItem(family)
		dragStartOrder.current = [...sortedFavorites]
	}

	function handleDragEnd() {
		setDraggedItem(null)
		setDragOverItem(null)
		draggedOverItem.current = null
		dragStartOrder.current = []
	}

	function handleDragOver(e: React.DragEvent, family: string) {
		e.preventDefault()
		e.dataTransfer.dropEffect = 'move'
		
		// Only update if different from current and not dragging over self
		if (draggedOverItem.current !== family && draggedItem !== family) {
			draggedOverItem.current = family
			setDragOverItem(family)
		}
	}

	function handleDragLeave(e: React.DragEvent) {
		// Clear drag over state when leaving the drop zone
		if (!e.currentTarget.contains(e.relatedTarget as Node)) {
			setDragOverItem(null)
			draggedOverItem.current = null
		}
	}

	function handleDrop(e: React.DragEvent) {
		e.preventDefault()
		e.stopPropagation()

		if (!draggedItem || !draggedOverItem.current || draggedItem === draggedOverItem.current) {
			handleDragEnd()
			return
		}

		const draggedIndex = favorites.indexOf(draggedItem)
		const targetIndex = favorites.indexOf(draggedOverItem.current)

		if (draggedIndex === -1 || targetIndex === -1) {
			handleDragEnd()
			return
		}

		const newFavorites = [...favorites]
		newFavorites.splice(draggedIndex, 1)
		const insertIndex = targetIndex > draggedIndex ? targetIndex - 1 : targetIndex
		newFavorites.splice(insertIndex, 0, draggedItem)

		setFavorites(newFavorites)
		handleDragEnd()
	}

	return {
		draggedItem,
		dragOverItem,
		displayFavorites,
		handleDragStart,
		handleDragEnd,
		handleDragOver,
		handleDragLeave,
		handleDrop,
	}
}
