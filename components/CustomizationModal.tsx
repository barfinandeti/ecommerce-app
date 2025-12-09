import { useState } from 'react';
import { X, Upload } from 'lucide-react';

interface CustomizationModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (data: any) => void;
    productTitle: string;
    productImage: string;
}

const CustomizationModal = ({ isOpen, onClose, onSave, productTitle, productImage }: CustomizationModalProps) => {
    const [measurements, setMeasurements] = useState({
        bust: '',
        waist: '',
        hips: '',
        length: ''
    });
    const [notes, setNotes] = useState('');

    if (!isOpen) return null;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave({ measurements, notes });
        onClose();
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
            <div className="bg-white w-full max-w-md p-6 rounded-lg shadow-xl relative max-h-[90vh] overflow-y-auto">
                <button onClick={onClose} className="absolute top-4 right-4 text-gray-500 hover:text-black">
                    <X className="w-6 h-6" />
                </button>

                <h2 className="text-2xl font-serif font-bold mb-6">Customize Your Fit</h2>

                <div className="flex items-center mb-6 bg-gray-50 p-3 rounded">
                    <img src={productImage} alt={productTitle} className="w-16 h-16 object-cover rounded mr-4" />
                    <div>
                        <p className="font-medium text-sm">{productTitle}</p>
                        <p className="text-xs text-gray-500">Customization</p>
                    </div>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="space-y-4 mb-6">
                        <h3 className="font-medium border-b pb-2">Measurements (in inches)</h3>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm text-gray-600 mb-1">Bust</label>
                                <input
                                    type="number"
                                    value={measurements.bust}
                                    onChange={(e) => setMeasurements({ ...measurements, bust: e.target.value })}
                                    className="w-full border border-gray-300 px-3 py-2 rounded focus:outline-none focus:border-black"
                                />
                            </div>
                            <div>
                                <label className="block text-sm text-gray-600 mb-1">Waist</label>
                                <input
                                    type="number"
                                    value={measurements.waist}
                                    onChange={(e) => setMeasurements({ ...measurements, waist: e.target.value })}
                                    className="w-full border border-gray-300 px-3 py-2 rounded focus:outline-none focus:border-black"
                                />
                            </div>
                            <div>
                                <label className="block text-sm text-gray-600 mb-1">Hips</label>
                                <input
                                    type="number"
                                    value={measurements.hips}
                                    onChange={(e) => setMeasurements({ ...measurements, hips: e.target.value })}
                                    className="w-full border border-gray-300 px-3 py-2 rounded focus:outline-none focus:border-black"
                                />
                            </div>
                            <div>
                                <label className="block text-sm text-gray-600 mb-1">Length</label>
                                <input
                                    type="number"
                                    value={measurements.length}
                                    onChange={(e) => setMeasurements({ ...measurements, length: e.target.value })}
                                    className="w-full border border-gray-300 px-3 py-2 rounded focus:outline-none focus:border-black"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="mb-6">
                        <h3 className="font-medium border-b pb-2 mb-4">Additional Notes</h3>
                        <textarea
                            value={notes}
                            onChange={(e) => setNotes(e.target.value)}
                            className="w-full border border-gray-300 px-3 py-2 rounded focus:outline-none focus:border-black h-24"
                            placeholder="Any specific requests?"
                        />
                    </div>

                    <div className="mb-6">
                        <h3 className="font-medium border-b pb-2 mb-4">Reference Image</h3>
                        <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-black transition-colors cursor-pointer">
                            <Upload className="w-8 h-8 mx-auto text-gray-400 mb-2" />
                            <p className="text-sm text-gray-500">Click to upload a reference image</p>
                        </div>
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-black text-white py-3 font-bold hover:bg-gray-800 transition-colors"
                    >
                        SAVE CUSTOMIZATION
                    </button>
                </form>
            </div>
        </div>
    );
};

export default CustomizationModal;
