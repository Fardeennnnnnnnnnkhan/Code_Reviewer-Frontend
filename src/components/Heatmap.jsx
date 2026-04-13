import React from 'react';
import CalendarHeatmap from 'react-calendar-heatmap';
import 'react-calendar-heatmap/dist/styles.css';

const Heatmap = ({ activities }) => {
    if (!activities) activities = [];
    
    // Transform data
    const heatmapData = activities.map(item => ({
        date: item.date,
        count: item.count || 0
    }));

    const today = new Date();
    // Start date 6 months ago to fix sizing
    const startDate = new Date(today);
    startDate.setMonth(today.getMonth() - 6);

    return (
        <div className="w-full h-full pt-2 -ml-2 overflow-hidden flex justify-center items-center">
             {/* Custom CSS to match slate/slate-900 theme */}
             <style dangerouslySetInnerHTML={{__html: `
                .react-calendar-heatmap .color-empty { fill: #f1f5f9; }
                .react-calendar-heatmap .color-scale-1 { fill: #cbd5e1; }
                .react-calendar-heatmap .color-scale-2 { fill: #94a3b8; }
                .react-calendar-heatmap .color-scale-3 { fill: #475569; }
                .react-calendar-heatmap .color-scale-4 { fill: #0f172a; }
                .react-calendar-heatmap text { fill: #64748b; font-size: 8px; font-family: sans-serif; }
                .react-calendar-heatmap rect { rx: 2px; ry: 2px; }
             `}} />
             
            <CalendarHeatmap
                startDate={startDate}
                endDate={today}
                values={heatmapData}
                classForValue={(value) => {
                    if (!value || value.count === 0) return 'color-empty';
                    return `color-scale-${Math.min(value.count, 4)}`;
                }}
                titleForValue={(value) => {
                    if (!value || !value.date) return 'No activity';
                    return `${value.count} submissions on ${value.date}`;
                }}
                showWeekdayLabels={true}
                gutterSize={2}
            />
        </div>
    );
};

export default Heatmap;
