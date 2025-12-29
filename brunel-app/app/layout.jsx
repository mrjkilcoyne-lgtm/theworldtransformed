import './globals.css'

export const metadata = {
  title: 'The Brunel Engine',
  description: 'Transform frustrations into actionable insight',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
