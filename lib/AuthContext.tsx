import { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { User } from '@supabase/supabase-js';
import { useRouter } from 'next/router';

interface AuthContextType {
    user: User | null;
    role: 'SUPERADMIN' | 'ADMIN' | 'USER' | null;
    organizationId: string | null;
    loading: boolean;
    logout: () => Promise<void>;
    isLoginModalOpen: boolean;
    openLoginModal: () => void;
    closeLoginModal: () => void;
}

const AuthContext = createContext<AuthContextType>({
    user: null,
    role: null,
    organizationId: null,
    loading: true,
    logout: async () => { },
    isLoginModalOpen: false,
    openLoginModal: () => { },
    closeLoginModal: () => { },
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [role, setRole] = useState<'SUPERADMIN' | 'ADMIN' | 'USER' | null>(null);
    const [organizationId, setOrganizationId] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
    const router = useRouter();

    const openLoginModal = () => setIsLoginModalOpen(true);
    const closeLoginModal = () => setIsLoginModalOpen(false);

    const fetchUserProfile = async (sessionUser: User | null) => {
        if (!sessionUser) {
            setUser(null);
            setRole(null);
            setOrganizationId(null);
            setLoading(false);
            return;
        }

        try {
            const { data: { session } } = await supabase.auth.getSession();
            const token = session?.access_token;

            const res = await fetch('/api/me', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (res.ok) {
                const { user: dbUser } = await res.json();
                setUser(sessionUser);
                setRole(dbUser.role);
                setOrganizationId(dbUser.organizationId);
            } else {
                console.error('Failed to fetch user profile');
            }
        } catch (error) {
            console.error('Error fetching user profile:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const checkUser = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            await fetchUserProfile(session?.user ?? null);
        };

        checkUser();

        const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
            await fetchUserProfile(session?.user ?? null);
        });

        return () => subscription.unsubscribe();
    }, []);

    const logout = async () => {
        console.log('Logging out...');
        try {
            const { error } = await supabase.auth.signOut();
            if (error) console.error('Error signing out:', error);
            else console.log('Signed out from Supabase');
        } catch (err) {
            console.error('Exception during sign out:', err);
        }

        setUser(null);
        setRole(null);
        setOrganizationId(null);
        console.log('State cleared, redirecting to home...');
        router.push('/');
    };

    return (
        <AuthContext.Provider value={{ user, role, organizationId, loading, logout, isLoginModalOpen, openLoginModal, closeLoginModal }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
