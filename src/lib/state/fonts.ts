import { atom } from 'jotai'
import { atomWithStorage } from 'jotai/utils'
import { Font } from '../utils'

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
	return Array.from(grouped.values())
})

export const sortedFavoritesAtom = atom<GroupedFont[]>(get => {
	const grouped = get(groupedFontsAtom)
	const favorites = get(favoritesAtom)
	return favorites.map(familyName => grouped.find(f => f.family === familyName)).filter(Boolean) as GroupedFont[]
})

// Ordered favorites list stored in localStorage
export const favoritesAtom = atomWithStorage<string[]>('favorites', [])

export const previewAtom = atom<{ text: string; size: number }>({
	text: 'The quick brown fox jumps over the lazy dog',
	size: 2.5,
})
