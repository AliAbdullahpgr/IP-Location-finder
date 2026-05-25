import "./styles.css"

export const metadata = {
  title: "Location Detection Approaches",
  description:
    "Compares Vercel IP geolocation with browser geolocation and reverse geocoding.",
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
