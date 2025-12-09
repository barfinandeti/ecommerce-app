import Link from 'next/link';
import { Facebook, Instagram, Twitter } from 'lucide-react';

const Footer = () => {
    return (
        <footer className="bg-muted pt-16 pb-8">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
                    {/* Brand */}
                    <div>
                        <h3 className="text-xl font-serif font-bold mb-4">LUXE</h3>
                        <p className="text-sm text-gray-600 mb-4">
                            Timeless elegance for the modern individual. Quality craftsmanship and sustainable practices.
                        </p>
                        <div className="flex space-x-4">
                            <a href="#" className="text-gray-400 hover:text-black transition-colors">
                                <Instagram className="w-5 h-5" />
                            </a>
                            <a href="#" className="text-gray-400 hover:text-black transition-colors">
                                <Facebook className="w-5 h-5" />
                            </a>
                            <a href="#" className="text-gray-400 hover:text-black transition-colors">
                                <Twitter className="w-5 h-5" />
                            </a>
                        </div>
                    </div>

                    {/* Shop */}
                    <div>
                        <h4 className="font-bold mb-4">Shop</h4>
                        <ul className="space-y-2 text-sm text-gray-600">
                            <li><Link href="/collection/new-arrivals" className="hover:text-black">New Arrivals</Link></li>
                            <li><Link href="/collection/bestsellers" className="hover:text-black">Bestsellers</Link></li>
                            <li><Link href="/collection/clothing" className="hover:text-black">Clothing</Link></li>
                            <li><Link href="/collection/accessories" className="hover:text-black">Accessories</Link></li>
                        </ul>
                    </div>

                    {/* Support */}
                    <div>
                        <h4 className="font-bold mb-4">Support</h4>
                        <ul className="space-y-2 text-sm text-gray-600">
                            <li><Link href="/contact" className="hover:text-black">Contact Us</Link></li>
                            <li><Link href="/shipping" className="hover:text-black">Shipping & Returns</Link></li>
                            <li><Link href="/faq" className="hover:text-black">FAQ</Link></li>
                            <li><Link href="/size-guide" className="hover:text-black">Size Guide</Link></li>
                        </ul>
                    </div>

                    {/* Newsletter */}
                    <div>
                        <h4 className="font-bold mb-4">Newsletter</h4>
                        <p className="text-sm text-gray-600 mb-4">
                            Subscribe to receive updates, access to exclusive deals, and more.
                        </p>
                        <form className="flex">
                            <input
                                type="email"
                                placeholder="Enter your email"
                                className="flex-1 px-4 py-2 border border-gray-300 focus:outline-none focus:border-black text-sm"
                            />
                            <button
                                type="submit"
                                className="bg-black text-white px-4 py-2 text-sm font-medium hover:bg-gray-800 transition-colors"
                            >
                                Subscribe
                            </button>
                        </form>
                    </div>
                </div>

                <div className="border-t border-gray-200 pt-8 flex flex-col md:flex-row justify-between items-center text-xs text-gray-500">
                    <p>&copy; {new Date().getFullYear()} LUXE. All rights reserved.</p>
                    <div className="flex space-x-4 mt-4 md:mt-0">
                        <Link href="/privacy" className="hover:text-black">Privacy Policy</Link>
                        <Link href="/terms" className="hover:text-black">Terms of Service</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
