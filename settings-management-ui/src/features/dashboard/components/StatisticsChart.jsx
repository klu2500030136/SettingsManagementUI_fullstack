import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid
} from "recharts";
import Card from "../../../components/ui/Card";
import { useTheme } from "../../../context/ThemeContext";

const data = [
  { month: "Jan", settings: 20 },
  { month: "Feb", settings: 35 },
  { month: "Mar", settings: 50 },
  { month: "Apr", settings: 40 },
  { month: "May", settings: 65 },
];

function StatisticsChart() {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  
  const textColor = isDark ? '#B3B3B3' : '#64748b';
  const gridColor = isDark ? 'rgba(212,175,55,0.1)' : '#e2e8f0';
  const tooltipBg = isDark ? '#141414' : '#ffffff';
  const tooltipBorder = isDark ? 'rgba(212,175,55,0.25)' : 'none';
  const tooltipColor = isDark ? '#ffffff' : '#0B0B0B';

  return (
    <Card>
      {/* Heading */}
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-xl font-bold font-heading text-surface-900 dark:text-text-main tracking-tight">
          Settings Analytics
        </h2>
        <span className="text-xs font-semibold text-[#0B0B0B] bg-gold-gradient px-3 py-1.5 rounded-full shadow-gold-btn">
          +12% this month
        </span>
      </div>

      {/* Chart */}
      <div className="h-[300px] w-full mt-4">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={gridColor} />
            <XAxis 
              dataKey="month" 
              axisLine={false}
              tickLine={false}
              tick={{ fill: textColor, fontSize: 12, fontWeight: 500 }}
              dy={10}
            />
            <YAxis 
              axisLine={false}
              tickLine={false}
              tick={{ fill: textColor, fontSize: 12, fontWeight: 500 }}
              dx={-10}
            />
            <Tooltip 
              contentStyle={{ 
                borderRadius: '14px', 
                border: `1px solid ${tooltipBorder}`, 
                backgroundColor: tooltipBg,
                color: tooltipColor,
                boxShadow: isDark ? '0 8px 32px rgba(0,0,0,0.45)' : '0 4px 20px -2px rgba(0, 0, 0, 0.1)',
                fontWeight: 600
              }}
              itemStyle={{ color: '#D4AF37' }}
            />
            <Line
              type="monotone"
              dataKey="settings"
              stroke="#D4AF37"
              strokeWidth={4}
              dot={{ r: 4, strokeWidth: 2, fill: isDark ? '#1C1C1C' : '#fff', stroke: '#D4AF37' }}
              activeDot={{ r: 6, strokeWidth: 0, fill: '#FFD700', filter: 'drop-shadow(0 0 8px rgba(212,175,55,0.8))' }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}

export default StatisticsChart;