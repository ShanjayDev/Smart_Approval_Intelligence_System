import React from 'react';
import { ApprovalRequest } from '../types/index';
import { FiCheckCircle, FiClock, FiXCircle, FiAlertCircle } from 'react-icons/fi';

interface RequestCardProps {
    request: ApprovalRequest;
    onViewDetails: (id: string) => void;
}

export const RequestCard: React.FC<RequestCardProps> = ({
    request,
    onViewDetails,
}) => {
    const getStatusColor = (status: string) => {
        switch (status) {
            case 'approved':
                return 'bg-emerald-100 text-emerald-800';
            case 'rejected':
                return 'bg-red-100 text-red-800';
            case 'pending-review':
            case 'submitted':
                return 'bg-amber-100 text-amber-800';
            case 'auto-approved':
                return 'bg-green-100 text-green-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    const getRiskColor = (level: string) => {
        switch (level) {
            case 'low':
                return 'text-emerald-600';
            case 'medium':
                return 'text-amber-600';
            case 'high':
                return 'text-orange-600';
            case 'critical':
                return 'text-red-600';
            default:
                return 'text-gray-600';
        }
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'approved':
                return <FiCheckCircle className="text-emerald-600" />;
            case 'rejected':
                return <FiXCircle className="text-red-600" />;
            case 'pending-review':
                return <FiClock className="text-amber-600" />;
            case 'auto-approved':
                return <FiCheckCircle className="text-green-600" />;
            default:
                return <FiAlertCircle className="text-gray-600" />;
        }
    };

    return (
        <div className="card hover:shadow-md transition cursor-pointer" onClick={() => onViewDetails(request._id)}>
            <div className="flex items-start justify-between mb-4">
                <div>
                    <h3 className="text-lg font-semibold text-gray-800">
                        {request.title}
                    </h3>
                    <p className="text-sm text-gray-500">{request.requestNumber}</p>
                </div>
                <div className="flex gap-2">
                    <span className={`badge ${getStatusColor(request.status)}`}>
                        {request.status.replace('-', ' ')}
                    </span>
                </div>
            </div>

            <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                {request.description}
            </p>

            <div className="grid grid-cols-2 gap-4 mb-4 pb-4 border-b border-gray-200">
                <div>
                    <p className="text-xs text-gray-500 mb-1">Amount</p>
                    <p className="text-lg font-semibold text-gray-800">
                        ${request.amount.toLocaleString()}
                    </p>
                </div>
                <div>
                    <p className="text-xs text-gray-500 mb-1">Risk Level</p>
                    <p className={`text-lg font-semibold ${getRiskColor(request.riskLevel)}`}>
                        {request.riskLevel.charAt(0).toUpperCase() +
                            request.riskLevel.slice(1)}
                    </p>
                </div>
            </div>

            <div className="flex items-center justify-between">
                <span className="text-xs text-gray-500">
                    Created{' '}
                    {new Date(request.createdAt).toLocaleDateString()}
                </span>
                <div className="flex items-center gap-2">
                    {getStatusIcon(request.status)}
                    <span className="text-xs font-medium text-gray-700">
                        {request.status}
                    </span>
                </div>
            </div>
        </div>
    );
};

interface StatCardProps {
    title: string;
    value: string | number;
    color: string;
    icon?: React.ReactNode;
}

export const StatCard: React.FC<StatCardProps> = ({
    title,
    value,
    color,
    icon,
}) => {
    return (
        <div className={`card border-l-4 ${color}`}>
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-gray-600 text-sm mb-2">{title}</p>
                    <p className="text-3xl font-bold text-gray-800">{value}</p>
                </div>
                {icon && <div className="text-3xl opacity-20">{icon}</div>}
            </div>
        </div>
    );
};
