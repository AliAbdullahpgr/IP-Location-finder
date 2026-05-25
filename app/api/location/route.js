import { geolocation, ipAddress } from "@vercel/functions"

export const dynamic = "force-dynamic"

export function GET(request) {
  const geo = geolocation(request)
  const ip = ipAddress(request)

  return Response.json({
    ip,
    city: geo.city,
    region: geo.countryRegion,
    country: geo.country,
    latitude: geo.latitude,
    longitude: geo.longitude,
    vercelRegion: geo.region,
    hasLocation: Boolean(
      ip ||
        geo.city ||
        geo.countryRegion ||
        geo.country ||
        geo.latitude ||
        geo.longitude ||
        geo.region,
    ),
  })
}
