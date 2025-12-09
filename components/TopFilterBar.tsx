import { ChevronDown } from 'lucide-react';
import { useState } from 'react';

const Dropdown = ({
    label,
    options,
    isOpen,
    onToggle,
    onSelect,
    selectedValue
}: {
    label: string,
    options: string[],
    isOpen: boolean,
    onToggle: () => void,
    onSelect: (value: string) => void,
    selectedValue?: string
}) => {
    return (
        <div className="relative inline-block text-left">
            <button
                onClick={onToggle}
                className="inline-flex justify-center items-center w-full px-4 py-2 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none"
            >
                {selectedValue || label}
                <ChevronDown className={`ml-2 -mr-1 h-4 w-4 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
            </button>

            {isOpen && (
                <div className="origin-top-left absolute left-0 mt-2 w-40 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none z-50">
                    <div className="py-1">
                        {options.map((option) => (
                            <button
                                key={option}
                                onClick={() => onSelect(option)}
                                className={`block w-full text-left px-4 py-2 text-sm ${selectedValue === option ? 'bg-gray-100 text-gray-900 font-medium' : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'}`}
                            >
                                {option}
                            </button>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

interface TopFilterBarProps {
    onSortChange: (value: string) => void;
    onOriginChange: (value: string) => void;
    onSizeChange: (value: string) => void;
    selectedSort: string;
    selectedOrigin: string;
    selectedSize: string;
}

export default function TopFilterBar({
    onSortChange,
    onOriginChange,
    onSizeChange,
    selectedSort,
    selectedOrigin,
    selectedSize
}: TopFilterBarProps) {
    const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

    const handleToggle = (label: string) => {
        setActiveDropdown(activeDropdown === label ? null : label);
    };

    const handleSelect = (type: string, value: string) => {
        if (type === 'sort') onSortChange(value);
        if (type === 'origin') onOriginChange(value);
        if (type === 'size') onSizeChange(value);
        setActiveDropdown(null);
    };

    return (
        <div className="flex items-center space-x-4 border-b border-gray-200 pb-4 mb-6">
            <span className="text-sm font-bold text-gray-900 uppercase tracking-wide mr-2">Sort By:</span>
            <Dropdown
                label="Recommended"
                options={['Price: Low to High', 'Price: High to Low', 'Newest First', 'Popularity']}
                isOpen={activeDropdown === 'Recommended'}
                onToggle={() => handleToggle('Recommended')}
                onSelect={(val) => handleSelect('sort', val)}
                selectedValue={selectedSort}
            />

            <div className="h-6 w-px bg-gray-300 mx-4" />

            <Dropdown
                label="Country of Origin"
                options={['India', 'USA', 'UK', 'Italy']}
                isOpen={activeDropdown === 'Country of Origin'}
                onToggle={() => handleToggle('Country of Origin')}
                onSelect={(val) => handleSelect('origin', val)}
                selectedValue={selectedOrigin}
            />
            <Dropdown
                label="Size"
                options={['XS', 'S', 'M', 'L', 'XL', 'XXL']}
                isOpen={activeDropdown === 'Size'}
                onToggle={() => handleToggle('Size')}
                onSelect={(val) => handleSelect('size', val)}
                selectedValue={selectedSize}
            />
        </div>
    );
}
