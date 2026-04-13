import React, { useEffect, useState } from 'react';
import { useAuth } from '@clerk/clerk-react';
import axios from 'axios';
import ScoreCard from '../components/ScoreCard';
import ProgressChart from '../components/ProgressChart';
import Heatmap from '../components/Heatmap';
import StreakBadge from '../components/StreakBadge';

const Profile = () => {
    const { userId, isLoaded, isSignedIn } = useAuth();
    const [progress, setProgress] = useState([]);
    const [activities, setActivities] = useState([]);
    const [streakData, setStreakData] = useState({ currentStreak: 0, longestStreak: 0 });
    const [loading, setLoading] = useState(true);

    const BACKEND_URL = import.meta.env.VITE_API_URL || import.meta.env.VITE_BACKEND_URL || 'http://localhost:3000';
    const apiUrl = BACKEND_URL.replace(/\/$/, ''); // Remove trailing slash if any

    useEffect(() => {
        if (!isLoaded || !isSignedIn || !userId) {
            setLoading(false);
            return;
        }

        const fetchData = async () => {
            try {
                setLoading(true);
                const [progressRes, activityRes, streakRes] = await Promise.all([
                    axios.get(`${apiUrl}/api/user-progress/${userId}`),
                    axios.get(`${apiUrl}/api/activity/${userId}`),
                    axios.get(`${apiUrl}/api/streak/${userId}`)
                ]);
                
                setProgress(progressRes.data.progress || []);
                setActivities(activityRes.data.activities || []);
                setStreakData({
                    currentStreak: streakRes.data.currentStreak || 0,
                    longestStreak: streakRes.data.longestStreak || 0
                });
            } catch (error) {
                console.error("Failed to fetch dashboard data", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [isLoaded, isSignedIn, userId, apiUrl]);

    if (!isLoaded || loading) {
        return (
            <div className="min-h-screen bg-slate-50 flex items-center justify-center">
                <div className="w-12 h-12 border-4 border-slate-200 border-t-blue-500 rounded-full animate-spin"></div>
            </div>
        );
    }

    if (!isSignedIn) {
        return (
            <div className="min-h-screen bg-slate-50 flex items-center justify-center">
                <div className="bg-white rounded-lg border border-slate-200 shadow-sm p-8 text-center max-w-md">
                    <h2 className="text-xl font-semibold text-slate-900 mb-2">Sign in Required</h2>
                    <p className="text-slate-600">Please sign in to view your profile and metrics.</p>
                </div>
            </div>
        );
    }

    const latestCode = progress.length > 0 ? progress[0] : null;
    let scores = { readability: 0, timeComplexity: 0, spaceComplexity: 0, bestPractices: 0, security: 0 };
    let totalScore = 0;
    
    if (latestCode && latestCode.scores) {
        scores = latestCode.scores;
        totalScore = latestCode.totalScore;
    }

    return (
        <div className="min-h-screen bg-slate-50 pt-20 md:pt-28">
            {/* Header */}
            <div className="bg-white border-b border-slate-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                        <div>
                            <h1 className="text-2xl font-bold text-slate-900">Developer Profile</h1>
                            <p className="text-slate-600 mt-1">Review your overall code quality metrics and activity history.</p>
                        </div>
                        <StreakBadge currentStreak={streakData.currentStreak} longestStreak={streakData.longestStreak} />
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
                {/* Metric Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <ScoreCard title="Latest Review Score" score={totalScore} maxScore={100} color="text-slate-900" bgColor="bg-slate-800" />
                    <ScoreCard title="Best Practices" score={scores.bestPractices} maxScore={25} color="text-blue-600" bgColor="bg-blue-500" />
                    <ScoreCard title="Security Standards" score={scores.security} maxScore={20} color="text-emerald-600" bgColor="bg-emerald-500" />
                </div>

                <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
                    {/* Chart Container */}
                    <div className="bg-white rounded-lg border border-slate-200 shadow-sm flex flex-col">
                        <div className="px-6 py-4 border-b border-slate-200">
                            <h2 className="text-lg font-semibold text-slate-900">Progress History</h2>
                        </div>
                        <div className="p-6 flex-grow">
                            <ProgressChart data={progress} />
                        </div>
                    </div>
                    
                    {/* Heatmap Container */}
                    <div className="bg-white rounded-lg border border-slate-200 shadow-sm flex flex-col">
                        <div className="px-6 py-4 border-b border-slate-200">
                            <h2 className="text-lg font-semibold text-slate-900">Activity Calendar</h2>
                        </div>
                        <div className="p-6 flex-grow flex items-center justify-center">
                            <Heatmap activities={activities} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;
