import { StravaActivity } from "@/types/activity"

export function getRuns(activities: StravaActivity[]): StravaActivity[] {
  return activities.filter((a) => a.type === "Run")
}

export function getTotalDistance(activities: StravaActivity[]): number {
  return activities.reduce((sum, a) => sum + a.distance, 0)
}

export function getAvgHeartrate(activities: StravaActivity[]): number {
  if (activities.length === 0) return 0
  const total = activities.reduce((sum, a) => sum + a.average_heartrate, 0)
  return Math.round(total / activities.length)
}

export function getAvgPace(activities: StravaActivity[]): number {
  if (activities.length === 0) return 0
  const total = activities.reduce((sum, a) => sum + a.average_pace, 0)
  return Math.round(total / activities.length)
}

export interface WeeklyDistanceData {
  week: string
  km: number
  runs: number
}

function getISOWeekNumber(date: Date): number {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()))
  const dayNum = d.getUTCDay() || 7
  d.setUTCDate(d.getUTCDate() + 4 - dayNum)
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1))
  return Math.ceil((((d.getTime() - yearStart.getTime()) / 86400000) + 1) / 7)
}

export function getWeeklyDistanceData(activities: StravaActivity[]): WeeklyDistanceData[] {
  const weekMap = new Map<string, { km: number; runs: number; weekNum: number }>()

  activities.forEach((a) => {
    const date = new Date(a.start_date)
    const weekNum = getISOWeekNumber(date)
    const key = `${date.getFullYear()}-W${weekNum}`

    const current = weekMap.get(key) ?? { km: 0, runs: 0, weekNum }
    weekMap.set(key, {
      km: Math.round((current.km + a.distance / 1000) * 10) / 10,
      runs: current.runs + 1,
      weekNum,
    })
  })

  return Array.from(weekMap.entries())
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([, data]) => ({
      week: `Uke ${data.weekNum}`,
      km: data.km,
      runs: data.runs,
    }))
}

export interface HRZoneData {
  name: string
  count: number
  fill: string
}

export function getHRZoneData(activities: StravaActivity[]): HRZoneData[] {
  const zones = [
    { name: 'Sone 1', min: 0,   max: 130, fill: '#60A5FA' },
    { name: 'Sone 2', min: 130, max: 150, fill: '#34D399' },
    { name: 'Sone 3', min: 150, max: 165, fill: '#FBBF24' },
    { name: 'Sone 4', min: 165, max: 180, fill: '#F97316' },
    { name: 'Sone 5', min: 180, max: 999, fill: '#EF4444' },
  ].map((z) => ({ ...z, count: 0 }))

  activities.forEach((a) => {
    const zone = zones.find((z) => a.average_heartrate >= z.min && a.average_heartrate < z.max)
    if (zone) zone.count++
  })

  return zones
    .filter((z) => z.count > 0)
    .map(({ name, count, fill }) => ({ name, count, fill }))
}