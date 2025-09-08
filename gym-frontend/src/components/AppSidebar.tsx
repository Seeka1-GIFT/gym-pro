import { NavLink } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Dumbbell,
  Users,
  CalendarDays,
  Wallet,
  Layers,
  CalendarCheck2,
  Boxes,
  BarChart3,
  Settings,
  LogIn,
  LogOut,
  CreditCard,
  Receipt
} from 'lucide-react';
import { useAuth } from '../features/auth/AuthContext';

const linkClass = 'flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all duration-300 hover:bg-white/20 hover:scale-105 active:scale-95';

export default function AppSidebar() {
  const { user, logout, hasPermission } = useAuth();
  
  // define the navigation items based on user permissions
  const allItems = [
    { to: '/dashboard', label: 'Dashboard', icon: Dumbbell, permission: 'view_dashboard' },
    { to: '/members', label: 'Members', icon: Users, permission: 'manage_members' },
    { to: '/plans', label: 'Plans', icon: Layers, permission: 'manage_plans' },
    { to: '/memberships', label: 'Memberships', icon: CreditCard, permission: 'manage_members' },
    { to: '/attendance', label: 'Attendance', icon: CalendarCheck2, permission: 'manage_attendance' },
    { to: '/payments', label: 'Payments', icon: Wallet, permission: 'manage_payments' },
    { to: '/expenses', label: 'Expenses', icon: Receipt, permission: 'manage_all' },
    { to: '/assets', label: 'Assets', icon: Boxes, permission: 'manage_assets' },
    { to: '/reports', label: 'Reports', icon: BarChart3, permission: 'view_reports' },
    { to: '/settings', label: 'Settings', icon: Settings, permission: 'manage_settings' }
  ];

  const items = allItems.filter(item => hasPermission(item.permission));
  
  return (
    <aside className="w-full md:w-64 shrink-0">
      <div className="card-glass glass h-full">
        <div className="mb-8 flex items-center gap-3">
          <div className="rounded-xl bg-gradient-to-r from-primary-500 to-primary-600 p-2">
            <Dumbbell className="h-6 w-6 text-white" />
          </div>
          <span className="text-xl font-bold bg-gradient-to-r from-primary-600 to-primary-800 bg-clip-text text-transparent">
            GYM PRO
          </span>
        </div>
        
        <nav className="flex flex-col gap-2">
          {items.map(({ to, label, icon: Icon }, index) => (
            <motion.div
              key={to}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              <NavLink
                to={to}
                className={({ isActive }) => 
                  `${linkClass} ${
                    isActive 
                      ? 'bg-gradient-to-r from-primary-500/20 to-primary-600/20 text-primary-700 dark:text-primary-300 border border-primary-200 dark:border-primary-800' 
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
                  }`
                }
              >
                <Icon className="h-5 w-5" />
                {label}
              </NavLink>
            </motion.div>
          ))}
        </nav>
        
        {/* User info section - hide entirely if no authenticated user */}
        {user ? (
          <div className="mt-auto pt-6">
            <div className="rounded-xl bg-gradient-to-r from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-700 p-4">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-gradient-to-r from-primary-500 to-primary-600 flex items-center justify-center">
                  <span className="text-sm font-bold text-white">
                    {user?.avatar || user?.name?.charAt(0) || 'U'}
                  </span>
                </div>
                <div className="flex-1">
                  <div className="text-sm font-medium text-slate-900 dark:text-slate-100">
                    {user?.name || 'User'}
                  </div>
                  <div className="text-xs text-slate-500 dark:text-slate-400 capitalize">
                    {user?.role || ''}
                  </div>
                </div>
                <button
                  onClick={logout}
                  className="p-2 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors"
                  title="Logout"
                >
                  <LogOut className="h-4 w-4 text-slate-600 dark:text-slate-400" />
                </button>
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </aside>
  );
}