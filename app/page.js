"use client"

import { useEffect, useState } from "react"

export default function Home() {
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
          throw new Error("Could not load location data.")
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
      <section className="panel">
        <p className="eyebrow">Vercel geolocation</p>
        <h1>Your request location</h1>
        <p className="lede">
          This page reads the location data Vercel adds to your browser request.
        </p>

        {error && <div className="notice">{error}</div>}

        {data && !data.hasLocation && (
          <div className="notice">
            Location headers are not present. Deploy this app to Vercel to see
            real visitor location data.
          </div>
        )}

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
