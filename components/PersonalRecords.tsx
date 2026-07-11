import type { PersonalRecord } from '@/lib/activityHelpers'

interface Props {
  records: PersonalRecord[]
}

export function PersonalRecords({ records }: Props) {
  return (
    <div className="bg-white dark:bg-[#0F1629] rounded-xl border border-slate-200 dark:border-white/[0.06] p-5 flex flex-col h-full">
      <p className="text-xs uppercase tracking-wider font-medium text-slate-400 dark:text-slate-500 mb-4">
        Personlige rekorder
      </p>
      <div className="flex flex-col gap-2.5 flex-1">
        {records.map((record, i) => (
          <div
            key={i}
            className="flex items-center justify-between bg-slate-50 dark:bg-white/[0.03] rounded-lg px-3 py-2.5"
          >
            <div className="flex items-center gap-2.5">
              <i
                className={`ti ${record.icon} text-slate-400 dark:text-slate-500`}
                style={{ fontSize: 15 }}
                aria-hidden="true"
              />
              <div>
                <p className="text-xs font-medium text-slate-600 dark:text-slate-300">
                  {record.label}
                </p>
                <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">
                  {record.activityName} · {record.date}
                </p>
              </div>
            </div>
            <p className="text-sm font-mono font-semibold text-blue-600 dark:text-blue-400 shrink-0 ml-3">
              {record.value}
            </p>
          </div>
        ))}
      </div>
    </div>
  )
}