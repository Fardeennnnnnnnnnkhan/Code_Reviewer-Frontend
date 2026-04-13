import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const ProgressChart = ({ data }) => {
    if (!data || data.length === 0) {
        return <div className="h-64 flex justify-center items-center text-slate-500 bg-slate-50 rounded-lg border border-dashed border-slate-300">No review data available</div>;
    }

    const chartData = [...data].reverse().map((item, index) => {
        let dateStr = new Date(item.createdAt).toLocaleDateString();
        return {
            name: `Req #${index + 1}`,
            date: dateStr,
            score: typeof item.totalScore === 'number' ? item.totalScore : 0
        };
    });

    return (
        <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData} margin={{ top: 5, right: 20, left: -20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                    <XAxis dataKey="name" stroke="#64748b" tick={{fill: '#64748b', fontSize: 12}} tickLine={false} axisLine={false} />
                    <YAxis stroke="#64748b" domain={[0, 100]} tick={{fill: '#64748b', fontSize: 12}} tickLine={false} axisLine={false} />
                    <Tooltip 
                        contentStyle={{ backgroundColor: '#ffffff', borderColor: '#e2e8f0', color: '#0f172a', borderRadius: '8px', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                        itemStyle={{ color: '#0f172a', fontWeight: 'bold' }}
                        labelStyle={{ color: '#64748b', marginBottom: '4px' }}
                    />
                    <Line type="monotone" dataKey="score" stroke="#0f172a" strokeWidth={3} dot={{ r: 4, fill: '#0f172a', strokeWidth: 2, stroke: '#ffffff' }} activeDot={{ r: 6, fill: '#0f172a', stroke: '#ffffff' }} />
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
};

export default ProgressChart;
