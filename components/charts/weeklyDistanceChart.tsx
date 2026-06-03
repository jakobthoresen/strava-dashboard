'use client'

import { useTheme } from 'next-themes'
import { useEffect, useState } from 'react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import type { WeeklyDistanceData } from '@/lib/activityHelpers'

export function WeeklyDistanceChart({ data }: { data: WeeklyDistanceData[] }) {
  const [mounted, setMounted] = useState(false)
  const { resolvedTheme } = useTheme()
  useEffect(() => setMounted(true), [])
  if (!mounted) return <div className="h-48" />

  const isDark = resolvedTheme === 'dark'
  const grid   = isDark ? '#1E293B' : '#E2E8F0'
  const text   = isDark ? '#64748B' : '#94A3B8'
  const bar    = isDark ? '#3B82F6' : '#2563EB'

  return (
    <ResponsiveContainer width="100%" height={192}>
      <BarChart data={data} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke={grid} vertical={false} />
        <XAxis dataKey="week" tick={{ fill: text, fontSize: 11 }} axisLine={false} tickLine={false} />
        <YAxis tick={{ fill: text, fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={(v) => `${v}km`} />
        <Tooltip
          formatter={(value) => [`${value} km`, 'Distanse']}
          contentStyle={{
            background: isDark ? '#0F1629' : '#FFFFFF',
            border: `1px solid ${isDark ? '#1E293B' : '#E2E8F0'}`,
            borderRadius: '8px',
            fontSize: '12px',
            color: isDark ? '#F1F5F9' : '#0F172A',
          }}
        />
        <Bar dataKey="km" fill={bar} radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  )
}