'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import {
  LayoutDashboard,
  Users,
  ClipboardList,
  Bell,
  Settings
} from 'lucide-react'

const navigation = [
  { name: 'Dashboard', href: '/hr-dashboard', icon: LayoutDashboard },
  { name: 'Employees', href: '/hr-dashboard/employees', icon: Users },
  { name: 'Reviews', href: '/hr-dashboard/reviews', icon: ClipboardList },
  { name: 'Notifications', href: '/hr-dashboard/notifications', icon: Bell },
  { name: 'Settings', href: '/hr-dashboard/settings', icon: Settings },
]

export function Sidebar() {
  const pathname = usePathname()

  return (
    <div className="fixed inset-y-0 left-0 w-64 bg-white border-r border-gray-200 pb-4 flex flex-col">
      <div className="px-6 py-6">
        <h2 className="text-2xl font-semibold text-gray-800">SMCT Group</h2>
        <p className="text-sm text-gray-500">Performance Review</p>
      </div>
      
      <nav className="flex-1 px-4 space-y-1">
        {navigation.map((item) => {
          const Icon = item.icon
          const isActive = pathname === item.href
          
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                'flex items-center gap-x-3 px-3 py-2 text-sm rounded-lg',
                isActive
                  ? 'bg-gray-100 text-gray-900'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              )}
            >
              <Icon className="h-5 w-5" />
              {item.name}
            </Link>
          )
        })}
      </nav>
    </div>
  )
} 