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

  function checkDeviceLocation() {
    setDeviceError("")
    setDeviceLocation(null)

    if (!navigator.geolocation) {
      setDeviceError("Device location is not supported by this browser.")
      return
    }

    setIsCheckingDevice(true)

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setDeviceLocation({
          latitude: position.coords.latitude.toFixed(6),
          longitude: position.coords.longitude.toFixed(6),
          accuracy: Math.round(position.coords.accuracy),
        })
        setIsCheckingDevice(false)
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
              Uses your browser permission for more accurate coordinates. City
              names still need a separate map or reverse-geocoding service.
            </p>
          </div>
          <button onClick={checkDeviceLocation} disabled={isCheckingDevice}>
            {isCheckingDevice ? "Checking..." : "Use device location"}
          </button>
        </div>

        {deviceError && <div className="notice">{deviceError}</div>}

        {deviceLocation && (
          <dl className="grid">
            <div className="item">
              <dt>Device latitude</dt>
              <dd>{deviceLocation.latitude}</dd>
            </div>
            <div className="item">
              <dt>Device longitude</dt>
              <dd>{deviceLocation.longitude}</dd>
            </div>
            <div className="item">
              <dt>Accuracy</dt>
              <dd>{deviceLocation.accuracy} m</dd>
            </div>
          </dl>
        )}
      </section>
    </main>
  )
}
