const linkRows = [
  {
    recipient: 'Grade 10 – Term 2',
    sub: 'Batch • Expires in 12d',
    amount: 'TSh 45,000',
    type: 'funnel',
    opened: 85,
    paid: 40,
  },
  {
    recipient: 'Sarah Jenkins',
    sub: 'Individual • ID: 1042',
    amount: 'TSh 1,200',
    type: 'badge',
    badge: 'Link Opened',
    badgeStyle: 'bg-secondary-container/30 text-on-secondary-container border border-secondary-container',
  },
  {
    recipient: 'Michael Chang',
    sub: 'Individual • ID: 0891',
    amount: 'TSh 850',
    type: 'badge',
    badge: 'Delivered (Unopened)',
    badgeStyle: 'bg-surface-container-high text-on-surface-variant border border-outline-variant/30',
  },
  {
    recipient: 'Grade 11 – Art Stream',
    sub: 'Batch • Expires in 2d',
    amount: 'TSh 12,400',
    type: 'funnel',
    opened: 92,
    paid: 88,
  },
]

export default function PaymentLinks() {
  return (
    <div className="grid grid-cols-12 gap-lg">
      {/* KPI Bar */}
      <div className="col-span-12 grid grid-cols-3 gap-lg mb-xs">
        <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-md flex flex-col gap-xs relative overflow-hidden">
          <div className="absolute right-0 top-0 w-24 h-24 bg-secondary-container/20 rounded-bl-full -z-10" />
          <span className="font-body-sm text-body-sm text-on-surface-variant">Active Links</span>
          <span className="font-display-lg text-display-lg text-on-surface">1,432</span>
          <div className="flex items-center gap-xs text-secondary mt-xs">
            <span className="material-symbols-outlined text-[16px]">trending_up</span>
            <span className="font-label-bold text-label-bold">+12% this week</span>
          </div>
        </div>
        <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-md flex flex-col gap-xs">
          <span className="font-body-sm text-body-sm text-on-surface-variant">Link Open Rate</span>
          <span className="font-display-lg text-display-lg text-on-surface">68.5%</span>
          <div className="w-full bg-surface-container-highest rounded-full h-1 mt-auto">
            <div className="bg-secondary h-1 rounded-full" style={{ width: '68.5%' }} />
          </div>
        </div>
        <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-md flex flex-col gap-xs">
          <span className="font-body-sm text-body-sm text-on-surface-variant">Conversion (Paid)</span>
          <span className="font-display-lg text-display-lg text-on-surface">42.1%</span>
          <div className="w-full bg-surface-container-highest rounded-full h-1 mt-auto">
            <div className="bg-primary h-1 rounded-full" style={{ width: '42.1%' }} />
          </div>
        </div>
      </div>

      {/* Generator */}
      <div className="col-span-12 xl:col-span-4 flex flex-col gap-lg">
        <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-lg shadow-[0_2px_8px_rgba(0,0,0,0.02)]">
          <h3 className="font-title-lg text-title-lg text-on-surface mb-md flex items-center gap-sm">
            <span className="material-symbols-outlined text-secondary">add_link</span>
            Generate Payment Links
          </h3>
          <form className="flex flex-col gap-md">
            <div className="flex flex-col gap-xs">
              <label className="font-label-bold text-label-bold text-on-surface-variant uppercase">Target Audience</label>
              <select className="w-full border border-outline-variant rounded-lg p-sm bg-surface font-body-md text-on-surface focus:border-secondary focus:ring-1 focus:ring-secondary outline-none transition-colors">
                <option>Grade 10 – All Students</option>
                <option>Grade 11 – Science Stream</option>
                <option>Individual Student Selection...</option>
                <option>Defaulters List (30+ Days)</option>
              </select>
            </div>
            <div className="flex flex-col gap-xs">
              <label className="font-label-bold text-label-bold text-on-surface-variant uppercase">Fee Structure</label>
              <select className="w-full border border-outline-variant rounded-lg p-sm bg-surface font-body-md text-on-surface focus:border-secondary focus:ring-1 focus:ring-secondary outline-none transition-colors">
                <option>Term 2 Tuition + Transport</option>
                <option>Annual Exam Fees</option>
                <option>Custom Amount Entry...</option>
              </select>
            </div>
            <div className="flex flex-col gap-xs">
              <label className="font-label-bold text-label-bold text-on-surface-variant uppercase">Link Expiry</label>
              <input type="date" className="w-full border border-outline-variant rounded-lg p-sm bg-surface font-body-md text-on-surface focus:border-secondary focus:ring-1 focus:ring-secondary outline-none transition-colors" />
            </div>
            <div className="mt-sm p-sm bg-surface-container-low rounded-lg border border-outline-variant/50 flex flex-col gap-xs">
              <div className="flex justify-between items-center">
                <span className="font-body-sm text-on-surface-variant">Estimated Links:</span>
                <span className="font-data-mono text-data-mono text-on-surface">142</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-body-sm text-on-surface-variant">Total Value:</span>
                <span className="font-data-mono text-data-mono text-on-surface">TSh 124,500.00</span>
              </div>
            </div>
            <button
              type="button"
              className="mt-xs w-full bg-secondary text-on-secondary py-sm rounded-lg font-label-bold text-label-bold uppercase tracking-wide hover:bg-secondary/90 transition-colors shadow-[0_4px_12px_rgba(0,106,106,0.15)] active:scale-[0.98]"
            >
              Generate Bulk Links
            </button>
          </form>
        </div>
      </div>

      {/* Active Links Tracking */}
      <div className="col-span-12 xl:col-span-8 flex flex-col gap-lg">
        <div className="bg-surface-container-lowest border border-outline-variant rounded-xl overflow-hidden shadow-[0_2px_8px_rgba(0,0,0,0.02)] flex flex-col h-full">
          <div className="p-lg border-b border-outline-variant flex items-center justify-between bg-surface-bright">
            <h3 className="font-title-lg text-title-lg text-on-surface flex items-center gap-sm">
              <span className="material-symbols-outlined text-outline">tune</span>
              Active Link Tracking
            </h3>
            <button className="px-sm py-xs border border-outline-variant rounded-md text-on-surface-variant hover:bg-surface-container-high transition-colors font-label-bold text-[11px] uppercase flex items-center gap-xs">
              <span className="material-symbols-outlined text-[16px]">filter_list</span> Filter
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-surface-container-low border-b border-outline-variant">
                  {['Recipient / Batch', 'Amount', 'Funnel Status', 'Actions'].map((h, i) => (
                    <th key={h} className={`p-md font-label-bold text-label-bold text-on-surface-variant uppercase${i === 3 ? ' text-right' : ''}`}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant/50 font-body-sm text-body-sm">
                {linkRows.map((row, i) => (
                  <tr key={i} className="hover:bg-surface-container-low/50 transition-colors">
                    <td className="p-md">
                      <div className="flex flex-col">
                        <span className="font-data-mono text-on-surface font-medium">{row.recipient}</span>
                        <span className="text-[12px] text-on-surface-variant">{row.sub}</span>
                      </div>
                    </td>
                    <td className="p-md font-data-mono text-data-mono text-on-surface">{row.amount}</td>
                    <td className="p-md">
                      {row.type === 'funnel' ? (
                        <div className="flex flex-col gap-1 w-32">
                          <div className="flex justify-between text-[11px] font-label-bold">
                            <span className="text-secondary">Opened: {row.opened}%</span>
                            <span className="text-primary">Paid: {row.paid}%</span>
                          </div>
                          <div className="w-full h-1.5 flex rounded-full overflow-hidden bg-surface-container-highest">
                            <div className="bg-primary h-full" style={{ width: `${row.paid}%` }} />
                            <div className="bg-secondary/40 h-full" style={{ width: `${row.opened - row.paid}%` }} />
                          </div>
                        </div>
                      ) : (
                        <span className={`px-xs py-[2px] rounded font-label-bold text-[10px] uppercase ${row.badgeStyle}`}>
                          {row.badge}
                        </span>
                      )}
                    </td>
                    <td className="p-md text-right">
                      <div className="flex items-center justify-end gap-xs">
                        <button className="p-xs text-on-surface-variant hover:text-secondary bg-surface-container-high rounded-md transition-colors" title="Share">
                          <span className="material-symbols-outlined text-[18px]">chat</span>
                        </button>
                        <button className="p-xs text-on-surface-variant hover:text-primary bg-surface-container-high rounded-md transition-colors" title="Copy Link">
                          <span className="material-symbols-outlined text-[18px]">content_copy</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="p-sm border-t border-outline-variant flex justify-center mt-auto bg-surface">
            <button className="text-secondary font-label-bold text-[12px] hover:underline uppercase tracking-wide">
              View All Links
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
