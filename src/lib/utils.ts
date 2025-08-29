export interface BrowserFont {
	family: string
	fullName: string
	style: string
	postscriptName: string
	blob(): Promise<Blob>
}

export type Font = BrowserFont & {
	favorited?: boolean
	styles?: Font[]
}

export async function getUserFonts(): Promise<Font[]> {
	try {
		// Check if the browser supports the Local Font Access API
		if ('queryLocalFonts' in window) {
			const fonts = await (window as Window).queryLocalFonts()

			// Return fonts with browser font properties
			const fontPromises = fonts.map(async (font: BrowserFont) => {
				return {
					family: font.family,
					fullName: font.fullName,
					style: font.style,
					postscriptName: font.postscriptName,
					blob: font.blob.bind(font),
					favorited: false,
				}
			})

			return await Promise.all(fontPromises)
		} else {
			// Fallback: return common web-safe fonts
			return []
		}
	} catch (error) {
		if (error instanceof Error && error.name === 'SecurityError') {
			console.error('Font access requires user activation (user gesture like click)', error)
		} else {
			console.error('Error accessing fonts:', error)
		}
		return []
	}
}
