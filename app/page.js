export default function Home() {
  return (
    <main>
      <section className="panel handout">
        <nav className="nav" aria-label="Location approach pages">
          <a href="/">Overview</a>
          <a href="/vercel-ip">Vercel IP</a>
          <a href="/browser-location">Browser location</a>
        </nav>

        <p className="eyebrow">Location detection handout</p>
        <h1>Two ways this site can find location</h1>
        <p className="lede">
          This demo separates the two approaches so the accuracy tradeoff is
          clear: IP-based geolocation is automatic but approximate, while
          browser geolocation requires permission but can be much more precise.
        </p>

        <div className="approach-grid">
          <article className="approach-card">
            <span className="tag">Approach 1</span>
            <h2>Vercel IP geolocation</h2>
            <p>
              Uses Vercel request headers through <code>@vercel/functions</code>
              to estimate location from the visitor public IP address.
            </p>
            <ul>
              <li>No browser permission prompt.</li>
              <li>Works automatically on Vercel deployments.</li>
              <li>Can show ISP gateway cities like Karachi instead of Multan.</li>
            </ul>
            <a className="button-link" href="/vercel-ip">
              Open IP approach
            </a>
          </article>

          <article className="approach-card">
            <span className="tag">Approach 2</span>
            <h2>Browser geolocation + reverse geocode</h2>
            <p>
              Uses <code>navigator.geolocation</code> for coordinates, then
              calls BigDataCloud to convert latitude/longitude into city,
              region, country, and postal code.
            </p>
            <ul>
              <li>Requires user permission in the browser.</li>
              <li>Often uses GPS, Wi-Fi, or device location services.</li>
              <li>Better fit when the user must confirm a real physical area.</li>
            </ul>
            <a className="button-link" href="/browser-location">
              Open browser approach
            </a>
          </article>
        </div>

        <div className="callout">
          <strong>Recommendation:</strong> Use Vercel IP geolocation for a
          low-friction first guess. Use browser geolocation plus reverse
          geocoding when accuracy matters and a permission prompt is acceptable.
        </div>
      </section>
    </main>
  )
}
