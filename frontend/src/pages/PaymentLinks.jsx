import { useState, useEffect } from 'react'
import { createPaymentLink, listPayments } from '../lib/api'

const FEE_PLANS = {
  'Term 2 Tuition + Transport': 1050,
  'Annual Exam Fees': 500,
  'Boarding Fees': 800,
  'Custom Amount Entry...': 0,
}

const STATUS_STYLES = {
  pending: 'bg-surface-container-high text-on-surface-variant border border-outline-variant/30',
  succeeded: 'bg-[#E6F4EA] text-[#137333]',
  failed: 'bg-error-container text-on-error-container',
  voided: 'bg-error-container text-on-error-container',
  expired: 'bg-surface-container-high text-on-surface-variant',
}

export default function PaymentLinks() {
  const [studentName, setStudentName] = useState('')
  const [studentId, setStudentId] = useState('')
  const [phoneNumber, setPhoneNumber] = useState('')
  const [parentEmail, setParentEmail] = useState('')
  const [feePlan, setFeePlan] = useState('Term 2 Tuition + Transport')
  const [customAmount, setCustomAmount] = useState('')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)
  const [error, setError] = useState(null)
  const [payments, setPayments] = useState([])
  const [paymentsLoading, setPaymentsLoading] = useState(true)
  const [copied, setCopied] = useState(null)

  const isCustom = feePlan === 'Custom Amount Entry...'
  const amount = isCustom ? (parseInt(customAmount) || 0) : FEE_PLANS[feePlan]

  useEffect(() => {
    refreshPayments()
  }, [])

  function refreshPayments() {
    setPaymentsLoading(true)
    listPayments()
      .then((res) => setPayments(res.data))
      .catch(() => {})
      .finally(() => setPaymentsLoading(false))
  }

  async function handleGenerate(e) {
    e.preventDefault()
    setError(null)
    setResult(null)
    setLoading(true)
    try {
      const res = await createPaymentLink({
        student_name: studentName,
        student_id: studentId,
        phone_number: phoneNumber,
        amount,
        currency: 'TZS',
        parent_email: parentEmail || undefined,
        description: isCustom ? 'Custom Fee' : feePlan,
      })
      setResult(res.data)
      refreshPayments()
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to create payment link.')
    } finally {
      setLoading(false)
    }
  }

  function copyPayLink(paymentId) {
    const url = `${window.location.origin}/pay?payment_id=${paymentId}`
    navigator.clipboard.writeText(url).then(() => {
      setCopied(paymentId)
      setTimeout(() => setCopied(null), 2000)
    })
  }

  const activeCount = payments.filter((p) => p.status === 'pending').length
  const paidCount = payments.filter((p) => p.status === 'succeeded').length
  const conversionRate = payments.length ? Math.round((paidCount / payments.length) * 100) : 0

  return (
    <div className="grid grid-cols-12 gap-lg">
      {/* KPI Bar */}
      <div className="col-span-12 grid grid-cols-3 gap-lg mb-xs">
        <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-md flex flex-col gap-xs relative overflow-hidden">
          <div className="absolute right-0 top-0 w-24 h-24 bg-secondary-container/20 rounded-bl-full -z-10" />
          <span className="font-body-sm text-body-sm text-on-surface-variant">Active Links</span>
          <span className="font-display-lg text-display-lg text-on-surface">{activeCount}</span>
          <div className="flex items-center gap-xs text-secondary mt-xs">
            <span className="material-symbols-outlined text-[16px]">link</span>
            <span className="font-label-bold text-label-bold">awaiting payment</span>
          </div>
        </div>
        <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-md flex flex-col gap-xs">
          <span className="font-body-sm text-body-sm text-on-surface-variant">Total Links</span>
          <span className="font-display-lg text-display-lg text-on-surface">{payments.length}</span>
          <div className="w-full bg-surface-container-highest rounded-full h-1 mt-auto">
            <div className="bg-secondary h-1 rounded-full" style={{ width: payments.length ? '100%' : '0%' }} />
          </div>
        </div>
        <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-md flex flex-col gap-xs">
          <span className="font-body-sm text-body-sm text-on-surface-variant">Conversion (Paid)</span>
          <span className="font-display-lg text-display-lg text-on-surface">
            {payments.length ? `${conversionRate}%` : '—'}
          </span>
          <div className="w-full bg-surface-container-highest rounded-full h-1 mt-auto">
            <div className="bg-primary h-1 rounded-full" style={{ width: `${conversionRate}%` }} />
          </div>
        </div>
      </div>

      {/* Generator */}
      <div className="col-span-12 xl:col-span-4 flex flex-col gap-lg">
        <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-lg shadow-[0_2px_8px_rgba(0,0,0,0.02)]">
          <h3 className="font-title-lg text-title-lg text-on-surface mb-md flex items-center gap-sm">
            <span className="material-symbols-outlined text-secondary">add_link</span>
            Generate Payment Link
          </h3>
          <form className="flex flex-col gap-md" onSubmit={handleGenerate}>
            <div className="flex flex-col gap-xs">
              <label className="font-label-bold text-label-bold text-on-surface-variant uppercase">Student Name</label>
              <input
                required
                value={studentName}
                onChange={(e) => setStudentName(e.target.value)}
                placeholder="e.g. Alex Mercer"
                className="w-full border border-outline-variant rounded-lg p-sm bg-surface font-body-md text-on-surface focus:border-secondary focus:ring-1 focus:ring-secondary outline-none transition-colors"
              />
            </div>
            <div className="flex flex-col gap-xs">
              <label className="font-label-bold text-label-bold text-on-surface-variant uppercase">Student ID</label>
              <input
                required
                value={studentId}
                onChange={(e) => setStudentId(e.target.value)}
                placeholder="e.g. STU-1042"
                className="w-full border border-outline-variant rounded-lg p-sm bg-surface font-body-md text-on-surface focus:border-secondary focus:ring-1 focus:ring-secondary outline-none transition-colors"
              />
            </div>
            <div className="flex flex-col gap-xs">
              <label className="font-label-bold text-label-bold text-on-surface-variant uppercase">Phone Number</label>
              <input
                required
                type="tel"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                placeholder="e.g. 0712345678"
                className="w-full border border-outline-variant rounded-lg p-sm bg-surface font-body-md text-on-surface focus:border-secondary focus:ring-1 focus:ring-secondary outline-none transition-colors"
              />
            </div>
            <div className="flex flex-col gap-xs">
              <label className="font-label-bold text-label-bold text-on-surface-variant uppercase">Fee Structure</label>
              <select
                value={feePlan}
                onChange={(e) => setFeePlan(e.target.value)}
                className="w-full border border-outline-variant rounded-lg p-sm bg-surface font-body-md text-on-surface focus:border-secondary focus:ring-1 focus:ring-secondary outline-none transition-colors"
              >
                {Object.keys(FEE_PLANS).map((k) => <option key={k}>{k}</option>)}
              </select>
            </div>
            {isCustom && (
              <div className="flex flex-col gap-xs">
                <label className="font-label-bold text-label-bold text-on-surface-variant uppercase">Amount (TSh)</label>
                <input
                  required
                  type="number"
                  min="1"
                  value={customAmount}
                  onChange={(e) => setCustomAmount(e.target.value)}
                  placeholder="e.g. 1200"
                  className="w-full border border-outline-variant rounded-lg p-sm bg-surface font-body-md text-on-surface focus:border-secondary focus:ring-1 focus:ring-secondary outline-none transition-colors"
                />
              </div>
            )}
            <div className="flex flex-col gap-xs">
              <label className="font-label-bold text-label-bold text-on-surface-variant uppercase">Parent Email</label>
              <input
                required
                type="email"
                value={parentEmail}
                onChange={(e) => setParentEmail(e.target.value)}
                placeholder="parent@email.com"
                className="w-full border border-outline-variant rounded-lg p-sm bg-surface font-body-md text-on-surface focus:border-secondary focus:ring-1 focus:ring-secondary outline-none transition-colors"
              />
            </div>
            <div className="mt-sm p-sm bg-surface-container-low rounded-lg border border-outline-variant/50 flex flex-col gap-xs">
              <div className="flex justify-between items-center">
                <span className="font-body-sm text-on-surface-variant">Amount Due:</span>
                <span className="font-data-mono text-data-mono text-on-surface">
                  {amount ? `TSh ${amount.toLocaleString()}` : '—'}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-body-sm text-on-surface-variant">Currency:</span>
                <span className="font-data-mono text-data-mono text-on-surface">TZS</span>
              </div>
            </div>

            {error && (
              <div className="p-sm bg-error-container rounded-lg text-on-error-container font-body-sm text-body-sm">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading || !studentName || !studentId || !phoneNumber || !parentEmail || !amount}
              className="mt-xs w-full bg-secondary text-on-secondary py-sm rounded-lg font-label-bold text-label-bold uppercase tracking-wide hover:bg-secondary/90 transition-colors shadow-[0_4px_12px_rgba(0,106,106,0.15)] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Generating…' : 'Generate Payment Link'}
            </button>
          </form>

          {result && (
            <div className="mt-md p-md bg-secondary-container/10 border border-secondary/30 rounded-lg">
              <div className="flex items-center gap-xs mb-xs">
                <span className="material-symbols-outlined text-secondary text-[18px]" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
                <p className="font-label-bold text-label-bold text-secondary uppercase">Link Generated!</p>
              </div>
              <p className="font-body-sm text-body-sm text-on-surface-variant mb-sm break-all">
                Status: {result.status}
              </p>
              <button
                onClick={() => copyPayLink(result.payment_id)}
                className="w-full flex items-center justify-center gap-xs py-xs border border-secondary text-secondary rounded font-label-bold text-label-bold hover:bg-secondary/5 transition-colors"
              >
                <span className="material-symbols-outlined text-[16px]">content_copy</span>
                {copied === result.payment_id ? 'Copied!' : 'Copy Payment Link'}
              </button>
            </div>
          )}
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
          </div>
          <div className="overflow-x-auto">
            {paymentsLoading ? (
              <div className="py-2xl text-center font-body-md text-body-md text-on-surface-variant">Loading…</div>
            ) : payments.length === 0 ? (
              <div className="py-2xl text-center font-body-md text-body-md text-on-surface-variant">
                No links yet — generate one to get started.
              </div>
            ) : (
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-surface-container-low border-b border-outline-variant">
                    {['Recipient', 'Amount', 'Status', 'Actions'].map((h, i) => (
                      <th key={h} className={`p-md font-label-bold text-label-bold text-on-surface-variant uppercase${i === 3 ? ' text-right' : ''}`}>
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-outline-variant/50 font-body-sm text-body-sm">
                  {payments.map((row) => (
                    <tr key={row.payment_id} className="hover:bg-surface-container-low/50 transition-colors">
                      <td className="p-md">
                        <div className="flex flex-col">
                          <span className="font-data-mono text-on-surface font-medium">{row.student_name}</span>
                          <span className="text-[12px] text-on-surface-variant">
                            ID: {row.student_id}{row.description ? ` • ${row.description}` : ''}
                          </span>
                        </div>
                      </td>
                      <td className="p-md font-data-mono text-data-mono text-on-surface">TSh {row.amount.toLocaleString()}</td>
                      <td className="p-md">
                        <span className={`px-xs py-[2px] rounded font-label-bold text-[10px] uppercase ${STATUS_STYLES[row.status] || ''}`}>
                          {row.status}
                        </span>
                      </td>
                      <td className="p-md text-right">
                        <div className="flex items-center justify-end gap-xs">
                          <button
                            className="p-xs text-on-surface-variant hover:text-secondary bg-surface-container-high rounded-md transition-colors"
                            title={copied === row.payment_id ? 'Copied!' : 'Copy payment page link'}
                            onClick={() => copyPayLink(row.payment_id)}
                          >
                            <span className="material-symbols-outlined text-[18px]">
                              {copied === row.payment_id ? 'check' : 'content_copy'}
                            </span>
                          </button>
                          {row.snippe_reference ? (
                            <span
                              title="USSD sent to phone"
                              className="p-xs text-secondary bg-secondary-container/20 rounded-md"
                            >
                              <span className="material-symbols-outlined text-[18px]">smartphone</span>
                            </span>
                          ) : row.snippe_link ? (
                            <a
                              href={row.snippe_link}
                              target="_blank"
                              rel="noreferrer"
                              className="p-xs text-on-surface-variant hover:text-primary bg-surface-container-high rounded-md transition-colors"
                              title="Open Snippe checkout"
                            >
                              <span className="material-symbols-outlined text-[18px]">open_in_new</span>
                            </a>
                          ) : null}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
          <div className="p-sm border-t border-outline-variant flex justify-center mt-auto bg-surface">
            <button
              onClick={refreshPayments}
              className="text-secondary font-label-bold text-[12px] hover:underline uppercase tracking-wide flex items-center gap-xs"
            >
              <span className="material-symbols-outlined text-[14px]">refresh</span>
              Refresh
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
