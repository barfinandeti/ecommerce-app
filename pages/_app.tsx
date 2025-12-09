import '@/styles/globals.css';
import type { AppProps } from 'next/app';
import { CartProvider } from '@/lib/CartContext';
import { Inter, Playfair_Display } from 'next/font/google';
import { WishlistProvider } from '@/lib/WishlistContext';
import { AuthProvider } from '@/lib/AuthContext';
import { Toaster } from "@/components/ui/sonner"

const inter = Inter({ subsets: ['latin'], variable: '--font-sans' });
const playfair = Playfair_Display({ subsets: ['latin'], variable: '--font-serif' });

export default function App({ Component, pageProps }: AppProps) {
  return (
    <AuthProvider>
      <CartProvider>
        <WishlistProvider>
          <main className={`${inter.variable} ${playfair.variable} font-sans`}>
            <Component {...pageProps} />
            <Toaster />
          </main>
        </WishlistProvider>
      </CartProvider>
    </AuthProvider>
  );
}
