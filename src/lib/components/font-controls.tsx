'use client'

// Utils
import { useAtom } from 'jotai'

// Components
import { TextField, SegmentedControl, Slider } from '@radix-ui/themes'

// State
import { fontsAtom, previewAtom, viewAtom } from '@/lib/state/fonts'
import { FontSizeIcon } from '@radix-ui/react-icons'

export default function FontControls() {
	const [preview, setPreview] = useAtom(previewAtom)
	const [, setView] = useAtom(viewAtom)
	const [fonts] = useAtom(fontsAtom)
	return (
		<form className="flex justify-between items-center w-full gap-4">
			<SegmentedControl.Root defaultValue="fonts" disabled={fonts.length === 0}>
				<SegmentedControl.Item value="fonts" onClick={() => setView('all')}>
					All
				</SegmentedControl.Item>
				<SegmentedControl.Item value="favorites" onClick={() => setView('favorites')}>
					Favorites
				</SegmentedControl.Item>
			</SegmentedControl.Root>

			<div className="flex w-full max-w-sm grow gap-4 items-center">
				<FontSizeIcon />
				<Slider
					disabled={fonts.length === 0}
					className="max-w-24"
					onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
						setPreview({ ...preview, size: +event.target.value })
					}
					defaultValue={[preview.size]}
					min={1}
					step={0.01}
					max={5}
				/>

				<TextField.Root
					disabled={fonts.length === 0}
					className="grow"
					value={preview.text}
					onChange={e => setPreview({ ...preview, text: e.target.value })}
					placeholder="Enter preview text..."
				/>
			</div>
		</form>
	)
}
