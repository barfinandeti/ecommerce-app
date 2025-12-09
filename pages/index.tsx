import Layout from '@/components/Layout';
import ProductCard from '@/components/ProductCard';
import Link from 'next/link';
import { ArrowRight, Loader2 } from 'lucide-react';
import { useSections } from '@/hooks/useSections';
import { useEffect, useState } from 'react';

// Component to render individual sections based on type
const SectionRenderer = ({ section }: { section: any }) => {
  const { type, settings, title } = section;

  if (type === 'BANNER') {
    return (
      <section className="relative h-[600px] flex items-center bg-pink-50 overflow-hidden">
        <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div className="z-10 order-2 md:order-1 text-center md:text-left">
            <span className="inline-block bg-pink-100 text-pink-600 px-4 py-1 rounded-full text-sm font-bold mb-6 tracking-wide">
              NEW COLLECTION 2025
            </span>
            <h1 className="text-5xl md:text-7xl font-black mb-6 leading-tight text-gray-900">
              {settings.heading || title}
            </h1>
            <p className="text-lg text-gray-600 mb-8 max-w-md mx-auto md:mx-0 font-medium">
              {settings.subheading || 'Discover the latest trends.'}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
              <Link
                href={settings.buttonLink || '/collection/all'}
                className="inline-flex items-center justify-center bg-pink-600 text-white px-8 py-4 text-sm font-bold tracking-widest hover:bg-pink-700 transition-all transform hover:-translate-y-1 shadow-lg hover:shadow-pink-200"
              >
                {settings.buttonText || 'SHOP NOW'}
              </Link>
            </div>
          </div>
          <div className="order-1 md:order-2 relative h-[400px] md:h-[600px]">
            <div
              className="absolute inset-0 bg-cover bg-center rounded-3xl md:rounded-none md:rounded-bl-[100px] shadow-2xl transform md:translate-x-10"
              style={{ backgroundImage: `url('${settings.bannerUrl}')` }}
            />
          </div>
        </div>
      </section>
    );
  }

  if (type === 'PRODUCT_GRID') {
    // In a real app, we would fetch products for this specific section here or pass them down
    // For now, we'll use a placeholder or fetch generic products if we had a hook for it
    // Let's assume we fetch some products based on the filter setting
    const [products, setProducts] = useState<any[]>([]);

    useEffect(() => {
      // Fetch products for this section (mocking for now or using a generic endpoint)
      // In reality: fetch(`/api/products?filter=${settings.filter}&limit=${settings.limit}`)
      // For this demo, we'll just use the static ones if we can't fetch easily, 
      // but let's try to fetch from our products API if it exists
      async function fetchProducts() {
        try {
          const res = await fetch('/api/products'); // Fetch all for now
          if (res.ok) {
            const data = await res.json();
            setProducts(data.slice(0, settings.limit || 4));
          }
        } catch (e) {
          console.error("Failed to fetch products for grid", e);
        }
      }
      fetchProducts();
    }, [settings]);

    if (products.length === 0) return null;

    return (
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-end mb-10">
            <h2 className="text-3xl font-black uppercase tracking-tight">{title}</h2>
            <Link href="/collection/all" className="text-pink-600 font-bold hover:underline flex items-center">
              View All <ArrowRight className="w-4 h-4 ml-1" />
            </Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (type === 'CATEGORY_SHOWCASE') {
    // Mock categories for showcase if not fetching dynamically yet
    // Ideally we fetch the specific category details
    return (
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold text-center mb-10 uppercase tracking-wider">{title}</h2>
          {/* Placeholder content for category showcase */}
          <div className="text-center text-gray-500">
            Category Showcase: {settings.categorySlug}
          </div>
        </div>
      </section>
    )
  }

  return null;
};

export default function Home() {
  const { sections, loading } = useSections();

  if (loading) {
    return (
      <Layout>
        <div className="flex justify-center items-center h-screen">
          <Loader2 className="w-10 h-10 animate-spin text-pink-600" />
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      {sections.map((section) => (
        <SectionRenderer key={section.id} section={section} />
      ))}

      {/* Fallback/Static content if no sections or for specific hardcoded areas if needed */}
      {sections.length === 0 && (
        <div className="text-center py-20">
          <h2 className="text-2xl font-bold">Welcome to Luxe</h2>
          <p>Configure your home page in the admin panel.</p>
        </div>
      )}
    </Layout>
  );
}
