import { useState, useEffect } from 'react'
import { listStudents, createStudent, deleteStudent } from '../lib/api'

const AVATAR_COLORS = [
  { bg: 'bg-secondary-container', text: 'text-on-secondary-container' },
  { bg: 'bg-tertiary-container', text: 'text-on-tertiary-container' },
  { bg: 'bg-primary-container', text: 'text-on-primary-container' },
  { bg: 'bg-surface-container-highest', text: 'text-on-surface' },
]

const TAG_STYLES = {
  'New Admission': 'bg-secondary-container/40 text-on-secondary-container',
  'Returning': 'bg-surface-container-highest text-on-surface-variant',
}

const EMPTY_FORM = {
  student_id: '',
  name: '',
  grade: '',
  guardian_name: '',
  phone_number: '',
  parent_email: '',
  tag: 'New Admission',
}

function getInitials(name) {
  return name.trim().split(/\s+/).map((w) => w[0]).slice(0, 2).join('').toUpperCase()
}

function avatarColor(name) {
  return AVATAR_COLORS[name.charCodeAt(0) % AVATAR_COLORS.length]
}

function Field({ label, children }) {
  return (
    <div className="flex flex-col gap-xs">
      <label className="font-label-bold text-label-bold text-on-surface-variant uppercase tracking-wide text-[11px]">
        {label}
      </label>
      {children}
    </div>
  )
}

const inputCls = 'w-full border border-outline-variant rounded-lg px-sm py-[7px] bg-surface font-body-md text-body-md text-on-surface focus:border-secondary focus:ring-1 focus:ring-secondary outline-none transition-colors'

