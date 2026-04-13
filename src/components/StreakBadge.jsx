import React from 'react';
import { motion } from 'framer-motion';

const StreakBadge = ({ currentStreak = 0, longestStreak = 0 }) => {
    
    let badgeType = "Beginner";
    let badgeColor = "bg-slate-100 text-slate-800 border-slate-200";
    let icon = "🌱";
    
    if (currentStreak >= 30) {
        badgeType = "Master";
        badgeColor = "bg-amber-100 text-amber-800 border-amber-200";
        icon = "👑";
    } else if (currentStreak >= 7) {
        badgeType = "Pro";
        badgeColor = "bg-blue-100 text-blue-800 border-blue-200";
        icon = "🔥";
    } else if (currentStreak >= 3) {
        badgeType = "Active";
        badgeColor = "bg-emerald-100 text-emerald-800 border-emerald-200";
        icon = "⚡";
    }

    return (
        <motion.div 
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="flex items-center space-x-4 bg-white py-2 px-4 rounded-full border border-slate-200 shadow-sm"
        >
            <div className={`hidden sm:flex items-center justify-center px-3 py-1 rounded-full text-xs font-semibold border ${badgeColor}`}>
                <span className="mr-1">{icon}</span> {badgeType}
            </div>
            
            <div className="flex flex-col text-right">
                <span className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold">Streak</span>
                <span className="text-sm font-bold text-slate-900">{currentStreak} Days</span>
            </div>
            
            <div className="w-px h-6 bg-slate-200 mx-1"></div>
            
            <div className="flex flex-col text-right">
                <span className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold">Best</span>
                <span className="text-sm font-semibold text-slate-600">{longestStreak} Days</span>
            </div>
        </motion.div>
    );
};

export default StreakBadge;
