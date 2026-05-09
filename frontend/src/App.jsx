import { Routes, Route, Navigate } from 'react-router-dom'
import DashboardLayout from './layouts/DashboardLayout'
import Dashboard from './pages/Dashboard'
import Students from './pages/Students'
import FeeStructures from './pages/FeeStructures'
import PaymentLinks from './pages/PaymentLinks'
import PaymentsTracker from './pages/PaymentsTracker'
import Reports from './pages/Reports'
import PayStudentFees from './pages/PayStudentFees'
import Settings from './pages/Settings'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      <Route element={<DashboardLayout />}>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/students" element={<Students />} />
        <Route path="/fee-structures" element={<FeeStructures />} />
        <Route path="/payment-links" element={<PaymentLinks />} />
        <Route path="/payments" element={<PaymentsTracker />} />
        <Route path="/reports" element={<Reports />} />
        <Route path="/settings" element={<Settings />} />
      </Route>
      <Route path="/pay" element={<PayStudentFees />} />
    </Routes>
  )
}
