// Hook to get admin auth token for API calls
export function useAdminAuth() {
    const getToken = () => {
        if (typeof window === 'undefined') return null;

        const sessionData = localStorage.getItem('adminSession');
        if (!sessionData) return null;

        try {
            const session = JSON.parse(sessionData);
            return session.token || null;
        } catch {
            return null;
        }
    };

    const getAuthHeaders = () => {
        const token = getToken();
        return token ? { 'Authorization': `Bearer ${token}` } : {};
    };

    return { getToken, getAuthHeaders };
}
