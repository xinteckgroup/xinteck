"use client";

import { QuickActions } from "@/components/admin/QuickActions";
import { StatsCard } from "@/components/admin/StatsCard";
import { PageContainer, PageHeader } from "@/components/admin/ui";
import { Activity, Calendar } from "lucide-react";
import { useState } from "react";
import { Area, AreaChart, Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

import { TYPOGRAPHY } from "@/lib/typography";
import { DashboardStat, RecentActivity } from "@/types";

// Prop types for real data
interface DashboardClientProps {
  stats: DashboardStat[];
  activity: RecentActivity[];
  analytics?: any[]; 
}

// Fallback logic handled on the Server Action

export function DashboardClient({ stats, activity, analytics = [] }: DashboardClientProps) {
  const [chartType, setChartType] = useState<"traffic" | "conversion">("traffic");
  const [timeRange, setTimeRange] = useState("7d");

  return (
    <PageContainer>
      <PageHeader 
        title="Dashboard Overview" 
        subtitle="Welcome back, Admin. Analyze your performance metrics."
        actions={
          <div className="flex items-center gap-2 admin-surface-primary p-1 rounded-[8px]">
           {["7d", "30d", "90d"].map((range) => (
             <button 
               key={range}
               onClick={() => setTimeRange(range)}
               className={`px-3 py-1 rounded-[6px] transition-all ${TYPOGRAPHY.button} ${timeRange === range ? "bg-gold text-primary-foreground shadow-sm" : "text-gold hover:text-[var(--admin-text)] hover:text-[var(--admin-text)]"}`}
             >
               {range}
             </button>
           ))}
          </div>
        }
      />
      
      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 md:gap-6">
        {stats.map((stat) => (
          <StatsCard 
            key={stat.title}
            {...stat}
          />
        ))}
      </div>

      {/* Quick Actions */}
      <div>
        <h3 className={`${TYPOGRAPHY.tableHeader} text-[var(--admin-text)] mb-4`}>Quick Actions</h3>
        <QuickActions />
      </div>
      
      <div className="grid lg:grid-cols-3 gap-3 md:gap-6">
        {/* Main Chart */}
        <div className="lg:col-span-2 p-3 md:p-6 rounded-[10px] admin-surface-primary backdrop-blur-xs min-h-[280px] md:min-h-[450px] flex flex-col w-full overflow-hidden">
          <div className="flex justify-between items-center mb-6">
            <div className="flex gap-4">
              <button 
                onClick={() => setChartType("traffic")}
                className={`border-b-2 pb-1 transition-colors ${TYPOGRAPHY.button} ${chartType === "traffic" ? "text-[var(--admin-text)] border-gold" : "text-[var(--admin-muted)] border-transparent hover:text-[var(--admin-text)]"}`}
              >
                Traffic Trends
              </button>
              <button 
                onClick={() => setChartType("conversion")}
                className={`border-b-2 pb-1 transition-colors ${TYPOGRAPHY.button} ${chartType === "conversion" ? "text-[var(--admin-text)] border-gold" : "text-[var(--admin-muted)] border-transparent hover:text-[var(--admin-text)]"}`}
              >
                Lead Conversion
              </button>
            </div>
            
            <div className={`hidden md:flex items-center gap-2 ${TYPOGRAPHY.meta} text-[var(--admin-text)]`}>
              <Calendar size={12} />
              <span>Real-time</span>
            </div>
          </div>

          <div className="flex-1 w-full overflow-x-auto pb-2">
            <div className="min-w-[400px] md:min-w-[600px] h-[200px] md:h-[350px]">
              <ResponsiveContainer width="100%" height="100%">
                {chartType === "traffic" ? (
                  <AreaChart data={analytics}>
                    <defs>
                      <linearGradient id="colorVisits" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#D4AF37" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#D4AF37" stopOpacity={0}/>
                      </linearGradient>
                      <linearGradient id="colorViews" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--admin-border)" vertical={false} />
                    <XAxis dataKey="name" stroke="var(--admin-text)" fontSize={10} tick={{ fill: 'var(--admin-text)' }} tickLine={false} axisLine={false} dy={10} />
                    <YAxis stroke="var(--admin-text)" fontSize={10} tick={{ fill: 'var(--admin-text)' }} tickLine={false} axisLine={false} tickFormatter={(value) => `${value}`} dx={-10} />
                    <Tooltip 
                      contentStyle={{ backgroundColor: "var(--admin-surface-floating)", borderColor: "var(--admin-border)", borderRadius: "10px", fontSize: "12px", color: "var(--admin-text)" }}
                      itemStyle={{ color: "var(--admin-text)" }}
                      cursor={{ stroke: "var(--admin-border)" }}
                    />
                    <Area type="monotone" dataKey="visits" name="Unique Visits" stroke="#D4AF37" strokeWidth={2} fillOpacity={1} fill="url(#colorVisits)" />
                    <Area type="monotone" dataKey="views" name="Page Views" stroke="#3b82f6" strokeWidth={2} fillOpacity={1} fill="url(#colorViews)" />
                  </AreaChart>
                ) : (
                    <BarChart data={analytics}>
                      <CartesianGrid strokeDasharray="3 3" stroke="var(--admin-border)" vertical={false} />
                      <XAxis dataKey="name" stroke="var(--admin-text)" fontSize={10} tick={{ fill: 'var(--admin-text)' }} tickLine={false} axisLine={false} dy={10} />
                      <YAxis stroke="var(--admin-text)" fontSize={10} tick={{ fill: 'var(--admin-text)' }} tickLine={false} axisLine={false} dx={-10} />
                      <Tooltip 
                        cursor={{fill: 'var(--admin-surface-input)'}}
                        contentStyle={{ backgroundColor: "var(--admin-surface-floating)", borderColor: "var(--admin-border)", borderRadius: "10px", fontSize: "12px", color: "var(--admin-text)" }}
                        itemStyle={{ color: "var(--admin-text)" }}
                      />
                      <Bar dataKey="inquiries" name="Inquiries" fill="#D4AF37" radius={[4, 4, 0, 0]} barSize={40} />
                   </BarChart>
                )}
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="p-3 md:p-6 rounded-[10px] admin-surface-primary backdrop-blur-xs min-h-[280px] md:min-h-[450px] flex flex-col overflow-hidden">
          <div className="flex justify-between items-center mb-4 md:mb-6">
             <h3 className={`${TYPOGRAPHY.sectionTitle} text-[var(--admin-text)]`}>Recent Activity</h3>
             <a href="/admin/audit" className={`${TYPOGRAPHY.meta} text-gold hover:text-[var(--admin-text)] transition-colors`}>View All</a>
          </div>
          
          <div className="flex flex-col md:flex-col gap-3 md:gap-4 overflow-x-auto md:overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-white/10 flex-1">
            {activity.map((activity) => (
              <div key={activity.id} className="flex gap-3 p-2 md:p-3 rounded-[10px] hover:bg-[var(--admin-text)]/5 transition-colors border border-transparent hover:border-[var(--admin-border)] group">
                <div className={`w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center shrink-0 ${
                   activity.type === 'inbox' ? 'bg-blue-500/10 text-blue-400' :
                   activity.type === 'blog' ? 'bg-green-500/10 text-green-400' :
                   activity.type === 'file' ? 'bg-purple-500/10 text-purple-400' :
                   'admin-surface-input text-[var(--admin-muted)]'
                }`}>
                  <Activity size={14} className="md:w-4 md:h-4 text-gold hover:text-[var(--admin-text)]" />
                </div>
                <div className="flex flex-col gap-0.5 min-w-0 justify-center whitespace-nowrap">
                  <p className={`${TYPOGRAPHY.body} leading-tight text-[var(--admin-text)]`}>
                    <span className="font-bold text-[var(--admin-text)] group-hover:text-gold transition-colors">{activity.user}</span> {activity.action}
                  </p>
                  <span className={`${TYPOGRAPHY.meta} text-gold hover:text-[var(--admin-text)]`}>{activity.time}</span>
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-4 pt-4 border-t border-[var(--admin-border)]">
             <div className="admin-surface-secondary border border-[var(--admin-border)] rounded-[8px] p-3 flex items-center justify-between">
                <div>
                   <span className={`${TYPOGRAPHY.tableHeader} text-[var(--admin-text)] block mb-1`}>System Status</span>
                   <span className={`${TYPOGRAPHY.badge} text-green-400 flex items-center gap-1`}>● Operational</span>
                </div>
                <div className="text-right">
                   <span className={`${TYPOGRAPHY.tableHeader} text-[var(--admin-text)] block mb-1`}>API Latency</span>
                   <span className={`${TYPOGRAPHY.meta} text-[var(--admin-text)]`}>~24ms</span>
                </div>
             </div>
          </div>
        </div>
      </div>
    </PageContainer>
  );
}
