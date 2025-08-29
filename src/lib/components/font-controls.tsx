'use client'

// Utils
import { useAtom } from 'jotai'

// Components
import { TextField, SegmentedControl } from '@radix-ui/themes'

// State
import { previewAtom, viewAtom } from '@/lib/state/fonts'

export default function FontControls() {
	const [preview, setPreview] = useAtom(previewAtom)
	const [, setView] = useAtom(viewAtom)
	return (
		<form className="mb-6 container mx-auto z-50 grid gap-4 grid-cols-[1fr_2fr_1fr] items-center max-w-3xl sticky top-2 bg-white/85 shadow-lg shadow-neutral-400/20 backdrop-blur-md py-4 px-6 rounded-full">
			<SegmentedControl.Root defaultValue="fonts">
				<SegmentedControl.Item value="fonts" onClick={() => setView('all')}>
					All
				</SegmentedControl.Item>
				<SegmentedControl.Item value="favorites" onClick={() => setView('favorites')}>
					Favorites
				</SegmentedControl.Item>
			</SegmentedControl.Root>
			<TextField.Root
				value={preview.text}
				onChange={e => setPreview({ ...preview, text: e.target.value })}
				placeholder="The quick brown fox jumps over the lazy dog"
			/>
		</form>
	)
}
