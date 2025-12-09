import Header from './Header';
import Footer from './Footer';
import Head from 'next/head';

interface LayoutProps {
    children: React.ReactNode;
    title?: string;
    description?: string;
}

import CartSidebar from './CartSidebar';
import LoginModal from './LoginModal';
import { useAuth } from '@/lib/AuthContext';

const Layout = ({ children, title = 'LUXE | Timeless Elegance', description = 'Shop the latest collection of premium clothing.' }: LayoutProps) => {
    const { isLoginModalOpen, closeLoginModal } = useAuth();
    return (
        <>
            <Head>
                <title>{title}</title>
                <meta name="description" content={description} />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <div className="flex flex-col min-h-screen">
                <Header />
                <CartSidebar />
                <main className="flex-grow">
                    {children}
                </main>
                <Footer />
                <LoginModal
                    isOpen={isLoginModalOpen}
                    onClose={closeLoginModal}
                    onSuccess={() => {
                        closeLoginModal();
                        // Optional: Show success toast or redirect
                    }}
                />
            </div>
        </>
    );
};

export default Layout;
