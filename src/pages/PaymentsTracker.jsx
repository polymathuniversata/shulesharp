const transactions = [
  { id: 'TXN-8829', date: 'Oct 24, 2023', time: '09:41 AM', name: 'Sarah Jenkins', studentId: 'STU-1042', feeType: 'Tuition – Term 3', methodIcon: 'credit_card', method: 'Card ending 4242', amount: 'TSh 1,250.00', status: 'Paid', statusStyle: 'bg-[#E6F4EA] text-[#137333]' },
  { id: 'TXN-8828', date: 'Oct 23, 2023', time: '14:22 PM', name: 'Michael Chang', studentId: 'STU-0988', feeType: 'Boarding Fees', methodIcon: 'account_balance', method: 'Bank Transfer', amount: 'TSh 800.00', status: 'Partial', statusStyle: 'bg-[#FFF8E1] text-[#F57F17]' },
  { id: 'TXN-8827', date: 'Oct 23, 2023', time: '11:05 AM', name: 'David Osei', studentId: 'STU-1102', feeType: 'Library Fines', methodIcon: 'payments', method: 'Cash', amount: 'TSh 45.00', status: 'Paid', statusStyle: 'bg-[#E6F4EA] text-[#137333]' },
  { id: 'TXN-8826', date: 'Oct 22, 2023', time: '16:45 PM', name: 'Emma Watson', studentId: 'STU-0899', feeType: 'Tuition – Term 3', methodIcon: 'smartphone', method: 'Mobile Money', amount: 'TSh 1,250.00', status: 'Failed', statusStyle: 'bg-error-container text-on-error-container' },
]

