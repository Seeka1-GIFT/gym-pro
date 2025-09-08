import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Calendar, Clock, Users, MapPin, Plus, Play, Pause } from 'lucide-react';
import api from '../../lib/api';
type GymClass = { id: string; name: string; coach: string; room: string; start: string; end: string; capacity: number; members: { id: string }[] };
import PageHeader from '../../components/PageHeader';
import DataTable, { Column } from '../../components/DataTable';
import { useAuth } from '../../hooks/useAuth';

/**
 * Classes schedule and list page.
 */
export default function ClassesList() {
  const { hasPermission } = useAuth();
  const classes = useQuery<GymClass[]>({ queryKey: ['classes'], queryFn: async () => (await fetch('/api/classes')).json() });
  
  // Calculate class statistics
  const totalClasses = classes.data?.length || 0;
  const activeClasses = classes.data?.filter(c => {
    const now = new Date();
    const start = new Date(c.start);
    const end = new Date(c.end);
    return now >= start && now <= end;
  }).length || 0;
  const totalEnrolled = classes.data?.reduce((sum, c) => sum + c.members.length, 0) || 0;
  const upcomingClasses = classes.data?.filter(c => new Date(c.start) > new Date()).length || 0;

  type C = GymClass;
  const columns: Column<C>[] = [
    { 
      key: 'name', 
      header: 'Class',
      render: (r) => (
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-gradient-to-r from-primary-500 to-primary-600 flex items-center justify-center">
            <Calendar className="h-5 w-5 text-white" />
          </div>
          <div>
            <div className="font-medium text-slate-900 dark:text-slate-100">{r.name}</div>
            <div className="text-sm text-slate-500 dark:text-slate-400">{r.coach}</div>
          </div>
        </div>
      )
    },
    { 
      key: 'room', 
      header: 'Location',
      render: (r) => (
        <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
          <MapPin className="h-4 w-4" />
          {r.room}
        </div>
      )
    },
    { 
      key: 'capacity', 
      header: 'Capacity',
      render: (r) => (
        <div className="flex items-center gap-2">
          <Users className="h-4 w-4 text-slate-400" />
          <span className="font-medium">{r.members.length}/{r.capacity}</span>
        </div>
      )
    },
    {
      key: 'start',
      header: 'Schedule',
      render: (r) => (
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-sm">
            <Clock className="h-4 w-4 text-slate-400" />
            <span className="font-medium">{new Date(r.start).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
          </div>
          <div className="text-xs text-slate-500 dark:text-slate-400">
            {new Date(r.start).toLocaleDateString()}
          </div>
        </div>
      )
    },
    {
      key: 'members',
      header: 'Status',
      render: (r) => {
        const now = new Date();
        const start = new Date(r.start);
        const end = new Date(r.end);
        const isActive = now >= start && now <= end;
        const isUpcoming = start > now;
        
        return (
          <div className="flex items-center gap-2">
            {isActive ? (
              <>
                <Play className="h-4 w-4 text-green-500" />
                <span className="text-sm font-medium text-green-600 dark:text-green-400">Active</span>
              </>
            ) : isUpcoming ? (
              <>
                <Clock className="h-4 w-4 text-blue-500" />
                <span className="text-sm font-medium text-blue-600 dark:text-blue-400">Upcoming</span>
              </>
            ) : (
              <>
                <Pause className="h-4 w-4 text-slate-500" />
                <span className="text-sm font-medium text-slate-600 dark:text-slate-400">Ended</span>
              </>
            )}
          </div>
        );
      }
    }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="space-y-6"
    >
      <PageHeader
        title="Classes"
        actions={
          hasPermission('manage_classes') ? (
            <motion.button 
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="btn flex items-center gap-2"
            >
              <Plus className="h-4 w-4" />
              Add Class
            </motion.button>
          ) : null
        }
      />

      {/* Class Statistics */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="card"
        >
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-blue-100 dark:bg-blue-900/40">
              <Calendar className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <div className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                {totalClasses}
              </div>
              <div className="text-sm text-slate-600 dark:text-slate-400">
                Total Classes
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="card"
        >
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-green-100 dark:bg-green-900/40">
              <Play className="h-6 w-6 text-green-600 dark:text-green-400" />
            </div>
            <div>
              <div className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                {activeClasses}
              </div>
              <div className="text-sm text-slate-600 dark:text-slate-400">
                Active Now
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="card"
        >
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-purple-100 dark:bg-purple-900/40">
              <Users className="h-6 w-6 text-purple-600 dark:text-purple-400" />
            </div>
            <div>
              <div className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                {totalEnrolled}
              </div>
              <div className="text-sm text-slate-600 dark:text-slate-400">
                Total Enrolled
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="card"
        >
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-orange-100 dark:bg-orange-900/40">
              <Clock className="h-6 w-6 text-orange-600 dark:text-orange-400" />
            </div>
            <div>
              <div className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                {upcomingClasses}
              </div>
              <div className="text-sm text-slate-600 dark:text-slate-400">
                Upcoming
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Classes Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.5 }}
      >
        {classes.isLoading ? (
          <div className="space-y-4">
            <div className="skeleton h-12 w-full" />
            <div className="skeleton h-32 w-full" />
          </div>
        ) : (
          <DataTable 
            data={classes.data ?? []} 
            columns={columns}
            pageSize={10}
          />
        )}
      </motion.div>
    </motion.div>
  );
}