"use client"

import { useEffect, useState } from "react"

export default function Home() {
  const [data, setData] = useState(null)
  const [error, setError] = useState("")
  const [deviceLocation, setDeviceLocation] = useState(null)
  const [deviceError, setDeviceError] = useState("")
  const [isCheckingDevice, setIsCheckingDevice] = useState(false)

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

  function getRegionCode(code, fallback) {
    if (!code) {
      return fallback
    }

    return code.includes("-") ? code.split("-").pop() : code
  }

  function checkDeviceLocation() {
    setDeviceError("")
    setDeviceLocation(null)

    if (!navigator.geolocation) {
      setDeviceError("Device location is not supported by this browser.")
      return
    }

    setIsCheckingDevice(true)

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const latitude = position.coords.latitude
        const longitude = position.coords.longitude

        try {
          const response = await fetch(
            `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`,
          )

          if (!response.ok) {
            throw new Error("Could not reverse-geocode device location.")
          }

          const geocode = await response.json()
          const city = geocode.city || geocode.locality
          const region = getRegionCode(
            geocode.principalSubdivisionCode,
            geocode.principalSubdivision,
          )

          setDeviceLocation({
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
          setDeviceLocation({
            latitude: latitude.toFixed(6),
            longitude: longitude.toFixed(6),
            accuracy: Math.round(position.coords.accuracy),
          })
          setDeviceError(reverseGeocodeError.message)
        } finally {
          setIsCheckingDevice(false)
        }
      },
      (locationError) => {
        setDeviceError(locationError.message)
        setIsCheckingDevice(false)
      },
      {
        enableHighAccuracy: true,
        maximumAge: 60000,
        timeout: 10000,
      },
    )
  }

  const ipFields = [
    ["IP address", data?.ip],
    ["City", data?.city],
    ["Region", data?.region],
    ["Country", data?.country],
    ["Latitude", data?.latitude],
    ["Longitude", data?.longitude],
    ["Vercel region", data?.vercelRegion],
  ]

  const deviceFields = [
    ["City", deviceLocation?.city],
    ["Region", deviceLocation?.region],
    ["Region name", deviceLocation?.regionName],
    ["Postal code", deviceLocation?.postalCode],
    ["Country", deviceLocation?.country],
    ["Country name", deviceLocation?.countryName],
    ["Latitude", deviceLocation?.latitude],
    ["Longitude", deviceLocation?.longitude],
    ["Accuracy", deviceLocation ? `${deviceLocation.accuracy} m` : undefined],
  ]

  return (
    <main>
      <section className="panel">
        <p className="eyebrow">Vercel geolocation</p>
        <h1>Your request location</h1>
        <p className="lede">
          This page reads the IP-based location data Vercel adds to your
          browser request.
        </p>

        {error && <div className="notice">{error}</div>}

        {data?.hasLocation && (
          <div className="notice">
            IP location is approximate. It can show your ISP gateway or IP block
            registration city, so Karachi/Sindh can appear even when you are in
            Multan/Punjab.
          </div>
        )}

        {data && !data.hasLocation && (
          <div className="notice">
            Location headers are not present. Deploy this app to Vercel to see
            real visitor location data.
          </div>
        )}

        <h2>IP estimate</h2>
        <dl className="grid">
          {ipFields.map(([label, value]) => (
            <div className="item" key={label}>
              <dt>{label}</dt>
              <dd>{data ? value || "Not available" : "Checking..."}</dd>
            </div>
          ))}
        </dl>

        <div className="device">
          <div>
            <h2>Device location</h2>
            <p>
              Uses your browser permission, then reverse-geocodes the
              coordinates with BigDataCloud to resolve city, region, country,
              and postal code.
            </p>
          </div>
          <button onClick={checkDeviceLocation} disabled={isCheckingDevice}>
            {isCheckingDevice ? "Checking..." : "Use device location"}
          </button>
        </div>

        {deviceError && <div className="notice">{deviceError}</div>}

        {deviceLocation && (
          <dl className="grid">
            {deviceFields.map(([label, value]) => (
              <div className="item" key={label}>
                <dt>{label}</dt>
                <dd>{value || "Not available"}</dd>
              </div>
            ))}
          </dl>
        )}
      </section>
    </main>
  )
}
