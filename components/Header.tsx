import Link from 'next/link';
import { ShoppingBag, Menu, Search, User, LogIn, LogOut, Heart, ChevronDown } from 'lucide-react';
import { useState } from 'react';
import { useAuth } from '@/lib/AuthContext';
import { useCart } from '@/lib/CartContext';
import { useRouter } from 'next/router';
import { useCategoryTree } from '@/hooks/useCategoryTree';

export default function Header() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const { user, logout, openLoginModal } = useAuth();
    const [searchQuery, setSearchQuery] = useState('');
    const { items, openCart } = useCart();
    const router = useRouter();
    const { categories, loading } = useCategoryTree();

    const handleLogout = async () => {
        await logout();
    };

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            router.push(`/collection/all?search=${encodeURIComponent(searchQuery)}`);
        }
    };

    return (
        <header className="sticky top-0 z-50 bg-white shadow-sm font-sans">
            <div className="container mx-auto px-4 h-20 flex items-center justify-between">
                {/* Logo */}
                <Link href="/" className="text-3xl font-black tracking-tighter mr-8 text-pink-600 font-sans">
                    LUXE
                </Link>

                {/* Desktop Nav */}
                <nav className="hidden md:flex items-center space-x-8 h-full">
                    {loading ? (
                        <div className="flex space-x-8 animate-pulse">
                            {[1, 2, 3, 4, 5].map((i) => (
                                <div key={i} className="h-4 w-16 bg-gray-200 rounded"></div>
                            ))}
                        </div>
                    ) : (
                        categories.map((category) => (
                            <div key={category.id} className="group h-full flex items-center relative">
                                <Link
                                    href={`/collection/${category.slug}`}
                                    className="text-sm font-bold text-gray-800 hover:text-pink-600 h-full flex items-center transition-colors px-1 uppercase tracking-wide"
                                >
                                    {category.name}
                                    {category.children.length > 0 && <ChevronDown className="w-3 h-3 ml-1" />}
                                    <span className="absolute bottom-0 left-0 w-full h-0.5 bg-pink-600 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left"></span>
                                </Link>

                                {/* Dropdown Menu */}
                                {category.children.length > 0 && (
                                    <div className="absolute top-full left-0 w-48 bg-white shadow-lg border border-gray-100 rounded-b-lg py-2 hidden group-hover:block animate-in fade-in slide-in-from-top-2 duration-200">
                                        {category.children.map((child) => (
                                            <Link
                                                key={child.id}
                                                href={`/collection/${child.slug}`}
                                                className="block px-4 py-2 text-sm text-gray-600 hover:text-pink-600 hover:bg-pink-50 transition-colors"
                                            >
                                                {child.name}
                                            </Link>
                                        ))}
                                    </div>
                                )}
                            </div>
                        ))
                    )}
                </nav>

                {/* Search Bar */}
                <div className="hidden md:flex flex-1 max-w-md mx-8">
                    <form onSubmit={handleSearch} className="w-full relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Search className="h-4 w-4 text-gray-400" />
                        </div>
                        <input
                            type="text"
                            className="block w-full pl-10 pr-3 py-2.5 border border-gray-100 bg-gray-50 rounded text-sm text-gray-900 placeholder-gray-500 focus:outline-none focus:bg-white focus:border-gray-300 transition-colors"
                            placeholder="Search for products, brands and more"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </form>
                </div>

                {/* Icons */}
                <div className="flex items-center space-x-6">
                    {/* Profile */}
                    <div className="flex flex-col items-center cursor-pointer group relative">
                        <User className="w-5 h-5 text-gray-700 mb-0.5 group-hover:text-black" />
                        <span className="text-[10px] font-bold text-gray-700 group-hover:text-black">Profile</span>

                        {/* Dropdown */}
                        <div className="absolute top-full right-0 pt-4 hidden group-hover:block">
                            <div className="bg-white shadow-lg border border-gray-100 rounded w-48 py-2 flex flex-col">
                                {user ? (
                                    <>
                                        <div className="px-4 py-2 border-b border-gray-100">
                                            <p className="text-sm font-bold">Hello</p>
                                            <p className="text-xs text-gray-500 truncate">{user.phone || user.email}</p>
                                        </div>
                                        <Link href="/account/orders" className="px-4 py-2 text-sm hover:bg-gray-50 hover:font-bold">Orders</Link>
                                        <Link href="/wishlist" className="px-4 py-2 text-sm hover:bg-gray-50 hover:font-bold">Wishlist</Link>
                                        <Link href="/contact" className="px-4 py-2 text-sm hover:bg-gray-50 hover:font-bold">Contact Us</Link>
                                        <button onClick={handleLogout} className="px-4 py-2 text-sm text-left hover:bg-gray-50 hover:font-bold text-pink-600">Logout</button>
                                    </>
                                ) : (
                                    <>
                                        <div className="px-4 py-3">
                                            <p className="text-sm font-bold mb-1">Welcome</p>
                                            <p className="text-xs text-gray-500 mb-3">To access account and manage orders</p>
                                            <button
                                                onClick={openLoginModal}
                                                className="block w-full border border-gray-200 text-pink-600 font-bold text-center py-2 text-sm hover:border-pink-600"
                                            >
                                                LOGIN / SIGNUP
                                            </button>
                                        </div>
                                        <div className="border-t border-gray-100 pt-1">
                                            <Link href="/account/orders" className="block px-4 py-2 text-sm hover:bg-gray-50">Orders</Link>
                                            <Link href="/wishlist" className="block px-4 py-2 text-sm hover:bg-gray-50">Wishlist</Link>
                                            <Link href="/contact" className="block px-4 py-2 text-sm hover:bg-gray-50">Contact Us</Link>
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Wishlist */}
                    <Link href="/wishlist" className="flex flex-col items-center group">
                        <Heart className="w-5 h-5 text-gray-700 mb-0.5 group-hover:text-black" />
                        <span className="text-[10px] font-bold text-gray-700 group-hover:text-black">Wishlist</span>
                    </Link>

                    {/* Bag */}
                    <button onClick={openCart} className="flex flex-col items-center group relative">
                        <ShoppingBag className="w-5 h-5 text-gray-700 mb-0.5 group-hover:text-black" />
                        <span className="text-[10px] font-bold text-gray-700 group-hover:text-black">Bag</span>
                        {items.length > 0 && (
                            <span className="absolute -top-1 right-0 bg-pink-500 text-white text-[10px] font-bold w-4 h-4 flex items-center justify-center rounded-full">
                                {items.reduce((sum, item) => sum + item.quantity, 0)}
                            </span>
                        )}
                    </button>
                </div>

                {/* Mobile Menu Button */}
                <button
                    className="md:hidden p-2"
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                >
                    <Menu className="w-6 h-6" />
                </button>
            </div>

            {/* Mobile Menu */}
            {isMenuOpen && (
                <div className="md:hidden bg-white border-t border-gray-100 absolute w-full left-0 top-20 shadow-lg py-4 px-4 flex flex-col space-y-4 max-h-[calc(100vh-80px)] overflow-y-auto">
                    {categories.map((category) => (
                        <div key={category.id} className="space-y-2">
                            <Link
                                href={`/collection/${category.slug}`}
                                className="text-sm font-bold text-gray-800 block"
                                onClick={() => setIsMenuOpen(false)}
                            >
                                {category.name}
                            </Link>
                            {category.children.length > 0 && (
                                <div className="pl-4 space-y-2 border-l-2 border-gray-100 ml-1">
                                    {category.children.map((child) => (
                                        <Link
                                            key={child.id}
                                            href={`/collection/${child.slug}`}
                                            className="block text-sm text-gray-600"
                                            onClick={() => setIsMenuOpen(false)}
                                        >
                                            {child.name}
                                        </Link>
                                    ))}
                                </div>
                            )}
                        </div>
                    ))}
                    <div className="border-t border-gray-100 pt-4 space-y-3">
                        <Link href="/account/orders" className="block text-sm">My Orders</Link>
                        <Link href="/wishlist" className="block text-sm">Wishlist</Link>
                        {user ? (
                            <button onClick={handleLogout} className="block text-sm text-pink-600 font-bold">Logout</button>
                        ) : (
                            <button onClick={openLoginModal} className="block text-sm text-pink-600 font-bold w-full text-left">Login / Signup</button>
                        )}
                    </div>
                </div>
            )}
        </header>
    );
}
