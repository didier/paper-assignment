// Types
import type { Metadata } from 'next'

// Styles
import './globals.css'

// Components
import { Providers } from '@/lib/components/providers'
import { Theme } from '@radix-ui/themes'

export const metadata: Metadata = {
	title: 'Paper Font Book',
	description: 'Didier Catz',
	icons: [
		{
			rel: 'icon',
			url: 'https://fav.farm/📃',
			sizes: 'any',
		},
	],
}

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode
}>) {
	return (
		<html lang="en">
			<body className="antialiased">
				<Theme accentColor="teal" grayColor="gray" radius="large">
					<Providers>
						<main>{children}</main>
					</Providers>
				</Theme>
			</body>
		</html>
	)
}
