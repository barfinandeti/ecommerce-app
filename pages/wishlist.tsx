import Layout from '@/components/Layout';
import { useWishlist } from '@/lib/WishlistContext';
import Link from 'next/link';
import { Trash2, ShoppingBag } from 'lucide-react';
import { useCart } from '@/lib/CartContext';

export default function WishlistPage() {
    const { items, removeItem } = useWishlist();
    const { addItem: addToCart } = useCart();

    const handleMoveToCart = (item: any) => {
        addToCart({
            id: item.id,
            title: item.title,
            price: item.price,
            image: item.image,
            quantity: 1,
            variantId: '', // Default or prompt for size
        });
        removeItem(item.id);
        alert('Moved to Bag');
    };

    return (
        <Layout title="Wishlist | LUXE">
            <div className="container mx-auto px-4 py-12">
                <h1 className="text-2xl font-bold mb-8">My Wishlist <span className="text-gray-500 font-normal">({items.length} items)</span></h1>

                {items.length === 0 ? (
                    <div className="text-center py-20 bg-gray-50 rounded-lg">
                        <p className="text-gray-500 mb-4">Your wishlist is empty.</p>
                        <Link href="/" className="text-pink-600 font-bold hover:underline">
                            Continue Shopping
                        </Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                        {items.map((item) => (
                            <div key={item.id} className="border border-gray-200 rounded-lg overflow-hidden group relative">
                                <button
                                    onClick={() => removeItem(item.id)}
                                    className="absolute top-2 right-2 bg-white/80 p-1.5 rounded-full hover:bg-white text-gray-400 hover:text-red-500 transition-colors z-10"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </button>

                                <Link href={`/product/${item.slug}`} className="block relative aspect-[3/4]">
                                    <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
                                </Link>

                                <div className="p-4">
                                    <h3 className="font-medium text-sm mb-1 truncate">{item.title}</h3>
                                    <p className="text-sm font-bold mb-3">₹{item.price.toLocaleString('en-IN')}</p>

                                    <button
                                        onClick={() => handleMoveToCart(item)}
                                        className="w-full border border-pink-600 text-pink-600 text-xs font-bold py-2 rounded hover:bg-pink-600 hover:text-white transition-colors flex items-center justify-center uppercase tracking-wide"
                                    >
                                        <ShoppingBag className="w-3 h-3 mr-2" />
                                        Move to Bag
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </Layout>
    );
}
