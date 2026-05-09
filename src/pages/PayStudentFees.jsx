import { useState } from 'react'

const feeItems = [
  { label: 'Tuition Fee', amount: 'TSh 850.00' },
  { label: 'Laboratory Fee', amount: 'TSh 120.00' },
  { label: 'Technology Levy', amount: 'TSh 50.00' },
  { label: 'Library Fee', amount: 'TSh 30.00' },
]

export default function PayStudentFees() {
  const [method, setMethod] = useState('mtn')

  return (
    <div className="min-h-screen bg-surface flex flex-col items-center justify-center p-md">
      <div className="w-full max-w-md bg-surface-container-lowest rounded-xl shadow-sm border border-outline-variant/30 overflow-hidden">
        {/* School Header */}
        <div className="bg-primary text-on-primary p-lg text-center flex flex-col items-center justify-center gap-xs">
          <div className="w-16 h-16 bg-surface-container-lowest rounded-full flex items-center justify-center mb-sm">
            <span className="material-symbols-outlined text-primary text-[32px]" style={{ fontVariationSettings: "'FILL' 1" }}>
              school
            </span>
          </div>
          <h1 className="font-headline-md text-headline-md">Springfield High</h1>
          <p className="font-body-sm text-body-sm text-primary-fixed-dim opacity-80">Term 2 Fee Payment</p>
        </div>

        {/* Student Details */}
        <div className="p-md border-b border-outline-variant/30 bg-surface-container-lowest">
          <div className="flex items-start justify-between mb-sm">
            <div>
              <p className="font-label-bold text-label-bold text-on-surface-variant uppercase tracking-wider mb-base">Student</p>
              <p className="font-title-lg text-title-lg text-on-surface">Alex Mercer</p>
            </div>
            <div className="text-right">
              <p className="font-label-bold text-label-bold text-on-surface-variant uppercase tracking-wider mb-base">Grade</p>
              <p className="font-body-md text-body-md text-on-surface">Grade 10 – A</p>
            </div>
          </div>
          <div className="flex items-center gap-xs text-on-surface-variant font-body-sm text-body-sm">
            <span className="material-symbols-outlined text-[18px]">badge</span>
            <span>ID: 2023-8849</span>
          </div>
        </div>

        {/* Fee Breakdown */}
        <div className="p-md bg-surface-container-lowest">
          <p className="font-label-bold text-label-bold text-on-surface-variant uppercase tracking-wider mb-sm">Fee Breakdown</p>
          <div className="space-y-sm font-body-md text-body-md text-on-surface mb-md">
            {feeItems.map((item, i) => (
              <div key={item.label} className={`flex justify-between items-center py-base${i < feeItems.length - 1 ? ' border-b border-outline-variant/20' : ''}`}>
                <span>{item.label}</span>
                <span className="font-data-mono text-data-mono">{item.amount}</span>
              </div>
            ))}
          </div>
          <div className="bg-surface-container-low p-md rounded-lg flex justify-between items-center mt-md">
            <span className="font-title-lg text-title-lg text-on-surface">Total Due</span>
            <span className="font-display-lg text-display-lg text-secondary">TSh 1,050.00</span>
          </div>
        </div>

        {/* Payment Method & Action */}
        <div className="p-md bg-surface-container-lowest border-t border-outline-variant/30">
          <p className="font-label-bold text-label-bold text-on-surface-variant uppercase tracking-wider mb-sm">Select Payment Method</p>
          <div className="grid grid-cols-2 gap-sm mb-lg">
            <label className={`flex items-center justify-center p-sm border-2 rounded-lg cursor-pointer transition-colors ${method === 'mtn' ? 'border-secondary bg-secondary-container/10' : 'border-outline-variant hover:bg-surface-container-high'}`}>
              <input type="radio" name="payment_method" value="mtn" checked={method === 'mtn'} onChange={() => setMethod('mtn')} className="sr-only" />
              <span className={`font-title-lg text-title-lg ${method === 'mtn' ? 'text-secondary' : 'text-on-surface-variant'}`}>MTN MoMo</span>
            </label>
            <label className={`flex items-center justify-center p-sm border-2 rounded-lg cursor-pointer transition-colors ${method === 'airtel' ? 'border-secondary bg-secondary-container/10' : 'border-outline-variant hover:bg-surface-container-high'}`}>
              <input type="radio" name="payment_method" value="airtel" checked={method === 'airtel'} onChange={() => setMethod('airtel')} className="sr-only" />
              <span className={`font-title-lg text-title-lg ${method === 'airtel' ? 'text-secondary' : 'text-on-surface-variant'}`}>Airtel Money</span>
            </label>
          </div>
          <button className="w-full bg-secondary text-on-secondary font-title-lg text-title-lg py-md rounded-lg flex items-center justify-center gap-xs hover:bg-secondary/90 transition-colors shadow-sm">
            <span className="material-symbols-outlined">lock</span>
            Pay TSh 1,050.00 Securely
          </button>
          <p className="text-center font-body-sm text-body-sm text-on-surface-variant mt-sm flex items-center justify-center gap-xs opacity-70">
            <span className="material-symbols-outlined text-[16px]">verified_user</span>
            Secured by EduPay
          </p>
        </div>
      </div>
    </div>
  )
}
