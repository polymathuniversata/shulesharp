import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { getPayment, initiatePayment } from '../lib/api'

export default function PayStudentFees() {
  const [searchParams] = useSearchParams()
  const paymentId = searchParams.get('payment_id')

  const [payment, setPayment] = useState(null)
  const [loading, setLoading] = useState(!!paymentId)
  const [error, setError] = useState(null)
  const [method, setMethod] = useState('mtn')
  const [ussdSent, setUssdSent] = useState(false)
  const [initiating, setInitiating] = useState(false)
  const [initiateError, setInitiateError] = useState(null)

  useEffect(() => {
    if (!paymentId) return
    getPayment(paymentId)
      .then((res) => setPayment(res.data))
      .catch(() => setError('Payment not found or this link has expired.'))
      .finally(() => setLoading(false))
  }, [paymentId])

  async function handlePay() {
    if (payment?.snippe_link) {
      window.location.href = payment.snippe_link
      return
    }
    setInitiateError(null)
    setInitiating(true)
    try {
      await initiatePayment(paymentId)
      setUssdSent(true)
    } catch (err) {
      setInitiateError(err.response?.data?.detail || 'Failed to send payment request. Please try again.')
    } finally {
      setInitiating(false)
    }
  }

  const studentName = payment?.student_name ?? 'Alex Mercer'
  const studentId = payment?.student_id ?? '2023-8849'
  const totalAmount = payment?.amount ?? 1050
  const description = payment?.description ?? 'Term 2 Fee Payment'
  const isPaid = payment?.status === 'succeeded'

  return (
    <div className="min-h-screen bg-surface-container-low flex flex-col items-center justify-center p-md">
      {/* Centered shell — wide on desktop, full-width on mobile */}
      <div className="w-full max-w-3xl bg-surface-container-lowest rounded-2xl shadow-md border border-outline-variant/30 overflow-hidden">

        {/* ── Top banner (full-width) ── */}
        <div className="bg-primary text-on-primary px-xl py-lg flex items-center gap-lg">
          <div className="w-14 h-14 shrink-0 bg-white/15 rounded-full flex items-center justify-center">
            <span className="material-symbols-outlined text-on-primary text-[28px]" style={{ fontVariationSettings: "'FILL' 1" }}>
              school
            </span>
          </div>
          <div>
            <h1 className="font-headline-sm text-headline-sm leading-tight">Springfield High School</h1>
            <p className="font-body-sm text-body-sm opacity-75 mt-[2px]">{description}</p>
          </div>
          <div className="ml-auto flex items-center gap-xs opacity-70">
            <span className="material-symbols-outlined text-[16px]">verified_user</span>
            <span className="font-label-bold text-[11px] uppercase tracking-wider">Secured by EduPay</span>
          </div>
        </div>

        {/* ── Loading ── */}
        {loading && (
          <div className="py-3xl text-center font-body-md text-body-md text-on-surface-variant">
            Loading payment details…
          </div>
        )}

        {/* ── Error ── */}
        {!loading && error && (
          <div className="py-3xl px-xl text-center">
            <span className="material-symbols-outlined text-error text-[56px] block mb-md">error_outline</span>
            <p className="font-title-lg text-title-lg text-on-surface mb-xs">Link Unavailable</p>
            <p className="font-body-md text-body-md text-on-surface-variant">{error}</p>
          </div>
        )}

        {/* ── Already paid ── */}
        {!loading && !error && isPaid && (
          <div className="py-3xl px-xl text-center">
            <span
              className="material-symbols-outlined text-secondary text-[64px] block mb-md"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              check_circle
            </span>
            <p className="font-title-lg text-title-lg text-on-surface">Payment Received</p>
            <p className="font-body-sm text-body-sm text-on-surface-variant mt-xs">
              This payment has already been completed. Thank you!
            </p>
          </div>
        )}

        {/* ── Main content: two columns on md+, stacked on mobile ── */}
        {!loading && !error && !isPaid && (
          <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-outline-variant/30">

            {/* Left: student + fee details */}
            <div className="p-xl flex flex-col gap-lg">
              {/* Student card */}
              <div>
                <p className="font-label-bold text-label-bold text-on-surface-variant uppercase tracking-wider mb-sm">
                  Student
                </p>
                <div className="bg-surface-container-low rounded-xl p-md flex items-center gap-md">
                  <div className="w-12 h-12 rounded-full bg-secondary-container flex items-center justify-center shrink-0">
                    <span className="material-symbols-outlined text-secondary text-[22px]" style={{ fontVariationSettings: "'FILL' 1" }}>person</span>
                  </div>
                  <div>
                    <p className="font-title-md text-title-md text-on-surface leading-tight">{studentName}</p>
                    <p className="font-body-sm text-body-sm text-on-surface-variant mt-[2px] flex items-center gap-xs">
                      <span className="material-symbols-outlined text-[14px]">badge</span>
                      {studentId}
                    </p>
                  </div>
                </div>
              </div>

              {/* Fee breakdown */}
              <div>
                <p className="font-label-bold text-label-bold text-on-surface-variant uppercase tracking-wider mb-sm">
                  Fee Breakdown
                </p>
                <div className="bg-surface-container-low rounded-xl overflow-hidden divide-y divide-outline-variant/30">
                  <div className="px-md py-sm flex justify-between items-center">
                    <span className="font-body-md text-body-md text-on-surface">{description}</span>
                    <span className="font-data-mono text-data-mono text-on-surface">TSh {totalAmount.toLocaleString()}</span>
                  </div>
                  <div className="px-md py-sm flex justify-between items-center bg-secondary-container/10">
                    <span className="font-label-bold text-label-bold text-on-surface uppercase tracking-wide">Total Due</span>
                    <span className="font-display-sm text-display-sm text-secondary">TSh {totalAmount.toLocaleString()}</span>
                  </div>
                </div>
              </div>

              {/* Currency badge */}
              <div className="flex items-center gap-xs text-on-surface-variant font-body-sm text-body-sm opacity-60">
                <span className="material-symbols-outlined text-[16px]">public</span>
                <span>Currency: TZS · Tanzania Shilling</span>
              </div>
            </div>

            {/* Right: payment action */}
            <div className="p-xl flex flex-col gap-lg">
              <div>
                <p className="font-title-lg text-title-lg text-on-surface mb-xs">Complete Payment</p>
                <p className="font-body-sm text-body-sm text-on-surface-variant">
                  Select your mobile money provider and confirm the USSD prompt on your phone.
                </p>
              </div>

              {ussdSent ? (
                <div className="flex-1 flex flex-col items-center justify-center gap-md py-xl text-center bg-secondary-container/10 rounded-xl border border-secondary/20">
                  <span
                    className="material-symbols-outlined text-secondary text-[56px]"
                    style={{ fontVariationSettings: "'FILL' 1" }}
                  >
                    smartphone
                  </span>
                  <div>
                    <p className="font-title-lg text-title-lg text-on-surface">Check Your Phone</p>
                    <p className="font-body-sm text-body-sm text-on-surface-variant mt-xs max-w-[240px] mx-auto">
                      A USSD prompt has been sent. Follow the on-screen instructions to approve TSh {totalAmount.toLocaleString()}.
                    </p>
                  </div>
                  <p className="font-body-sm text-body-sm text-on-surface-variant opacity-60 text-[12px]">
                    This page updates automatically once confirmed.
                  </p>
                </div>
              ) : (
                <>
                  {/* Provider selector */}
                  <div>
                    <p className="font-label-bold text-label-bold text-on-surface-variant uppercase tracking-wider mb-sm">
                      Mobile Money Provider
                    </p>
                    <div className="grid grid-cols-2 gap-sm">
                      {[
                        { id: 'mtn', label: 'MTN MoMo', icon: 'signal_cellular_alt' },
                        { id: 'airtel', label: 'Airtel Money', icon: 'signal_cellular_alt' },
                      ].map(({ id, label, icon }) => (
                        <label
                          key={id}
                          className={`flex flex-col items-center justify-center p-md border-2 rounded-xl cursor-pointer transition-all gap-xs ${
                            method === id
                              ? 'border-secondary bg-secondary-container/15 shadow-sm'
                              : 'border-outline-variant hover:bg-surface-container-high'
                          }`}
                        >
                          <input
                            type="radio"
                            name="payment_method"
                            value={id}
                            checked={method === id}
                            onChange={() => setMethod(id)}
                            className="sr-only"
                          />
                          <span className={`material-symbols-outlined text-[28px] ${method === id ? 'text-secondary' : 'text-on-surface-variant'}`}>
                            {icon}
                          </span>
                          <span className={`font-label-bold text-label-bold ${method === id ? 'text-secondary' : 'text-on-surface-variant'}`}>
                            {label}
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Pay button */}
                  <div className="mt-auto flex flex-col gap-sm">
                    <button
                      onClick={handlePay}
                      disabled={!payment || payment.status !== 'pending' || initiating}
                      className="w-full bg-secondary text-on-secondary font-title-md text-title-md py-md rounded-xl flex items-center justify-center gap-sm hover:bg-secondary/90 active:scale-[0.98] transition-all shadow-[0_4px_16px_rgba(0,106,106,0.2)] disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none"
                    >
                      <span className="material-symbols-outlined">lock</span>
                      {initiating ? 'Sending request…' : `Pay TSh ${totalAmount.toLocaleString()} Securely`}
                    </button>
                    {initiateError && (
                      <p className="text-center font-body-sm text-body-sm text-error">{initiateError}</p>
                    )}
                    <p className="text-center font-body-sm text-body-sm text-on-surface-variant flex items-center justify-center gap-xs opacity-60 text-[12px]">
                      <span className="material-symbols-outlined text-[14px]">verified_user</span>
                      Payments processed securely via Snippe
                    </p>
                  </div>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
