import { useState, useEffect } from 'react'
import { listPayments } from '../lib/api'

const STATUS_STYLES = {
  succeeded: 'bg-[#E6F4EA] text-[#137333]',
  pending: 'bg-[#FFF8E1] text-[#F57F17]',
  failed: 'bg-error-container text-on-error-container',
  voided: 'bg-error-container text-on-error-container',
  expired: 'bg-surface-container-highest text-on-surface-variant',
}

const STATUS_LABELS = {
  succeeded: 'Paid',
  pending: 'Pending',
  failed: 'Failed',
  voided: 'Voided',
  expired: 'Expired',
}

const fmt = (n) => `TSh ${n.toLocaleString()}`
const txnId = (id) => (id ? `TXN-${id.slice(-6).toUpperCase()}` : '—')

export default function PaymentsTracker() {
  const [payments, setPayments] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    listPayments(100)
      .then((res) => setPayments(res.data))
      .catch(() => setError('Failed to load payments. Is the backend running?'))
      .finally(() => setLoading(false))
  }, [])

  const collected = payments.filter((p) => p.status === 'succeeded').reduce((s, p) => s + p.amount, 0)
  const pending = payments.filter((p) => p.status === 'pending').reduce((s, p) => s + p.amount, 0)

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-xl gap-md">
        <div>
          <h2 className="font-display-lg text-display-lg text-on-background mb-base">Payments Tracker</h2>
          <p className="font-body-md text-body-md text-on-surface-variant">Monitor, filter, and reconcile incoming fee payments.</p>
        </div>
      </div>

      {/* Stats Bar */}
      <div className="bg-surface-container-lowest rounded-xl border border-outline-variant p-md mb-lg flex flex-wrap items-center gap-md shadow-sm">
        <div className="flex items-center gap-lg">
          <div>
            <p className="font-label-bold text-label-bold text-on-surface-variant uppercase tracking-wider mb-base">Total Collected</p>
            <p className="font-title-lg text-title-lg text-secondary">{fmt(collected)}</p>
          </div>
          <div className="border-l border-outline-variant pl-lg">
            <p className="font-label-bold text-label-bold text-on-surface-variant uppercase tracking-wider mb-base">Pending</p>
            <p className="font-title-lg text-title-lg text-on-surface">{fmt(pending)}</p>
          </div>
        </div>
        <div className="ml-auto font-body-sm text-body-sm text-on-surface-variant">
          {loading ? 'Loading…' : `${payments.length} total transactions`}
        </div>
      </div>

      {/* Table */}
      <div className="bg-surface-container-lowest rounded-xl border border-outline-variant overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          {loading ? (
            <div className="py-2xl text-center font-body-md text-body-md text-on-surface-variant">Loading payments…</div>
          ) : error ? (
            <div className="py-2xl text-center font-body-md text-body-md text-error">{error}</div>
          ) : payments.length === 0 ? (
            <div className="py-2xl text-center font-body-md text-body-md text-on-surface-variant">
              No payments recorded yet.
            </div>
          ) : (
            <table className="w-full text-left border-collapse">
              <thead className="bg-surface-container border-b border-outline-variant">
                <tr>
                  {['Transaction ID', 'Student', 'Description', 'Amount', 'Status', ''].map((h, i) => (
                    <th
                      key={h || i}
                      className={`py-sm px-md font-label-bold text-label-bold text-on-surface-variant uppercase tracking-wider${
                        i === 3 ? ' text-right' : i === 4 ? ' text-center' : ''
                      }`}
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-surface-variant">
                {payments.map((p) => (
                  <tr key={p.payment_id} className="hover:bg-surface-container-low transition-colors group cursor-pointer">
                    <td className="py-md px-md font-data-mono text-data-mono text-on-surface-variant">
                      {txnId(p.payment_id)}
                    </td>
                    <td className="py-md px-md">
                      <div className="font-body-sm text-body-sm font-medium text-on-surface">{p.student_name}</div>
                      <div className="font-body-sm text-body-sm text-on-surface-variant">ID: {p.student_id}</div>
                    </td>
                    <td className="py-md px-md font-body-sm text-body-sm text-on-surface">{p.description || '—'}</td>
                    <td className="py-md px-md font-data-mono text-data-mono text-on-surface text-right font-medium">
                      {fmt(p.amount)}
                    </td>
                    <td className="py-md px-md text-center">
                      <span className={`inline-flex items-center px-sm py-xs rounded-full font-label-bold text-label-bold ${STATUS_STYLES[p.status] || ''}`}>
                        {STATUS_LABELS[p.status] || p.status}
                      </span>
                    </td>
                    <td className="py-md px-md text-right">
                      {p.snippe_link && (
                        <a
                          href={p.snippe_link}
                          target="_blank"
                          rel="noreferrer"
                          className="text-on-surface-variant opacity-0 group-hover:opacity-100 hover:text-secondary transition-all"
                          title="Open Snippe checkout"
                        >
                          <span className="material-symbols-outlined">open_in_new</span>
                        </a>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {!loading && payments.length > 0 && (
          <div className="px-lg py-md border-t border-outline-variant bg-surface-container-lowest">
            <p className="font-body-sm text-body-sm text-on-surface-variant">
              Showing {payments.length} entries
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
