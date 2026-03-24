import { useEffect, useState } from 'react';
import apiService from '../services/api.ts';
import { User } from '../types/index.ts';

export function useAuth() {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            fetchProfile();
        } else {
            setLoading(false);
        }
    }, []);

    const fetchProfile = async () => {
        try {
            const profile = await apiService.getProfile();
            setUser(profile);
        } catch (err) {
            setError('Failed to fetch profile');
            localStorage.removeItem('token');
        } finally {
            setLoading(false);
        }
    };

    const logout = async () => {
        try {
            await apiService.logout();
            setUser(null);
            localStorage.removeItem('token');
        } catch (err) {
            setError('Failed to logout');
        }
    };

    return { user, loading, error, logout, setUser };
}
