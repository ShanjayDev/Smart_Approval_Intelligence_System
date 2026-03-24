import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import apiService from '../services/api';
import { toast } from 'react-toastify';
import { FiMail, FiLock, FiUser } from 'react-icons/fi';

export const LoginPage: React.FC = () => {
    const navigate = useNavigate();
    const [isLogin, setIsLogin] = useState(true);
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        email: 'admin@example.com',
        password: 'admin123',
        firstName: '',
        lastName: '',
        department: '',
    });

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            if (isLogin) {
                const response = await apiService.login({
                    email: formData.email,
                    password: formData.password,
                });
                localStorage.setItem('token', response.token);
                toast.success('Login successful!');
                navigate('/dashboard');
            } else {
                const response = await apiService.register({
                    email: formData.email,
                    password: formData.password,
                    firstName: formData.firstName,
                    lastName: formData.lastName,
                    department: formData.department,
                });
                localStorage.setItem('token', response.token);
                toast.success('Registration successful!');
                navigate('/dashboard');
            }
        } catch (error: any) {
            toast.error(
                error.response?.data?.message || 'An error occurred'
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-900 to-blue-800 flex items-center justify-center p-4">
            <div className="w-full max-w-md">
                <div className="bg-white rounded-lg shadow-2xl p-8">
                    {/* Header */}
                    <div className="text-center mb-8">
                        <h1 className="text-3xl font-bold text-gray-800 mb-2">
                            Smart Approval
                        </h1>
                        <p className="text-gray-600">
                            AI-Powered Intelligent Approval System
                        </p>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="space-y-4">
                        {!isLogin && (
                            <>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        First Name
                                    </label>
                                    <div className="relative">
                                        <FiUser className="absolute left-3 top-3 text-gray-400" />
                                        <input
                                            type="text"
                                            name="firstName"
                                            value={formData.firstName}
                                            onChange={handleInputChange}
                                            className="form-input pl-10"
                                            placeholder="First name"
                                            required
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Last Name
                                    </label>
                                    <div className="relative">
                                        <FiUser className="absolute left-3 top-3 text-gray-400" />
                                        <input
                                            type="text"
                                            name="lastName"
                                            value={formData.lastName}
                                            onChange={handleInputChange}
                                            className="form-input pl-10"
                                            placeholder="Last name"
                                            required
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Department
                                    </label>
                                    <input
                                        type="text"
                                        name="department"
                                        value={formData.department}
                                        onChange={handleInputChange}
                                        className="form-input"
                                        placeholder="Department"
                                    />
                                </div>
                            </>
                        )}

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Email Address
                            </label>
                            <div className="relative">
                                <FiMail className="absolute left-3 top-3 text-gray-400" />
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleInputChange}
                                    className="form-input pl-10"
                                    placeholder="Email address"
                                    required
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Password
                            </label>
                            <div className="relative">
                                <FiLock className="absolute left-3 top-3 text-gray-400" />
                                <input
                                    type="password"
                                    name="password"
                                    value={formData.password}
                                    onChange={handleInputChange}
                                    className="form-input pl-10"
                                    placeholder="Password"
                                    required
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full btn-primary py-3 font-semibold mt-6"
                        >
                            {loading
                                ? 'Processing...'
                                : isLogin
                                    ? 'Sign In'
                                    : 'Create Account'}
                        </button>
                    </form>

                    {/* Toggle */}
                    <div className="mt-6 text-center">
                        <p className="text-gray-600">
                            {isLogin
                                ? "Don't have an account? "
                                : 'Already have an account? '}
                            <button
                                onClick={() => setIsLogin(!isLogin)}
                                className="text-blue-900 font-semibold hover:underline"
                            >
                                {isLogin ? 'Sign Up' : 'Sign In'}
                            </button>
                        </p>
                    </div>

                    {/* Demo Info */}
                    <div className="mt-8 p-4 bg-blue-50 rounded-lg">
                        <p className="text-xs text-gray-600 mb-2">
                            <strong>Demo Credentials:</strong>
                        </p>
                        <p className="text-xs text-gray-500">
                            Email: admin@example.com
                            <br />
                            Password: admin123
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};
