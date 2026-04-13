import React from 'react';
import { motion } from 'framer-motion';

const ScoreCard = ({ title, score, maxScore = 100, color = 'text-slate-700', bgColor = 'bg-slate-200' }) => {
    const percentage = Math.round((score / maxScore) * 100) || 0;
    
    return (
        <motion.div 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-lg border border-slate-200 shadow-sm p-6 flex flex-col h-full"
        >
            <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-4">{title}</h3>
            <div className="flex items-baseline space-x-2">
                <span className={`text-4xl font-bold ${color}`}>{score || 0}</span>
                <span className="text-slate-500 text-lg font-medium opacity-70">/ {maxScore}</span>
            </div>
            
            <div className="w-full bg-slate-100 rounded-full h-2 mt-6 overflow-hidden mt-auto">
                <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${percentage}%` }}
                    transition={{ duration: 1, delay: 0.1 }}
                    className={`h-2 rounded-full ${bgColor}`} 
                />
            </div>
        </motion.div>
    );
};

export default ScoreCard;
