import Layout from '@/components/Layout';
import Link from 'next/link';
import Image from 'next/image';
import { useCart } from '@/lib/CartContext';
import { Trash2, Plus, Minus } from 'lucide-react';

export default function CartPage() {
    const { items, removeItem, updateQuantity, total } = useCart();

    if (items.length === 0) {
        return (
            <Layout title="Your Cart | LUXE">
                <div className="container mx-auto px-4 py-20 text-center">
                    <h1 className="text-3xl font-serif font-bold mb-6">Your Cart is Empty</h1>
                    <p className="text-gray-600 mb-8">Looks like you haven't added anything to your cart yet.</p>
                    <Link
                        href="/collection/all"
                        className="inline-block bg-black text-white px-8 py-4 text-sm font-bold tracking-widest hover:bg-gray-800 transition-colors"
                    >
                        CONTINUE SHOPPING
                    </Link>
                </div>
            </Layout>
        );
    }

    return (
        <Layout title="Your Cart | LUXE">
            <div className="container mx-auto px-4 py-12">
                <h1 className="text-3xl font-serif font-bold mb-8">Shopping Cart</h1>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                    {/* Cart Items */}
                    <div className="lg:col-span-2">
                        <div className="space-y-8">
                            {items.map((item) => (
                                <div key={item.id} className="flex gap-6 border-b border-gray-100 pb-8">
                                    <div className="relative w-24 h-32 flex-shrink-0 bg-gray-100">
                                        <Image
                                            src={item.image}
                                            alt={item.title}
                                            fill
                                            className="object-cover"
                                        />
                                    </div>

                                    <div className="flex-1">
                                        <div className="flex justify-between mb-2">
                                            <h3 className="font-medium">
                                                <Link href={`/product/slug`} className="hover:text-accent transition-colors">
                                                    {item.title}
                                                </Link>
                                            </h3>
                                            <button
                                                onClick={() => removeItem(item.id)}
                                                className="text-gray-400 hover:text-red-500 transition-colors"
                                            >
                                                <Trash2 className="w-5 h-5" />
                                            </button>
                                        </div>

                                        <p className="text-sm text-gray-500 mb-4">Size: {item.size}</p>

                                        <div className="flex justify-between items-end">
                                            <div className="flex items-center border border-gray-200 rounded">
                                                <button
                                                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                                    className="p-2 hover:bg-gray-50 text-gray-500"
                                                >
                                                    <Minus className="w-4 h-4" />
                                                </button>
                                                <span className="w-8 text-center text-sm">{item.quantity}</span>
                                                <button
                                                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                                    className="p-2 hover:bg-gray-50 text-gray-500"
                                                >
                                                    <Plus className="w-4 h-4" />
                                                </button>
                                            </div>
                                            <span className="font-medium">₹{(item.price * item.quantity).toLocaleString('en-IN')}</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Summary */}
                    <div className="lg:col-span-1">
                        <div className="bg-gray-50 p-6 rounded-lg">
                            <h2 className="text-xl font-serif font-bold mb-6">Order Summary</h2>

                            <div className="space-y-4 mb-6 border-b border-gray-200 pb-6">
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-600">Subtotal</span>
                                    <span className="font-medium">₹{total.toLocaleString('en-IN')}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-600">Shipping</span>
                                    <span className="text-green-600 font-medium">Free</span>
                                </div>
                            </div>

                            <div className="flex justify-between text-lg font-bold mb-8">
                                <span>Total</span>
                                <span>₹{total.toLocaleString('en-IN')}</span>
                            </div>

                            <Link
                                href="/checkout"
                                className="block w-full bg-black text-white text-center py-4 font-bold tracking-widest hover:bg-gray-800 transition-colors"
                            >
                                PROCEED TO CHECKOUT
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    );
}
