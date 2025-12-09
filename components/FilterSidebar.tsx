import { useState } from 'react';
import { ChevronDown, ChevronUp, Check } from 'lucide-react';
import { clsx } from 'clsx';

interface FilterSectionProps {
    title: string;
    children: React.ReactNode;
    defaultOpen?: boolean;
}

const FilterSection = ({ title, children, defaultOpen = true }: FilterSectionProps) => {
    const [isOpen, setIsOpen] = useState(defaultOpen);

    return (
        <div className="border-b border-gray-200 py-4">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center justify-between w-full text-left mb-2 group"
            >
                <span className="font-bold text-sm uppercase tracking-wider text-gray-900 group-hover:text-gray-600 transition-colors">{title}</span>
                {isOpen ? <ChevronUp className="w-4 h-4 text-gray-400" /> : <ChevronDown className="w-4 h-4 text-gray-400" />}
            </button>
            {isOpen && (
                <div className="mt-2 space-y-2 animate-in slide-in-from-top-2 duration-200">
                    {children}
                </div>
            )}
        </div>
    );
};

interface FilterSidebarProps {
    filters: {
        gender: string[];
        categories: string[];
        brands: string[];
        priceRange: [number, number];
        colors: string[];
        discount: string;
    };
    onFilterChange: (type: string, value: any) => void;
    onClearAll: () => void;
}

export default function FilterSidebar({ filters, onFilterChange, onClearAll }: FilterSidebarProps) {
    const handleCheckboxChange = (type: string, value: string) => {
        const currentValues = (filters as any)[type] as string[];
        const newValues = currentValues.includes(value)
            ? currentValues.filter(v => v !== value)
            : [...currentValues, value];
        onFilterChange(type, newValues);
    };

    return (
        <div className="w-64 flex-shrink-0 pr-8 hidden md:block">
            <div className="flex items-center justify-between mb-6">
                <h2 className="font-bold text-lg">Filters</h2>
                <button onClick={onClearAll} className="text-xs text-pink-600 font-bold uppercase tracking-wide hover:underline">Clear All</button>
            </div>

            <FilterSection title="Gender">
                {['Men', 'Women', 'Boys', 'Girls'].map((item) => (
                    <label key={item} className="flex items-center space-x-3 cursor-pointer group">
                        <div className="relative flex items-center">
                            <input
                                type="checkbox"
                                checked={filters.gender.includes(item)}
                                onChange={() => handleCheckboxChange('gender', item)}
                                className="peer h-4 w-4 border-gray-300 rounded text-pink-600 focus:ring-pink-500"
                            />
                        </div>
                        <span className="text-sm text-gray-600 group-hover:text-black transition-colors">{item}</span>
                    </label>
                ))}
            </FilterSection>

            <FilterSection title="Categories">
                {['Lehenga', 'Saree', 'Gown', 'Kurta Set', 'Indo Western'].map((item) => (
                    <label key={item} className="flex items-center space-x-3 cursor-pointer group">
                        <input
                            type="checkbox"
                            checked={filters.categories.includes(item)}
                            onChange={() => handleCheckboxChange('categories', item)}
                            className="h-4 w-4 border-gray-300 rounded text-pink-600 focus:ring-pink-500"
                        />
                        <span className="text-sm text-gray-600 group-hover:text-black transition-colors">{item}</span>
                    </label>
                ))}
            </FilterSection>

            <FilterSection title="Price">
                <div className="px-1">
                    <input
                        type="range"
                        min="0"
                        max="50000"
                        value={filters.priceRange[1]}
                        onChange={(e) => onFilterChange('priceRange', [0, parseInt(e.target.value)])}
                        className="w-full h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-pink-600"
                    />
                    <div className="flex justify-between text-xs text-gray-500 mt-2 font-medium">
                        <span>₹0</span>
                        <span>₹{filters.priceRange[1].toLocaleString()}</span>
                    </div>
                </div>
            </FilterSection>
        </div>
    );
}
