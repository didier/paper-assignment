import { atom } from 'jotai'
import { atomWithStorage } from 'jotai/utils'
import { Font } from '../utils'

export const fontsAtom = atom<Font[]>([])

export const favoritedFontsAtom = atom<Font[]>(get => {
	const fonts = get(fontsAtom)
	const favorites = get(favoritesAtom)
	const fontFamilies = new Set(fonts.map(f => f.family))

	// Only return fonts that are both favorited and actually exist
	return fonts.filter(font => favorites.includes(font.family) && fontFamilies.has(font.family))
})

// Ordered favorites list stored in localStorage
export const favoritesAtom = atomWithStorage<string[]>('favorites', [])

export const previewAtom = atom<{ text: string; size: number }>({
	text: 'The quick brown fox jumps over the lazy dog',
	size: 2.5,
})
