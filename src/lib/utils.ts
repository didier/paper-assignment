export type Font = {
	family: string
	fullName: string
	style: string
	isUserInstalled: boolean
	favorited?: boolean
}

async function isSystemFont(font: any): Promise<boolean> {
	try {
		// Get font blob to analyze actual font data
		const blob = await font.blob()
		const fileSize = blob.size

		// Aggressive system font detection: assume most fonts are system fonts
		// Only mark as user-installed if there are very strong indicators

		// User-installed fonts are typically:
		// 1. Very large (complex designer fonts with many features)
		// 2. Or very small (incomplete/specialty fonts)

		if (fileSize > 3000000) {
			// Very large fonts are likely complex user fonts
			return false
		}

		if (fileSize < 5000) {
			// Very small fonts might be specialty user fonts
			return false
		}

		// Everything else is assumed to be a system font
		// This includes Apple Color Emoji and other built-in fonts
		return true
	} catch (error) {
		// If we can't analyze the font, assume it's a system font
		return true
	}
}

export async function getUserFonts(): Promise<Font[]> {
	try {
		// Check if the browser supports the Local Font Access API
		if ('queryLocalFonts' in window) {
			const fonts = await (window as Window).queryLocalFonts()

			// Process fonts concurrently to detect system vs user-installed
			const fontPromises = fonts.map(async (font: any) => {
				const isSystem = await isSystemFont(font)
				return {
					family: font.family,
					fullName: font.fullName,
					style: font.style,
					isUserInstalled: !isSystem,
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
