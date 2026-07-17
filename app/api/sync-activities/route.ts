import { supabase } from '@/lib/supabase'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const testActivity = {
      id: 999,
      name: 'Test fra Supabase',
      distance: 5000,
      moving_time: 1800,
      average_heartrate: 150,
      max_heartrate: 170,
      average_pace: 360,
      start_date: new Date().toISOString(),
      type: 'Run',
      total_elevation_gain: 50,
      calories: 400,
    }

    const { error } = await supabase
      .from('activities')
      .upsert(testActivity, { onConflict: 'id' })

    if (error) throw error

    return NextResponse.json({ success: true, message: 'Aktivitet lagret i Supabase' })
  } catch (error) {
    console.error('Feil:', error)
    return NextResponse.json({ success: false, error: JSON.stringify(error) }, { status: 500 })
  }
}