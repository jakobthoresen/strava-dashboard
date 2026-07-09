'use client'

import { StravaActivity } from '@/types/activity'
import { formatDistance, formatPace, formatDuration } from '@/lib/utils'
import { X } from 'lucide-react'

function getHRZone(hr: number): { zone: string; color: string } {
  if (hr < 130) return { zone: 'Sone 1', color: 'text-blue-400' }
  if (hr < 150) return { zone: 'Sone 2', color: 'text-green-400' }
  if (hr < 165) return { zone: 'Sone 3', color: 'text-yellow-400' }
  if (hr < 180) return { zone: 'Sone 4', color: 'text-orange-400' }
  return { zone: 'Sone 5', color: 'text-red-400' }
}

interface Props {
  activity: StravaActivity
  onClose: () => void
}

export function ActivityDetail({ activity, onClose }: Props) {
  const hrZone = activity.average_heartrate
    ? getHRZone(activity.average_heartrate)
    : null

  return (
    <div
      className="fixed inset-0 z-[1000] flex items-end sm:items-center justify-center"
      onClick={onClose}
    >
      {/* Bakgrunnsdimming */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm z-[1000]" />

      {/* Panel */}
      <div
        className="relative z-[1000] w-full sm:max-w-lg bg-white dark:bg-[#0F1629] border border-slate-200 dark:border-white/[0.06] rounded-t-2xl sm:rounded-2xl shadow-xl max-h-[85vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between px-5 py-4 border-b border-slate-100 dark:border-white/[0.04] sticky top-0 bg-white dark:bg-[#0F1629]">
          <div>
            <p className="text-sm font-semibold">{activity.name}</p>
            <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">
              {new Date(activity.start_date).toLocaleDateString('no-NO', {
                weekday: 'long', day: 'numeric', month: 'long', year: 'numeric'
              })}
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors ml-4 shrink-0"
          >
            <X size={18} />
          </button>
        </div>

        <div className="px-5 py-4 space-y-5">

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

          {/* Splits-tabell */}
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

          {!activity.splits && (
            <p className="text-xs text-slate-400 dark:text-slate-500 text-center py-2">
              Ingen split-data tilgjengelig for denne økten
            </p>
          )}

        </div>
      </div>
    </div>
  )
}