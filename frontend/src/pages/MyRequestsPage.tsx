import React, { useEffect, useState } from 'react';
import apiService from '../services/api';
import { ApprovalRequest } from '../types/index';
import { RequestCard } from '../components/Cards';
import { Layout } from '../components/Layout';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

export const MyRequestsPage: React.FC = () => {
    const navigate = useNavigate();
    const [requests, setRequests] = useState<ApprovalRequest[]>([]);
    const [loading, setLoading] = useState(true);
    const [statusFilter, setStatusFilter] = useState<string>('');
    const [categoryFilter, setCategoryFilter] = useState<string>('');

    useEffect(() => {
        fetchRequests();
    }, [statusFilter, categoryFilter]);

    const fetchRequests = async () => {
        try {
            setLoading(true);
            const filters: any = {};
            if (statusFilter) filters.status = statusFilter;
            if (categoryFilter) filters.category = categoryFilter;

            const data = await apiService.getMyRequests(filters);
            setRequests(data);
        } catch (error) {
            toast.error('Failed to fetch requests');
        } finally {
            setLoading(false);
        }
    };

    const handleViewDetails = (id: string) => {
        navigate(`/request-details/${id}`);
    };

    return (
        <Layout>
            <div className="space-y-6 fade-in">
                {/* Header */}
                <div className="flex justify-between items-start">
                    <div>
                        <h2 className="text-3xl font-bold text-gray-800 mb-2">
                            My Requests
                        </h2>
                        <p className="text-gray-600">Track your approval requests</p>
                    </div>
                    <button
                        onClick={() => navigate('/submit-request')}
                        className="btn-primary"
                    >
                        + New Request
                    </button>
                </div>

                {/* Filters */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Status
                        </label>
                        <select
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                            className="form-select"
                        >
                            <option value="">All Statuses</option>
                            <option value="draft">Draft</option>
                            <option value="submitted">Submitted</option>
                            <option value="auto-approved">Auto-Approved</option>
                            <option value="pending-review">Pending Review</option>
                            <option value="approved">Approved</option>
                            <option value="rejected">Rejected</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Category
                        </label>
                        <select
                            value={categoryFilter}
                            onChange={(e) => setCategoryFilter(e.target.value)}
                            className="form-select"
                        >
                            <option value="">All Categories</option>
                            <option value="travel">Travel</option>
                            <option value="equipment">Equipment</option>
                            <option value="software">Software</option>
                            <option value="service">Service</option>
                            <option value="other">Other</option>
                        </select>
                    </div>
                </div>

                {/* Requests Grid */}
                {loading ? (
                    <div className="flex items-center justify-center py-12">
                        <div className="spinner text-4xl text-blue-900">⚙️</div>
                    </div>
                ) : requests.length === 0 ? (
                    <div className="card text-center py-12">
                        <p className="text-gray-600 mb-4">No requests found</p>
                        <button
                            onClick={() => navigate('/submit-request')}
                            className="btn-primary"
                        >
                            Create Your First Request
                        </button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {requests.map((request) => (
                            <RequestCard
                                key={request._id}
                                request={request}
                                onViewDetails={handleViewDetails}
                            />
                        ))}
                    </div>
                )}
            </div>
        </Layout>
    );
};
