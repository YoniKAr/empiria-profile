import type { Metadata } from 'next'
import { DM_Sans, Geist_Mono } from 'next/font/google'
import './globals.css'

const dmSans = DM_Sans({ subsets: ["latin"], variable: "--font-dm-sans" });
const _geistMono = Geist_Mono({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: 'My Profile — Empiria',
  description: 'Manage your tickets, orders, and profile settings.',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`${dmSans.className} font-sans antialiased`} suppressHydrationWarning>
        {children}
      </body>
    </html>
  )
}
