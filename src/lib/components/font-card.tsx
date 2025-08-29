'use client'

// Utils
import clsx from 'clsx'
import { useAtom } from 'jotai'
import { getWeightDescription, extractWeightFromStyle } from '../utils/font-sorting'

// Components
import { StarFilledIcon, StarIcon, ChevronRightIcon } from '@radix-ui/react-icons'
import { IconButton } from '@radix-ui/themes'

// State
import { previewAtom } from '@/lib/state/fonts'
import { Font } from '../utils'

interface FontCardProps {
	fontFamily: Font
	isExpanded: boolean
	isFavorited: boolean
	onToggleExpanded: () => void
	onToggleFavorite: () => void
}

function PreviewText({ style }: { style?: Font }) {
	const [preview] = useAtom(previewAtom)

	return (
		<span
			style={{
				fontSize: `${preview.size}rem`,
				...(style && {
					fontFamily: `"${style.family}", system-ui, sans-serif`,
					fontWeight: extractWeightFromStyle(style.style).weight,
					fontStyle: style.style.toLowerCase().includes('italic') ? 'italic' : 'normal',
				}),
			}}
			className="leading-[1em] truncate max-w-full transition-all duration-100 ease-out"
		>
			{preview.text || style?.family}
		</span>
	)
}

export default function FontCard({
	fontFamily,
	isExpanded,
	isFavorited,
	onToggleExpanded,
	onToggleFavorite,
}: FontCardProps) {
	// Always use the regular weight for the main preview
	const regularStyle = (() => {
		if (!fontFamily.styles || fontFamily.styles.length === 0) {
			return fontFamily
		}

		// Look for exact regular matches first
		const exactRegular = fontFamily.styles.find(s => {
			const style = s.style.toLowerCase()
			return style === 'regular' || style === 'normal' || style === 'book' || style === 'roman'
		})
		if (exactRegular) return exactRegular

		// Look for 400 weight
		const weight400 = fontFamily.styles.find(s => s.style.toLowerCase().includes('400'))
		if (weight400) return weight400

		// Look for any non-italic, non-bold style
		const normalStyle = fontFamily.styles.find(s => {
			const style = s.style.toLowerCase()
			return (
				!style.includes('italic') &&
				!style.includes('oblique') &&
				!style.includes('bold') &&
				!style.includes('light') &&
				!style.includes('thin') &&
				!style.includes('heavy') &&
				!style.includes('black')
			)
		})
		if (normalStyle) return normalStyle

		// Fallback to first style or font itself
		return fontFamily.styles[0] || fontFamily
	})()

	return (
		<div
			className="rounded-2xl bg-card grid gap-0 size-full overflow-clip max-w-full"
			style={{ fontFamily: fontFamily.family, contentVisibility: 'auto' }}
		>
			<div className="flex items-start w-full gap-3 justify-between sticky top-0 p-4 left-0 bg-card">
				<div className="flex items-center gap-2 w-full">
					<div className="flex items-start gap-2">
						{fontFamily.styles && fontFamily.styles.length > 1 && (
							<IconButton
								variant="ghost"
								color="gray"
								className="flex-shrink-0 relative block"
								onClick={onToggleExpanded}
							>
								<ChevronRightIcon
									className={`size-full transition-transform duration-100 ${isExpanded ? 'rotate-90' : ''}`}
								/>
							</IconButton>
						)}
						<div className="flex flex-col gap-1">
							<span className="font-sans text-neutral-700 leading-4 font-medium">
								{fontFamily.family}
							</span>
							<span className="font-sans text-xs text-neutral-500">
								{fontFamily?.styles?.length ?? 1} style
								{(fontFamily?.styles?.length ?? 1) > 1 ? 's' : ''}
							</span>
						</div>
					</div>
				</div>

				<IconButton
					variant="ghost"
					color="gray"
					className="size-8 flex-shrink-0"
					onClick={e => {
						e.stopPropagation()
						onToggleFavorite()
					}}
				>
					{isFavorited ? (
						<StarFilledIcon
							className={clsx(
								'size-6 group-hover:opacity-100 transition duration-300 ease-out group-hover:duration-150 fill-current text-yellow-500 opacity-100'
							)}
						/>
					) : (
						<StarIcon
							className={clsx(
								'size-6 group-hover:opacity-100 transition duration-300 ease-out opacity-0 group-hover:duration-150 fill-current text-gray-400'
							)}
						/>
					)}
				</IconButton>
			</div>

			<div className="p-4 truncate max-w-3xl bg-white m-1 rounded-xl shadow shadow-neutral-200">
				<PreviewText style={regularStyle} />

				{isExpanded && fontFamily.styles && fontFamily.styles.length > 1 && (
					<div className="flex flex-col gap-6 pt-4 mt-4 border-t border-neutral-200">
						{fontFamily.styles.map((style: Font, styleIndex: number) => (
							<div key={`${style.fullName}-${styleIndex}`} className="flex flex-col gap-2">
								<span className="font-sans text-xs text-neutral-500">
									{getWeightDescription(style.style)}
								</span>
								<PreviewText style={style} />
							</div>
						))}
					</div>
				)}
			</div>
		</div>
	)
}
