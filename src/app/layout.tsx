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
				<Theme accentColor="teal" grayColor="sand" radius="large">
					<Providers>
						<main>{children}</main>
						<footer className="max-w-3xl mx-auto p-4 text-center text-neutral-400">
							<a
								href="https://didiercatz.com"
								className="absolute bottom-4 left-1/2 -translate-x-1/2 block"
							>
								by Didier Catz
							</a>
						</footer>
					</Providers>
				</Theme>
			</body>
		</html>
	)
}
