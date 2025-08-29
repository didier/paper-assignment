import { Font } from '../utils'

interface WeightPattern {
	pattern: RegExp
	weight: number
	label: string
}

// NOTE: I did use AI for this but because, really, who wants to write this out by hand?
const WEIGHT_PATTERNS: WeightPattern[] = [
	// Numeric weights (most precise, checked first)
	{ pattern: /\b(100)\b/i, weight: 100, label: 'Thin' },
	{ pattern: /\b(200)\b/i, weight: 200, label: 'Extra Light' },
	{ pattern: /\b(300)\b/i, weight: 300, label: 'Light' },
	{ pattern: /\b(400)\b/i, weight: 400, label: 'Regular' },
	{ pattern: /\b(500)\b/i, weight: 500, label: 'Medium' },
	{ pattern: /\b(600)\b/i, weight: 600, label: 'Semi Bold' },
	{ pattern: /\b(700)\b/i, weight: 700, label: 'Bold' },
	{ pattern: /\b(800)\b/i, weight: 800, label: 'Extra Bold' },
	{ pattern: /\b(900)\b/i, weight: 900, label: 'Black' },
	{ pattern: /\b(950)\b/i, weight: 950, label: 'Extra Black' },

	// Keyword patterns (order matters - more specific first)
	{ pattern: /\b(extra-?light|ultra-?light)\b/i, weight: 200, label: 'Extra Light' },
	{ pattern: /\b(extra-?bold|ultra-?bold)\b/i, weight: 800, label: 'Extra Bold' },
	{ pattern: /\b(extra-?black|ultra-?black)\b/i, weight: 950, label: 'Extra Black' },
	{ pattern: /\b(semi-?bold|demi-?bold)\b/i, weight: 600, label: 'Semi Bold' },
	{ pattern: /\b(thin|hairline)\b/i, weight: 100, label: 'Thin' },
	{ pattern: /\blight\b/i, weight: 300, label: 'Light' },
	{ pattern: /\b(regular|normal|book|roman)\b/i, weight: 400, label: 'Regular' },
	{ pattern: /\bmedium\b/i, weight: 500, label: 'Medium' },
	{ pattern: /\bbold\b/i, weight: 700, label: 'Bold' },
	{ pattern: /\b(black|heavy)\b/i, weight: 900, label: 'Black' },
]

const STYLE_PRIORITY = {
	normal: 0,
	italic: 1,
	oblique: 2,
} as const

export function extractWeightFromStyle(styleName: string): { weight: number; label: string } {
	// Test patterns in order (most specific first)
	for (const pattern of WEIGHT_PATTERNS) {
		if (pattern.pattern.test(styleName)) {
			return { weight: pattern.weight, label: pattern.label }
		}
	}

	// Fallback: check for any 3-digit number
	const numericMatch = styleName.match(/\b([1-9]\d{2})\b/)
	if (numericMatch) {
		const weight = parseInt(numericMatch[1], 10)
		// Round to nearest standard weight
		const standardWeights = [100, 200, 300, 400, 500, 600, 700, 800, 900]
		const closest = standardWeights.reduce((prev, curr) =>
			Math.abs(curr - weight) < Math.abs(prev - weight) ? curr : prev
		)
		const matchingPattern = WEIGHT_PATTERNS.find(p => p.weight === closest)
		return { weight: closest, label: matchingPattern?.label || `${closest}` }
	}

	// Default to regular weight if no match found
	return { weight: 400, label: 'Regular' }
}

function extractStyleFromName(styleName: string): keyof typeof STYLE_PRIORITY {
	const lowerStyle = styleName.toLowerCase()

	if (/\bitalic\b/i.test(lowerStyle)) return 'italic'
	if (/\boblique\b/i.test(lowerStyle)) return 'oblique'
	return 'normal'
}

function getStyleSortKey(font: Font): string {
	const { weight } = extractWeightFromStyle(font.style)
	const styleType = extractStyleFromName(font.style)
	const stylePriority = STYLE_PRIORITY[styleType]

	// Create a sort key: weight (padded to 3 digits) + style priority
	return `${weight.toString().padStart(3, '0')}.${stylePriority}`
}

export function sortFontStyles(fonts: Font[]): Font[] {
	return [...fonts].sort((a, b) => {
		const keyA = getStyleSortKey(a)
		const keyB = getStyleSortKey(b)
		return keyA.localeCompare(keyB)
	})
}

// Helper function to get human-readable weight description
export function getWeightDescription(styleName: string): string {
	const { label } = extractWeightFromStyle(styleName)
	const style = extractStyleFromName(styleName)

	return style === 'normal' ? label : `${label} ${style.charAt(0).toUpperCase() + style.slice(1)}`
}
