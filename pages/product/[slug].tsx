import { useRouter } from 'next/router';
import Layout from '@/components/Layout';
import ProductGallery from '@/components/ProductGallery';
import { useState } from 'react';
import { Star, Truck, ShieldCheck, Ruler, Heart } from 'lucide-react';
import { clsx } from 'clsx';
import { useCart } from '@/lib/CartContext';
import { useWishlist } from '@/lib/WishlistContext';
import CustomizationModal from '@/components/CustomizationModal';

// Dummy data
// Dummy data
const PRODUCTS = [
    {
        id: '1',
        slug: 'rose-silk-lehenga',
        title: 'Rose Silk Lehenga',
        price: 8999,
        description: '<p>Handcrafted silk lehenga with intricate zari work. Perfect for weddings and festive occasions.</p><p>The set includes a blouse piece, the lehenga skirt, and a matching dupatta.</p>',
        images: [
            'https://images.unsplash.com/photo-1583391733956-6c78276477e2?auto=format&fit=crop&q=80&w=800',
            'https://images.unsplash.com/photo-1583391733908-266021644a42?auto=format&fit=crop&q=80&w=800',
            'https://images.unsplash.com/photo-1583391733877-08c3a4796f60?auto=format&fit=crop&q=80&w=800'
        ],
        variants: [
            { id: 'v1', size: 'S', color: 'Rose', stock: 5 },
            { id: 'v2', size: 'M', color: 'Rose', stock: 3 },
            { id: 'v3', size: 'L', color: 'Rose', stock: 0 },
            { id: 'v4', size: 'XL', color: 'Rose', stock: 2 },
        ],
        attributes: {
            fabric: 'Silk',
            care: 'Dry Clean Only',
            origin: 'India'
        }
    },
    {
        id: '2',
        slug: 'emerald-green-saree',
        title: 'Emerald Green Saree',
        price: 5499,
        description: '<p>Elegant emerald green saree with gold border. Suitable for parties and formal events.</p>',
        images: [
            'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&q=80&w=800',
            'https://images.unsplash.com/photo-1610030469668-965d05a1b9f5?auto=format&fit=crop&q=80&w=800'
        ],
        variants: [
            { id: 'v1', size: 'One Size', color: 'Green', stock: 10 }
        ],
        attributes: {
            fabric: 'Georgette',
            care: 'Dry Clean',
            origin: 'India'
        }
    },
    {
        id: '3',
        slug: 'royal-blue-anarkali',
        title: 'Royal Blue Anarkali',
        price: 6999,
        description: '<p>Stunning royal blue anarkali suit with heavy embroidery. Comes with a matching dupatta and churidar.</p>',
        images: [
            'https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&q=80&w=800',
            'https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&q=80&w=800' // Duplicate for gallery demo
        ],
        variants: [
            { id: 'v1', size: 'M', color: 'Blue', stock: 4 },
            { id: 'v2', size: 'L', color: 'Blue', stock: 6 },
            { id: 'v3', size: 'XL', color: 'Blue', stock: 2 }
        ],
        attributes: {
            fabric: 'Cotton Silk',
            care: 'Dry Clean Only',
            origin: 'India'
        }
    },
    // Add more dummy products as needed to match collection page
];

