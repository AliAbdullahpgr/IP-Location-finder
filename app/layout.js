import "./styles.css"

export const metadata = {
  title: "Geo IP Location",
  description: "Shows location data provided by Vercel geolocation headers.",
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
