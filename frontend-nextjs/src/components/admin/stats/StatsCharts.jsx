'use client';

import React from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  LineChart, Line, PieChart, Pie, Cell, Legend
} from 'recharts';
import { useTranslations, useLocale } from 'next-intl';

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#06b6d4', '#71717a'];

export const StatsCharts = ({ topWilayas, categoryDistribution, satisfactionTrends }) => {
  const t = useTranslations('admin.statistics');
  const locale = useLocale();
  const isRTL = locale === 'ar';

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white dark:bg-slate-900 p-3 border border-gray-100 dark:border-gray-800 shadow-xl rounded-lg text-sm">
          <p className="font-semibold text-gray-900 dark:text-white mb-1">{label}</p>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full" style={{ backgroundColor: payload[0].fill || payload[0].color }}></span>
            <span className="text-gray-600 dark:text-gray-400">{payload[0].value} {t('map_requests', { count: payload[0].value }).split(' ')[1]}</span>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 w-full">
      {/* Top Wilayas - Bar Chart */}
      <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm transition-all hover:shadow-md">
        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
          <span className="w-1.5 h-6 bg-primary-500 rounded-full"></span>
          {t('charts.top_wilayas')}
        </h3>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={topWilayas} layout="vertical" margin={{ left: 20, right: 30 }}>
              <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#e2e8f0" opacity={0.5} />
              <XAxis type="number" hide />
              <YAxis 
                dataKey="name" 
                type="category" 
                orientation={isRTL ? 'right' : 'left'}
                tick={{ fill: 'currentColor', fontSize: 12 }}
                width={80}
              />
              {/* eslint-disable-next-line react-hooks/static-components */}
              <Tooltip content={<CustomTooltip />} cursor={{ fill: '#f1f5f9', opacity: 0.4 }} />
              <Bar dataKey="requests" fill="#3b82f6" radius={[0, 4, 4, 0]} barSize={20} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Category Distribution - Pie/Donut Chart */}
      <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm transition-all hover:shadow-md">
        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
          <span className="w-1.5 h-6 bg-secondary-500 rounded-full"></span>
          {t('charts.requests_by_category')}
        </h3>
        <div className="h-[300px] w-full flex flex-col md:flex-row items-center">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={categoryDistribution}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={5}
                dataKey="value"
              >
                {categoryDistribution.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} className="hover:opacity-80 transition-opacity" />
                ))}
              </Pie>
              <Tooltip />
              <Legend verticalAlign="middle" align={isRTL ? 'left' : 'right'} layout="vertical" />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Satisfaction Trend - Line Chart */}
      <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm transition-all hover:shadow-md lg:col-span-2">
        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
          <span className="w-1.5 h-6 bg-yellow-500 rounded-full"></span>
          {t('charts.satisfaction_trends')}
        </h3>
        <div className="h-[350px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={satisfactionTrends} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="colorRating" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.1}/>
                  <stop offset="95%" stopColor="#f59e0b" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" opacity={0.5} />
              <XAxis 
                dataKey="month" 
                tick={{ fill: 'currentColor', fontSize: 11 }}
                reversed={isRTL}
              />
              <YAxis 
                domain={[0, 5]} 
                orientation={isRTL ? 'right' : 'left'}
                tick={{ fill: 'currentColor', fontSize: 11 }}
              />
              <Tooltip
                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' }}
              />
              <Line 
                type="monotone" 
                dataKey="rating" 
                stroke="#f59e0b" 
                strokeWidth={3} 
                dot={{ fill: '#f59e0b', strokeWidth: 2, r: 4, stroke: '#fff' }}
                activeDot={{ r: 6, strokeWidth: 0 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default StatsCharts;
