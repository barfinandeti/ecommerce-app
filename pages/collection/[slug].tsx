import { useRouter } from 'next/router';
import Layout from '@/components/Layout';
import ProductCard from '@/components/ProductCard';
import FilterSidebar from '@/components/FilterSidebar';
import TopFilterBar from '@/components/TopFilterBar';
import Breadcrumbs from '@/components/Breadcrumbs';

// Dummy data
// Dummy data
const PRODUCTS = [
    {
        id: '1',
        slug: 'rose-silk-lehenga',
        title: 'Rose Silk Lehenga',
        price: 8999,
        images: ['https://images.unsplash.com/photo-1583391733956-6c78276477e2?auto=format&fit=crop&q=80&w=800'],
        category: 'Lehenga',
        origin: 'India',
        sizes: ['S', 'M', 'L'],
        createdAt: '2023-01-01',
        popularity: 100
    },
    {
        id: '2',
        slug: 'emerald-green-saree',
        title: 'Emerald Green Saree',
        price: 5499,
        images: ['https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&q=80&w=800'],
        category: 'Saree',
        origin: 'India',
        sizes: ['XS', 'S', 'M', 'L', 'XL'],
        createdAt: '2023-02-15',
        popularity: 85
    },
    {
        id: '3',
        slug: 'royal-blue-anarkali',
        title: 'Royal Blue Anarkali',
        price: 6999,
        images: ['https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&q=80&w=800'],
        category: 'Gown',
        origin: 'India',
        sizes: ['M', 'L', 'XL', 'XXL'],
        createdAt: '2023-03-10',
        popularity: 95
    },
    {
        id: '4',
        slug: 'maroon-velvet-lehenga',
        title: 'Maroon Velvet Lehenga',
        price: 12999,
        images: ['https://images.unsplash.com/photo-1518049362265-d5b2a6467637?auto=format&fit=crop&q=80&w=800'],
        category: 'Lehenga',
        origin: 'India',
        sizes: ['S', 'M', 'L'],
        createdAt: '2023-01-20',
        popularity: 120
    },
    {
        id: '5',
        slug: 'peach-georgette-saree',
        title: 'Peach Georgette Saree',
        price: 3999,
        images: ['https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&q=80&w=800'],
        category: 'Saree',
        origin: 'India',
        sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
        createdAt: '2023-04-05',
        popularity: 70
    },
    {
        id: '6',
        slug: 'gold-sequin-gown',
        title: 'Gold Sequin Gown',
        price: 15999,
        images: ['https://images.unsplash.com/photo-1566174053879-31528523f8ae?auto=format&fit=crop&q=80&w=800'],
        category: 'Gown',
        origin: 'USA',
        sizes: ['S', 'M', 'L'],
        createdAt: '2023-05-01',
        popularity: 150
    }
];

import { useState, useMemo } from 'react';

export default function CollectionPage() {
    const router = useRouter();
    const { slug } = router.query;
    const categoryTitle = slug ? (typeof slug === 'string' ? slug.charAt(0).toUpperCase() + slug.slice(1) : 'Collection') : 'Collection';

    const breadcrumbs = [
        { label: 'Home', href: '/' },
        { label: categoryTitle, href: `/collection/${slug}` }
    ];

    const [filters, setFilters] = useState({
        gender: [] as string[],
        categories: [] as string[],
        brands: [] as string[],
        priceRange: [0, 50000] as [number, number],
        colors: [] as string[],
        discount: '',
        sort: 'Recommended',
        origin: '',
        size: ''
    });

    const handleFilterChange = (type: string, value: any) => {
        setFilters(prev => ({ ...prev, [type]: value }));
    };

    const handleClearAll = () => {
        setFilters({
            gender: [],
            categories: [],
            brands: [],
            priceRange: [0, 50000],
            colors: [],
            discount: '',
            sort: 'Recommended',
            origin: '',
            size: ''
        });
    };

    const filteredProducts = useMemo(() => {
        let result = PRODUCTS.filter(product => {
            if (filters.categories.length > 0 && !filters.categories.includes(product.category)) return false;
            if (product.price > filters.priceRange[1]) return false;
            if (filters.origin && product.origin !== filters.origin) return false;
            if (filters.size && !product.sizes.includes(filters.size)) return false;
            return true;
        });

        // Sorting logic
        if (filters.sort === 'Price: Low to High') {
            result.sort((a, b) => a.price - b.price);
        } else if (filters.sort === 'Price: High to Low') {
            result.sort((a, b) => b.price - a.price);
        } else if (filters.sort === 'Newest First') {
            result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        } else if (filters.sort === 'Popularity') {
            result.sort((a, b) => b.popularity - a.popularity);
        }

        return result;
    }, [filters]);

    return (
        <Layout title={`${categoryTitle} | LUXE`}>
            <div className="container mx-auto px-4 py-8">
                <Breadcrumbs items={breadcrumbs} />

                <div className="flex">
                    {/* Sidebar Filters */}
                    <FilterSidebar
                        filters={filters}
                        onFilterChange={handleFilterChange}
                        onClearAll={handleClearAll}
                    />

                    {/* Main Content */}
                    <div className="flex-1">
                        <div className="mb-6">
                            <h1 className="text-2xl font-bold mb-2 uppercase tracking-wide">{categoryTitle} <span className="text-gray-500 text-lg font-normal">({filteredProducts.length} items)</span></h1>
                        </div>

                        <TopFilterBar
                            selectedSort={filters.sort}
                            selectedOrigin={filters.origin}
                            selectedSize={filters.size}
                            onSortChange={(val) => handleFilterChange('sort', val)}
                            onOriginChange={(val) => handleFilterChange('origin', val)}
                            onSizeChange={(val) => handleFilterChange('size', val)}
                        />

                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-10">
                            {filteredProducts.map((product) => (
                                <ProductCard key={product.id} product={product} />
                            ))}
                        </div>

                        {filteredProducts.length === 0 && (
                            <div className="text-center py-20">
                                <p className="text-gray-500 text-lg">No products found matching your filters.</p>
                                <button onClick={handleClearAll} className="text-pink-600 font-bold mt-4 hover:underline">Clear Filters</button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </Layout>
    );
}
