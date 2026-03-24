import React from 'react';
import {
    BrowserRouter as Router,
    Routes,
    Route,
    Navigate,
} from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './styles/index.css';

import { LoginPage } from './pages/LoginPage';
import { DashboardPage } from './pages/DashboardPage';
import { SubmitRequestPage } from './pages/SubmitRequestPage';
import { MyRequestsPage } from './pages/MyRequestsPage';
import { ReviewQueuePage } from './pages/ReviewQueuePage';
import { AnalyticsPage } from './pages/AnalyticsPage';
import { useAuth } from './hooks/useAuth';

// Protected Route Component
interface ProtectedRouteProps {
    children: React.ReactNode;
    requiredRole?: string;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
    children,
    requiredRole,
}) => {
    const { user, loading } = useAuth();

    if (loading) {
        return (
            <div className="flex items-center justify-center h-screen">
                <div className="spinner text-5xl">⚙️</div>
            </div>
        );
    }

    if (!user) {
        return <Navigate to="/login" replace />;
    }

    if (
        requiredRole &&
        !['admin', requiredRole].includes(user.role)
    ) {
        return <Navigate to="/dashboard" replace />;
    }

    return <>{children}</>;
};

function App() {
    return (
        <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
            <div>
                <Routes>
                    {/* Public Routes */}
                    <Route path="/login" element={<LoginPage />} />

                    {/* Protected Routes */}
                    <Route
                        path="/dashboard"
                        element={
                            <ProtectedRoute>
                                <DashboardPage />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/submit-request"
                        element={
                            <ProtectedRoute requiredRole="user">
                                <SubmitRequestPage />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/my-requests"
                        element={
                            <ProtectedRoute requiredRole="user">
                                <MyRequestsPage />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/review-queue"
                        element={
                            <ProtectedRoute requiredRole="manager">
                                <ReviewQueuePage />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/analytics"
                        element={
                            <ProtectedRoute requiredRole="admin">
                                <AnalyticsPage />
                            </ProtectedRoute>
                        }
                    />

                    {/* Default Route */}
                    <Route path="/" element={<Navigate to="/dashboard" replace />} />
                </Routes>

                {/* Toast Notifications */}
                <ToastContainer
                    position="top-right"
                    autoClose={3000}
                    hideProgressBar={false}
                    newestOnTop={true}
                    closeOnClick
                    rtl={false}
                    pauseOnFocusLoss
                    draggable
                    pauseOnHover
                />
            </div>
        </Router>
    );
}

export default App;
