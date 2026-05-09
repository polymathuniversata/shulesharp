const termSummaries = [
  { term: 'Term 1 (Fall)', billed: 'TSh 1,700,000', collected: 'TSh 1,650,000', status: 'Closed', statusStyle: 'bg-[#E6F4EA] text-[#137333]' },
  { term: 'Term 2 (Winter)', billed: 'TSh 1,700,000', collected: 'TSh 1,400,000', status: 'Active', statusStyle: 'bg-secondary-container/30 text-on-secondary-container' },
  { term: 'Term 3 (Spring)', billed: 'TSh 1,700,000', collected: 'TSh 1,200,000', status: 'Upcoming', statusStyle: 'bg-surface-container-high text-on-surface-variant' },
]

const gradeBalances = [
  { label: 'Grade 12', amount: 'TSh 210,000', pct: 85, barStyle: 'bg-error/80' },
  { label: 'Grade 11', amount: 'TSh 185,000', pct: 65, barStyle: 'bg-outline/80' },
  { label: 'Grade 10', amount: 'TSh 150,000', pct: 50, barStyle: 'bg-outline/60' },
  { label: 'Grade 9', amount: 'TSh 125,000', pct: 35, barStyle: 'bg-outline/40' },
  { label: 'Middle School (6–8)', amount: 'TSh 180,000', pct: 60, barStyle: 'bg-outline/50' },
]

