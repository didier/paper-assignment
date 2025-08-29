'use client'

// Utils
import { useAtom } from 'jotai'
import clsx from 'clsx'

// Components
import { StarFilledIcon, StarIcon } from '@radix-ui/react-icons'
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

interface FontPreviewProps {
	fontFamily: Font
	isExpanded: boolean
}

function PreviewText({ style }: { style?: Font }) {
	const [preview] = useAtom(previewAtom)
	return (
		<span
			style={{
				fontSize: `${preview.size}rem`,
				...(style && {
					fontFamily: style.family,
					fontStyle: style.style.toLowerCase().includes('italic') ? 'italic' : 'normal',
					fontWeight: style.style.toLowerCase().includes('bold') ? 'bold' : 'normal',
				}),
			}}
			className="leading-[1.25em] truncate"
		>
			{preview.text}
		</span>
	)
}

function FontPreview({ fontFamily, isExpanded }: FontPreviewProps) {
	return (
		<div className="flex flex-col gap-2 overflow-y-auto">
			{isExpanded && fontFamily.styles.length > 1 ? (
				fontFamily.styles.map((style: any, styleIndex: number) => (
					<div key={`${style.fullName}-${styleIndex}`} className="flex flex-col">
						<span className="font-sans text-xs text-neutral-500 mb-1">{style.style}</span>
						<PreviewText style={style} />
					</div>
				))
			) : (
				<PreviewText />
			)}
		</div>
	)
}

export default function FontCard({
	fontFamily,
	isExpanded,
	isFavorited,
	onToggleExpanded,
	onToggleFavorite,
}: FontCardProps) {
	return (
		<div
			className="rounded-2xl p-4 bg-neutral-100 grid size-full gap-4 overflow-hidden cursor-pointer"
			style={{ fontFamily: fontFamily.family, contentVisibility: 'auto' }}
			onClick={() => fontFamily.styles.length > 1 && onToggleExpanded()}
		>
			<div className="flex items-start w-full gap-3 justify-between">
				<div className="flex flex-col gap-1 w-full justify-between">
					<span className="font-sans text-neutral-700 font-medium">{fontFamily.family}</span>
					{fontFamily.styles.length > 1 && (
						<span className="font-sans text-xs text-neutral-500">{fontFamily.styles.length} styles</span>
					)}
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

			<FontPreview fontFamily={fontFamily} isExpanded={isExpanded} />
		</div>
	)
}
