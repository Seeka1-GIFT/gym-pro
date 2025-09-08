import { useTheme } from '../hooks/useTheme';
import { useAuth } from '../features/auth/AuthContext';
import { motion } from 'framer-motion';
import { Sun, Moon, Bell, Search, User, LogOut } from 'lucide-react';

/**
 * Top bar with welcome message and theme toggle.
 */
export default function AppTopbar() {
  const { theme, toggle } = useTheme();
  const auth = useAuth();
  
  return (
    <motion.header 
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="sticky top-0 z-40 border-b border-slate-200/50 bg-white/80 backdrop-blur-md dark:border-slate-700/50 dark:bg-slate-900/80"
    >
      <div className="container flex h-16 items-center justify-between">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="flex items-center gap-4"
        >
          <h1 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
            Welcome back, {auth.user?.name?.split(' ')[0] || 'User'}! 👋
          </h1>
          <div className="hidden md:block text-sm text-slate-500 dark:text-slate-400">
            {new Date().toLocaleDateString('en-US', { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}
          </div>
        </motion.div>
        
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="flex items-center gap-3"
        >
          {/* Search */}
          <div className="relative hidden md:block">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search..."
              className="w-64 rounded-xl border border-slate-300 bg-white/80 pl-10 pr-4 py-2 text-sm outline-none transition-all duration-300 focus:border-primary-400 focus:ring-2 focus:ring-primary-300 dark:border-slate-600 dark:bg-slate-800/80 dark:focus:border-primary-500 dark:focus:ring-primary-600"
            />
          </div>
          
          {/* Notifications */}
          <button className="relative rounded-xl bg-slate-100 p-2 text-slate-600 transition-all duration-300 hover:bg-slate-200 hover:text-slate-900 dark:bg-slate-800 dark:text-slate-400 dark:hover:bg-slate-700 dark:hover:text-slate-100">
            <Bell className="h-5 w-5" />
            <span className="absolute -top-1 -right-1 h-3 w-3 rounded-full bg-red-500 text-xs"></span>
          </button>
          
          {/* User Profile or Login Button */}
          {!auth.ready ? null : auth.user ? (
            <div className="flex items-center gap-2">
              <button className="flex items-center gap-2 rounded-xl bg-slate-100 px-3 py-2 text-slate-600 transition-all duration-300 hover:bg-slate-200 hover:text-slate-900 dark:bg-slate-800 dark:text-slate-400 dark:hover:bg-slate-700 dark:hover:text-slate-100">
                <div className="h-8 w-8 rounded-full bg-gradient-to-r from-primary-500 to-primary-600 flex items-center justify-center">
                  <span className="text-sm font-bold text-white">
                    {auth.user?.avatar || auth.user?.name?.charAt(0) || <User className="h-4 w-4" />}
                  </span>
                </div>
                <span className="hidden md:block text-sm font-medium">{auth.user?.name || 'User'}</span>
              </button>
              <button
                onClick={auth.logout}
                className="flex items-center gap-2 rounded-xl bg-red-100 px-3 py-2 text-red-600 transition-all duration-300 hover:bg-red-200 hover:text-red-900 dark:bg-red-900/20 dark:text-red-400 dark:hover:bg-red-900/40 dark:hover:text-red-300"
                title="Logout"
              >
                <LogOut className="h-4 w-4" />
                <span className="hidden md:block text-sm font-medium">Logout</span>
              </button>
            </div>
          ) : (
            <a
              href="/login"
              className="btn flex items-center gap-2"
            >
              <User className="h-4 w-4" />
              Login
            </a>
          )}
          
          {/* Theme Toggle */}
          <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            aria-label="Toggle theme" 
            className="rounded-xl bg-slate-100 p-2 text-slate-600 transition-all duration-300 hover:bg-slate-200 hover:text-slate-900 dark:bg-slate-800 dark:text-slate-400 dark:hover:bg-slate-700 dark:hover:text-slate-100" 
            onClick={toggle}
          >
            {theme === 'light' ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
          </motion.button>
        </motion.div>
      </div>
    </motion.header>
  );
}