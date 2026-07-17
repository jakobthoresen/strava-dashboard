import { supabase } from '@/lib/supabase'
import { StravaActivity } from '@/types/activity'

export async function getActivities(): Promise<StravaActivity[]> {
  const { data, error } = await supabase
    .from('activities')
    .select('*')
    .order('start_date', { ascending: false })

  if (error) {
    console.error('Supabase feil:', error)
    return []
  }

  return data as StravaActivity[]
}