import React, { ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import {
    FiHome,
    FiFileText,
    FiCheckCircle,
    FiBarChart,
    FiLogOut,
    FiMenu,
    FiX,
} from 'react-icons/fi';
import { useState } from 'react';

interface LayoutProps {
    children: ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
    const navigate = useNavigate();
    const { user, logout } = useAuth();
    const [sidebarOpen, setSidebarOpen] = useState(true);

    const handleLogout = async () => {
        await logout();
        navigate('/login');
    };

    const menuItems = [
        {
            label: 'Dashboard',
            icon: FiHome,
            href: '/dashboard',
            roles: ['user', 'manager', 'admin'],
        },
        {
            label: 'Submit Request',
            icon: FiFileText,
            href: '/submit-request',
            roles: ['user'],
        },
        {
            label: 'My Requests',
            icon: FiFileText,
            href: '/my-requests',
            roles: ['user'],
        },
        {
            label: 'Review Queue',
            icon: FiCheckCircle,
            href: '/review-queue',
            roles: ['manager', 'admin'],
        },
        {
            label: 'Analytics',
            icon: FiBarChart,
            href: '/analytics',
            roles: ['admin'],
        },
    ];

    const filteredMenu = menuItems.filter((item) =>
        item.roles.includes(user?.role || '')
    );

    return (
        <div className="flex h-screen bg-gray-100">
            {/* Sidebar */}
            <aside
                className={`${sidebarOpen ? 'w-64' : 'w-20'
                    } bg-blue-900 text-white transition-all duration-300 flex flex-col`}
            >
                {/* Logo */}
                <div className="p-6 border-b border-blue-800 flex items-center justify-between">
                    {sidebarOpen && (
                        <h1 className="text-xl font-bold">Smart Approval</h1>
                    )}
                    <button
                        onClick={() => setSidebarOpen(!sidebarOpen)}
                        className="text-white hover:bg-blue-800 p-2 rounded"
                    >
                        {sidebarOpen ? <FiX size={20} /> : <FiMenu size={20} />}
                    </button>
                </div>

                {/* Navigation */}
                <nav className="flex-1 px-3 py-6 space-y-2">
                    {filteredMenu.map((item) => {
                        const Icon = item.icon;
                        return (
                            <button
                                key={item.href}
                                onClick={() => navigate(item.href)}
                                className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-blue-800 transition text-left"
                            >
                                <Icon size={20} />
                                {sidebarOpen && <span>{item.label}</span>}
                            </button>
                        );
                    })}
                </nav>

                {/* User Info & Logout */}
                <div className="p-6 border-t border-blue-800">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 bg-blue-700 rounded-full flex items-center justify-center font-bold">
                            {user?.firstName[0]}
                        </div>
                        {sidebarOpen && (
                            <div className="text-sm">
                                <p className="font-semibold">{user?.firstName}</p>
                                <p className="text-blue-300 text-xs">{user?.role}</p>
                            </div>
                        )}
                    </div>
                    <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-4 py-2 bg-red-600 rounded-lg hover:bg-red-700 transition"
                    >
                        <FiLogOut size={20} />
                        {sidebarOpen && <span>Logout</span>}
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <div className="flex-1 flex flex-col overflow-hidden">
                {/* Header */}
                <header className="bg-white border-b border-gray-200 px-6 py-4 shadow-sm">
                    <div className="flex items-center justify-between">
                        <h2 className="text-2xl font-bold text-gray-800">
                            Smart Approval Intelligence System
                        </h2>
                        <div className="text-sm text-gray-600">
                            Welcome, {user?.firstName}!
                        </div>
                    </div>
                </header>

                {/* Content */}
                <main className="flex-1 overflow-auto p-6">
                    {children}
                </main>
            </div>
        </div>
    );
};
