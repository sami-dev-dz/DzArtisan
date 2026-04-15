"use client"

import * as React from "react"
import {
  LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, Legend, ResponsiveContainer, Cell
} from "recharts"

// Custom Tooltip style
const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null
  return (
    <div className="bg-white dark:bg-slate-800 border border-slate-100 dark:border-white/10 rounded-2xl shadow-2xl p-4 text-xs font-bold">
      <p className="text-slate-400 uppercase tracking-widest mb-2">{label}</p>
      {payload.map((entry) => (
        <div key={entry.dataKey} className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full" style={{ background: entry.color }} />
          <span className="text-slate-900 dark:text-white">{entry.name}: <strong>{entry.value}</strong></span>
        </div>
      ))}
    </div>
  )
}

export function RegistrationsChart({ data }) {
  return (
    <div className="bg-white/80 dark:bg-slate-900/40 backdrop-blur-xl rounded-[32px] border border-slate-100 dark:border-white/5 p-6 shadow-xl">
      <div className="mb-6">
        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Nouvelles inscriptions</p>
        <h3 className="text-lg font-black text-slate-900 dark:text-white mt-0.5">Par semaine — 8 dernières semaines</h3>
      </div>
      <ResponsiveContainer width="100%" height={260}>
        <LineChart data={data} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="currentColor" className="text-slate-100 dark:text-white/5" />
          <XAxis
            dataKey="week"
            tick={{ fontSize: 11, fontWeight: 700, fill: "currentColor" }}
            className="text-slate-400"
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            tick={{ fontSize: 11, fontWeight: 700, fill: "currentColor" }}
            className="text-slate-400"
            axisLine={false}
            tickLine={false}
            allowDecimals={false}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend
            formatter={(value) => (
              <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">
                {value === "clients" ? "Clients" : "Artisans"}
              </span>
            )}
          />
          <Line
            type="monotone"
            dataKey="clients"
            name="clients"
            stroke="#3b82f6"
            strokeWidth={2.5}
            dot={{ r: 4, fill: "#3b82f6", strokeWidth: 0 }}
            activeDot={{ r: 6 }}
          />
          <Line
            type="monotone"
            dataKey="artisans"
            name="artisans"
            stroke="#10b981"
            strokeWidth={2.5}
            dot={{ r: 4, fill: "#10b981", strokeWidth: 0 }}
            activeDot={{ r: 6 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}

const WILAYA_COLORS = [
  "#3b82f6", "#6366f1", "#8b5cf6", "#a855f7", "#ec4899",
  "#f43f5e", "#f97316", "#eab308", "#22c55e", "#06b6d4",
]

export function WilayaBarChart({ data }) {
  return (
    <div className="bg-white/80 dark:bg-slate-900/40 backdrop-blur-xl rounded-[32px] border border-slate-100 dark:border-white/5 p-6 shadow-xl">
      <div className="mb-6">
        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Demandes d&apos;intervention</p>
        <h3 className="text-lg font-black text-slate-900 dark:text-white mt-0.5">Top 10 Wilayas actives</h3>
      </div>
      <ResponsiveContainer width="100%" height={260}>
        <BarChart data={data} layout="vertical" margin={{ top: 0, right: 10, left: 30, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="currentColor" className="text-slate-100 dark:text-white/5" />
          <XAxis
            type="number"
            tick={{ fontSize: 11, fontWeight: 700, fill: "currentColor" }}
            className="text-slate-400"
            axisLine={false}
            tickLine={false}
            allowDecimals={false}
          />
          <YAxis
            type="category"
            dataKey="wilaya"
            tick={{ fontSize: 11, fontWeight: 700, fill: "currentColor" }}
            className="text-slate-400"
            axisLine={false}
            tickLine={false}
            width={80}
          />
          <Tooltip content={<CustomTooltip />} />
          <Bar dataKey="count" name="Demandes" radius={[0, 8, 8, 0]}>
            {data?.map((_, i) => (
              <Cell key={i} fill={WILAYA_COLORS[i % WILAYA_COLORS.length]} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
