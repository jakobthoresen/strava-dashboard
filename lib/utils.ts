export function formatDistance(meters: number): string {
  return (meters / 1000).toFixed(1) + " km"
}

export function formatDuration(seconds: number): string {
  const mins = Math.floor(seconds / 60)
  const secs = seconds % 60
  return `${mins}:${secs.toString().padStart(2, "0")}`
}

export function formatPace(secondsPerKm: number): string {
  const mins = Math.floor(secondsPerKm / 60)
  const secs = secondsPerKm % 60
  return `${mins}:${secs.toString().padStart(2, "0")} /km`
}
