import { headers } from "next/headers"

async function getLocation() {
  const requestHeaders = await headers()
  const host = requestHeaders.get("host")
  const protocol = requestHeaders.get("x-forwarded-proto") || "http"
  const baseUrl = `${protocol}://${host}`

  const response = await fetch(`${baseUrl}/api/location`, {
    cache: "no-store",
  })

  if (!response.ok) {
    throw new Error("Could not load location data.")
  }

  return response.json()
}

export default async function Home() {
  const data = await getLocation()

  const fields = [
    ["IP address", data.ip],
    ["City", data.city],
    ["Region", data.region],
    ["Country", data.country],
    ["Latitude", data.latitude],
    ["Longitude", data.longitude],
    ["Vercel region", data.vercelRegion],
  ]

  return (
    <main>
      <section className="panel">
        <p className="eyebrow">Vercel geolocation</p>
        <h1>Your request location</h1>
        <p className="lede">
          This page reads the location data Vercel adds to incoming requests.
        </p>

        {!data.hasLocation && (
          <div className="notice">
            Location headers are not present. Deploy this app to Vercel to see
            real visitor location data.
          </div>
        )}

        <dl className="grid">
          {fields.map(([label, value]) => (
            <div className="item" key={label}>
              <dt>{label}</dt>
              <dd>{value || "Not available"}</dd>
            </div>
          ))}
        </dl>
      </section>
    </main>
  )
}
