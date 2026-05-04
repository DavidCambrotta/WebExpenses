export default function Loading({ error }) {
  if (error) {
    return (
      <div className="center-screen">
        <p className="error-text">Error loading data: {error}</p>
        <p className="error-hint">Check environment variables (.env) and Supabase RLS policies.</p>
      </div>
    )
  }
  return (
    <div className="center-screen">
      <div className="spinner" />
      <p className="loading-text">Loading data...</p>
    </div>
  )
}
