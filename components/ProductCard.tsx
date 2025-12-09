import Link from 'next/link';
import Image from 'next/image';
import { Plus, Heart } from 'lucide-react';
import { useWishlist } from '@/lib/WishlistContext';

interface Product {
    id: string;
    slug: string;
    title: string;
    price: number;
    compare_at_price?: number;
    images: string[];
    category?: string;
}

interface ProductCardProps {
    product: Product;
}

const ProductCard = ({ product }: ProductCardProps) => {
    const { addItem, removeItem, isInWishlist } = useWishlist();
    const inWishlist = isInWishlist(product.id);

    const toggleWishlist = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (inWishlist) {
            removeItem(product.id);
        } else {
            addItem({
                id: product.id,
                title: product.title,
                price: product.price,
                image: product.images[0],
                slug: product.slug
            });
        }
    };

    return (
        <div className="group relative">
            <Link href={`/product/${product.slug}`} className="block relative aspect-[3/4] overflow-hidden bg-gray-100 mb-4">
                {product.images[0] && (
                    <Image
                        src={product.images[0]}
                        alt={product.title}
                        fill
                        className="object-cover object-center transition-transform duration-500 group-hover:scale-105"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                )}

                {/* Wishlist Button */}
                <button
                    onClick={toggleWishlist}
                    className="absolute top-3 right-3 p-2 bg-white/80 rounded-full hover:bg-white transition-colors z-10"
                >
                    <Heart className={`w-4 h-4 ${inWishlist ? 'fill-red-500 text-red-500' : 'text-gray-600'}`} />
                </button>

                {/* Quick Add Button */}
                <button className="absolute bottom-4 right-4 bg-white text-pink-600 p-3 rounded-full shadow-lg opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 hover:bg-pink-600 hover:text-white">
                    <Plus className="w-5 h-5" />
                </button>
            </Link>

            <div className="mt-3">
                <Link href={`/product/${product.slug}`}>
                    <h3 className="text-sm font-bold text-gray-900 mb-1 hover:text-pink-600 transition-colors uppercase tracking-wide truncate">
                        {product.title}
                    </h3>
                </Link>
                <div className="flex items-center space-x-2">
                    <span className="text-sm font-bold text-gray-900">
                        ₹{product.price.toLocaleString('en-IN')}
                    </span>
                    {product.compare_at_price && (
                        <span className="text-xs text-gray-400 line-through">
                            ₹{product.compare_at_price.toLocaleString('en-IN')}
                        </span>
                    )}
                    {product.compare_at_price && (
                        <span className="text-[10px] font-bold text-pink-600 bg-pink-50 px-1.5 py-0.5 rounded">
                            {Math.round(((product.compare_at_price - product.price) / product.compare_at_price) * 100)}% OFF
                        </span>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ProductCard;
