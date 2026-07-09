'use client'

import { useState } from 'react'
import { mockActivities } from '@/lib/mockData'
import {
  getRuns, getTotalDistance, getAvgPace,
  getAvgHeartrate, getWeeklyDistanceData, getHRZoneData,
  getMonthlyRuns, getLongestRun, getEasyAvgHR, getLatestActivity,
} from '@/lib/activityHelpers'
import { formatDistance, formatPace } from '@/lib/utils'
import { ThemeToggle } from '@/components/layout/themeToggle'
import { WeeklyDistanceChart } from '@/components/charts/weeklyDistanceChart'
import { HRZonesChart } from '@/components/charts/HRZonesChart'
import { ActivityDetail } from '@/components/ActivityDetail'
import { LastActivityCard } from '@/components/LastActivityCard'
import { StravaActivity } from '@/types/activity'

export default function Home() {
  const [showDemo, setShowDemo] = useState(false)
  const [selectedActivity, setSelectedActivity] = useState<StravaActivity | null>(null)

  const runs           = getRuns(mockActivities)
  const monthlyRuns    = getMonthlyRuns(runs)
  const weeklyData     = getWeeklyDistanceData(runs)
  const hrZoneData     = getHRZoneData(runs)
  const easyHR         = getEasyAvgHR(runs)
  const overallHR      = getAvgHeartrate(runs)
  const latestActivity = getLatestActivity(runs)

  const stats = [
    {
      label: 'Distanse',
      primary: formatDistance(getTotalDistance(monthlyRuns)),
      primarySub: 'denne måneden',
      secondary: formatDistance(getTotalDistance(runs)),
      secondarySub: 'totalt',
    },
    {
      label: 'Løpeturer',
      primary: monthlyRuns.length,
      primarySub: 'denne måneden',
      secondary: runs.length,
      secondarySub: 'totalt',
    },
    {
      label: 'Lengste økt',
      primary: formatDistance(getLongestRun(monthlyRuns)),
      primarySub: 'denne måneden',
      secondary: formatDistance(getLongestRun(runs)),
      secondarySub: 'noensinne',
    },
    {
      label: 'Snittpuls',
      primary: `${easyHR} bpm`,
      primarySub: 'rolige turer',
      secondary: `${overallHR} bpm`,
      secondarySub: 'alle turer',
    },
  ]

  if (showDemo) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-[#080C14] text-slate-900 dark:text-slate-100">

        <header className="sticky top-0 z-10 border-b border-slate-200 dark:border-white/[0.06] bg-slate-50/80 dark:bg-[#080C14]/80 backdrop-blur px-6 py-3.5">
          <div className="max-w-5xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowDemo(false)}
                className="text-xs text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
              >
                ← Tilbake
              </button>
              <div className="w-px h-4 bg-slate-200 dark:bg-white/10" />
              <span className="text-sm font-semibold">Løpedashbord</span>
              <span className="text-xs px-2 py-0.5 rounded-md bg-blue-500/10 text-blue-500 dark:text-blue-400 border border-blue-500/20 font-medium">
                DEMO
              </span>
            </div>
            <ThemeToggle />
          </div>
        </header>

        <main className="max-w-5xl mx-auto px-6 py-8 space-y-5">

          {/* Statistikkort */}
          <section className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {stats.map((s, i) => (
              <div key={i} className="bg-white dark:bg-[#0F1629] rounded-xl border border-slate-200 dark:border-white/[0.06] p-5">
                <p className="text-xs uppercase tracking-wider font-medium text-slate-400 dark:text-slate-500 mb-3">
                  {s.label}
                </p>
                <p className="text-2xl font-bold font-mono tracking-tight">{s.primary}</p>
                <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">{s.primarySub}</p>
                <div className="mt-3 pt-3 border-t border-slate-100 dark:border-white/[0.04]">
                  <p className="text-sm font-mono font-semibold text-slate-500 dark:text-slate-400">
                    {s.secondary}
                  </p>
                  <p className="text-xs text-slate-400 dark:text-slate-500">{s.secondarySub}</p>
                </div>
              </div>
            ))}
          </section>

          {/* Grafer */}
          <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white dark:bg-[#0F1629] rounded-xl border border-slate-200 dark:border-white/[0.06] p-5">
              <p className="text-xs uppercase tracking-wider font-medium text-slate-400 dark:text-slate-500 mb-4">
                Ukentlig distanse
              </p>
              <WeeklyDistanceChart data={weeklyData} />
            </div>
            <div className="bg-white dark:bg-[#0F1629] rounded-xl border border-slate-200 dark:border-white/[0.06] p-5">
              <p className="text-xs uppercase tracking-wider font-medium text-slate-400 dark:text-slate-500 mb-4">
                Pulssoner
              </p>
              <HRZonesChart data={hrZoneData} />
            </div>
          </section>

          {/* Siste økt med kart */}
          {latestActivity && (
            <LastActivityCard activity={latestActivity} />
          )}

          {/* Aktivitetsliste */}
          <section className="bg-white dark:bg-[#0F1629] rounded-xl border border-slate-200 dark:border-white/[0.06] overflow-hidden">
            <div className="px-5 py-4 border-b border-slate-100 dark:border-white/[0.04]">
              <p className="text-xs uppercase tracking-wider font-medium text-slate-400 dark:text-slate-500">
                Siste aktiviteter
              </p>
            </div>
            <div className="divide-y divide-slate-100 dark:divide-white/[0.04]">
              {runs.map((activity) => (
                <div
                  key={activity.id}
                  onClick={() => setSelectedActivity(activity)}
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
                  <div className="text-right">
                    <p className="text-sm font-mono font-semibold text-blue-600 dark:text-blue-400">
                      {formatDistance(activity.distance)}
                    </p>
                    <p className="text-xs font-mono text-slate-400 dark:text-slate-500 mt-0.5">
                      {formatPace(activity.average_pace)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </section>

        </main>

        {selectedActivity && (
          <ActivityDetail
            activity={selectedActivity}
            onClose={() => setSelectedActivity(null)}
          />
        )}

      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background text-foreground transition-colors duration-200 relative flex flex-col">
      <div className="absolute top-0 right-0 p-6 z-10">
        <ThemeToggle />
      </div>
      <div className="flex-1 flex flex-col items-center justify-center px-4">
        <div className="max-w-xs w-full text-center space-y-8">
          <div className="space-y-3">
            <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
              Personlig statistikk
            </p>
            <h1 className="text-3xl font-bold tracking-tight">Løpedashbord</h1>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Analyser løpeøktene dine med pulssoner, tempodata og ukentlig progresjon.
            </p>
          </div>
          <div className="space-y-2.5">
            <button
              disabled
              className="w-full py-2.5 px-4 rounded-xl border border-border text-sm font-medium text-muted-foreground cursor-not-allowed flex items-center justify-center gap-2"
            >
              Koble til Strava
              <span className="text-xs bg-muted px-1.5 py-0.5 rounded">Snart</span>
            </button>
            <button
              onClick={() => setShowDemo(true)}
              className="w-full py-2.5 px-4 rounded-xl bg-foreground text-background text-sm font-semibold hover:opacity-90 transition-opacity"
            >
              Se demo
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}