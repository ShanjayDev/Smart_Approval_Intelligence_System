import React, { useEffect, useState } from 'react';
import apiService from '../services/api';
import { DashboardStats } from '../types/index';
import { StatCard } from '../components/Cards';
import { Layout } from '../components/Layout';
import { toast } from 'react-toastify';
import {
    FiBarChart,
    FiCheckCircle,
    FiClock,
    FiXCircle,
    FiAlertCircle,
} from 'react-icons/fi';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    Title,
    Tooltip,
    Legend,
    ArcElement,
} from 'chart.js';
import { Bar, Doughnut } from 'react-chartjs-2';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    ArcElement,
    Title,
    Tooltip,
    Legend
);

export const DashboardPage: React.FC = () => {
    const [stats, setStats] = useState<DashboardStats | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchStats();
    }, []);

    const fetchStats = async () => {
        try {
            setLoading(true);
            const data = await apiService.getDashboardStats();
            setStats(data);
        } catch (error) {
            toast.error('Failed to fetch dashboard statistics');
        } finally {
            setLoading(false);
        }
    };

    if (loading || !stats) {
        return (
            <Layout>
                <div className="flex items-center justify-center h-full">
                    <div className="spinner text-4xl text-blue-900">⚙️</div>
                </div>
            </Layout>
        );
    }

    // Charts data
    const riskDistributionData = {
        labels: ['Low Risk', 'Medium Risk', 'High Risk', 'Critical Risk'],
        datasets: [
            {
                data: [
                    stats.riskDistribution.low,
                    stats.riskDistribution.medium,
                    stats.riskDistribution.high,
                    stats.riskDistribution.critical,
                ],
                backgroundColor: [
                    'rgba(16, 185, 129, 0.6)',
                    'rgba(245, 158, 11, 0.6)',
                    'rgba(249, 115, 22, 0.6)',
                    'rgba(239, 68, 68, 0.6)',
                ],
                borderColor: [
                    'rgba(16, 185, 129, 1)',
                    'rgba(245, 158, 11, 1)',
                    'rgba(249, 115, 22, 1)',
                    'rgba(239, 68, 68, 1)',
                ],
                borderWidth: 1,
            },
        ],
    };

    const statusDistributionData = {
        labels: [
            'Draft',
            'Submitted',
            'Auto-Approved',
            'Pending',
            'Approved',
            'Rejected',
        ],
        datasets: [
            {
                label: 'Requests',
                data: [
                    stats.statusDistribution.draft,
                    stats.statusDistribution.submitted,
                    stats.statusDistribution.autoApproved,
                    stats.statusDistribution.pendingReview,
                    stats.statusDistribution.approved,
                    stats.statusDistribution.rejected,
                ],
                backgroundColor: 'rgba(30, 58, 138, 0.6)',
                borderColor: 'rgba(30, 58, 138, 1)',
                borderWidth: 1,
            },
        ],
    };

    return (
        <Layout>
            <div className="space-y-8 fade-in">
                {/* Header */}
                <div>
                    <h2 className="text-3xl font-bold text-gray-800 mb-2">Dashboard</h2>
                    <p className="text-gray-600">Overview of your approval system</p>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <StatCard
                        title="Total Requests"
                        value={String(stats.totalRequests)}
                        color="border-blue-500"
                        icon={<FiBarChart />}
                    />
                    <StatCard
                        title="Approved"
                        value={String(stats.metrics.approved)}
                        color="border-emerald-500"
                        icon={<FiCheckCircle />}
                    />
                    <StatCard
                        title="Pending Review"
                        value={String(stats.metrics.pending)}
                        color="border-amber-500"
                        icon={<FiClock />}
                    />
                    <StatCard
                        title="Rejected"
                        value={String(stats.metrics.rejected)}
                        color="border-red-500"
                        icon={<FiXCircle />}
                    />
                </div>

                {/* More Stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <StatCard
                        title="Approval Rate"
                        value={`${stats.metrics.approvalRate}%`}
                        color="border-green-500"
                        icon={<FiCheckCircle />}
                    />
                    <StatCard
                        title="Auto-Approval Rate"
                        value={`${stats.metrics.autoApprovalRate}%`}
                        color="border-purple-500"
                        icon={<FiAlertCircle />}
                    />
                    <StatCard
                        title="Avg Request Amount"
                        value={`₹${parseFloat(stats.avgRequestAmount).toLocaleString('en-IN')}`}
                        color="border-indigo-500"
                        icon={<FiBarChart />}
                    />
                </div>

                {/* Charts */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Risk Distribution */}
                    <div className="card">
                        <h3 className="text-lg font-semibold text-gray-800 mb-4">
                            Risk Distribution
                        </h3>
                        <div className="flex justify-center">
                            <div style={{ width: '300px', height: '300px' }}>
                                <Doughnut
                                    data={riskDistributionData}
                                    options={{
                                        responsive: true,
                                        maintainAspectRatio: false,
                                        plugins: {
                                            legend: {
                                                position: 'bottom',
                                            },
                                        },
                                    }}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Status Distribution */}
                    <div className="card">
                        <h3 className="text-lg font-semibold text-gray-800 mb-4">
                            Status Distribution
                        </h3>
                        <Bar
                            data={statusDistributionData}
                            options={{
                                responsive: true,
                                plugins: {
                                    legend: {
                                        display: false,
                                    },
                                },
                                scales: {
                                    y: {
                                        beginAtZero: true,
                                    },
                                },
                            }}
                        />
                    </div>
                </div>

                {/* Additional Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="card">
                        <h3 className="text-lg font-semibold text-gray-800 mb-4">
                            System Overview
                        </h3>
                        <div className="space-y-3">
                            <div className="flex justify-between items-center py-2 border-b">
                                <span className="text-gray-600">Total Users</span>
                                <span className="font-semibold text-gray-800">
                                    {stats.totalUsers}
                                </span>
                            </div>
                            <div className="flex justify-between items-center py-2 border-b">
                                <span className="text-gray-600">Avg Risk Score</span>
                                <span className="font-semibold text-gray-800">
                                    {Math.round(parseFloat(stats.avgRiskScore))}
                                </span>
                            </div>
                            <div className="flex justify-between items-center py-2">
                                <span className="text-gray-600">Auto-Approved</span>
                                <span className="font-semibold text-emerald-600">
                                    {stats.metrics.autoApproved}
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="card">
                        <h3 className="text-lg font-semibold text-gray-800 mb-4">
                            Risk Level Summary
                        </h3>
                        <div className="space-y-3">
                            <div className="flex justify-between items-center py-2 border-b">
                                <span className="text-emerald-600 font-medium">
                                    Low Risk
                                </span>
                                <span className="font-semibold text-gray-800">
                                    {stats.riskDistribution.low}
                                </span>
                            </div>
                            <div className="flex justify-between items-center py-2 border-b">
                                <span className="text-amber-600 font-medium">
                                    Medium Risk
                                </span>
                                <span className="font-semibold text-gray-800">
                                    {stats.riskDistribution.medium}
                                </span>
                            </div>
                            <div className="flex justify-between items-center py-2 border-b">
                                <span className="text-orange-600 font-medium">
                                    High Risk
                                </span>
                                <span className="font-semibold text-gray-800">
                                    {stats.riskDistribution.high}
                                </span>
                            </div>
                            <div className="flex justify-between items-center py-2">
                                <span className="text-red-600 font-medium">
                                    Critical Risk
                                </span>
                                <span className="font-semibold text-gray-800">
                                    {stats.riskDistribution.critical}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    );
};
