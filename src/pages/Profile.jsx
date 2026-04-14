import React, { useEffect, useState } from 'react';
import { useAuth, useUser } from '@clerk/clerk-react';
import axios from 'axios';
import ScoreCard from '../components/ScoreCard';
import ProgressChart from '../components/ProgressChart';
import Heatmap from '../components/Heatmap';
import StreakBadge from '../components/StreakBadge';

const Profile = () => {
    const { userId, isLoaded, isSignedIn } = useAuth();
    const { user } = useUser();
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
            <div className="min-h-screen bg-[#fafaf9] flex items-center justify-center pt-20">
                <div className="relative flex justify-center items-center">
                    <div className="absolute animate-ping w-12 h-12 rounded-full bg-[#8d9a7b]/40"></div>
                    <div className="w-12 h-12 border-4 border-[#8d9a7b]/20 border-t-[#8d9a7b] rounded-full animate-spin relative z-10"></div>
                </div>
            </div>
        );
    }

    if (!isSignedIn) {
        return (
            <div className="min-h-screen bg-[#fafaf9] flex items-center justify-center pt-20">
                <div className="bg-white rounded-3xl border border-[#8d9a7b]/20 shadow-[0_10px_40px_rgba(141,154,123,0.15)] p-10 text-center max-w-md transform transition-all">
                    <div className="w-16 h-16 bg-[#eaf4d7] text-[#4a5638] rounded-full flex items-center justify-center mx-auto mb-6">
                        <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                        </svg>
                    </div>
                    <h2 className="text-2xl font-bold text-slate-800 mb-3 tracking-tight">Authentication Required</h2>
                    <p className="text-slate-500 leading-relaxed">Please sign in to view your personalized code quality metrics and secure dashboard.</p>
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
        <div className="min-h-screen bg-[#fafaf9]  pb-16">
            {/* Immersive Banner */}
            <div className="h-40 md:h-56 w-full bg-gradient-to-br from-[#8d9a7b] via-[#6f7a60] to-[#4a5638] relative overflow-hidden">
                <div className="absolute inset-0 bg-[radial-gradient(#ffffff22_1px,transparent_1px)] [background-size:24px_24px] opacity-50"></div>
                {/* Decorative floating blurred orbs */}
                <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-white/10 blur-3xl rounded-full mix-blend-overlay"></div>
                <div className="absolute -top-20 -right-20 w-80 h-80 bg-[#eaf4d7]/20 blur-3xl rounded-full mix-blend-overlay"></div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-16 md:-mt-24 relative z-10">
                {/* Premium Profile Identity Card */}
                <div className="bg-white rounded-2xl md:rounded-3xl border border-white/40 shadow-[0_12px_40px_rgba(141,154,123,0.12)] p-6 md:p-10 mb-10 flex flex-col md:flex-row items-center md:items-start justify-between gap-6 backdrop-blur-xl">
                    <div className="flex flex-col md:flex-row items-center md:items-start gap-6 w-full">
                        {/* Glowing Avatar */}
                        <div className="relative group shrink-0">
                            <div className="absolute -inset-1.5 bg-gradient-to-tr from-[#8d9a7b] to-[#eaf4d7] rounded-full opacity-60 group-hover:opacity-100 blur-md transition duration-500"></div>
                            <img 
                                src={user?.imageUrl || "https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y"} 
                                alt="Profile Avatar" 
                                className="relative w-28 h-28 md:w-36 md:h-36 rounded-full object-cover border-4 border-white shadow-lg bg-white transform transition-transform duration-500 group-hover:scale-[1.02]"
                            />
                        </div>
                        
                        {/* User Details */}
                        <div className="text-center md:text-left mt-2 md:mt-4 flex-grow">
                            <h1 className="text-3xl md:text-4xl font-bold text-slate-800 tracking-tight">
                                {user?.fullName || "Developer Analyst"}
                            </h1>
                            <p className="text-slate-500 font-medium text-base md:text-lg flex items-center justify-center md:justify-start gap-2 mt-2">
                                <svg className="w-5 h-5 text-[#8d9a7b]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                </svg>
                                {user?.primaryEmailAddress?.emailAddress || "user@example.com"}
                            </p>
                            <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 mt-5">
                                <span className="px-4 py-1.5 bg-[#8d9a7b]/10 text-[#4a5638] text-[11px] sm:text-xs font-bold uppercase tracking-wider rounded-full border border-[#8d9a7b]/20 shadow-sm">CodeCureAI Member</span>
                                <span className="text-[11px] sm:text-xs text-slate-500 font-medium bg-slate-50 px-4 py-1.5 rounded-full border border-slate-200">Joined {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : "Recently"}</span>
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-col items-center justify-center shrink-0 w-full md:w-auto p-5 bg-gradient-to-b from-[#fbfcfa] to-[#f4f7f0] rounded-2xl border border-[#8d9a7b]/15 shadow-inner">
                        <StreakBadge currentStreak={streakData.currentStreak} longestStreak={streakData.longestStreak} />
                    </div>
                </div>

                {/* Main Dashboard Content Grid */}
                <div className="grid grid-cols-1 gap-8">
                    {/* Metric Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <ScoreCard 
                          title="Evaluation Score" 
                          score={totalScore} 
                          maxScore={100} 
                          color="text-[#4a5638]" 
                          bgColor="bg-[#eaf4d7]" 
                        />
                        <ScoreCard 
                          title="Best Practices" 
                          score={scores.bestPractices} 
                          maxScore={25} 
                          color="text-[#596944]" 
                          bgColor="bg-[#dbecd2]" 
                        />
                        <ScoreCard 
                          title="Security Integrity" 
                          score={scores.security} 
                          maxScore={20} 
                          color="text-[#657a4a]" 
                          bgColor="bg-[#e5eedc]" 
                        />
                    </div>

                    <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
                        {/* Chart Container */}
                        <div className="bg-white rounded-3xl border border-[#8d9a7b]/15 shadow-[0_8px_30px_rgba(141,154,123,0.08)] flex flex-col overflow-hidden transition-all duration-300 hover:shadow-[0_12px_40px_rgba(141,154,123,0.12)]">
                            <div className="px-8 py-6 border-b border-[#8d9a7b]/10 bg-gradient-to-r from-[#fafaf9] to-white flex justify-between items-center">
                                <h2 className="text-lg font-bold text-slate-800 flex items-center gap-3">
                                    <div className="p-2 bg-[#8d9a7b]/10 rounded-lg">
                                        <svg className="w-5 h-5 text-[#8d9a7b]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
                                        </svg>
                                    </div>
                                    Performance Timeline
                                </h2>
                            </div>
                            <div className="p-8 flex-grow flex items-center justify-center">
                                <ProgressChart data={progress} />
                            </div>
                        </div>
                        
                        {/* Heatmap Container */}
                        <div className="bg-white rounded-3xl border border-[#8d9a7b]/15 shadow-[0_8px_30px_rgba(141,154,123,0.08)] flex flex-col overflow-hidden transition-all duration-300 hover:shadow-[0_12px_40px_rgba(141,154,123,0.12)]">
                            <div className="px-8 py-6 border-b border-[#8d9a7b]/10 bg-gradient-to-r from-[#fafaf9] to-white flex justify-between items-center">
                                <h2 className="text-lg font-bold text-slate-800 flex items-center gap-3">
                                    <div className="p-2 bg-[#8d9a7b]/10 rounded-lg">
                                        <svg className="w-5 h-5 text-[#8d9a7b]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                        </svg>
                                    </div>
                                    Activity Heatmap
                                </h2>
                            </div>
                            <div className="p-8 flex-grow flex items-center justify-center overflow-x-auto overflow-y-hidden">
                                <Heatmap activities={activities} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;
