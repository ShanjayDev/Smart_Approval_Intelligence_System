import React, { useEffect, useState } from 'react';
import apiService from '../services/api';
import { Layout } from '../components/Layout';
import { toast } from 'react-toastify';
import { StatCard } from '../components/Cards';
import Settings from '../components/Settings';
import { Bar, Doughnut } from 'react-chartjs-2';

export const AnalyticsPage: React.FC = () => {
    const [analyticsData, setAnalyticsData] = useState<any>(null);
    const [trendsData, setTrendsData] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [days, setDays] = useState(30);

    useEffect(() => {
        fetchAnalytics();
    }, [days]);

    const fetchAnalytics = async () => {
        try {
            setLoading(true);
            const [analytics, trends] = await Promise.all([
                apiService.getRequestAnalytics(days),
                apiService.getApprovalTrends(),
            ]);
            setAnalyticsData(analytics);
            setTrendsData(trends);
        } catch (error) {
            toast.error('Failed to fetch analytics');
        } finally {
            setLoading(false);
        }
    };



    if (loading || !analyticsData || !trendsData) {
        return (
            <Layout>
                <div className="flex items-center justify-center h-full">
                    <div className="spinner text-4xl">⚙️</div>
                </div>
                <Settings />
            </Layout>
        );
    }

    // Chart data preparation
    const categoryData = {
        labels: Object.keys(analyticsData.categoryBreakdown || {}),
        datasets: [
            {
                label: 'Requests by Category',
                data: Object.values(analyticsData.categoryBreakdown || {}).map(
                    (cat: any) => cat.count
                ),
                backgroundColor: 'rgba(30, 58, 138, 0.6)',
                borderColor: 'rgba(30, 58, 138, 1)',
                borderWidth: 1,
            },
        ],
    };

    const statusData = {
        labels: Object.keys(trendsData.byStatus || {}),
        datasets: [
            {
                data: Object.values(trendsData.byStatus || {}),
                backgroundColor: [
                    'rgba(107, 114, 128, 0.6)',
                    'rgba(245, 158, 11, 0.6)',
                    'rgba(16, 185, 129, 0.6)',
                    'rgba(59, 130, 246, 0.6)',
                    'rgba(34, 197, 94, 0.6)',
                    'rgba(239, 68, 68, 0.6)',
                ],
                borderColor: [
                    'rgba(107, 114, 128, 1)',
                    'rgba(245, 158, 11, 1)',
                    'rgba(16, 185, 129, 1)',
                    'rgba(59, 130, 246, 1)',
                    'rgba(34, 197, 94, 1)',
                    'rgba(239, 68, 68, 1)',
                ],
                borderWidth: 1,
            },
        ],
    };

    const riskData = {
        labels: Object.keys(trendsData.byRiskLevel || {}),
        datasets: [
            {
                data: Object.values(trendsData.byRiskLevel || {}),
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

    const totalRequests = Object.values(trendsData.byStatus || {}).reduce(
        (a: any, b: any) => a + b,
        0
    );
    const approvedCount = (trendsData.byStatus?.approved || 0);
    const rejectedCount = (trendsData.byStatus?.rejected || 0);
    const pendingCount = (trendsData.byStatus?.['pending-review'] || 0);

    return (
        <Layout>
            <div className="space-y-8 fade-in">
                {/* Header */}
                <div className="flex justify-between items-start">
                    <div>
                        <h2 className="text-3xl font-bold text-gray-800 mb-2">
                            Analytics
                        </h2>
                        <p className="text-gray-600">Detailed analytics and reports</p>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Time Period (Days)
                        </label>
                        <select
                            value={days}
                            onChange={(e) => setDays(parseInt(e.target.value))}
                            className="form-select"
                        >
                            <option value={7}>Last 7 Days</option>
                            <option value={30}>Last 30 Days</option>
                            <option value={90}>Last 90 Days</option>
                            <option value={365}>Last Year</option>
                        </select>
                    </div>
                </div>

                {/* Key Metrics */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    <StatCard
                        title="Total Requests"
                        value={String(totalRequests)}
                        color="border-blue-500"
                    />
                    <StatCard
                        title="Approved"
                        value={String(approvedCount)}
                        color="border-emerald-500"
                    />
                    <StatCard
                        title="Rejected"
                        value={String(rejectedCount)}
                        color="border-red-500"
                    />
                    <StatCard
                        title="Pending"
                        value={String(pendingCount)}
                        color="border-amber-500"
                    />
                </div>

                {/* Charts */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Status Distribution */}
                    <div className="card">
                        <h3 className="text-lg font-semibold text-gray-800 mb-4">
                            Requests by Status
                        </h3>
                        <div style={{ height: '300px' }}>
                            <Doughnut
                                data={statusData}
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

                    {/* Risk Distribution */}
                    <div className="card">
                        <h3 className="text-lg font-semibold text-gray-800 mb-4">
                            Requests by Risk Level
                        </h3>
                        <div style={{ height: '300px' }}>
                            <Doughnut
                                data={riskData}
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

                {/* Category Breakdown */}
                <div className="card">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">
                        Requests by Category
                    </h3>
                    <Bar
                        data={categoryData}
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

                {/* Detailed Category Stats */}
                <div className="card">
                    <h3 className="text-lg font-semibold text-gray-800 mb-6">
                        Category Statistics
                    </h3>
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-gray-200">
                                    <th className="text-left py-3 px-4 font-semibold text-gray-800">
                                        Category
                                    </th>
                                    <th className="text-right py-3 px-4 font-semibold text-gray-800">
                                        Total
                                    </th>
                                    <th className="text-right py-3 px-4 font-semibold text-gray-800">
                                        Approved
                                    </th>
                                    <th className="text-right py-3 px-4 font-semibold text-gray-800">
                                        Total Amount
                                    </th>
                                    <th className="text-right py-3 px-4 font-semibold text-gray-800">
                                        Approval Rate
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {Object.entries(analyticsData.categoryBreakdown || {}).map(
                                    ([category, data]: [string, any], idx) => (
                                        <tr
                                            key={category}
                                            className={`${idx % 2 === 0 ? 'bg-gray-50' : ''
                                                } table-row`}
                                        >
                                            <td className="py-3 px-4 capitalize font-medium">
                                                {category}
                                            </td>
                                            <td className="py-3 px-4 text-right">
                                                {data.count}
                                            </td>
                                            <td className="py-3 px-4 text-right text-emerald-600 font-semibold">
                                                {data.approved}
                                            </td>
                                            <td className="py-3 px-4 text-right">
                                                ${data.totalAmount.toLocaleString()}
                                            </td>
                                            <td className="py-3 px-4 text-right">
                                                {data.count > 0
                                                    ? `${(
                                                        (data.approved / data.count) *
                                                        100
                                                    ).toFixed(1)}%`
                                                    : '-'}
                                            </td>
                                        </tr>
                                    )
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </Layout>
    );
};
