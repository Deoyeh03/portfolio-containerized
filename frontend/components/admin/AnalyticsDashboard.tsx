"use client";

import { useEffect, useState } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import api from '@/lib/api';
import { Loader2, TrendingUp } from 'lucide-react';

export default function AnalyticsDashboard() {
    const [data, setData] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const res = await api.get('/analytics/stats'); 
                setData(res.data);
            } catch (error: any) {
                console.error("Error fetching stats", error);
                if (error.response?.status === 401) {
                    window.location.href = '/admin/login';
                }
            } finally {
                setLoading(false);
            }
        };
        fetchStats();
    }, []);

    if (loading) return <div className="flex justify-center p-12"><Loader2 className="animate-spin text-primary" /></div>;

    return (
        <div className="bg-white/5 border border-white/10 p-6 rounded-2xl w-full">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h3 className="text-xl font-bold text-white flex items-center gap-2">
                        <TrendingUp className="text-primary" /> Traffic Overview
                    </h3>
                    <p className="text-sm text-muted-foreground">Visitor engagement over the last 7 days</p>
                </div>
            </div>

            <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%" minWidth={0}>
                    <AreaChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                        <defs>
                            <linearGradient id="colorVisit" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#00ff88" stopOpacity={0.3}/>
                                <stop offset="95%" stopColor="#00ff88" stopOpacity={0}/>
                            </linearGradient>
                        </defs>
                        <XAxis 
                            dataKey="date" 
                            stroke="#666" 
                            fontSize={12} 
                            tickLine={false} 
                            axisLine={false} 
                        />
                        <YAxis 
                            stroke="#666" 
                            fontSize={12} 
                            tickLine={false} 
                            axisLine={false}
                        />
                        <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
                        <Tooltip 
                            contentStyle={{ backgroundColor: '#000', border: '1px solid #333', borderRadius: '8px' }}
                            itemStyle={{ color: '#fff' }}
                        />
                        <Area 
                            type="monotone" 
                            dataKey="visit" 
                            stroke="#00ff88" 
                            fillOpacity={1} 
                            fill="url(#colorVisit)" 
                            strokeWidth={2}
                        />
                        <Area 
                            type="monotone" 
                            dataKey="project_view" 
                            stroke="#00ccff" 
                            fillOpacity={0.1} 
                            fill="#00ccff" 
                            strokeWidth={2}
                        />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
            
            <div className="grid grid-cols-2 gap-4 mt-6">
                <div className="bg-black/20 p-4 rounded-xl border border-white/5">
                    <p className="text-xs text-muted-foreground mb-1">Total Visits</p>
                    <p className="text-2xl font-bold text-white">
                        {data.reduce((acc, curr) => acc + (curr.visit || 0), 0)}
                    </p>
                </div>
                <div className="bg-black/20 p-4 rounded-xl border border-white/5">
                    <p className="text-xs text-muted-foreground mb-1">Project Views</p>
                    <p className="text-2xl font-bold text-white">
                        {data.reduce((acc, curr) => acc + (curr.project_view || 0), 0)}
                    </p>
                </div>
            </div>
        </div>
    );
}
