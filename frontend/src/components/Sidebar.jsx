import { NavLink } from 'react-router-dom'

const navItems = [
  { to: '/dashboard', icon: 'dashboard', label: 'Dashboard' },
  { to: '/students', icon: 'group', label: 'Students' },
  { to: '/fee-structures', icon: 'account_balance_wallet', label: 'Fee Structures' },
  { to: '/payment-links', icon: 'link', label: 'Payment Links' },
  { to: '/payments', icon: 'payments', label: 'Payments Tracker' },
  { to: '/reports', icon: 'assessment', label: 'Reports' },
  { to: '/settings', icon: 'settings', label: 'Settings' },
]

export default function Sidebar() {
  return (
    <aside className="bg-primary w-sidebar_width h-screen fixed left-0 top-0 flex flex-col py-lg z-50">
      {/* Brand */}
      <div className="px-lg mb-xl">
        <div className="flex items-center gap-sm">
          <div className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center shrink-0">
            <span className="material-symbols-outlined text-on-secondary" style={{ fontVariationSettings: "'FILL' 1" }}>
              account_balance
            </span>
          </div>
          <div>
            <h1 className="font-headline-md text-headline-md text-on-primary m-0 p-0">EduPay Bursar</h1>
            <p className="font-body-sm text-body-sm text-on-primary-container/70 m-0 p-0">Administrative Portal</p>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 flex flex-col gap-xs px-sm overflow-y-auto">
        {navItems.map(({ to, icon, label }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              isActive
                ? 'flex items-center gap-md px-md py-sm border-l-4 border-secondary bg-secondary-container/10 text-secondary font-label-bold text-label-bold transition-all duration-200'
                : 'flex items-center gap-md px-md py-sm border-l-4 border-transparent text-on-primary-container/70 font-body-md text-body-md hover:bg-secondary-container/5 hover:text-secondary transition-all duration-200'
            }
          >
            {({ isActive }) => (
              <>
                <span
                  className="material-symbols-outlined"
                  style={{ fontVariationSettings: isActive ? "'FILL' 1" : "'FILL' 0" }}
                >
                  {icon}
                </span>
                <span>{label}</span>
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Support */}
      <div className="px-lg mt-auto pt-lg">
        <button className="w-full flex items-center justify-center gap-sm py-sm rounded-lg border border-on-primary-container/30 text-on-primary-container font-label-bold text-label-bold hover:bg-secondary-container/5 hover:text-secondary transition-colors">
          <span className="material-symbols-outlined text-[18px]">help_center</span>
          Support Center
        </button>
      </div>
    </aside>
  )
}
