import { atom } from 'jotai'
import { atomWithStorage } from 'jotai/utils'
import { Font } from '../utils'
import { sortFontStyles, extractWeightFromStyle } from '../utils/font-sorting'

interface GroupedFont extends Font {
	styles: Font[]
	favorited: boolean
}

export const fontsAtom = atom<Font[]>([])

export const viewAtom = atom<'all' | 'favorites'>('all')

export const expandedFontsAtom = atom<Set<string>>(new Set<string>())

export const groupedFontsAtom = atom<GroupedFont[]>(get => {
	const fonts = get(fontsAtom)
	const favorites = get(favoritesAtom)
	const grouped = new Map<string, GroupedFont>()

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

	// Sort and deduplicate styles within each font family
	grouped.forEach(fontFamily => {
		// Sort first
		const sorted = sortFontStyles(fontFamily.styles)

		// Deduplicate by weight and style combination
		const seen = new Map<string, Font>()
		sorted.forEach(font => {
			const { weight } = extractWeightFromStyle(font.style)
			const styleType = font.style.toLowerCase().includes('italic') ? 'italic' : 'normal'
			const key = `${weight}-${styleType}`

			// Keep the first occurrence (usually the better-named one)
			if (!seen.has(key)) {
				seen.set(key, font)
			}
		})

		fontFamily.styles = Array.from(seen.values())
	})
	return Array.from(grouped.values())
})

export const filteredFontsAtom = atom<GroupedFont[]>(get => {
	const grouped = get(groupedFontsAtom)
	const search = get(deferredSearchAtom).toLowerCase().trim()
	
	if (!search) {
		return grouped
	}
	
	return grouped.filter(font => 
		font.family.toLowerCase().includes(search) ||
		font.styles.some(style => 
			style.style.toLowerCase().includes(search) ||
			style.fullName.toLowerCase().includes(search)
		)
	)
})

export const sortedFavoritesAtom = atom<GroupedFont[]>(get => {
	const grouped = get(groupedFontsAtom)
	const favorites = get(favoritesAtom)
	return favorites.map(familyName => grouped.find(f => f.family === familyName)).filter(Boolean) as GroupedFont[]
})

export const filteredFavoritesAtom = atom<GroupedFont[]>(get => {
	const sortedFavorites = get(sortedFavoritesAtom)
	const search = get(deferredSearchAtom).toLowerCase().trim()
	
	if (!search) {
		return sortedFavorites
	}
	
	return sortedFavorites.filter(font => 
		font.family.toLowerCase().includes(search) ||
		font.styles.some(style => 
			style.style.toLowerCase().includes(search) ||
			style.fullName.toLowerCase().includes(search)
		)
	)
})

// Ordered favorites list stored in localStorage
export const favoritesAtom = atomWithStorage<string[]>('favorites', [])

export const previewAtom = atom<{ text: string; size: number }>({
	text: '',
	size: 2.5,
})

export const searchAtom = atom<string>('')

// Deferred search atom for better performance
export const deferredSearchAtom = atom<string>('')
