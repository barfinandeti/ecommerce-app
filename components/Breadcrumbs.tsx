import Link from 'next/link';
import { ChevronRight, Home } from 'lucide-react';

interface BreadcrumbItem {
    label: string;
    href?: string;
}

interface BreadcrumbsProps {
    items: BreadcrumbItem[];
}

const Breadcrumbs = ({ items }: BreadcrumbsProps) => {
    return (
        <nav className="flex items-center text-xs text-gray-500 mb-6" aria-label="Breadcrumb">
            <Link href="/" className="hover:text-black transition-colors">
                <Home className="w-3 h-3" />
            </Link>
            {items.map((item, index) => (
                <div key={index} className="flex items-center">
                    <ChevronRight className="w-3 h-3 mx-2 text-gray-300" />
                    {item.href ? (
                        <Link href={item.href} className="hover:text-black transition-colors font-medium">
                            {item.label}
                        </Link>
                    ) : (
                        <span className="text-black font-bold">{item.label}</span>
                    )}
                </div>
            ))}
        </nav>
    );
};

export default Breadcrumbs;
