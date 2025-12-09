import { useCart } from '@/lib/CartContext';
import { useAuth } from '@/lib/AuthContext';
import { X, Plus, Minus, Trash2, ChevronRight, Tag } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/router';
import LoginModal from './LoginModal';

export default function CartSidebar() {
    const { items, removeItem, updateQuantity, total, isCartOpen, closeCart } = useCart();
    const { user } = useAuth();
    const sidebarRef = useRef<HTMLDivElement>(null);
    const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
    const router = useRouter();

    const handleCheckout = () => {
        if (user) {
            closeCart();
            router.push('/checkout');
        } else {
            setIsLoginModalOpen(true);
        }
    };

    const handleLoginSuccess = () => {
        setIsLoginModalOpen(false);
        closeCart();
        router.push('/checkout');
    };

    // Close on click outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (sidebarRef.current && !sidebarRef.current.contains(event.target as Node) && isCartOpen) {
                closeCart();
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [isCartOpen, closeCart]);

    // Prevent body scroll when open
    useEffect(() => {
        if (isCartOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isCartOpen]);

    return (
        <>
            {/* Backdrop */}
            <div
                className={`fixed inset-0 bg-black/50 z-[60] transition-opacity duration-300 ${isCartOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
            />

            {/* Sidebar */}
            <div
                ref={sidebarRef}
                className={`fixed top-0 right-0 h-full w-full md:w-[450px] bg-gray-50 z-[70] shadow-2xl transform transition-transform duration-300 ease-in-out ${isCartOpen ? 'translate-x-0' : 'translate-x-full'} flex flex-col`}
            >
                {/* Header */}
                <div className="bg-white px-6 py-4 flex items-center justify-between shadow-sm border-b border-gray-100">
                    <h2 className="text-lg font-bold text-gray-900">Your Cart ({items.length} items)</h2>
                    <button onClick={closeCart} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                        <X className="w-5 h-5 text-gray-500" />
                    </button>
                </div>

                {/* Items */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                    {items.length === 0 ? (
                        <div className="h-full flex flex-col items-center justify-center text-center p-8">
                            <div className="w-20 h-20 bg-pink-50 rounded-full flex items-center justify-center mb-4">
                                <Tag className="w-10 h-10 text-pink-300" />
                            </div>
                            <h3 className="text-lg font-bold text-gray-900 mb-2">Your cart is empty</h3>
                            <p className="text-gray-500 mb-6">Looks like you haven't added anything to your cart yet.</p>
                            <button onClick={closeCart} className="bg-pink-600 text-white px-8 py-3 rounded-lg font-bold hover:bg-pink-700 transition-colors">
                                Start Shopping
                            </button>
                        </div>
                    ) : (
                        items.map((item) => (
                            <div key={`${item.id}-${item.variantId}`} className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex gap-4">
                                <div className="relative w-24 h-32 flex-shrink-0 bg-gray-100 rounded-lg overflow-hidden">
                                    <Image
                                        src={item.image}
                                        alt={item.title}
                                        fill
                                        className="object-cover"
                                    />
                                </div>
                                <div className="flex-1 flex flex-col justify-between">
                                    <div>
                                        <div className="flex justify-between items-start">
                                            <h3 className="font-bold text-gray-900 line-clamp-2 text-sm">{item.title}</h3>
                                            <button onClick={() => removeItem(item.id)} className="text-gray-400 hover:text-red-500 p-1">
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                        {item.size && <p className="text-xs text-gray-500 mt-1">Size: {item.size}</p>}
                                        <div className="flex items-center gap-2 mt-2">
                                            <span className="font-bold text-gray-900">₹{item.price.toLocaleString('en-IN')}</span>
                                            {/* Mock discount for visual match */}
                                            <span className="text-xs text-green-600 font-bold">(43% OFF)</span>
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-between mt-3">
                                        <div className="flex items-center bg-gray-50 rounded-lg border border-gray-200">
                                            <button
                                                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                                className="p-1.5 hover:bg-gray-100 rounded-l-lg text-gray-600"
                                            >
                                                <Minus className="w-3 h-3" />
                                            </button>
                                            <span className="w-8 text-center text-sm font-bold">{item.quantity}</span>
                                            <button
                                                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                                className="p-1.5 hover:bg-gray-100 rounded-r-lg text-gray-600"
                                            >
                                                <Plus className="w-3 h-3" />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}

                    {/* Upsell / Explore More (Mock) */}
                    {items.length > 0 && (
                        <div className="mt-8">
                            <h3 className="font-bold text-gray-900 mb-4">Explore More</h3>
                            <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
                                {[1, 2].map((i) => (
                                    <div key={`explore-${i}`} className="min-w-[140px] bg-white p-3 rounded-xl border border-gray-100">
                                        <div className="h-32 bg-gray-100 rounded-lg mb-2 relative overflow-hidden">
                                            {/* Placeholder */}
                                            <div className="absolute inset-0 bg-gray-200" />
                                        </div>
                                        <p className="font-bold text-xs truncate">Trending T-Shirt</p>
                                        <p className="text-xs text-gray-500">₹999.00</p>
                                        <button className="w-full mt-2 border border-pink-600 text-pink-600 text-xs font-bold py-1 rounded hover:bg-pink-50">
                                            + Add
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* Footer */}
                {items.length > 0 && (
                    <div className="bg-white p-4 border-t border-gray-100 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
                        {/* Coupon */}
                        <div className="mb-4">
                            <div className="flex items-center bg-white border border-gray-200 rounded-lg px-3 py-2 cursor-pointer hover:border-pink-500 transition-colors">
                                <Tag className="w-4 h-4 text-green-500 mr-2" />
                                <span className="text-sm text-gray-500 flex-1">Enter Coupon Code</span>
                                <ChevronRight className="w-4 h-4 text-gray-400" />
                            </div>
                        </div>

                        {/* Savings Banner */}
                        <div className="bg-teal-500 text-white text-center text-xs font-bold py-1.5 rounded-t-lg mx-4 relative top-1">
                            ₹1,000.00 Saved so far!
                        </div>

                        {/* Checkout Button */}
                        <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-4">
                            <div className="flex justify-between items-center mb-3">
                                <span className="font-bold text-gray-700">Estimated Total</span>
                                <div className="text-right">
                                    <span className="text-gray-400 line-through text-xs block">₹{(total * 1.4).toLocaleString('en-IN')}</span>
                                    <span className="text-xl font-black text-gray-900">₹{total.toLocaleString('en-IN')}</span>
                                </div>
                            </div>
                            <button
                                onClick={handleCheckout}
                                className="block w-full bg-violet-600 text-white py-3.5 rounded-xl font-bold text-lg text-center hover:bg-violet-700 transition-colors shadow-lg shadow-violet-200 flex items-center justify-between px-6"
                            >
                                <span>Checkout</span>
                                <div className="flex -space-x-2">
                                    {/* Payment Icons Mock */}
                                    <div className="w-6 h-6 rounded-full bg-white flex items-center justify-center text-[8px] text-blue-600 font-bold border border-gray-100">Pay</div>
                                    <div className="w-6 h-6 rounded-full bg-white flex items-center justify-center text-[8px] text-purple-600 font-bold border border-gray-100">UPI</div>
                                </div>
                            </button>
                        </div>
                    </div>
                )}
            </div>

            <LoginModal
                isOpen={isLoginModalOpen}
                onClose={() => setIsLoginModalOpen(false)}
                onSuccess={handleLoginSuccess}
            />
        </>
    );
}
