"use client"

import { useEffect, useState } from "react"

export default function VercelIpPage() {
  const [data, setData] = useState(null)
  const [error, setError] = useState("")

  useEffect(() => {
    let cancelled = false

    async function loadLocation() {
      try {
        const response = await fetch("/api/location", {
          cache: "no-store",
        })

        if (!response.ok) {
          throw new Error("Could not load Vercel IP location data.")
        }

        const location = await response.json()

        if (!cancelled) {
          setData(location)
        }
      } catch (loadError) {
        if (!cancelled) {
          setError(loadError.message)
        }
      }
    }

    loadLocation()

    return () => {
      cancelled = true
    }
  }, [])

  const fields = [
    ["IP address", data?.ip],
    ["City", data?.city],
    ["Region", data?.region],
    ["Country", data?.country],
    ["Latitude", data?.latitude],
    ["Longitude", data?.longitude],
    ["Vercel region", data?.vercelRegion],
  ]

  return (
    <main>
      <section className="panel handout">
        <nav className="nav" aria-label="Location approach pages">
          <a href="/">Overview</a>
          <a href="/vercel-ip">Vercel IP</a>
          <a href="/browser-location">Browser location</a>
        </nav>

        <p className="eyebrow">Approach 1</p>
        <h1>Vercel IP geolocation</h1>
        <p className="lede">
          Approach type: automatic IP-based geolocation from Vercel request
          headers. This is useful as a frictionless first guess, not as proof of
          the user physical city.
        </p>

        <div className="info-row">
          <div>
            <h2>Data source</h2>
            <p>
              The API route calls <code>geolocation(request)</code> and{" "}
              <code>ipAddress(request)</code> from <code>@vercel/functions</code>.
            </p>
          </div>
          <div>
            <h2>Accuracy note</h2>
            <p>
              Results can reflect the ISP egress point, VPN, proxy, or IP block
              registration. Karachi/Sindh can appear even for a user physically
              in Multan/Punjab.
            </p>
          </div>
        </div>

        {error && <div className="notice">{error}</div>}

        {data && !data.hasLocation && (
          <div className="notice">
            Location headers are not present. Deploy this app to Vercel to see
            real Vercel geolocation values.
          </div>
        )}

        <h2>Live IP estimate</h2>
        <dl className="grid">
          {fields.map(([label, value]) => (
            <div className="item" key={label}>
              <dt>{label}</dt>
              <dd>{data ? value || "Not available" : "Checking..."}</dd>
            </div>
          ))}
        </dl>
      </section>
    </main>
  )
}
