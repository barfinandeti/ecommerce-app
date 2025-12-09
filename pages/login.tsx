import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '@/lib/AuthContext';
import { Loader2 } from 'lucide-react';

export default function LoginPage() {
    const router = useRouter();
    const { openLoginModal } = useAuth();

    useEffect(() => {
        // Redirect to home and open login modal
        router.push('/');
        // Small timeout to ensure redirect happens/context is ready
        setTimeout(() => {
            openLoginModal();
        }, 100);
    }, [router, openLoginModal]);

    return (
        <div className="min-h-screen flex items-center justify-center bg-white">
            <div className="flex flex-col items-center space-y-4">
                <Loader2 className="w-8 h-8 animate-spin text-pink-600" />
                <p className="text-gray-500 font-medium">Redirecting to login...</p>
            </div>
        </div>
    );
}