export default function Students() {
  const [students, setStudents] = useState([])
  const [loading, setLoading] = useState(true)
  const [fetchError, setFetchError] = useState(null)
  const [search, setSearch] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [form, setForm] = useState(EMPTY_FORM)
  const [formLoading, setFormLoading] = useState(false)
  const [formError, setFormError] = useState(null)
  const [confirmDeleteId, setConfirmDeleteId] = useState(null)

  useEffect(() => {
    fetchStudents()
  }, [])

  function fetchStudents() {
    setLoading(true)
    listStudents()
      .then((res) => setStudents(res.data))
      .catch(() => setFetchError('Failed to load students. Is the backend running?'))
      .finally(() => setLoading(false))
  }

  function setField(key, value) {
    setForm((prev) => ({ ...prev, [key]: value }))
  }

  const filtered = students.filter((s) => {
    const q = search.toLowerCase()
    return s.name.toLowerCase().includes(q) || s.student_id.toLowerCase().includes(q)
  })

  async function handleAdd(e) {
    e.preventDefault()
    setFormError(null)
    setFormLoading(true)
    try {
      await createStudent(form)
      setShowModal(false)
      setForm(EMPTY_FORM)
      fetchStudents()
    } catch (err) {
      setFormError(err.response?.data?.detail || 'Failed to add student.')
    } finally {
      setFormLoading(false)
    }
  }

  async function handleDelete(id) {
    try {
      await deleteStudent(id)
      setStudents((prev) => prev.filter((s) => s.id !== id))
    } catch {
      // row stays if delete fails
    } finally {
      setConfirmDeleteId(null)
    }
  }

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
        <button
          onClick={() => { setShowModal(true); setFormError(null); setForm(EMPTY_FORM) }}
          className="bg-secondary text-on-secondary px-lg py-sm rounded-lg font-title-lg text-title-lg hover:bg-secondary/90 transition-colors shadow-sm flex items-center gap-sm"
        >
          <span className="material-symbols-outlined">person_add</span>
          Add Student
        </button>
      </div>

      {/* Table Container */}
      <div className="bg-surface-container-lowest border border-outline-variant rounded-xl flex flex-col shadow-[0_2px_12px_rgba(0,0,0,0.02)] overflow-hidden">
        {/* Filters */}
        <div className="p-md border-b border-outline-variant flex items-center justify-between bg-surface-container-low/50">
          <div className="relative w-[280px]">
            <span className="material-symbols-outlined absolute left-sm top-1/2 -translate-y-1/2 text-outline text-[20px]">search</span>
            <input
              type="text"
              placeholder="Filter by name or ID…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-xl pr-sm py-1.5 bg-surface-container-lowest border border-outline-variant rounded-md focus:outline-none focus:border-secondary focus:ring-1 focus:ring-secondary font-body-sm text-body-sm text-on-surface placeholder:text-outline transition-colors"
            />
          </div>
          <span className="font-body-sm text-body-sm text-on-surface-variant">
            {loading ? 'Loading…' : `${filtered.length} student${filtered.length !== 1 ? 's' : ''}`}
          </span>
        </div>

        {/* Table */}
        <div className="overflow-x-auto flex-1">
          {fetchError ? (
            <div className="py-2xl text-center font-body-md text-body-md text-error">{fetchError}</div>
          ) : loading ? (
            <div className="py-2xl text-center font-body-md text-body-md text-on-surface-variant">Loading…</div>
          ) : filtered.length === 0 ? (
            <div className="py-2xl text-center font-body-md text-body-md text-on-surface-variant">
              {search ? 'No students match your search.' : 'No students yet — add one to get started.'}
            </div>
          ) : (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-outline-variant bg-surface-container-lowest">
                  {['Student Name', 'ID / Class', 'Guardian', 'Contact', ''].map((h) => (
                    <th key={h} className="py-sm px-md font-label-bold text-label-bold text-on-surface-variant uppercase tracking-wider">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="font-body-sm text-body-sm divide-y divide-outline-variant/50">
                {filtered.map((s) => {
                  const color = avatarColor(s.name)
                  const isConfirming = confirmDeleteId === s.id
                  return (
                    <tr key={s.id} className="hover:bg-surface-container-low transition-colors group">
                      {/* Name + tag */}
                      <td className="py-md px-md">
                        <div className="flex items-center gap-sm">
                          <div className={`w-8 h-8 rounded-full ${color.bg} ${color.text} flex items-center justify-center font-title-lg text-title-lg shrink-0`}>
                            {getInitials(s.name)}
                          </div>
                          <div>
                            <p className="font-title-lg text-title-lg text-on-surface m-0 leading-tight">{s.name}</p>
                            <span className={`text-[10px] font-label-bold px-xs py-[1px] rounded ${TAG_STYLES[s.tag] || TAG_STYLES['Returning']}`}>
                              {s.tag}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* ID + grade */}
                      <td className="py-md px-md">
                        <p className="font-data-mono text-data-mono text-on-surface m-0">{s.student_id}</p>
                        <p className="text-on-surface-variant m-0 text-[12px]">{s.grade}</p>
                      </td>

                      {/* Guardian */}
                      <td className="py-md px-md text-on-surface">{s.guardian_name}</td>

                      {/* Contact icons */}
                      <td className="py-md px-md">
                        <div className="flex items-center gap-xs">
                          <a
                            href={`tel:${s.phone_number}`}
                            className="w-8 h-8 rounded-full bg-surface border border-outline-variant flex items-center justify-center text-outline hover:text-secondary hover:border-secondary transition-colors"
                            title={s.phone_number}
                          >
                            <span className="material-symbols-outlined text-[18px]">phone</span>
                          </a>
                          <a
                            href={`mailto:${s.parent_email}`}
                            className="w-8 h-8 rounded-full bg-surface border border-outline-variant flex items-center justify-center text-outline hover:text-secondary hover:border-secondary transition-colors"
                            title={s.parent_email}
                          >
                            <span className="material-symbols-outlined text-[18px]">mail</span>
                          </a>
                        </div>
                      </td>

                      {/* Delete */}
                      <td className="py-md px-md text-right">
                        {isConfirming ? (
                          <div className="flex items-center justify-end gap-xs">
                            <span className="font-body-sm text-body-sm text-on-surface-variant">Delete?</span>
                            <button
                              onClick={() => handleDelete(s.id)}
                              className="px-sm py-[3px] rounded bg-error text-on-error font-label-bold text-[11px] uppercase hover:bg-error/90 transition-colors"
                            >
                              Yes
                            </button>
                            <button
                              onClick={() => setConfirmDeleteId(null)}
                              className="px-sm py-[3px] rounded border border-outline-variant text-on-surface-variant font-label-bold text-[11px] uppercase hover:bg-surface-container transition-colors"
                            >
                              No
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => setConfirmDeleteId(s.id)}
                            className="text-outline hover:text-error transition-colors opacity-0 group-hover:opacity-100 p-1"
                            title="Delete student"
                          >
                            <span className="material-symbols-outlined text-[20px]">delete</span>
                          </button>
                        )}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          )}
        </div>

        {/* Footer */}
        <div className="p-md border-t border-outline-variant bg-surface-container-lowest flex items-center justify-between text-on-surface-variant font-body-sm text-body-sm">
          <span>{students.length} total student{students.length !== 1 ? 's' : ''} on record</span>
          <button
            onClick={fetchStudents}
            className="text-secondary font-label-bold text-[12px] hover:underline uppercase tracking-wide flex items-center gap-xs"
          >
            <span className="material-symbols-outlined text-[14px]">refresh</span>
            Refresh
          </button>
        </div>
      </div>

      {/* Add Student Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-md">
          <div className="bg-surface-container-lowest rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden">
            {/* Modal header */}
            <div className="p-lg border-b border-outline-variant flex items-center justify-between bg-surface-bright">
              <h3 className="font-title-lg text-title-lg text-on-surface flex items-center gap-sm m-0">
                <span className="material-symbols-outlined text-secondary">person_add</span>
                Add Student
              </h3>
              <button
                onClick={() => setShowModal(false)}
                className="w-8 h-8 rounded-full text-on-surface-variant hover:bg-surface-container flex items-center justify-center transition-colors"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleAdd} className="p-lg flex flex-col gap-md">
              <div className="grid grid-cols-2 gap-md">
                <Field label="Student ID">
                  <input
                    required
                    value={form.student_id}
                    onChange={(e) => setField('student_id', e.target.value)}
                    placeholder="e.g. STU-24-001"
                    className={inputCls}
                  />
                </Field>
                <Field label="Type">
                  <select
                    value={form.tag}
                    onChange={(e) => setField('tag', e.target.value)}
                    className={inputCls}
                  >
                    <option>New Admission</option>
                    <option>Returning</option>
                  </select>
                </Field>
              </div>

              <Field label="Full Name">
                <input
                  required
                  value={form.name}
                  onChange={(e) => setField('name', e.target.value)}
                  placeholder="e.g. Sophia Jenkins"
                  className={inputCls}
                />
              </Field>

              <Field label="Grade / Class">
                <input
                  required
                  value={form.grade}
                  onChange={(e) => setField('grade', e.target.value)}
                  placeholder="e.g. Grade 5B"
                  className={inputCls}
                />
              </Field>

              <Field label="Guardian Name">
                <input
                  required
                  value={form.guardian_name}
                  onChange={(e) => setField('guardian_name', e.target.value)}
                  placeholder="e.g. Robert Jenkins"
                  className={inputCls}
                />
              </Field>

              <div className="grid grid-cols-2 gap-md">
                <Field label="Phone Number">
                  <input
                    required
                    type="tel"
                    value={form.phone_number}
                    onChange={(e) => setField('phone_number', e.target.value)}
                    placeholder="e.g. 0712345678"
                    className={inputCls}
                  />
                </Field>
                <Field label="Parent Email">
                  <input
                    required
                    type="email"
                    value={form.parent_email}
                    onChange={(e) => setField('parent_email', e.target.value)}
                    placeholder="parent@email.com"
                    className={inputCls}
                  />
                </Field>
              </div>

              {formError && (
                <div className="p-sm bg-error-container text-on-error-container rounded-lg font-body-sm text-body-sm">
                  {formError}
                </div>
              )}

              <div className="flex gap-sm mt-xs">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 py-sm border border-outline-variant text-on-surface-variant font-label-bold text-label-bold rounded-lg uppercase hover:bg-surface-container transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={formLoading}
                  className="flex-1 py-sm bg-secondary text-on-secondary font-label-bold text-label-bold rounded-lg uppercase hover:bg-secondary/90 transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {formLoading ? 'Saving…' : 'Add Student'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
