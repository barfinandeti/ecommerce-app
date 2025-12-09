import { useState } from 'react';
import Image from 'next/image';
import { clsx } from 'clsx';

interface ProductGalleryProps {
    images: string[];
}

const ProductGallery = ({ images }: ProductGalleryProps) => {
    const [selectedImage, setSelectedImage] = useState(images[0]);

    if (!images || images.length === 0) return null;

    return (
        <div className="flex flex-col-reverse md:flex-row gap-4">
            {/* Thumbnails */}
            <div className="flex md:flex-col gap-4 overflow-x-auto md:overflow-y-auto md:max-h-[600px] no-scrollbar">
                {images.map((image, index) => (
                    <button
                        key={index}
                        onClick={() => setSelectedImage(image)}
                        className={clsx(
                            "relative w-20 h-24 flex-shrink-0 border-2 transition-colors",
                            selectedImage === image ? "border-black" : "border-transparent hover:border-gray-200"
                        )}
                    >
                        <Image
                            src={image}
                            alt={`Product thumbnail ${index + 1}`}
                            fill
                            className="object-cover"
                            sizes="80px"
                        />
                    </button>
                ))}
            </div>

            {/* Main Image */}
            <div className="relative flex-1 aspect-[3/4] bg-gray-100">
                <Image
                    src={selectedImage}
                    alt="Product main image"
                    fill
                    className="object-cover"
                    priority
                    sizes="(max-width: 768px) 100vw, 50vw"
                />
            </div>
        </div>
    );
};

export default ProductGallery;
