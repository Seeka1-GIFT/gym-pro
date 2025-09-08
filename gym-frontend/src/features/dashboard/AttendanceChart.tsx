import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from 'recharts';
import { format, subDays, startOfDay } from 'date-fns';

interface Attendance {
  id: string;
  memberId: string;
  date: string;
  type: 'check-in' | 'check-out';
}

interface AttendanceChartProps {
  data: Attendance[];
}

export default function AttendanceChart({ data }: AttendanceChartProps) {
  // Generate last 7 days data
  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const date = subDays(new Date(), 6 - i);
    const dateStr = format(startOfDay(date), 'yyyy-MM-dd');
    
    const dayAttendance = data.filter(attendance => 
      attendance.date.startsWith(dateStr)
    ).length;
    
    return {
      date: format(date, 'MMM dd'),
      attendance: dayAttendance,
      fullDate: dateStr
    };
  });

  return (
    <div className="h-80">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={last7Days} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
          <defs>
            <linearGradient id="attendanceGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#3B82F6" stopOpacity={0.8} />
              <stop offset="100%" stopColor="#3B82F6" stopOpacity={0.1} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
          <XAxis 
            dataKey="date" 
            tick={{ fontSize: 12 }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis 
            tick={{ fontSize: 12 }}
            axisLine={false}
            tickLine={false}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: 'rgba(255, 255, 255, 0.95)',
              border: 'none',
              borderRadius: '12px',
              boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)',
              backdropFilter: 'blur(10px)'
            }}
            formatter={(value: number) => [`${value} check-ins`, 'Attendance']}
            labelStyle={{ color: '#374151', fontWeight: '600' }}
          />
          <Area
            type="monotone"
            dataKey="attendance"
            stroke="#3B82F6"
            strokeWidth={3}
            fill="url(#attendanceGradient)"
            dot={{ fill: '#3B82F6', strokeWidth: 2, r: 4 }}
            activeDot={{ r: 6, stroke: '#3B82F6', strokeWidth: 2 }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
