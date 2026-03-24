import React, { useEffect, useState } from 'react';

const Settings: React.FC = () => {
    const [theme, setTheme] = useState<'light' | 'dark' | 'system'>('system');

    useEffect(() => {
        const saved = localStorage.getItem('theme') as 'light' | 'dark' | 'system' | null;
        if (saved) setTheme(saved);
        else setTheme('system');
    }, []);

    useEffect(() => {
        const root = document.documentElement;
        const apply = (t: 'light' | 'dark' | 'system') => {
            if (t === 'dark') {
                root.classList.add('dark');
            } else if (t === 'light') {
                root.classList.remove('dark');
            } else {
                const prefersDark =
                    window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
                if (prefersDark) root.classList.add('dark');
                else root.classList.remove('dark');
            }
        };

        apply(theme);
        try {
            localStorage.setItem('theme', theme);
        } catch (e) {
            // ignore
        }

        let mql: MediaQueryList | null = null;
        const handleChange = () => apply(theme);
        if (theme === 'system' && window.matchMedia) {
            mql = window.matchMedia('(prefers-color-scheme: dark)');
            mql.addEventListener ? mql.addEventListener('change', handleChange) : mql.addListener(handleChange);
        }
        return () => {
            if (mql) {
                mql.removeEventListener ? mql.removeEventListener('change', handleChange) : mql.removeListener(handleChange);
            }
        };
    }, [theme]);

    return (
        <div className="card">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Settings</h3>
            <div className="flex items-center space-x-4">
                <label className="text-sm font-medium text-gray-700">Theme</label>
                <select
                    value={theme}
                    onChange={(e) => setTheme(e.target.value as 'light' | 'dark' | 'system')}
                    className="form-select max-w-xs"
                >
                    <option value="system">System</option>
                    <option value="light">Light</option>
                    <option value="dark">Dark</option>
                </select>
            </div>
        </div>
    );
};

export default Settings;