export default function Reports() {
  return (
    <div className="space-y-lg pb-2xl">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-lg gap-md">
        <div>
          <h2 className="font-display-lg text-display-lg text-on-surface mb-base">Financial Overview</h2>
          <p className="font-body-md text-body-md text-on-surface-variant">
            Comprehensive collection statistics and outstanding balances for the current academic year.
          </p>
        </div>
        <div className="flex items-center gap-sm">
          {[
            { icon: 'picture_as_pdf', label: 'Export to PDF' },
            { icon: 'table_view', label: 'Export to Excel' },
          ].map(({ icon, label }) => (
            <button key={label} className="bg-surface-container-lowest border border-outline-variant text-on-surface-variant font-label-bold text-label-bold uppercase px-md py-xs rounded hover:text-secondary hover:border-secondary hover:bg-secondary-container/5 transition-colors flex items-center gap-xs">
              <span className="material-symbols-outlined text-[18px]">{icon}</span>
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-lg">
        <div className="bg-surface-container-lowest border border-outline-variant rounded-lg p-lg flex flex-col justify-between h-32 relative overflow-hidden">
          <div className="absolute right-0 top-0 w-32 h-32 bg-secondary/5 rounded-bl-full -mr-8 -mt-8" />
          <div className="flex items-center justify-between mb-sm relative z-10">
            <span className="font-title-lg text-title-lg text-on-surface-variant">Total Collected YTD</span>
            <span className="material-symbols-outlined text-secondary bg-secondary-container/20 p-xs rounded">account_balance</span>
          </div>
          <div className="relative z-10">
            <span className="font-display-lg text-display-lg text-on-surface font-data-mono tracking-tight">TSh 4,250,000.00</span>
          </div>
        </div>
        <div className="bg-surface-container-lowest border border-outline-variant rounded-lg p-lg flex flex-col justify-between h-32 relative overflow-hidden">
          <div className="absolute right-0 top-0 w-32 h-32 bg-error/5 rounded-bl-full -mr-8 -mt-8" />
          <div className="flex items-center justify-between mb-sm relative z-10">
            <span className="font-title-lg text-title-lg text-on-surface-variant">Outstanding Balances</span>
            <span className="material-symbols-outlined text-error bg-error-container/40 p-xs rounded">warning</span>
          </div>
          <div className="relative z-10">
            <span className="font-display-lg text-display-lg text-on-surface font-data-mono tracking-tight">TSh 850,000.00</span>
          </div>
        </div>
        <div className="bg-surface-container-lowest border border-outline-variant rounded-lg p-lg flex flex-col justify-between h-32 relative overflow-hidden">
          <div className="flex items-center justify-between mb-sm relative z-10">
            <span className="font-title-lg text-title-lg text-on-surface-variant">Collection Target</span>
            <span className="material-symbols-outlined text-primary bg-surface-container-high p-xs rounded">trending_up</span>
          </div>
          <div className="relative z-10 flex items-end gap-md">
            <span className="font-display-lg text-display-lg text-on-surface font-data-mono tracking-tight">83.3%</span>
            <span className="font-body-sm text-body-sm text-on-surface-variant mb-xs">of TSh 5.1M Target</span>
          </div>
          <div className="w-full bg-surface-container-highest h-2 rounded-full mt-auto relative z-10 overflow-hidden">
            <div className="bg-secondary h-full rounded-full" style={{ width: '83.3%' }} />
          </div>
        </div>
      </div>

      {/* Collection Trends Chart */}
      <div className="bg-surface-container-lowest border border-outline-variant rounded-lg p-lg">
        <div className="flex items-center justify-between mb-lg">
          <h3 className="font-title-lg text-title-lg text-on-surface">Collection Trends (Last 6 Months)</h3>
          <div className="flex items-center gap-sm">
            <span className="flex items-center gap-xs font-label-bold text-label-bold text-on-surface-variant uppercase">
              <div className="w-3 h-3 bg-secondary rounded-sm" /> Collected
            </span>
            <span className="flex items-center gap-xs font-label-bold text-label-bold text-on-surface-variant uppercase">
              <div className="w-3 h-3 bg-outline rounded-sm" /> Projected
            </span>
          </div>
        </div>
        <div className="h-64 w-full relative border-l border-b border-outline-variant/50 pb-sm pl-sm flex items-end ml-16">
          <div className="absolute left-[-64px] top-0 h-full flex flex-col justify-between font-label-bold text-label-bold text-on-surface-variant/70 text-right pr-xs">
            {['TSh 1M', 'TSh 750k', 'TSh 500k', 'TSh 250k', 'TSh 0'].map((l) => (
              <span key={l}>{l}</span>
            ))}
          </div>
          <div className="w-full h-[calc(100%-20px)] relative">
            <div className="absolute inset-0 flex flex-col justify-between z-0">
              {[0, 1, 2, 3].map((i) => <div key={i} className="w-full border-b border-outline-variant/20 h-0" />)}
            </div>
            <svg className="w-full h-full relative z-10 overflow-visible" viewBox="0 0 1000 200" preserveAspectRatio="none">
              <defs>
                <linearGradient id="trendGradient" x1="0" x2="0" y1="0" y2="1">
                  <stop offset="0%" stopColor="#006a6a" />
                  <stop offset="100%" stopColor="#fdf8f8" stopOpacity="0" />
                </linearGradient>
              </defs>
              <path d="M0,150 L200,140 L400,100 L600,80 L800,50 L1000,20" fill="none" stroke="#77767b" strokeDasharray="4 4" strokeWidth="2" vectorEffect="non-scaling-stroke" />
              <path d="M0,160 L200,130 L400,110 L600,60 L800,40" fill="none" stroke="#006a6a" strokeWidth="3" vectorEffect="non-scaling-stroke" />
              <path d="M0,160 L200,130 L400,110 L600,60 L800,40 L800,200 L0,200 Z" fill="url(#trendGradient)" opacity="0.1" />
              {[[0,160],[200,130],[400,110],[600,60],[800,40]].map(([cx,cy]) => (
                <circle key={cx} cx={cx} cy={cy} r="4" fill="#006a6a" />
              ))}
            </svg>
          </div>
          <div className="absolute bottom-[-24px] left-sm right-0 flex justify-between font-label-bold text-label-bold text-on-surface-variant/70 uppercase">
            {['Aug','Sep','Oct','Nov','Dec','Jan (Proj)'].map((m) => <span key={m}>{m}</span>)}
          </div>
        </div>
      </div>

      {/* Term Summaries + Outstanding by Grade */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-lg">
        <div className="bg-surface-container-lowest border border-outline-variant rounded-lg flex flex-col h-full">
          <div className="p-lg border-b border-outline-variant flex items-center justify-between">
            <h3 className="font-title-lg text-title-lg text-on-surface">Term Summaries</h3>
            <button className="text-secondary font-label-bold text-label-bold uppercase hover:underline">View All</button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-outline-variant/50 bg-surface-container-low">
                  {['Term', 'Billed', 'Collected', 'Status'].map((h, i) => (
                    <th key={h} className={`py-sm px-lg font-label-bold text-label-bold text-on-surface-variant uppercase tracking-wider${i === 3 ? ' text-right' : ''}`}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="font-body-sm text-body-sm text-on-surface">
                {termSummaries.map((row, i) => (
                  <tr key={i} className={`hover:bg-surface-container-low/50 transition-colors${i < termSummaries.length - 1 ? ' border-b border-outline-variant/30' : ''}`}>
                    <td className="py-md px-lg font-data-mono font-medium">{row.term}</td>
                    <td className="py-md px-lg font-data-mono">{row.billed}</td>
                    <td className="py-md px-lg font-data-mono">{row.collected}</td>
                    <td className="py-md px-lg text-right">
                      <span className={`inline-flex items-center px-2 py-1 rounded-full font-label-bold text-[10px] uppercase tracking-wide ${row.statusStyle}`}>
                        {row.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="bg-surface-container-lowest border border-outline-variant rounded-lg flex flex-col h-full">
          <div className="p-lg border-b border-outline-variant">
            <h3 className="font-title-lg text-title-lg text-on-surface">Outstanding by Grade Level</h3>
          </div>
          <div className="p-lg flex flex-col gap-md">
            {gradeBalances.map((g) => (
              <div key={g.label}>
                <div className="flex justify-between text-body-sm font-body-sm mb-xs">
                  <span className="font-medium text-on-surface">{g.label}</span>
                  <span className="font-data-mono text-on-surface-variant">{g.amount}</span>
                </div>
                <div className="w-full bg-surface-container-highest h-2 rounded-full overflow-hidden">
                  <div className={`${g.barStyle} h-full rounded-full`} style={{ width: `${g.pct}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
