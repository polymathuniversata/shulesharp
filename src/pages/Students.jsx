const students = [
  { initials: 'EA', bg: 'bg-tertiary-fixed', text: 'text-on-tertiary-fixed', name: 'Elias Anderson', tag: 'New Admission', id: 'STU-24-001', grade: 'Grade 3A', guardian: 'Martha Anderson', balance: 'TSh 0.00', status: 'Cleared' },
  { initials: 'SJ', bg: 'bg-secondary-fixed', text: 'text-on-secondary-fixed-variant', name: 'Sophia Jenkins', tag: 'Returning', id: 'STU-23-142', grade: 'Grade 5B', guardian: 'Robert Jenkins', balance: 'TSh 1,250.00', status: 'Pending' },
  { initials: 'MR', bg: 'bg-surface-container-highest', text: 'text-on-surface', name: 'Marcus Rodriguez', tag: 'Returning', id: 'STU-22-089', grade: 'Grade 8A', guardian: 'Elena Rodriguez', balance: 'TSh 450.00', status: 'Overdue' },
  { initials: 'LT', bg: 'bg-tertiary-fixed', text: 'text-on-tertiary-fixed', name: 'Liam Thompson', tag: 'Returning', id: 'STU-21-204', grade: 'Grade 10C', guardian: 'Sarah Thompson', balance: 'TSh 0.00', status: 'Cleared' },
]

const statusBadge = {
  Cleared: 'bg-[#E6F4EA] text-[#1E8E3E]',
  Pending: 'bg-[#FFF3E0] text-[#E65100]',
  Overdue: 'bg-error-container text-on-error-container',
}

