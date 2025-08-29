import { atom } from 'jotai'
import { Font } from '../utils'

export const fontsAtom = atom<Font[]>([])

export const favoritedFontsAtom = atom<Font[]>(get => {
	const fonts = get(fontsAtom)
	return fonts.filter(font => font.favorited)
})
