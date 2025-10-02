import './globals.css'
import { Analytics } from '@vercel/analytics/react'

export const metadata = {
  title: 'IKU - Cábala Activa',
  description: 'Transformación espiritual y material a través de la Cábala',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es">
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  )
}