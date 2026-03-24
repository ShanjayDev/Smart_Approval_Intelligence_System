import React, { useEffect, useState } from 'react';
import apiService from '../services/api';
import { ApprovalRequest } from '../types/index';
import { Layout } from '../components/Layout';
import { toast } from 'react-toastify';
import {
    FiCheckCircle,
    FiXCircle,
    FiAlertCircle,
    FiMessageSquare,
} from 'react-icons/fi';

export const ReviewQueuePage: React.FC = () => {
    const [requests, setRequests] = useState<ApprovalRequest[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedRequest, setSelectedRequest] =
        useState<ApprovalRequest | null>(null);
    const [comment, setComment] = useState('');
    const [rejectReason, setRejectReason] = useState('');
    const [showRejectForm, setShowRejectForm] = useState(false);
    const [riskFilter, setRiskFilter] = useState<string>('');

    useEffect(() => {
        fetchReviewQueue();
    }, [riskFilter]);

    const fetchReviewQueue = async () => {
        try {
            setLoading(true);
            const filters: any = {};
            if (riskFilter) filters.riskLevel = riskFilter;

            const data = await apiService.getReviewQueue(filters);
            setRequests(data);
        } catch (error) {
            toast.error('Failed to fetch review queue');
        } finally {
            setLoading(false);
        }
    };

    const handleApprove = async () => {
        if (!selectedRequest) return;

        try {
            await apiService.approveRequest(selectedRequest._id, comment);
            toast.success('Request approved');
            setSelectedRequest(null);
            setComment('');
            fetchReviewQueue();
        } catch (error) {
            toast.error('Failed to approve request');
        }
    };

    const handleReject = async () => {
        if (!selectedRequest) return;

        if (!rejectReason.trim()) {
            toast.error('Please provide a rejection reason');
            return;
        }

        try {
            await apiService.rejectRequest(
                selectedRequest._id,
                rejectReason,
                comment
            );
            toast.success('Request rejected');
            setSelectedRequest(null);
            setComment('');
            setRejectReason('');
            setShowRejectForm(false);
            fetchReviewQueue();
        } catch (error) {
            toast.error('Failed to reject request');
        }
    };

    const getRiskColor = (level: string) => {
        switch (level) {
            case 'low':
                return 'text-emerald-600 bg-emerald-50';
            case 'medium':
                return 'text-amber-600 bg-amber-50';
            case 'high':
                return 'text-orange-600 bg-orange-50';
            case 'critical':
                return 'text-red-600 bg-red-50';
            default:
                return 'text-gray-600 bg-gray-50';
        }
    };

    return (
        <Layout>
            <div className="space-y-6 fade-in">
                {/* Header */}
                <div>
                    <h2 className="text-3xl font-bold text-gray-800 mb-2">
                        Review Queue
                    </h2>
                    <p className="text-gray-600">
                        Manage pending approval requests
                    </p>
                </div>

                {/* Risk Filter */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Filter by Risk Level
                    </label>
                    <select
                        value={riskFilter}
                        onChange={(e) => setRiskFilter(e.target.value)}
                        className="form-select max-w-xs"
                    >
                        <option value="">All Risk Levels</option>
                        <option value="low">Low Risk</option>
                        <option value="medium">Medium Risk</option>
                        <option value="high">High Risk</option>
                        <option value="critical">Critical Risk</option>
                    </select>
                </div>

                {/* Main Content */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Request List */}
                    <div className="lg:col-span-1">
                        <div className="card p-0 divide-y max-h-[600px] overflow-y-auto">
                            {loading ? (
                                <div className="p-6 text-center">
                                    <div className="spinner text-3xl">⚙️</div>
                                </div>
                            ) : requests.length === 0 ? (
                                <div className="p-6 text-center text-gray-600">
                                    No pending requests in queue
                                </div>
                            ) : (
                                requests.map((req) => (
                                    <button
                                        key={req._id}
                                        onClick={() => setSelectedRequest(req)}
                                        className={`w-full p-4 text-left hover:bg-gray-50 transition ${selectedRequest?._id === req._id
                                            ? 'bg-blue-50 border-l-4 border-blue-900'
                                            : ''
                                            }`}
                                    >
                                        <div className="flex items-start justify-between mb-2">
                                            <h4 className="font-semibold text-gray-800 text-sm">
                                                {req.title}
                                            </h4>
                                            <span
                                                className={`text-xs font-bold px-2 py-1 rounded ${getRiskColor(
                                                    req.riskLevel
                                                )}`}
                                            >
                                                {req.riskLevel}
                                            </span>
                                        </div>
                                        <p className="text-xs text-gray-500 mb-2">
                                            {req.requestNumber}
                                        </p>
                                        <p className="text-sm font-semibold text-gray-800">
                                            ${req.amount.toLocaleString()}
                                        </p>
                                    </button>
                                ))
                            )}
                        </div>
                    </div>

                    {/* Request Details */}
                    <div className="lg:col-span-2">
                        {selectedRequest ? (
                            <div className="space-y-6">
                                {/* Details Card */}
                                <div className="card">
                                    <div className="flex items-start justify-between mb-6">
                                        <div>
                                            <h3 className="text-2xl font-bold text-gray-800 mb-2">
                                                {selectedRequest.title}
                                            </h3>
                                            <p className="text-gray-500">
                                                {selectedRequest.requestNumber}
                                            </p>
                                        </div>
                                        <span
                                            className={`px-4 py-2 rounded-lg font-semibold ${getRiskColor(
                                                selectedRequest.riskLevel
                                            )}`}
                                        >
                                            {selectedRequest.riskLevel} Risk
                                        </span>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4 mb-6 pb-6 border-b">
                                        <div>
                                            <p className="text-gray-600 text-sm mb-1">
                                                Amount
                                            </p>
                                            <p className="text-2xl font-bold text-gray-800">
                                                ${selectedRequest.amount.toLocaleString()}
                                            </p>
                                        </div>
                                        <div>
                                            <p className="text-gray-600 text-sm mb-1">
                                                Risk Score
                                            </p>
                                            <p className="text-2xl font-bold text-gray-800">
                                                {selectedRequest.riskScore}/100
                                            </p>
                                        </div>
                                        <div>
                                            <p className="text-gray-600 text-sm mb-1">
                                                Category
                                            </p>
                                            <p className="text-lg font-semibold text-gray-800 capitalize">
                                                {selectedRequest.category}
                                            </p>
                                        </div>
                                        <div>
                                            <p className="text-gray-600 text-sm mb-1">
                                                Submitted
                                            </p>
                                            <p className="text-sm text-gray-800">
                                                {new Date(
                                                    selectedRequest.createdAt
                                                ).toLocaleDateString()}
                                            </p>
                                        </div>
                                    </div>

                                    <div>
                                        <p className="text-gray-600 text-sm mb-2 font-semibold">
                                            Description
                                        </p>
                                        <p className="text-gray-700">
                                            {selectedRequest.description}
                                        </p>
                                    </div>
                                </div>

                                {/* Comments */}
                                {selectedRequest.comments.length > 0 && (
                                    <div className="card">
                                        <h4 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
                                            <FiMessageSquare /> Comments
                                        </h4>
                                        <div className="space-y-3">
                                            {selectedRequest.comments.map((c, idx) => (
                                                <div key={idx} className="p-3 bg-gray-50 rounded">
                                                    <p className="text-xs font-semibold text-gray-600 mb-1">
                                                        {typeof c.userId === 'string'
                                                            ? 'User'
                                                            : `${c.userId.firstName} ${c.userId.lastName}`}
                                                    </p>
                                                    <p className="text-sm text-gray-700">
                                                        {c.text}
                                                    </p>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Action Forms */}
                                <div className="card">
                                    <div className="mb-4">
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Add Comment (Optional)
                                        </label>
                                        <textarea
                                            value={comment}
                                            onChange={(e) => setComment(e.target.value)}
                                            rows={3}
                                            className="form-textarea"
                                            placeholder="Add any notes for the requester..."
                                        ></textarea>
                                    </div>

                                    {!showRejectForm ? (
                                        <div className="flex gap-3">
                                            <button
                                                onClick={handleApprove}
                                                className="flex-1 btn-success flex items-center justify-center gap-2"
                                            >
                                                <FiCheckCircle /> Approve
                                            </button>
                                            <button
                                                onClick={() => setShowRejectForm(true)}
                                                className="flex-1 btn-danger flex items-center justify-center gap-2"
                                            >
                                                <FiXCircle /> Reject
                                            </button>
                                        </div>
                                    ) : (
                                        <div className="space-y-3">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                                    Rejection Reason <span className="text-red-500">*</span>
                                                </label>
                                                <textarea
                                                    value={rejectReason}
                                                    onChange={(e) => setRejectReason(e.target.value)}
                                                    rows={3}
                                                    className="form-textarea"
                                                    placeholder="Explain why this request is being rejected..."
                                                    required
                                                ></textarea>
                                            </div>
                                            <div className="flex gap-3">
                                                <button
                                                    onClick={handleReject}
                                                    className="flex-1 btn-danger"
                                                >
                                                    Confirm Rejection
                                                </button>
                                                <button
                                                    onClick={() => {
                                                        setShowRejectForm(false);
                                                        setRejectReason('');
                                                    }}
                                                    className="flex-1 btn-secondary"
                                                >
                                                    Cancel
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ) : (
                            <div className="card text-center py-12">
                                <FiAlertCircle size={48} className="mx-auto text-gray-400 mb-4" />
                                <p className="text-gray-600">
                                    Select a request from the list to review
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </Layout>
    );
};