export default function PaymentsTracker() {
  return (
    <div>
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-xl gap-md">
        <div>
          <h2 className="font-display-lg text-display-lg text-on-background mb-base">Payments Tracker</h2>
          <p className="font-body-md text-body-md text-on-surface-variant">Monitor, filter, and reconcile incoming fee payments.</p>
        </div>
        <button className="font-title-lg text-title-lg px-lg py-sm rounded-lg bg-secondary text-on-secondary shadow-[0_4px_12px_rgba(0,106,106,0.2)] hover:bg-secondary/90 transition-all flex items-center gap-sm">
          <span className="material-symbols-outlined">point_of_sale</span>
          Record Cash Payment
        </button>
      </div>

      {/* Filter Bar */}
      <div className="bg-surface-container-lowest rounded-xl border border-outline-variant p-md mb-lg flex flex-wrap items-center gap-md shadow-sm">
        <div className="flex-grow flex items-center gap-md flex-wrap">
          {[
            { icon: 'calendar_today', label: 'This Term (Q3)' },
            { icon: 'filter_list', label: 'Status: All' },
            { icon: 'account_balance', label: 'Method: All' },
          ].map(({ icon, label }) => (
            <div key={label} className="flex items-center gap-xs px-md py-sm border border-outline-variant rounded-lg bg-surface hover:border-secondary cursor-pointer transition-colors">
              <span className="material-symbols-outlined text-on-surface-variant text-[18px]">{icon}</span>
              <span className="font-body-sm text-body-sm text-on-surface">{label}</span>
              <span className="material-symbols-outlined text-on-surface-variant text-[18px]">arrow_drop_down</span>
            </div>
          ))}
        </div>
        <div className="flex items-center gap-lg border-l border-outline-variant pl-lg">
          <div>
            <p className="font-label-bold text-label-bold text-on-surface-variant uppercase tracking-wider mb-base">Total Collected</p>
            <p className="font-title-lg text-title-lg text-secondary">TSh 142,500.00</p>
          </div>
          <div>
            <p className="font-label-bold text-label-bold text-on-surface-variant uppercase tracking-wider mb-base">Pending Clearing</p>
            <p className="font-title-lg text-title-lg text-on-surface">TSh 8,240.00</p>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-surface-container-lowest rounded-xl border border-outline-variant overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-surface-container border-b border-outline-variant">
              <tr>
                <th className="py-sm px-md font-label-bold text-label-bold text-on-surface-variant uppercase tracking-wider w-12">
                  <input type="checkbox" className="rounded border-outline-variant" />
                </th>
                {['Transaction ID', 'Date', 'Student Name', 'Fee Type', 'Method', 'Amount', 'Status', ''].map((h, i) => (
                  <th key={h} className={`py-sm px-md font-label-bold text-label-bold text-on-surface-variant uppercase tracking-wider${i === 5 ? ' text-right' : i === 6 ? ' text-center' : ''}`}>
                    {h}
                    {(h === 'Transaction ID' || h === 'Date') && (
                      <span className="material-symbols-outlined text-[14px] opacity-0 align-middle ml-1">arrow_downward</span>
                    )}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-variant">
              {transactions.map((tx) => (
                <tr key={tx.id} className="hover:bg-surface-container-low transition-colors group cursor-pointer">
                  <td className="py-md px-md">
                    <input type="checkbox" className="rounded border-outline-variant" />
                  </td>
                  <td className="py-md px-md font-data-mono text-data-mono text-on-surface-variant">{tx.id}</td>
                  <td className="py-md px-md font-body-sm text-body-sm text-on-surface">
                    {tx.date}<br />
                    <span className="text-on-surface-variant text-[12px]">{tx.time}</span>
                  </td>
                  <td className="py-md px-md">
                    <div className="font-body-sm text-body-sm font-medium text-on-surface">{tx.name}</div>
                    <div className="font-body-sm text-body-sm text-on-surface-variant">ID: {tx.studentId}</div>
                  </td>
                  <td className="py-md px-md font-body-sm text-body-sm text-on-surface">{tx.feeType}</td>
                  <td className="py-md px-md">
                    <div className="flex items-center gap-xs">
                      <span className="material-symbols-outlined text-on-surface-variant text-[18px]">{tx.methodIcon}</span>
                      <span className="font-body-sm text-body-sm text-on-surface">{tx.method}</span>
                    </div>
                  </td>
                  <td className="py-md px-md font-data-mono text-data-mono text-on-surface text-right font-medium">{tx.amount}</td>
                  <td className="py-md px-md text-center">
                    <span className={`inline-flex items-center px-sm py-xs rounded-full font-label-bold text-label-bold ${tx.statusStyle}`}>
                      {tx.status}
                    </span>
                  </td>
                  <td className="py-md px-md text-right">
                    <button className="text-on-surface-variant opacity-0 group-hover:opacity-100 hover:text-secondary transition-all">
                      <span className="material-symbols-outlined">more_vert</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="px-lg py-md border-t border-outline-variant bg-surface-container-lowest flex items-center justify-between">
          <p className="font-body-sm text-body-sm text-on-surface-variant">Showing 1 to 10 of 245 entries</p>
          <div className="flex items-center gap-xs">
            <button className="p-xs rounded border border-outline-variant text-on-surface-variant hover:bg-surface-container disabled:opacity-50" disabled>
              <span className="material-symbols-outlined text-[20px]">chevron_left</span>
            </button>
            <button className="w-8 h-8 rounded bg-secondary text-on-secondary font-body-sm text-body-sm flex items-center justify-center">1</button>
            {[2, 3].map((n) => (
              <button key={n} className="w-8 h-8 rounded hover:bg-surface-container text-on-surface font-body-sm text-body-sm flex items-center justify-center transition-colors">
                {n}
              </button>
            ))}
            <span className="text-on-surface-variant">...</span>
            <button className="w-8 h-8 rounded hover:bg-surface-container text-on-surface font-body-sm text-body-sm flex items-center justify-center transition-colors">25</button>
            <button className="p-xs rounded border border-outline-variant text-on-surface hover:bg-surface-container transition-colors">
              <span className="material-symbols-outlined text-[20px]">chevron_right</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