export default function ProductPage() {
    const router = useRouter();
    const { slug } = router.query;
    const { addItem } = useCart();
    const { addItem: addToWishlist, removeItem: removeFromWishlist, isInWishlist } = useWishlist();

    const [selectedSize, setSelectedSize] = useState('');
    const [showSizeError, setShowSizeError] = useState(false);
    const [isCustomizationOpen, setIsCustomizationOpen] = useState(false);

    // Find product by slug
    const product = PRODUCTS.find(p => p.slug === slug);

    if (!product) {
        return (
            <Layout title="Product Not Found | LUXE">
                <div className="container mx-auto px-4 py-20 text-center">
                    <h1 className="text-2xl font-bold mb-4">Product Not Found</h1>
                    <p className="text-gray-600 mb-8">The product you are looking for does not exist.</p>
                    <button
                        onClick={() => router.push('/')}
                        className="bg-black text-white px-6 py-3 font-bold tracking-wide hover:bg-gray-800"
                    >
                        RETURN HOME
                    </button>
                </div>
            </Layout>
        );
    }
    const inWishlist = isInWishlist(product.id);

    const toggleWishlist = () => {
        if (inWishlist) {
            removeFromWishlist(product.id);
        } else {
            addToWishlist({
                id: product.id,
                title: product.title,
                price: product.price,
                image: product.images[0],
                slug: product.slug
            });
        }
    };

    const handleSizeSelect = (size: string) => {
        setSelectedSize(size);
        setShowSizeError(false);
    };

    const handleAddToCart = () => {
        if (!selectedSize) {
            setShowSizeError(true);
            return;
        }

        addItem({
            id: product.id,
            title: product.title,
            price: product.price,
            image: product.images[0],
            quantity: 1,
            variantId: product.variants.find(v => v.size === selectedSize)?.id || ''
        });

        // alert(`Added ${product.title} (Size: ${selectedSize}) to cart!`);
    };

    const handleCustomizationSave = (data: any) => {
        console.log('Customization data:', data);
        // In a real app, you would add this item to cart with customization data
        addItem({
            id: product.id,
            title: product.title,
            price: product.price,
            image: product.images[0],
            quantity: 1,
            variantId: 'custom',
            customization: data
        });
        setIsCustomizationOpen(false);
        // alert('Added customized item to cart!');
    };

    return (
        <Layout title={`${product.title} | LUXE`}>
            <div className="container mx-auto px-4 py-12">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                    {/* Gallery */}
                    <ProductGallery images={product.images} />

                    {/* Details */}
                    <div>
                        <div className="mb-6">
                            <h1 className="text-3xl md:text-4xl font-serif font-bold mb-2">{product.title}</h1>
                            <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center space-x-4">
                                    <span className="text-2xl font-medium">₹{product.price.toLocaleString('en-IN')}</span>
                                    <div className="flex items-center text-yellow-500">
                                        <Star className="w-4 h-4 fill-current" />
                                        <Star className="w-4 h-4 fill-current" />
                                        <Star className="w-4 h-4 fill-current" />
                                        <Star className="w-4 h-4 fill-current" />
                                        <Star className="w-4 h-4 fill-current" />
                                        <span className="text-gray-500 text-sm ml-2">(12 reviews)</span>
                                    </div>
                                </div>
                                <button
                                    onClick={toggleWishlist}
                                    className={`p-3 rounded-full border ${inWishlist ? 'border-red-500 text-red-500 bg-red-50' : 'border-gray-200 text-gray-400 hover:border-black hover:text-black'}`}
                                >
                                    <Heart className={`w-5 h-5 ${inWishlist ? 'fill-current' : ''}`} />
                                </button>
                            </div>
                        </div>

                        <div className="prose prose-sm mb-8" dangerouslySetInnerHTML={{ __html: product.description }} />

                        {/* Variants */}
                        <div className="mb-8">
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="font-medium">Select Size</h3>
                                <button className="text-sm text-gray-500 underline flex items-center hover:text-black">
                                    <Ruler className="w-4 h-4 mr-1" /> Size Guide
                                </button>
                            </div>
                            <div className="flex flex-wrap gap-3 mb-2">
                                {['XS', 'S', 'M', 'L', 'XL', 'XXL'].map((size) => {
                                    const variant = product.variants.find(v => v.size === size);
                                    const isAvailable = variant && variant.stock > 0;

                                    return (
                                        <button
                                            key={size}
                                            disabled={!isAvailable}
                                            onClick={() => handleSizeSelect(size)}
                                            className={clsx(
                                                "w-12 h-12 flex items-center justify-center border transition-all",
                                                selectedSize === size
                                                    ? "border-black bg-black text-white"
                                                    : "border-gray-200 hover:border-black",
                                                !isAvailable && "opacity-50 cursor-not-allowed bg-gray-50 diagonal-strike"
                                            )}
                                        >
                                            {size}
                                        </button>
                                    );
                                })}
                            </div>
                            {showSizeError && (
                                <p className="text-red-600 text-sm font-medium animate-pulse">
                                    Please select a size to proceed.
                                </p>
                            )}
                        </div>

                        {/* Actions */}
                        <div className="flex flex-col gap-4 mb-8">
                            <button
                                onClick={handleAddToCart}
                                className="w-full bg-black text-white py-4 font-bold tracking-widest hover:bg-gray-800 transition-colors"
                            >
                                ADD TO CART
                            </button>
                            <button
                                onClick={() => setIsCustomizationOpen(true)}
                                className="w-full border border-black py-4 font-bold tracking-widest hover:bg-gray-50 transition-colors"
                            >
                                CUSTOMIZE FIT
                            </button>
                        </div>

                        {/* Features */}
                        <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
                            <div className="flex items-center">
                                <Truck className="w-5 h-5 mr-3" />
                                <span>Free Shipping in India</span>
                            </div>
                            <div className="flex items-center">
                                <ShieldCheck className="w-5 h-5 mr-3" />
                                <span>Authentic Quality</span>
                            </div>
                        </div>

                        {/* Attributes */}
                        <div className="mt-8 border-t border-gray-100 pt-8">
                            <h3 className="font-bold mb-4">Product Details</h3>
                            <div className="grid grid-cols-2 gap-y-2 text-sm">
                                <span className="text-gray-500">Fabric</span>
                                <span>{product.attributes.fabric}</span>
                                <span className="text-gray-500">Care</span>
                                <span>{product.attributes.care}</span>
                                <span className="text-gray-500">Origin</span>
                                <span>{product.attributes.origin}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <CustomizationModal
                isOpen={isCustomizationOpen}
                onClose={() => setIsCustomizationOpen(false)}
                onSave={handleCustomizationSave}
                productTitle={product.title}
                productImage={product.images[0]}
            />
        </Layout>
    );
}
