'use client'

import dynamic from 'next/dynamic'
import { StravaActivity } from '@/types/activity'
import { formatDistance, formatPace, formatDuration, decodePolyline } from '@/lib/utils'

const RouteMap = dynamic(
  () => import('@/components/charts/RouteMap').then((m) => m.RouteMap),
  {
    ssr: false,
    loading: () => (
      <div className="h-60 rounded-lg bg-slate-100 dark:bg-white/[0.03] animate-pulse" />
    ),
  }
)

interface Props {
  activity: StravaActivity
}

export function LastActivityCard({ activity }: Props) {
  const coordinates = activity.coordinates
    ?? (activity.summary_polyline ? decodePolyline(activity.summary_polyline) : null)

  return (
    <section className="bg-white dark:bg-[#0F1629] rounded-xl border border-slate-200 dark:border-white/[0.06] overflow-hidden">
      <div className="px-5 py-4 border-b border-slate-100 dark:border-white/[0.04]">
        <p className="text-xs uppercase tracking-wider font-medium text-slate-400 dark:text-slate-500">
          Siste økt
        </p>
      </div>

      <div className="p-5 space-y-4">

        {/* Øktinfo */}
        <div className="flex justify-between items-start">
          <div>
            <p className="text-sm font-semibold">{activity.name}</p>
            <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">
              {new Date(activity.start_date).toLocaleDateString('no-NO', {
                weekday: 'long', day: 'numeric', month: 'long',
              })}
            </p>
          </div>
        </div>

        {/* Nøkkeltall */}
        <div className="grid grid-cols-3 gap-3">
          {[
            { label: 'Distanse', value: formatDistance(activity.distance) },
            { label: 'Tid', value: formatDuration(activity.moving_time) },
            { label: 'Tempo', value: formatPace(activity.average_pace) },
          ].map((s, i) => (
            <div key={i} className="bg-slate-50 dark:bg-white/[0.03] rounded-lg p-3">
              <p className="text-xs text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-1">
                {s.label}
              </p>
              <p className="text-sm font-mono font-semibold">{s.value}</p>
            </div>
          ))}
        </div>

        {/* Kart – kun hvis GPS-data finnes */}
        {coordinates && coordinates.length > 0 ? (
          <RouteMap coordinates={coordinates} />
        ) : (
          <div className="h-16 flex items-center justify-center rounded-lg bg-slate-50 dark:bg-white/[0.03]">
            <p className="text-xs text-slate-400 dark:text-slate-500">
              Ingen GPS-data for denne økten
            </p>
          </div>
        )}

      </div>
    </section>
  )
}