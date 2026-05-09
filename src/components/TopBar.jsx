export default function TopBar() {
  return (
    <header className="bg-surface h-16 fixed top-0 right-0 w-[calc(100%-260px)] z-40 border-b border-outline-variant flex items-center justify-between px-lg">
      {/* Left */}
      <div className="flex items-center gap-lg w-1/3">
        <span className="font-headline-md text-headline-md text-on-surface whitespace-nowrap">Fee Portal</span>
        <div className="relative w-full max-w-xs hidden md:block">
          <span className="material-symbols-outlined absolute left-sm top-1/2 -translate-y-1/2 text-outline text-[20px]">
            search
          </span>
          <input
            type="text"
            placeholder="Search students, invoices..."
            className="w-full pl-xl pr-sm py-2 bg-surface-container-low border border-outline-variant rounded-lg focus:outline-none focus:border-secondary focus:ring-1 focus:ring-secondary font-body-sm text-body-sm text-on-surface placeholder:text-outline transition-colors"
          />
        </div>
      </div>

      {/* Right */}
      <div className="flex items-center gap-md">
        <div className="flex items-center text-on-surface-variant gap-xs">
          <button className="w-10 h-10 rounded-full hover:bg-surface-container-high hover:text-secondary transition-colors flex items-center justify-center">
            <span className="material-symbols-outlined">notifications</span>
          </button>
          <button className="w-10 h-10 rounded-full hover:bg-surface-container-high hover:text-secondary transition-colors flex items-center justify-center">
            <span className="material-symbols-outlined">help_outline</span>
          </button>
        </div>
        <div className="h-6 w-px bg-outline-variant mx-xs" />
        <button className="px-md py-xs border border-outline text-on-surface font-label-bold text-label-bold rounded-lg hover:bg-surface-container transition-colors uppercase">
          Export Data
        </button>
        <button className="px-md py-xs bg-secondary text-on-secondary font-label-bold text-label-bold rounded-lg hover:bg-secondary/90 shadow-sm transition-colors uppercase flex items-center gap-xs">
          <span className="material-symbols-outlined text-[18px]">add</span>
          New Transaction
        </button>
        <div className="w-9 h-9 rounded-full bg-surface-container-highest border border-outline-variant overflow-hidden ml-xs shrink-0">
          <div className="w-full h-full bg-secondary-container flex items-center justify-center">
            <span className="font-label-bold text-label-bold text-on-secondary-container">JD</span>
          </div>
        </div>
      </div>
    </header>
  )
}
