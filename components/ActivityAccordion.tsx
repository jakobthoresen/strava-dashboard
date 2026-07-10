'use client'

import { useState } from 'react'
import dynamic from 'next/dynamic'
import { StravaActivity } from '@/types/activity'
import { formatDistance, formatPace, formatDuration, decodePolyline } from '@/lib/utils'
import { ChevronUp, ChevronDown } from 'lucide-react'

const RouteMap = dynamic(
  () => import('@/components/charts/RouteMap').then((m) => m.RouteMap),
  {
    ssr: false,
    loading: () => (
      <div className="h-60 rounded-lg bg-slate-100 dark:bg-white/[0.03] animate-pulse" />
    ),
  }
)

function getHRZone(hr: number): { zone: string; color: string } {
  if (hr < 130) return { zone: 'Sone 1', color: 'text-blue-400' }
  if (hr < 150) return { zone: 'Sone 2', color: 'text-green-400' }
  if (hr < 165) return { zone: 'Sone 3', color: 'text-yellow-400' }
  if (hr < 180) return { zone: 'Sone 4', color: 'text-orange-400' }
  return { zone: 'Sone 5', color: 'text-red-400' }
}

function ActivityRow({ activity, isExpanded, onToggle }: {
  activity: StravaActivity
  isExpanded: boolean
  onToggle: () => void
}) {
  const hrZone = activity.average_heartrate
    ? getHRZone(activity.average_heartrate)
    : null

  const coordinates = activity.coordinates
    ?? (activity.summary_polyline ? decodePolyline(activity.summary_polyline) : null)

  return (
    <div className="border-b border-slate-100 dark:border-white/[0.04] last:border-0">

      {/* Header – alltid synlig */}
      <div
        onClick={onToggle}
        className="flex justify-between items-center px-5 py-3.5 hover:bg-slate-50 dark:hover:bg-white/[0.02] transition-colors cursor-pointer"
      >
        <div>
          <p className="text-sm font-medium">{activity.name}</p>
          <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">
            {new Date(activity.start_date).toLocaleDateString('no-NO', {
              weekday: 'short', day: 'numeric', month: 'short',
            })}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="text-right">
            <p className="text-sm font-mono font-semibold text-blue-600 dark:text-blue-400">
              {formatDistance(activity.distance)}
            </p>
            <p className="text-xs font-mono text-slate-400 dark:text-slate-500 mt-0.5">
              {formatPace(activity.average_pace)}
            </p>
          </div>
          <div className="text-slate-400 dark:text-slate-500 shrink-0">
            {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </div>
        </div>
      </div>

      {/* Expanded innhold */}
      {isExpanded && (
        <div className="px-5 pb-5 space-y-4">

          {/* Nøkkeltall */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { label: 'Distanse', value: formatDistance(activity.distance) },
              { label: 'Tid', value: formatDuration(activity.moving_time) },
              { label: 'Snittempo', value: formatPace(activity.average_pace) },
              { label: 'Høyde', value: `${activity.total_elevation_gain}m` },
            ].map((s, i) => (
              <div key={i} className="bg-slate-50 dark:bg-white/[0.03] rounded-lg p-3">
                <p className="text-xs text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-1">
                  {s.label}
                </p>
                <p className="text-sm font-mono font-semibold">{s.value}</p>
              </div>
            ))}
          </div>

          {/* Puls og kalorier */}
          {(activity.average_heartrate || activity.calories) && (
            <div className="grid grid-cols-2 gap-3">
              {activity.average_heartrate && (
                <div className="bg-slate-50 dark:bg-white/[0.03] rounded-lg p-3">
                  <p className="text-xs text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-1">
                    Snittpuls
                  </p>
                  <p className={`text-sm font-mono font-semibold ${hrZone?.color}`}>
                    {activity.average_heartrate} bpm
                    <span className="text-xs font-normal text-slate-400 dark:text-slate-500 ml-1">
                      · {hrZone?.zone}
                    </span>
                  </p>
                </div>
              )}
              {activity.calories && (
                <div className="bg-slate-50 dark:bg-white/[0.03] rounded-lg p-3">
                  <p className="text-xs text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-1">
                    Kalorier
                  </p>
                  <p className="text-sm font-mono font-semibold">{activity.calories} kcal</p>
                </div>
              )}
            </div>
          )}

          {/* Kart */}
          {coordinates && coordinates.length > 0 && (
            <div>
              <p className="text-xs uppercase tracking-wider font-medium text-slate-400 dark:text-slate-500 mb-2">
                Løype
              </p>
              <RouteMap coordinates={coordinates} />
            </div>
          )}

          {/* Splits */}
          {activity.splits && activity.splits.length > 0 && (
            <div>
              <p className="text-xs uppercase tracking-wider font-medium text-slate-400 dark:text-slate-500 mb-2">
                Splits
              </p>
              <div className="rounded-lg border border-slate-100 dark:border-white/[0.04] overflow-hidden">
                <table className="w-full text-xs">
                  <thead>
                    <tr className="bg-slate-50 dark:bg-white/[0.03]">
                      <th className="text-left px-3 py-2 text-slate-400 dark:text-slate-500 font-medium">Km</th>
                      <th className="text-right px-3 py-2 text-slate-400 dark:text-slate-500 font-medium">Tempo</th>
                      <th className="text-right px-3 py-2 text-slate-400 dark:text-slate-500 font-medium">Puls</th>
                      <th className="text-right px-3 py-2 text-slate-400 dark:text-slate-500 font-medium">Høyde</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-white/[0.04]">
                    {activity.splits.map((split) => {
                      const zone = getHRZone(split.average_heartrate)
                      return (
                        <tr
                          key={split.km}
                          className="hover:bg-slate-50 dark:hover:bg-white/[0.02] transition-colors"
                        >
                          <td className="px-3 py-2 font-mono text-slate-500 dark:text-slate-400">
                            {split.km}
                          </td>
                          <td className="px-3 py-2 text-right font-mono font-medium text-blue-600 dark:text-blue-400">
                            {formatPace(split.pace)}
                          </td>
                          <td className={`px-3 py-2 text-right font-mono font-medium ${zone.color}`}>
                            {split.average_heartrate}
                          </td>
                          <td className="px-3 py-2 text-right font-mono text-slate-400 dark:text-slate-500">
                            {split.elevation_change > 0 ? '+' : ''}{split.elevation_change}m
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}

        </div>
      )}
    </div>
  )
}

interface Props {
  activities: StravaActivity[]
}

export function ActivityAccordion({ activities }: Props) {
  const [expandedId, setExpandedId] = useState<number | null>(
    activities.length > 0 ? activities[0].id : null
  )

  return (
    <section className="bg-white dark:bg-[#0F1629] rounded-xl border border-slate-200 dark:border-white/[0.06] overflow-hidden">
      <div className="px-5 py-4 border-b border-slate-100 dark:border-white/[0.04]">
        <p className="text-xs uppercase tracking-wider font-medium text-slate-400 dark:text-slate-500">
          Siste aktiviteter
        </p>
      </div>
      <div>
        {activities.map((activity) => (
          <ActivityRow
            key={activity.id}
            activity={activity}
            isExpanded={expandedId === activity.id}
            onToggle={() =>
              setExpandedId(expandedId === activity.id ? null : activity.id)
            }
          />
        ))}
      </div>
    </section>
  )
}