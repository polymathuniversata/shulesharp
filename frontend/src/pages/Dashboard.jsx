import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { listPayments } from '../lib/api'

const statusMap = {
  succeeded: { label: 'PAID', style: 'bg-secondary-container/30 text-on-secondary-container' },
  pending: { label: 'PROCESSING', style: 'bg-surface-container-highest text-on-surface-variant' },
  failed: { label: 'FAILED', style: 'bg-error-container/40 text-on-error-container' },
  voided: { label: 'FAILED', style: 'bg-error-container/40 text-on-error-container' },
  expired: { label: 'EXPIRED', style: 'bg-surface-container-highest text-on-surface-variant' },
}

const fmt = (n) => `TSh ${n.toLocaleString()}`

export default function Dashboard() {
  const [payments, setPayments] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    listPayments(50)
      .then((res) => setPayments(res.data))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const collected = payments.filter((p) => p.status === 'succeeded').reduce((s, p) => s + p.amount, 0)
  const outstanding = payments.filter((p) => p.status === 'pending').reduce((s, p) => s + p.amount, 0)
  const total = collected + outstanding
  const rate = total > 0 ? Math.round((collected / total) * 100) : 0
  const pendingCount = payments.filter((p) => p.status === 'pending').length
  const recentPayments = payments.slice(0, 5)
  const navigate = useNavigate()

  return (
    <div className="space-y-xl">
      {/* Page Header */}
      <div className="flex justify-between items-end">
        <div>
          <h2 className="font-display-lg text-display-lg text-on-surface">Overview</h2>
          <p className="font-body-md text-body-md text-on-surface-variant mt-xs">
            Current fee collection status for the active academic term.
          </p>
        </div>
        <div className="font-body-sm text-body-sm text-on-surface-variant bg-surface-container px-md py-xs rounded-full border border-outline-variant/50">
          {loading ? 'Loading…' : `${payments.length} payments on record`}
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
            <div className="font-display-lg text-display-lg text-secondary">
              {loading ? '—' : fmt(collected)}
            </div>
          </div>
          <div className="flex items-center gap-xs mt-auto text-secondary-fixed-dim font-label-bold text-label-bold">
            <span className="material-symbols-outlined text-[16px]">trending_up</span>
            <span>{payments.filter((p) => p.status === 'succeeded').length} successful payments</span>
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
            <div className="font-display-lg text-display-lg text-on-surface">
              {loading ? '—' : fmt(outstanding)}
            </div>
          </div>
          <div className="flex items-center gap-xs mt-auto text-error font-body-sm text-body-sm">
            <span className="w-2 h-2 rounded-full bg-error" />
            <span>{pendingCount} {pendingCount === 1 ? 'account' : 'accounts'} pending</span>
          </div>
        </div>

        {/* Collection Progress */}
        <div className="col-span-12 md:col-span-4 bg-surface-container-lowest rounded-xl p-lg border border-outline-variant/40 shadow-[0_2px_8px_-4px_rgba(0,0,0,0.05)] flex items-center justify-between h-[200px]">
          <div className="flex flex-col justify-between h-full py-xs">
            <h3 className="font-title-lg text-title-lg text-on-surface">Collection Progress</h3>
            <div>
              <div className="font-body-sm text-body-sm text-on-surface-variant mb-base">vs. outstanding</div>
              <div className="font-headline-md text-headline-md text-on-surface">
                {loading ? '—' : `${rate}% Achieved`}
              </div>
            </div>
          </div>
          <div
            className="relative w-32 h-32 rounded-full flex items-center justify-center shrink-0"
            style={{ background: loading ? '#ebe7e7' : `conic-gradient(#006a6a ${rate}%, #ebe7e7 0)` }}
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
            { icon: 'add_link', title: 'Generate Link', desc: 'Create a new payment request', to: '/payment-links' },
            { icon: 'person_add', title: 'Add Student', desc: 'Register a new payer profile', to: '/students' },
            { icon: 'receipt_long', title: 'Send Invoices', desc: 'Batch send term reminders', to: '/payments' },
          ].map(({ icon, title, desc, to }) => (
            <button
              key={title}
              onClick={() => navigate(to)}
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
          {loading ? (
            <div className="py-2xl text-center font-body-md text-body-md text-on-surface-variant">Loading payments…</div>
          ) : recentPayments.length === 0 ? (
            <div className="py-2xl text-center font-body-md text-body-md text-on-surface-variant">
              No payments yet — generate a payment link to get started.
            </div>
          ) : (
            <table className="w-full text-left border-collapse min-w-[700px]">
              <thead>
                <tr className="bg-surface-container-low border-b border-outline-variant/30">
                  {['Student Name', 'Student ID', 'Description', 'Amount', 'Status'].map((h, i) => (
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
                {recentPayments.map((p, i) => {
                  const s = statusMap[p.status] || { label: p.status.toUpperCase(), style: 'bg-surface-container-highest text-on-surface-variant' }
                  return (
                    <tr
                      key={p.payment_id}
                      className={`hover:bg-surface-container/50 transition-colors${i < recentPayments.length - 1 ? ' border-b border-outline-variant/20' : ''}`}
                    >
                      <td className="py-md px-lg font-data-mono text-data-mono font-medium">{p.student_name}</td>
                      <td className="py-md px-lg text-on-surface-variant font-data-mono">{p.student_id}</td>
                      <td className="py-md px-lg text-on-surface-variant">{p.description || '—'}</td>
                      <td className="py-md px-lg font-data-mono text-data-mono font-medium">{fmt(p.amount)}</td>
                      <td className="py-md px-lg text-right">
                        <span className={`inline-flex items-center px-sm py-base rounded-full font-label-bold text-label-bold ${s.style}`}>
                          {s.label}
                        </span>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  )
}
