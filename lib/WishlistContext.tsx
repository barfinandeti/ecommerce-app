import { createContext, useContext, useState, useEffect } from 'react';

interface WishlistItem {
    id: string;
    title: string;
    price: number;
    image: string;
    slug: string;
}

interface WishlistContextType {
    items: WishlistItem[];
    addItem: (item: WishlistItem) => void;
    removeItem: (id: string) => void;
    isInWishlist: (id: string) => boolean;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export const WishlistProvider = ({ children }: { children: React.ReactNode }) => {
    const [items, setItems] = useState<WishlistItem[]>([]);

    // Load wishlist from local storage on mount
    useEffect(() => {
        const savedWishlist = localStorage.getItem('wishlist');
        if (savedWishlist) {
            setItems(JSON.parse(savedWishlist));
        }
    }, []);

    // Save wishlist to local storage whenever it changes
    useEffect(() => {
        localStorage.setItem('wishlist', JSON.stringify(items));
    }, [items]);

    const addItem = (newItem: WishlistItem) => {
        setItems(currentItems => {
            if (currentItems.some(item => item.id === newItem.id)) {
                return currentItems;
            }
            return [...currentItems, newItem];
        });
    };

    const removeItem = (id: string) => {
        setItems(currentItems => currentItems.filter(item => item.id !== id));
    };

    const isInWishlist = (id: string) => {
        return items.some(item => item.id === id);
    };

    return (
        <WishlistContext.Provider value={{ items, addItem, removeItem, isInWishlist }}>
            {children}
        </WishlistContext.Provider>
    );
};

export const useWishlist = () => {
    const context = useContext(WishlistContext);
    if (context === undefined) {
        throw new Error('useWishlist must be used within a WishlistProvider');
    }
    return context;
};
