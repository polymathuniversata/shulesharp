const smallCards = [
  {
    title: 'Science Lab Fee',
    desc: 'Annual fee for biology and chemistry lab materials.',
    icon: 'science',
    items: [
      { label: 'Consumable Materials', amount: 'TSh 50.00' },
      { label: 'Equipment Maintenance', amount: 'TSh 25.00' },
    ],
    total: 'TSh 75.00',
  },
  {
    title: 'Bus Fare – Zone A',
    desc: 'Monthly transportation cost for urban zone routes.',
    icon: 'directions_bus',
    items: [
      { label: 'Transport Base Route', amount: 'TSh 250.00' },
      { label: 'Fuel Surcharge (Q1)', amount: 'TSh 50.00' },
    ],
    total: 'TSh 300.00',
  },
  {
    title: 'Varsity Athletics',
    desc: 'Seasonal registration and uniform fees.',
    icon: 'sports_soccer',
    items: [
      { label: 'League Registration', amount: 'TSh 50.00' },
      { label: 'Uniform & Gear Kit', amount: 'TSh 70.00' },
    ],
    total: 'TSh 120.00',
  },
]

export default function FeeStructures() {
  return (
    <div className="space-y-lg">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-md">
        <div>
          <h2 className="font-headline-md text-headline-md text-on-surface tracking-tight">Fee Structures</h2>
          <p className="font-body-md text-body-md text-on-surface-variant mt-base">
            Manage reusable templates for standard billing cycles and ad-hoc charges.
          </p>
        </div>
        <button className="bg-secondary text-on-secondary px-md py-sm rounded-lg flex items-center justify-center gap-xs hover:bg-secondary/90 transition-all shadow-sm font-body-md text-body-md whitespace-nowrap">
          <span className="material-symbols-outlined text-[20px]">add_circle</span>
          Create New Structure
        </button>
      </div>

      {/* Bento Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-lg">
        {/* Primary Card (spans 2 cols) */}
        <div className="col-span-1 lg:col-span-2 bg-surface-container-lowest border border-outline-variant rounded-xl p-lg flex flex-col shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-secondary-container/20 rounded-bl-full -mr-8 -mt-8 pointer-events-none" />
          <div className="flex justify-between items-start mb-md">
            <div>
              <div className="flex items-center gap-xs mb-xs">
                <span className="bg-secondary-container/30 text-secondary font-label-bold text-label-bold px-xs py-base rounded uppercase tracking-wider">Primary</span>
                <h3 className="font-title-lg text-title-lg text-on-surface">Tuition – Term 1</h3>
              </div>
              <p className="font-body-sm text-body-sm text-on-surface-variant">Standard fall semester comprehensive billing.</p>
            </div>
            <div className="text-right">
              <span className="font-body-sm text-body-sm text-on-surface-variant uppercase tracking-wider">Total Value</span>
              <div className="font-headline-md text-headline-md text-secondary mt-base">TSh 1,250.00</div>
            </div>
          </div>
          <div className="flex-1 mt-md">
            <div className="w-full text-left">
              <div className="flex pb-xs border-b border-surface-variant font-label-bold text-label-bold text-on-surface-variant uppercase tracking-wider">
                <div className="flex-1">Line Item</div>
                <div className="w-32 text-right">Amount</div>
              </div>
              {[
                { label: 'Base Tuition', amount: 'TSh 1,000.00' },
                { label: 'Technology Fee', amount: 'TSh 150.00' },
                { label: 'Student Activity Fee', amount: 'TSh 100.00' },
              ].map((item, i, arr) => (
                <div key={item.label} className={`flex py-sm items-center${i < arr.length - 1 ? ' border-b border-surface-variant/50' : ''}`}>
                  <div className="flex-1 font-body-sm text-body-sm text-on-surface">{item.label}</div>
                  <div className="w-32 text-right font-data-mono text-data-mono text-on-surface">{item.amount}</div>
                </div>
              ))}
            </div>
          </div>
          <div className="mt-lg pt-md border-t border-outline-variant flex items-center justify-end gap-sm opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            <button className="p-xs rounded text-on-surface-variant hover:bg-surface-variant hover:text-on-surface transition-colors" title="Duplicate">
              <span className="material-symbols-outlined text-[20px]">content_copy</span>
            </button>
            <button className="p-xs rounded text-on-surface-variant hover:bg-surface-variant hover:text-on-surface transition-colors" title="Edit">
              <span className="material-symbols-outlined text-[20px]">edit</span>
            </button>
          </div>
        </div>

        {/* Small Cards */}
        {smallCards.map((card) => (
          <div key={card.title} className="col-span-1 bg-surface-container-lowest border border-outline-variant rounded-xl p-lg flex flex-col shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 group">
            <div className="flex justify-between items-start mb-md">
              <div>
                <h3 className="font-title-lg text-title-lg text-on-surface mb-xs">{card.title}</h3>
                <p className="font-body-sm text-body-sm text-on-surface-variant line-clamp-2">{card.desc}</p>
              </div>
              <span className="material-symbols-outlined text-outline">{card.icon}</span>
            </div>
            <div className="my-md py-md border-y border-surface-variant flex flex-col gap-sm flex-1">
              {card.items.map((item) => (
                <div key={item.label} className="flex justify-between items-center">
                  <span className="font-body-sm text-body-sm text-on-surface">{item.label}</span>
                  <span className="font-data-mono text-data-mono text-on-surface-variant">{item.amount}</span>
                </div>
              ))}
            </div>
            <div className="flex justify-between items-end mt-auto">
              <div className="flex gap-xs opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                <button className="p-xs rounded text-on-surface-variant hover:bg-surface-variant hover:text-on-surface transition-colors">
                  <span className="material-symbols-outlined text-[18px]">edit</span>
                </button>
              </div>
              <div className="text-right">
                <span className="font-body-sm text-body-sm text-on-surface-variant uppercase tracking-wider block mb-base">Total</span>
                <span className="font-title-lg text-title-lg text-on-surface font-semibold">{card.total}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