export default function Students() {
  return (
    <div className="flex flex-col gap-lg h-full">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-display-lg text-display-lg text-on-background m-0">Students Roster</h2>
          <p className="font-body-md text-body-md text-on-surface-variant mt-xs">
            Manage student accounts and monitor current fee balances.
          </p>
        </div>
        <button className="bg-secondary text-on-secondary px-lg py-sm rounded-lg font-title-lg text-title-lg hover:bg-secondary/90 transition-colors shadow-sm flex items-center gap-sm">
          <span className="material-symbols-outlined">person_add</span>
          Add Student
        </button>
      </div>

      {/* Table Container */}
      <div className="bg-surface-container-lowest border border-outline-variant rounded-xl flex flex-col shadow-[0_2px_12px_rgba(0,0,0,0.02)] overflow-hidden">
        {/* Filters */}
        <div className="p-md border-b border-outline-variant flex items-center justify-between bg-surface-container-low/50">
          <div className="flex items-center gap-sm">
            <div className="relative w-[280px]">
              <span className="material-symbols-outlined absolute left-sm top-1/2 -translate-y-1/2 text-outline text-[20px]">
                search
              </span>
              <input
                type="text"
                placeholder="Filter by name or ID..."
                className="w-full pl-xl pr-sm py-1.5 bg-surface-container-lowest border border-outline-variant rounded-md focus:outline-none focus:border-secondary focus:ring-1 focus:ring-secondary font-body-sm text-body-sm text-on-surface placeholder:text-outline transition-colors"
              />
            </div>
            <select className="py-1.5 pl-sm pr-xl bg-surface-container-lowest border border-outline-variant rounded-md focus:outline-none focus:border-secondary font-body-sm text-body-sm text-on-surface appearance-none">
              <option value="">All Classes</option>
              <option value="grade1">Grade 1</option>
              <option value="grade2">Grade 2</option>
              <option value="grade3">Grade 3</option>
            </select>
            <select className="py-1.5 pl-sm pr-xl bg-surface-container-lowest border border-outline-variant rounded-md focus:outline-none focus:border-secondary font-body-sm text-body-sm text-on-surface appearance-none">
              <option value="">Any Balance Status</option>
              <option value="cleared">Cleared</option>
              <option value="pending">Pending</option>
              <option value="overdue">Overdue</option>
            </select>
          </div>
          <button className="p-xs text-outline hover:text-secondary rounded-md hover:bg-surface-container transition-colors">
            <span className="material-symbols-outlined text-[20px]">tune</span>
          </button>
        </div>

        {/* Table */}
        <div className="overflow-x-auto flex-1">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-outline-variant bg-surface-container-lowest">
                {['Student Name', 'ID / Class', 'Guardian Details', 'Contact', 'Current Balance', 'Status', ''].map((h) => (
                  <th key={h} className="py-sm px-md font-label-bold text-label-bold text-on-surface-variant uppercase tracking-wider">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="font-body-sm text-body-sm divide-y divide-outline-variant/50">
              {students.map((s) => (
                <tr key={s.id} className="hover:bg-surface-container-low transition-colors group">
                  <td className="py-md px-md">
                    <div className="flex items-center gap-sm">
                      <div className={`w-8 h-8 rounded-full ${s.bg} ${s.text} flex items-center justify-center font-title-lg text-title-lg`}>
                        {s.initials}
                      </div>
                      <div>
                        <p className="font-title-lg text-title-lg text-on-surface m-0 leading-tight">{s.name}</p>
                        <p className="text-on-surface-variant m-0 text-xs">{s.tag}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-md px-md">
                    <p className="font-data-mono text-data-mono text-on-surface m-0">{s.id}</p>
                    <p className="text-on-surface-variant m-0">{s.grade}</p>
                  </td>
                  <td className="py-md px-md text-on-surface">{s.guardian}</td>
                  <td className="py-md px-md">
                    <div className="flex items-center gap-xs">
                      <button className="w-8 h-8 rounded-full bg-surface border border-outline-variant flex items-center justify-center text-outline hover:text-[#25D366] hover:border-[#25D366] transition-colors" title="WhatsApp">
                        <span className="material-symbols-outlined text-[18px]">chat</span>
                      </button>
                      <button className="w-8 h-8 rounded-full bg-surface border border-outline-variant flex items-center justify-center text-outline hover:text-secondary hover:border-secondary transition-colors" title="SMS">
                        <span className="material-symbols-outlined text-[18px]">sms</span>
                      </button>
                    </div>
                  </td>
                  <td className="py-md px-md font-data-mono text-data-mono text-on-surface">{s.balance}</td>
                  <td className="py-md px-md">
                    <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full font-label-bold text-label-bold ${statusBadge[s.status]}`}>
                      {s.status === 'Overdue' && (
                        <span className="material-symbols-outlined text-[14px]">warning</span>
                      )}
                      {s.status}
                    </span>
                  </td>
                  <td className="py-md px-md text-right">
                    <button className="text-outline hover:text-primary transition-colors opacity-0 group-hover:opacity-100 p-1">
                      <span className="material-symbols-outlined text-[20px]">more_vert</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="p-md border-t border-outline-variant bg-surface-container-lowest flex items-center justify-between text-on-surface-variant font-body-sm text-body-sm">
          <span>Showing 1 to 4 of 248 entries</span>
          <div className="flex items-center gap-xs">
            <button className="p-1 rounded text-outline hover:bg-surface-container hover:text-secondary transition-colors disabled:opacity-50" disabled>
              <span className="material-symbols-outlined">chevron_left</span>
            </button>
            <button className="w-8 h-8 rounded-md bg-secondary text-on-secondary flex items-center justify-center font-data-mono text-data-mono">1</button>
            {[2, 3].map((n) => (
              <button key={n} className="w-8 h-8 rounded-md hover:bg-surface-container hover:text-secondary flex items-center justify-center transition-colors font-data-mono text-data-mono">
                {n}
              </button>
            ))}
            <span className="px-1">...</span>
            <button className="w-8 h-8 rounded-md hover:bg-surface-container hover:text-secondary flex items-center justify-center transition-colors font-data-mono text-data-mono">
              25
            </button>
            <button className="p-1 rounded text-outline hover:bg-surface-container hover:text-secondary transition-colors">
              <span className="material-symbols-outlined">chevron_right</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
