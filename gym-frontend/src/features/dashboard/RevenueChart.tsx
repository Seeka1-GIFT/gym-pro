import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { format, startOfMonth, endOfMonth, eachDayOfInterval } from 'date-fns';

interface Payment {
  id: string;
  amount: number;
  date: string;
  memberId: string;
  method: 'cash' | 'card' | 'mobile';
  status: 'paid' | 'unpaid';
}

interface RevenueChartProps {
  data: Payment[];
}

export default function RevenueChart({ data }: RevenueChartProps) {
  // Group payments by day for the current month
  const currentMonth = new Date();
  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd });

  const revenueData = daysInMonth.map(day => {
    const dayStr = format(day, 'yyyy-MM-dd');
    const dayRevenue = data
      .filter(payment => payment.date.startsWith(dayStr) && payment.status === 'paid')
      .reduce((sum, payment) => sum + payment.amount, 0);
    
    return {
      date: format(day, 'MMM dd'),
      revenue: dayRevenue,
      fullDate: dayStr
    };
  });

  return (
    <div className="h-80">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={revenueData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
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
            tickFormatter={(value) => `$${value}`}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: 'rgba(255, 255, 255, 0.95)',
              border: 'none',
              borderRadius: '12px',
              boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)',
              backdropFilter: 'blur(10px)'
            }}
            formatter={(value: number) => [`$${value.toLocaleString()}`, 'Revenue']}
            labelStyle={{ color: '#374151', fontWeight: '600' }}
          />
          <Bar 
            dataKey="revenue" 
            fill="url(#revenueGradient)"
            radius={[4, 4, 0, 0]}
            className="hover:opacity-80 transition-opacity"
          />
          <defs>
            <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#10B981" stopOpacity={0.8} />
              <stop offset="100%" stopColor="#059669" stopOpacity={0.6} />
            </linearGradient>
          </defs>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
