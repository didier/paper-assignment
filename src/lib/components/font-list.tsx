'use client'

// Utils
import { useAtom } from 'jotai'
import { motion } from 'motion/react'
import clsx from 'clsx'

// Components
import { StarFilledIcon, StarIcon } from '@radix-ui/react-icons'
import { Button, IconButton, TextField, SegmentedControl } from '@radix-ui/themes'

// State
import { fontsAtom } from '@/lib/state/fonts'
import { getUserFonts } from '../utils'
import { useState } from 'react'

export default function FontList() {
	const remSize = 2.5

	const [fonts, setFonts] = useAtom(fontsAtom)
	const [preview, setPreview] = useState('The quick brown fox jumps over the lazy dog')
	const [status, setStatus] = useState<'idle' | 'loading' | 'error'>('idle')
	const [view, setView] = useState<'fonts' | 'favorites'>('fonts')

	return (
		<div>
			<form className="mb-6 container mx-auto z-50 grid gap-4 grid-cols-[1fr_2fr_1fr] items-center max-w-3xl sticky top-2 bg-white/85 shadow-lg shadow-neutral-400/20 backdrop-blur-md py-4 px-6 rounded-full">
				<SegmentedControl.Root defaultValue="fonts">
					<SegmentedControl.Item value="fonts" onClick={() => setView('fonts')}>
						Fonts
					</SegmentedControl.Item>
					<SegmentedControl.Item value="favorites" onClick={() => setView('favorites')}>
						Favorites
					</SegmentedControl.Item>
				</SegmentedControl.Root>
				<TextField.Root
					value={preview}
					onChange={e => {
						setPreview(e.target.value)
					}}
					placeholder="The quick brown fox jumps over the lazy dog"
				/>
			</form>
			<motion.ul className="grid gap-3 container mx-auto grid-cols-4 ">
				{fonts.length ? (
					Array.from(
						new Map(
							fonts
								.filter(font => (view === 'favorites' ? font.favorited : true))
								.map(font => [font.family, font])
						).values()
					)
						// .sort((a, b) => (b.favorited ? 1 : 0) - (a.favorited ? 1 : 0))
						.map((font, index) => (
							<motion.li
								className="grid group "
								key={`${font.family}-${index}`}
								initial={{ opacity: 0, y: 20 }}
								animate={{
									opacity: 1,
									y: 0,
									transition: {
										delay: index * 0.015,
									},
								}}
								exit={{ opacity: 0, y: -20 }}
							>
								<div
									className="rounded-2xl p-4 bg-neutral-100 aspect-square grid size-full place-content-between items-between"
									style={{ fontFamily: font.family, contentVisibility: 'auto' }}
								>
									<div className="flex items-center gap-3 justify-between">
										<span className="font-sans text-neutral-700 font-medium">{font.family}</span>
										<IconButton
											variant="ghost"
											className="size-8"
											onClick={() => {
												setFonts(prevFonts =>
													prevFonts.map(f =>
														f.family === font.family ? { ...f, favorited: !f.favorited } : f
													)
												)
											}}
										>
											{font?.favorited ? (
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
									<span style={{ fontSize: `${remSize}rem` }} className="leading-[1.25em]">
										{preview}
									</span>
								</div>
							</motion.li>
						))
				) : (
					<div className="col-span-full grid place-items-center">
						<Button
							className="mx-auto"
							onClick={() => {
								getUserFonts().then(setFonts)
								setStatus('loading')
							}}
							loading={status === 'loading'}
						>
							Load fonts
						</Button>
					</div>
				)}
			</motion.ul>
		</div>
	)
}
