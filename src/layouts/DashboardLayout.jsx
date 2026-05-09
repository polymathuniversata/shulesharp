import { Outlet } from 'react-router-dom'
import Sidebar from '../components/Sidebar'
import TopBar from '../components/TopBar'

export default function DashboardLayout() {
  return (
    <div className="bg-background min-h-screen">
      <Sidebar />
      <TopBar />
      <main className="ml-sidebar_width mt-16 p-lg bg-surface min-h-[calc(100vh-64px)]">
        <div className="max-w-max_container mx-auto">
          <Outlet />
        </div>
      </main>
    </div>
  )
}
