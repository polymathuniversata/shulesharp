export default function Settings() {
  return (
    <div className="pb-2xl">
      {/* Header */}
      <div className="mb-xl">
        <h2 className="font-headline-md text-headline-md text-on-surface mb-xs">Settings &amp; Configuration</h2>
        <p className="font-body-md text-body-md text-on-surface-variant">
          Manage institutional details, billing cycles, and administrative access.
        </p>
      </div>

      {/* Bento Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-lg">
        {/* Left Column */}
        <div className="lg:col-span-8 flex flex-col gap-lg">
          {/* Institution Identity */}
          <section className="bg-surface rounded-xl border border-outline-variant p-lg shadow-sm">
            <div className="flex items-center gap-sm border-b border-outline-variant pb-md mb-md">
              <span className="material-symbols-outlined text-secondary">domain</span>
              <h3 className="font-title-lg text-title-lg text-on-surface">Institution Identity</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-lg">
              <div className="md:col-span-1 flex flex-col items-center justify-center p-md border-2 border-dashed border-outline-variant rounded-lg bg-surface-container-lowest text-center hover:bg-surface-variant transition-colors cursor-pointer">
                <div className="w-20 h-20 bg-surface-variant rounded-full mb-md flex items-center justify-center">
                  <span className="material-symbols-outlined text-[32px] text-on-surface-variant">add_photo_alternate</span>
                </div>
                <p className="font-label-bold text-label-bold text-on-surface mb-base">Upload Logo</p>
                <p className="font-body-sm text-body-sm text-on-surface-variant text-[12px]">PNG, JPG up to 2MB</p>
              </div>
              <div className="md:col-span-2 space-y-md">
                <div>
                  <label className="block font-label-bold text-label-bold text-on-surface mb-xs">Institution Name</label>
                  <input
                    type="text"
                    defaultValue="Greenwood International Academy"
                    className="w-full bg-surface-container-lowest border border-outline-variant rounded px-md py-sm font-body-md text-body-md text-on-surface focus:border-secondary focus:ring-1 focus:ring-secondary outline-none transition-colors"
                  />
                </div>
                <div className="grid grid-cols-2 gap-md">
                  <div>
                    <label className="block font-label-bold text-label-bold text-on-surface mb-xs">Registration Number</label>
                    <input
                      type="text"
                      defaultValue="REG-2023-4451"
                      className="w-full bg-surface-container-lowest border border-outline-variant rounded px-md py-sm font-body-md text-body-md text-on-surface focus:border-secondary focus:ring-1 focus:ring-secondary outline-none transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block font-label-bold text-label-bold text-on-surface mb-xs">Contact Email</label>
                    <input
                      type="email"
                      defaultValue="bursar@greenwood.edu"
                      className="w-full bg-surface-container-lowest border border-outline-variant rounded px-md py-sm font-body-md text-body-md text-on-surface focus:border-secondary focus:ring-1 focus:ring-secondary outline-none transition-colors"
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className="mt-lg flex justify-end">
              <button className="px-lg py-sm rounded bg-secondary text-on-secondary font-label-bold text-label-bold hover:bg-secondary/90 transition-colors">
                Save Identity
              </button>
            </div>
          </section>

          {/* Term Calendar */}
          <section className="bg-surface rounded-xl border border-outline-variant p-lg shadow-sm">
            <div className="flex items-center justify-between border-b border-outline-variant pb-md mb-md">
              <div className="flex items-center gap-sm">
                <span className="material-symbols-outlined text-secondary">calendar_month</span>
                <h3 className="font-title-lg text-title-lg text-on-surface">Academic Term Configuration</h3>
              </div>
              <button className="text-secondary font-label-bold text-label-bold hover:underline flex items-center gap-xs">
                <span className="material-symbols-outlined text-[16px]">add</span> New Term
              </button>
            </div>
            <div className="space-y-md">
              {/* Active Term */}
              <div className="border border-secondary/30 rounded-lg p-md bg-secondary/5 relative">
                <div className="absolute top-md right-md bg-secondary text-on-secondary px-sm py-base rounded text-[10px] font-label-bold uppercase tracking-wider">
                  Active Term
                </div>
                <h4 className="font-title-lg text-title-lg text-on-surface mb-sm">Term 1: 2024 Academic Year</h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-md">
                  {[
                    { label: 'Start Date', type: 'date', value: '2024-01-15' },
                    { label: 'End Date', type: 'date', value: '2024-04-12' },
                    { label: 'Fee Deadline', type: 'date', value: '2024-02-01' },
                    { label: 'Late Penalty (%)', type: 'number', value: '5' },
                  ].map(({ label, type, value }) => (
                    <div key={label}>
                      <label className="block font-label-bold text-label-bold text-on-surface-variant mb-xs">{label}</label>
                      <input
                        type={type}
                        defaultValue={value}
                        className="w-full bg-surface border border-outline-variant rounded px-sm py-sm font-body-sm text-body-sm text-on-surface focus:border-secondary outline-none"
                      />
                    </div>
                  ))}
                </div>
              </div>
              {/* Upcoming Term */}
              <div className="border border-outline-variant rounded-lg p-md bg-surface-container-lowest opacity-75 hover:opacity-100 transition-opacity">
                <h4 className="font-title-lg text-title-lg text-on-surface mb-sm">Term 2: 2024 Academic Year</h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-md">
                  {[
                    { label: 'Start Date', type: 'date', value: '2024-05-06' },
                    { label: 'End Date', type: 'date', value: '2024-08-09' },
                    { label: 'Fee Deadline', type: 'date', value: '2024-05-20' },
                    { label: 'Late Penalty (%)', type: 'number', value: '5' },
                  ].map(({ label, type, value }) => (
                    <div key={label}>
                      <label className="block font-label-bold text-label-bold text-on-surface-variant mb-xs">{label}</label>
                      <input
                        type={type}
                        defaultValue={value}
                        className="w-full bg-surface border border-outline-variant rounded px-sm py-sm font-body-sm text-body-sm text-on-surface focus:border-secondary outline-none"
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>
        </div>

        {/* Right Column */}
        <div className="lg:col-span-4 flex flex-col gap-lg">
          {/* Payment Channels */}
          <section className="bg-surface rounded-xl border border-outline-variant p-lg shadow-sm">
            <div className="flex items-center gap-sm border-b border-outline-variant pb-md mb-md">
              <span className="material-symbols-outlined text-secondary">account_balance</span>
              <h3 className="font-title-lg text-title-lg text-on-surface">Payment Channels</h3>
            </div>
            <div className="space-y-md">
              {/* Bank Transfer */}
              <div className="border border-outline-variant rounded p-md bg-surface-container-lowest">
                <div className="flex items-center justify-between mb-sm">
                  <div className="flex items-center gap-sm">
                    <span className="material-symbols-outlined text-on-surface-variant">account_balance</span>
                    <span className="font-body-md text-body-md text-on-surface font-semibold">Bank Transfer</span>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" defaultChecked className="sr-only peer" />
                    <div className="w-9 h-5 bg-outline-variant rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-secondary" />
                  </label>
                </div>
                <div className="text-on-surface-variant font-data-mono text-data-mono text-[12px] bg-surface-variant p-sm rounded">
                  Acct: 0123456789<br />
                  Bank: National Trust Bank
                </div>
                <button className="mt-sm text-secondary font-label-bold text-label-bold hover:underline">Edit Details</button>
              </div>
              {/* Mobile Money */}
              <div className="border border-outline-variant rounded p-md bg-surface-container-lowest">
                <div className="flex items-center justify-between mb-sm">
                  <div className="flex items-center gap-sm">
                    <span className="material-symbols-outlined text-on-surface-variant">smartphone</span>
                    <span className="font-body-md text-body-md text-on-surface font-semibold">Mobile Money API</span>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" defaultChecked className="sr-only peer" />
                    <div className="w-9 h-5 bg-outline-variant rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-secondary" />
                  </label>
                </div>
                <div className="text-on-surface-variant font-body-sm text-body-sm text-[12px] flex items-center gap-xs">
                  <span className="w-2 h-2 rounded-full bg-secondary" /> Active Connection
                </div>
                <button className="mt-sm text-secondary font-label-bold text-label-bold hover:underline">Manage Keys</button>
              </div>
            </div>
          </section>

          {/* Administrators */}
          <section className="bg-surface rounded-xl border border-outline-variant p-lg shadow-sm flex-1">
            <div className="flex items-center justify-between border-b border-outline-variant pb-md mb-md">
              <div className="flex items-center gap-sm">
                <span className="material-symbols-outlined text-secondary">admin_panel_settings</span>
                <h3 className="font-title-lg text-title-lg text-on-surface">Administrators</h3>
              </div>
              <button className="text-secondary hover:bg-secondary/10 p-xs rounded transition-colors">
                <span className="material-symbols-outlined text-[20px]">person_add</span>
              </button>
            </div>
            <div className="space-y-sm">
              {[
                { initials: 'JD', bg: 'bg-primary text-on-primary', name: 'John Doe', role: 'Primary Bursar' },
                { initials: 'AS', bg: 'bg-surface-variant text-on-surface-variant border border-outline-variant', name: 'Alice Smith', role: 'Assistant Bursar' },
              ].map((admin) => (
                <div key={admin.name} className="flex items-center justify-between p-sm hover:bg-surface-variant rounded transition-colors group">
                  <div className="flex items-center gap-sm">
                    <div className={`w-8 h-8 rounded-full ${admin.bg} flex items-center justify-center font-label-bold text-label-bold`}>
                      {admin.initials}
                    </div>
                    <div>
                      <p className="font-body-sm text-body-sm text-on-surface font-semibold">{admin.name}</p>
                      <p className="font-body-sm text-body-sm text-on-surface-variant text-[11px]">{admin.role}</p>
                    </div>
                  </div>
                  <span className="material-symbols-outlined text-outline-variant group-hover:text-secondary cursor-pointer">more_vert</span>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}
