import axios, { AxiosInstance } from 'axios';
import {
    User,
    ApprovalRequest,
    RiskAssessment,
    DashboardStats,
    LoginCredentials,
    RegisterData,
} from '../types/index';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

class APIService {
    private axiosInstance: AxiosInstance;

    constructor() {
        this.axiosInstance = axios.create({
            baseURL: API_URL,
        });

        // Add token to requests
        this.axiosInstance.interceptors.request.use((config) => {
            const token = localStorage.getItem('token');
            if (token) {
                config.headers.Authorization = `Bearer ${token}`;
            }
            return config;
        });

        // Handle responses
        this.axiosInstance.interceptors.response.use(
            (response) => response,
            (error) => {
                if (error.response?.status === 401) {
                    localStorage.removeItem('token');
                    window.location.href = '/login';
                }
                return Promise.reject(error);
            }
        );
    }

    // Auth endpoints
    async login(credentials: LoginCredentials) {
        const response = await this.axiosInstance.post<{
            token: string;
            user: User;
        }>('/auth/login', credentials);
        return response.data;
    }

    async register(data: RegisterData) {
        const response = await this.axiosInstance.post<{
            token: string;
            user: User;
        }>('/auth/register', data);
        return response.data;
    }

    async getProfile() {
        const response = await this.axiosInstance.get<User>('/auth/profile');
        return response.data;
    }

    async logout() {
        await this.axiosInstance.post('/auth/logout', {});
    }

    // Request endpoints
    async createRequest(data: Partial<ApprovalRequest>) {
        const response = await this.axiosInstance.post<{
            request: ApprovalRequest;
            riskAssessment: RiskAssessment;
        }>('/requests', data);
        return response.data;
    }

    async getMyRequests(filters?: {
        status?: string;
        category?: string;
    }) {
        const response = await this.axiosInstance.get<ApprovalRequest[]>(
            '/requests',
            { params: filters }
        );
        return response.data;
    }

    async getRequestById(id: string) {
        const response = await this.axiosInstance.get<ApprovalRequest>(
            `/requests/${id}`
        );
        return response.data;
    }

    async updateRequest(id: string, data: Partial<ApprovalRequest>) {
        const response = await this.axiosInstance.put<{
            request: ApprovalRequest;
        }>(`/requests/${id}`, data);
        return response.data;
    }

    async deleteRequest(id: string) {
        await this.axiosInstance.delete(`/requests/${id}`);
    }

    // Review queue endpoints
    async getReviewQueue(filters?: {
        status?: string;
        riskLevel?: string;
    }) {
        const response = await this.axiosInstance.get<ApprovalRequest[]>(
            '/review-queue',
            { params: filters }
        );
        return response.data;
    }

    async approveRequest(id: string, comment?: string) {
        const response = await this.axiosInstance.post<{
            request: ApprovalRequest;
        }>(`/review-queue/${id}/approve`, { comment });
        return response.data;
    }

    async rejectRequest(id: string, reason: string, comment?: string) {
        const response = await this.axiosInstance.post<{
            request: ApprovalRequest;
        }>(`/review-queue/${id}/reject`, { reason, comment });
        return response.data;
    }

    async addComment(id: string, text: string) {
        const response = await this.axiosInstance.post<{
            comments: any[];
        }>(`/review-queue/${id}/comments`, { text });
        return response.data;
    }

    // Analytics endpoints
    async getDashboardStats() {
        const response = await this.axiosInstance.get<DashboardStats>(
            '/analytics/dashboard'
        );
        return response.data;
    }

    async getRequestAnalytics(days: number = 30) {
        const response = await this.axiosInstance.get('/analytics/requests', {
            params: { days },
        });
        return response.data;
    }

    async getApprovalTrends() {
        const response = await this.axiosInstance.get('/analytics/trends');
        return response.data;
    }

    // AI endpoints
    async assessRisk(data: {
        title: string;
        description: string;
        amount: number;
        category: string;
    }) {
        const response = await this.axiosInstance.post<{
            assessment: RiskAssessment;
        }>('/ai/assess-risk', data);
        return response.data;
    }
}

export default new APIService();
