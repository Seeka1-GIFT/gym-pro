import { motion } from 'framer-motion';
import AppSidebar from '../components/AppSidebar';
import AppTopbar from '../components/AppTopbar';
import { Outlet } from 'react-router-dom';

/**
 * Layout component for pages, with top bar and side bar.
 */
export default function AppLayout() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 text-slate-900 dark:from-slate-950 dark:via-slate-900 dark:to-slate-800 dark:text-slate-100 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%239C92AC%22%20fill-opacity%3D%220.05%22%3E%3Ccircle%20cx%3D%2230%22%20cy%3D%2230%22%20r%3D%222%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] dark:opacity-20" />
      
      <AppTopbar />
      <div className="container flex flex-col gap-4 py-4 md:flex-row md:gap-6 md:py-6 relative z-10">
        <motion.aside
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full md:w-auto"
        >
          <AppSidebar />
        </motion.aside>
        <motion.main
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="w-full min-h-screen md:min-h-0"
        >
          <Outlet />
        </motion.main>
      </div>
    </div>
  );
}