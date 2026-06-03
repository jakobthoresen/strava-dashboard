'use client'

import { useTheme } from 'next-themes'
import { useEffect, useState } from 'react'
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import type { HRZoneData } from '@/lib/activityHelpers'

export function HRZonesChart({ data }: { data: HRZoneData[] }) {
  const [mounted, setMounted] = useState(false)
  const { resolvedTheme } = useTheme()
  useEffect(() => setMounted(true), [])
  if (!mounted) return <div className="h-48" />

  const isDark = resolvedTheme === 'dark'

  return (
    <ResponsiveContainer width="100%" height={192}>
      <PieChart>
        <Pie data={data} cx="50%" cy="45%" innerRadius={52} outerRadius={76} paddingAngle={3} dataKey="count">
          {data.map((entry, i) => (
            <Cell key={i} fill={entry.fill} />
          ))}
        </Pie>
        <Tooltip
          formatter={(value, name) => [`${value} økter`, name]}
          contentStyle={{
            background: isDark ? '#0F1629' : '#FFFFFF',
            border: `1px solid ${isDark ? '#1E293B' : '#E2E8F0'}`,
            borderRadius: '8px',
            fontSize: '12px',
            color: isDark ? '#F1F5F9' : '#0F172A',
          }}
        />
        <Legend
          iconType="circle"
          iconSize={7}
          formatter={(value) => (
            <span style={{ color: isDark ? '#94A3B8' : '#64748B', fontSize: '11px' }}>{value}</span>
          )}
        />
      </PieChart>
    </ResponsiveContainer>
  )
}