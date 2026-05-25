"use client"

import { useState } from "react"

function getRegionCode(code, fallback) {
  if (!code) {
    return fallback
  }

  return code.includes("-") ? code.split("-").pop() : code
}

export default function BrowserLocationPage() {
  const [location, setLocation] = useState(null)
  const [error, setError] = useState("")
  const [isChecking, setIsChecking] = useState(false)

  function checkBrowserLocation() {
    setError("")
    setLocation(null)

    if (!navigator.geolocation) {
      setError("Browser geolocation is not supported by this browser.")
      return
    }

    setIsChecking(true)

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const latitude = position.coords.latitude
        const longitude = position.coords.longitude

        try {
          const response = await fetch(
            `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`,
          )

          if (!response.ok) {
            throw new Error("Could not reverse-geocode browser coordinates.")
          }

          const geocode = await response.json()
          const city = geocode.city || geocode.locality
          const region = getRegionCode(
            geocode.principalSubdivisionCode,
            geocode.principalSubdivision,
          )

          setLocation({
            latitude: latitude.toFixed(6),
            longitude: longitude.toFixed(6),
            accuracy: Math.round(position.coords.accuracy),
            city,
            region,
            regionName: geocode.principalSubdivision,
            postalCode: geocode.postcode,
            country: geocode.countryCode,
            countryName: geocode.countryName,
          })
        } catch (reverseGeocodeError) {
          setLocation({
            latitude: latitude.toFixed(6),
            longitude: longitude.toFixed(6),
            accuracy: Math.round(position.coords.accuracy),
          })
          setError(reverseGeocodeError.message)
        } finally {
          setIsChecking(false)
        }
      },
      (locationError) => {
        setError(locationError.message)
        setIsChecking(false)
      },
      {
        enableHighAccuracy: true,
        maximumAge: 60000,
        timeout: 10000,
      },
    )
  }

  const fields = [
    ["City", location?.city],
    ["Region", location?.region],
    ["Region name", location?.regionName],
    ["Postal code", location?.postalCode],
    ["Country", location?.country],
    ["Country name", location?.countryName],
    ["Latitude", location?.latitude],
    ["Longitude", location?.longitude],
    ["Accuracy", location ? `${location.accuracy} m` : undefined],
  ]

  return (
    <main>
      <section className="panel handout">
        <nav className="nav" aria-label="Location approach pages">
          <a href="/">Overview</a>
          <a href="/vercel-ip">Vercel IP</a>
          <a href="/browser-location">Browser location</a>
        </nav>

        <p className="eyebrow">Approach 2</p>
        <h1>Browser geolocation + reverse geocode</h1>
        <p className="lede">
          Approach type: permission-based browser coordinates followed by
          client-side reverse geocoding. This is the closest match to the
          therapist onboarding location flow.
        </p>

        <div className="info-row">
          <div>
            <h2>Data source</h2>
            <p>
              The browser calls{" "}
              <code>navigator.geolocation.getCurrentPosition</code>.
              Coordinates are then sent directly from the browser to
              BigDataCloud&apos;s free reverse-geocode endpoint.
            </p>
          </div>
          <div>
            <h2>Why it is better for location confirmation</h2>
            <p>
              The browser can use device services such as GPS, Wi-Fi, and cell
              signals. It requires user permission, but it avoids relying only
              on where the public IP address is registered.
            </p>
          </div>
        </div>

        <div className="action-strip">
          <div>
            <h2>Run live check</h2>
            <p>
              Click the button and allow location access. The result is then
              reverse-geocoded into human-readable location fields.
            </p>
          </div>
          <button onClick={checkBrowserLocation} disabled={isChecking}>
            {isChecking ? "Checking..." : "Use browser location"}
          </button>
        </div>

        {error && <div className="notice">{error}</div>}

        <h2>Live browser result</h2>
        <dl className="grid">
          {fields.map(([label, value]) => (
            <div className="item" key={label}>
              <dt>{label}</dt>
              <dd>{location ? value || "Not available" : "Waiting for check"}</dd>
            </div>
          ))}
        </dl>
      </section>
    </main>
  )
}
