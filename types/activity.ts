export type ActivityType = "Run" | "Ride" | "Swim" | "Walk"

export interface StravaActivity {
  id: number
  name: string
  distance: number          // meter
  moving_time: number       // sekunder
  average_heartrate: number
  max_heartrate: number
  average_pace: number      // sekunder per km
  start_date: string        // ISO 8601
  type: ActivityType
  total_elevation_gain: number
}