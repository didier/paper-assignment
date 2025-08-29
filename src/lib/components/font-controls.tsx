'use client'

// Utils
import { useAtom } from 'jotai'
import { startTransition, useDeferredValue, useEffect } from 'react'

// Components
import { TextField, SegmentedControl, Slider } from '@radix-ui/themes'
import { FontSizeIcon, MagnifyingGlassIcon } from '@radix-ui/react-icons'

// State
import { fontsAtom, previewAtom, viewAtom, searchAtom, deferredSearchAtom } from '@/lib/state/fonts'

export default function FontControls() {
	const [preview, setPreview] = useAtom(previewAtom)
	const [, setView] = useAtom(viewAtom)
	const [fonts] = useAtom(fontsAtom)
	const [search, setSearch] = useAtom(searchAtom)
	const [, setDeferredSearch] = useAtom(deferredSearchAtom)

	const deferredSearchValue = useDeferredValue(search)

	useEffect(() => {
		startTransition(() => {
			setDeferredSearch(deferredSearchValue)
		})
	}, [deferredSearchValue, setDeferredSearch])
	return (
		<form className="grid gap-8 place-items-start">
			<SegmentedControl.Root variant="surface" defaultValue="fonts" disabled={fonts.length === 0}>
				<SegmentedControl.Item value="fonts" onClick={() => startTransition(() => setView('all'))}>
					All
				</SegmentedControl.Item>
				<SegmentedControl.Item value="favorites" onClick={() => startTransition(() => setView('favorites'))}>
					Favorites
				</SegmentedControl.Item>
			</SegmentedControl.Root>

			<div className="grid grid-cols-2 w-full gap-32">
				<TextField.Root
					variant="surface"
					className="bg-neutral-100"
					disabled={fonts.length === 0}
					value={search}
					onChange={e => setSearch(e.target.value)}
					placeholder="Search fonts by name or style..."
				>
					<TextField.Slot>
						<MagnifyingGlassIcon height="16" width="16" />
					</TextField.Slot>
				</TextField.Root>
				<div className="flex justify-between items-center w-full gap-4">
					<div className="flex w-full grow gap-4 max-w-sm items-center">
						<div className="flex items-center gap-3 max-w-24 w-full">
							<FontSizeIcon />
							<Slider
								disabled={fonts.length === 0}
								className="w-full"
								onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
									setPreview({ ...preview, size: +event.target.value })
								}
								defaultValue={[preview.size]}
								min={1}
								step={0.01}
								max={5}
							/>
						</div>
						<TextField.Root
							disabled={fonts.length === 0}
							className="grow"
							value={preview.text}
							onChange={e => setPreview({ ...preview, text: e.target.value })}
							placeholder="Enter preview text..."
						/>
					</div>
				</div>
			</div>
		</form>
	)
}
