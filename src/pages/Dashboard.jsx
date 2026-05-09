const recentPayments = [
  { name: 'Liam Anderson', grade: 'Grade 10 - Sci', date: 'Oct 24, 2023', amount: 'TSh 2,500.00', status: 'PAID' },
  { name: 'Emma Davis', grade: 'Grade 12 - Art', date: 'Oct 24, 2023', amount: 'TSh 1,800.00', status: 'PROCESSING' },
  { name: 'Noah Wilson', grade: 'Grade 9 - Gen', date: 'Oct 23, 2023', amount: 'TSh 3,000.00', status: 'FAILED' },
  { name: 'Sophia Martinez', grade: 'Grade 11 - Sci', date: 'Oct 23, 2023', amount: 'TSh 2,500.00', status: 'PAID' },
]

const statusStyles = {
  PAID: 'bg-secondary-container/30 text-on-secondary-container',
  PROCESSING: 'bg-surface-container-highest text-on-surface-variant',
  FAILED: 'bg-error-container/40 text-on-error-container',
}

export default function Dashboard() {
  return (
    <div className="space-y-xl">
      {/* Page Header */}
      <div className="flex justify-between items-end">
        <div>
          <h2 className="font-display-lg text-display-lg text-on-surface">Overview</h2>
          <p className="font-body-md text-body-md text-on-surface-variant mt-xs">
            Current fee collection status for Academic Year 2023-2024.
          </p>
        </div>
        <div className="font-body-sm text-body-sm text-on-surface-variant bg-surface-container px-md py-xs rounded-full border border-outline-variant/50">
          Last updated: Today at 09:42 AM
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-12 gap-lg">
        {/* Total Collected */}
        <div className="col-span-12 md:col-span-4 bg-surface-container-lowest rounded-xl p-lg border border-outline-variant/40 shadow-[0_2px_8px_-4px_rgba(0,0,0,0.05)] flex flex-col justify-between h-[200px]">
          <div>
            <div className="flex justify-between items-start mb-md">
              <h3 className="font-title-lg text-title-lg text-on-surface">Total Collected</h3>
              <div className="w-12 h-12 rounded-full bg-secondary-container/20 flex items-center justify-center text-secondary">
                <span className="material-symbols-outlined text-[28px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                  account_balance
                </span>
              </div>
            </div>
            <div className="font-display-lg text-display-lg text-secondary">TSh 1,245,000</div>
          </div>
          <div className="flex items-center gap-xs mt-auto text-secondary-fixed-dim font-label-bold text-label-bold">
            <span className="material-symbols-outlined text-[16px]">trending_up</span>
            <span>+12% vs last cycle</span>
          </div>
        </div>

        {/* Outstanding Balance */}
        <div className="col-span-12 md:col-span-4 bg-surface-container-lowest rounded-xl p-lg border border-outline-variant/40 shadow-[0_2px_8px_-4px_rgba(0,0,0,0.05)] flex flex-col justify-between h-[200px]">
          <div>
            <div className="flex justify-between items-start mb-md">
              <h3 className="font-title-lg text-title-lg text-on-surface">Outstanding Balance</h3>
              <div className="w-12 h-12 rounded-full bg-surface-container flex items-center justify-center text-on-surface-variant">
                <span className="material-symbols-outlined text-[28px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                  error
                </span>
              </div>
            </div>
            <div className="font-display-lg text-display-lg text-on-surface">TSh 342,500</div>
          </div>
          <div className="flex items-center gap-xs mt-auto text-error font-body-sm text-body-sm">
            <span className="w-2 h-2 rounded-full bg-error" />
            <span>45 accounts overdue</span>
          </div>
        </div>

        {/* Collection Progress */}
        <div className="col-span-12 md:col-span-4 bg-surface-container-lowest rounded-xl p-lg border border-outline-variant/40 shadow-[0_2px_8px_-4px_rgba(0,0,0,0.05)] flex items-center justify-between h-[200px]">
          <div className="flex flex-col justify-between h-full py-xs">
            <h3 className="font-title-lg text-title-lg text-on-surface">Collection Progress</h3>
            <div>
              <div className="font-body-sm text-body-sm text-on-surface-variant mb-base">Target: TSh 1.6M</div>
              <div className="font-headline-md text-headline-md text-on-surface">78% Achieved</div>
            </div>
          </div>
          <div
            className="relative w-32 h-32 rounded-full flex items-center justify-center shrink-0"
            style={{ background: 'conic-gradient(#006a6a 78%, #ebe7e7 0)' }}
          >
            <div className="absolute w-24 h-24 bg-surface-container-lowest rounded-full flex items-center justify-center shadow-inner">
              <span className="material-symbols-outlined text-[32px] text-secondary" style={{ fontVariationSettings: "'FILL' 1" }}>
                check_circle
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div>
        <h3 className="font-title-lg text-title-lg text-on-surface mb-md">Quick Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-lg">
          {[
            { icon: 'add_link', title: 'Generate Link', desc: 'Create a new payment request' },
            { icon: 'person_add', title: 'Add Student', desc: 'Register a new payer profile' },
            { icon: 'receipt_long', title: 'Send Invoices', desc: 'Batch send term reminders' },
          ].map(({ icon, title, desc }) => (
            <button
              key={title}
              className="bg-surface-container-lowest border border-outline-variant/40 hover:border-secondary hover:shadow-[0_4px_12px_-4px_rgba(0,106,106,0.1)] transition-all p-md rounded-xl flex items-center gap-md text-left group"
            >
              <div className="w-12 h-12 rounded-lg bg-surface-container group-hover:bg-secondary-container/20 flex items-center justify-center text-on-surface-variant group-hover:text-secondary transition-colors">
                <span className="material-symbols-outlined">{icon}</span>
              </div>
              <div>
                <div className="font-title-lg text-title-lg text-on-surface">{title}</div>
                <div className="font-body-sm text-body-sm text-on-surface-variant mt-base">{desc}</div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Recent Payments Table */}
      <div className="bg-surface-container-lowest rounded-xl border border-outline-variant/40 overflow-hidden shadow-[0_2px_8px_-4px_rgba(0,0,0,0.02)]">
        <div className="p-lg border-b border-outline-variant/30 flex justify-between items-center bg-surface-bright">
          <h3 className="font-title-lg text-title-lg text-on-surface">Recent Payments</h3>
          <button className="text-secondary font-label-bold text-label-bold uppercase tracking-wide hover:underline flex items-center gap-xs">
            View All
            <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[700px]">
            <thead>
              <tr className="bg-surface-container-low border-b border-outline-variant/30">
                {['Student Name', 'Grade/Class', 'Date Received', 'Amount', 'Status'].map((h, i) => (
                  <th
                    key={h}
                    className={`py-md px-lg font-label-bold text-label-bold text-on-surface-variant uppercase tracking-wider${i === 4 ? ' text-right' : ''}`}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="font-body-md text-body-md text-on-surface">
              {recentPayments.map((row, i) => (
                <tr
                  key={i}
                  className={`hover:bg-surface-container/50 transition-colors${i < recentPayments.length - 1 ? ' border-b border-outline-variant/20' : ''}`}
                >
                  <td className="py-md px-lg font-data-mono text-data-mono font-medium">{row.name}</td>
                  <td className="py-md px-lg text-on-surface-variant">{row.grade}</td>
                  <td className="py-md px-lg text-on-surface-variant">{row.date}</td>
                  <td className="py-md px-lg font-data-mono text-data-mono font-medium">{row.amount}</td>
                  <td className="py-md px-lg text-right">
                    <span className={`inline-flex items-center px-sm py-base rounded-full font-label-bold text-label-bold ${statusStyles[row.status]}`}>
                      {row.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
