import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const slugifyString = (text: string) => {
    return text
        .toString()
        .toLowerCase()
        .replace(/\s+/g, '-')
        .replace(/[^\w\-]+/g, '')
        .replace(/\-\-+/g, '-')
        .replace(/^-+/, '')
        .replace(/-+$/, '');
};

async function main() {
    console.log('Start seeding...');

    // 1. Create Default Organization
    let org = await prisma.organization.findFirst({
        where: { slug: 'luxe-store' },
    });

    if (!org) {
        org = await prisma.organization.create({
            data: {
                name: 'Luxe Store',
                slug: 'luxe-store',
            },
        });
    }

    // 2. Create Categories (Hierarchy)
    const categoriesData = [
        {
            name: 'MEN',
            children: ['Shirts', 'Pants', 'Hoodies', 'T-Shirts', 'Jackets'],
            image: 'https://images.unsplash.com/photo-1490578474895-699cd4e2cf59?auto=format&fit=crop&w=800&q=80',
        },
        {
            name: 'WOMEN',
            children: ['Dresses', 'Tops', 'Skirts', 'Jeans', 'Heels'],
            image: 'https://images.unsplash.com/photo-1618244972963-dbee1a7edc95?auto=format&fit=crop&w=800&q=80',
        },
        {
            name: 'KIDS',
            children: ['Boys Clothing', 'Girls Clothing', 'Toys', 'Shoes'],
            image: 'https://images.unsplash.com/photo-1514090458221-65bb69cf63e6?auto=format&fit=crop&w=800&q=80',
        },
        {
            name: 'STUDIO',
            children: ['New Arrivals', 'Collections', 'Editorials'],
            image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80',
        },
    ];

    for (const cat of categoriesData) {
        const parent = await prisma.category.create({
            data: {
                name: cat.name,
                slug: slugifyString(cat.name),
                image: cat.image,
                organizationId: org.id,
            },
        });

        for (const childName of cat.children) {
            await prisma.category.create({
                data: {
                    name: childName,
                    slug: slugifyString(`${cat.name}-${childName}`), // Ensure unique slug
                    parentId: parent.id,
                    organizationId: org.id,
                },
            });
        }
    }

    // 3. Create Sections
    const sectionsData = [
        {
            title: 'Hero Banner',
            type: 'BANNER',
            order: 1,
            settings: {
                bannerUrl: 'https://images.unsplash.com/photo-1469334031218-e382a71b716b?auto=format&fit=crop&w=1920&q=80',
                heading: 'Summer Collection 2025',
                subheading: 'Discover the latest trends',
                buttonText: 'Shop Now',
                buttonLink: '/collection/all',
            },
        },
        {
            title: 'Trending Now',
            type: 'PRODUCT_GRID',
            order: 2,
            settings: {
                limit: 4,
                filter: 'trending',
            },
        },
        {
            title: 'Best Sellers',
            type: 'PRODUCT_GRID',
            order: 3,
            settings: {
                limit: 4,
                filter: 'best-sellers',
            },
        },
        {
            title: "Women's Collection",
            type: 'CATEGORY_SHOWCASE',
            order: 4,
            settings: {
                categorySlug: 'women',
                layout: 'grid',
            },
        },
        {
            title: "Men's Collection",
            type: 'CATEGORY_SHOWCASE',
            order: 5,
            settings: {
                categorySlug: 'men',
                layout: 'grid',
            },
        },
    ];

    for (const section of sectionsData) {
        await prisma.section.create({
            data: {
                title: section.title,
                type: section.type,
                order: section.order,
                settings: section.settings,
            },
        });
    }

    // 4. Create Dummy Products
    // Fetch a category to assign products to
    const menShirts = await prisma.category.findFirst({ where: { slug: 'men-shirts' } });
    const womenDresses = await prisma.category.findFirst({ where: { slug: 'women-dresses' } });

    const productsData = [
        {
            title: 'Classic White Shirt',
            price: 2999,
            categoryId: menShirts?.id,
            images: ['https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=800&q=80'],
        },
        {
            title: 'Floral Summer Dress',
            price: 4999,
            categoryId: womenDresses?.id,
            images: ['https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?auto=format&fit=crop&w=800&q=80'],
        },
        {
            title: 'Slim Fit Chinos',
            price: 3499,
            categoryId: menShirts?.id, // Just assigning to existing for simplicity
            images: ['https://images.unsplash.com/photo-1473966968600-fa801b869a1a?auto=format&fit=crop&w=800&q=80'],
        },
        {
            title: 'Evening Gown',
            price: 8999,
            categoryId: womenDresses?.id,
            images: ['https://images.unsplash.com/photo-1566174053879-31528523f8ae?auto=format&fit=crop&w=800&q=80'],
        },
    ];

    for (const prod of productsData) {
        if (prod.categoryId) {
            await prisma.product.create({
                data: {
                    title: prod.title,
                    slug: slugifyString(prod.title + '-' + Math.random().toString(36).substring(7)),
                    price: prod.price,
                    categoryId: prod.categoryId,
                    organizationId: org.id,
                    images: prod.images,
                },
            });
        }
    }

    console.log('Seeding finished.');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
