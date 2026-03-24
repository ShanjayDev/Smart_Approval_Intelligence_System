import React, { useState } from 'react';
import apiService from '../services/api';
import { Layout } from '../components/Layout';
import { toast } from 'react-toastify';
import { FiAlertCircle, FiCheckCircle } from 'react-icons/fi';
import { RiskAssessment } from '../types/index.ts';
import { useNavigate } from 'react-router-dom';

export const SubmitRequestPage: React.FC = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [riskAssessment, setRiskAssessment] = useState<RiskAssessment | null>(
        null
    );
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        amount: 0,
        category: 'other' as const,
    });

    const handleInputChange = (
        e: React.ChangeEvent<
            HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
        >
    ) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]:
                name === 'amount'
                    ? parseFloat(value) || 0
                    : value,
        }));
    };

    const handleAssessRisk = async () => {
        if (!formData.title || !formData.description || formData.amount <= 0) {
            toast.error('Please fill all required fields');
            return;
        }

        try {
            setLoading(true);
            const response = await apiService.assessRisk({
                title: formData.title,
                description: formData.description,
                amount: formData.amount,
                category: formData.category,
            });
            setRiskAssessment(response.assessment);
            toast.success('Risk assessment completed');
        } catch (error) {
            toast.error('Failed to assess risk');
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (
            !formData.title ||
            !formData.description ||
            formData.amount <= 0
        ) {
            toast.error('Please fill all required fields');
            return;
        }

        try {
            setLoading(true);
            await apiService.createRequest({
                ...formData,
            });
            toast.success('Request submitted successfully');
            navigate('/my-requests');
        } catch (error: any) {
            toast.error(
                error.response?.data?.message || 'Failed to submit request'
            );
        } finally {
            setLoading(false);
        }
    };

    const getRiskColor = (level: string) => {
        switch (level) {
            case 'low':
                return 'border-emerald-500 bg-emerald-50';
            case 'medium':
                return 'border-amber-500 bg-amber-50';
            case 'high':
                return 'border-orange-500 bg-orange-50';
            case 'critical':
                return 'border-red-500 bg-red-50';
            default:
                return 'border-gray-500 bg-gray-50';
        }
    };

    return (
        <Layout>
            <div className="space-y-6 fade-in max-w-2xl">
                <div>
                    <h2 className="text-3xl font-bold text-gray-800 mb-2">
                        Submit New Request
                    </h2>
                    <p className="text-gray-600">
                        Create a new approval request with AI-powered risk assessment
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Title */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Request Title <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            name="title"
                            value={formData.title}
                            onChange={handleInputChange}
                            className="form-input"
                            placeholder="e.g., Software License Purchase"
                            required
                        />
                    </div>

                    {/* Description */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Description <span className="text-red-500">*</span>
                        </label>
                        <textarea
                            name="description"
                            value={formData.description}
                            onChange={handleInputChange}
                            rows={5}
                            className="form-textarea"
                            placeholder="Provide detailed information about your request..."
                            required
                        ></textarea>
                    </div>

                    <div className="grid grid-cols-2 gap-6">
                        {/* Amount */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Amount (USD) <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="number"
                                name="amount"
                                value={formData.amount}
                                onChange={handleInputChange}
                                className="form-input"
                                placeholder="0.00"
                                required
                                min="1"
                                step="0.01"
                            />
                        </div>

                        {/* Category */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Category <span className="text-red-500">*</span>
                            </label>
                            <select
                                name="category"
                                value={formData.category}
                                onChange={handleInputChange}
                                className="form-select"
                                required
                            >
                                <option value="travel">Travel</option>
                                <option value="equipment">Equipment</option>
                                <option value="software">Software</option>
                                <option value="service">Service</option>
                                <option value="other">Other</option>
                            </select>
                        </div>
                    </div>

                    {/* Risk Assessment Button */}
                    <button
                        type="button"
                        onClick={handleAssessRisk}
                        disabled={loading}
                        className="w-full btn-secondary"
                    >
                        {loading ? 'Assessing Risk...' : 'Assess Risk'}
                    </button>

                    {/* Risk Assessment Result */}
                    {riskAssessment && (
                        <div
                            className={`border-2 rounded-lg p-6 ${getRiskColor(
                                riskAssessment.riskLevel
                            )}`}
                        >
                            <div className="flex items-start justify-between mb-4">
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-800 mb-1">
                                        AI Risk Assessment
                                    </h3>
                                    <p className="text-gray-600 text-sm">
                                        Automated analysis of your request
                                    </p>
                                </div>
                                {riskAssessment.riskLevel === 'low' ||
                                    riskAssessment.riskLevel === 'medium' ? (
                                    <FiCheckCircle size={32} className="text-green-600" />
                                ) : (
                                    <FiAlertCircle size={32} className="text-red-600" />
                                )}
                            </div>

                            <div className="grid grid-cols-3 gap-4 mb-4 pb-4 border-b border-gray-300">
                                <div>
                                    <p className="text-xs text-gray-600 mb-1">
                                        Risk Score
                                    </p>
                                    <p className="text-2xl font-bold text-gray-800">
                                        {riskAssessment.riskScore}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-xs text-gray-600 mb-1">
                                        Risk Level
                                    </p>
                                    <p className="text-xl font-bold text-gray-800 capitalize">
                                        {riskAssessment.riskLevel}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-xs text-gray-600 mb-1">
                                        Decision
                                    </p>
                                    <p className="text-sm font-semibold text-gray-800 capitalize">
                                        {riskAssessment.riskLevel === 'low'
                                            ? 'Auto-Approvable'
                                            : 'Manual Review'}
                                    </p>
                                </div>
                            </div>

                            <div className="mb-4">
                                <p className="text-xs font-semibold text-gray-700 mb-2">
                                    Recommendation:
                                </p>
                                <p className="text-sm text-gray-700">
                                    {riskAssessment.recommendation}
                                </p>
                            </div>

                            {riskAssessment.factors.length > 0 && (
                                <div>
                                    <p className="text-xs font-semibold text-gray-700 mb-2">
                                        Risk Factors:
                                    </p>
                                    <ul className="text-sm text-gray-700 space-y-1">
                                        {riskAssessment.factors.map((factor, idx) => (
                                            <li key={idx} className="flex gap-2">
                                                <span className="text-gray-400">•</span>
                                                <span>{factor}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Submit Button */}
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full btn-primary py-3 text-lg font-semibold"
                    >
                        {loading ? 'Submitting...' : 'Submit Request'}
                    </button>
                </form>
            </div>
        </Layout>
    );
};
