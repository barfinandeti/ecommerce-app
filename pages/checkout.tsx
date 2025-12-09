import { useState } from 'react';
import Layout from '@/components/Layout';
import { useCart } from '@/lib/CartContext';
import { CheckCircle, CreditCard, Truck, MapPin } from 'lucide-react';
import { clsx } from 'clsx';

const STEPS = [
    { id: 1, title: 'Address', icon: MapPin },
    { id: 2, title: 'Shipping', icon: Truck },
    { id: 3, title: 'Payment', icon: CreditCard },
];

export default function CheckoutPage() {
    const { items, total } = useCart();
    const [currentStep, setCurrentStep] = useState(1);
    const [loading, setLoading] = useState(false);

    const handleNext = () => {
        if (currentStep < 3) {
            setCurrentStep(currentStep + 1);
        } else {
            handlePayment();
        }
    };

    const handlePayment = () => {
        setLoading(true);
        // Simulate payment processing
        setTimeout(() => {
            setLoading(false);
            alert('Order placed successfully!');
            // Redirect to success page or clear cart
        }, 2000);
    };

    if (items.length === 0) {
        return (
            <Layout title="Checkout | LUXE">
                <div className="container mx-auto px-4 py-20 text-center">
                    <h1 className="text-3xl font-serif font-bold mb-6">Your Cart is Empty</h1>
                    <p className="text-gray-600">Please add items to your cart before checking out.</p>
                </div>
            </Layout>
        );
    }

    return (
        <Layout title="Checkout | LUXE">
            <div className="container mx-auto px-4 py-12">
                <h1 className="text-3xl font-serif font-bold mb-8 text-center">Checkout</h1>

                {/* Steps */}
                <div className="flex justify-center mb-12">
                    {STEPS.map((step, index) => {
                        const Icon = step.icon;
                        const isActive = step.id === currentStep;
                        const isCompleted = step.id < currentStep;

                        return (
                            <div key={step.id} className="flex items-center">
                                <div className={clsx(
                                    "flex items-center justify-center w-10 h-10 rounded-full border-2 transition-colors",
                                    isActive || isCompleted ? "border-black bg-black text-white" : "border-gray-300 text-gray-300"
                                )}>
                                    {isCompleted ? <CheckCircle className="w-5 h-5" /> : <Icon className="w-5 h-5" />}
                                </div>
                                <span className={clsx(
                                    "ml-2 text-sm font-medium hidden md:block",
                                    isActive || isCompleted ? "text-black" : "text-gray-300"
                                )}>
                                    {step.title}
                                </span>
                                {index < STEPS.length - 1 && (
                                    <div className={clsx(
                                        "w-12 h-0.5 mx-4",
                                        isCompleted ? "bg-black" : "bg-gray-200"
                                    )} />
                                )}
                            </div>
                        );
                    })}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                    {/* Form */}
                    <div className="lg:col-span-2">
                        <div className="bg-white p-6 border border-gray-100 rounded-lg shadow-sm">
                            {currentStep === 1 && (
                                <div className="space-y-4">
                                    <h2 className="text-xl font-bold mb-4">Shipping Address</h2>
                                    <div className="grid grid-cols-2 gap-4">
                                        <input type="text" placeholder="First Name" className="border p-3 rounded w-full" />
                                        <input type="text" placeholder="Last Name" className="border p-3 rounded w-full" />
                                    </div>
                                    <input type="text" placeholder="Address" className="border p-3 rounded w-full" />
                                    <div className="grid grid-cols-2 gap-4">
                                        <input type="text" placeholder="City" className="border p-3 rounded w-full" />
                                        <input type="text" placeholder="Postal Code" className="border p-3 rounded w-full" />
                                    </div>
                                    <input type="text" placeholder="Phone" className="border p-3 rounded w-full" />
                                </div>
                            )}

                            {currentStep === 2 && (
                                <div className="space-y-4">
                                    <h2 className="text-xl font-bold mb-4">Shipping Method</h2>
                                    <div className="border p-4 rounded flex justify-between items-center cursor-pointer hover:border-black">
                                        <div className="flex items-center">
                                            <input type="radio" name="shipping" defaultChecked className="mr-3" />
                                            <div>
                                                <p className="font-medium">Standard Shipping</p>
                                                <p className="text-sm text-gray-500">5-7 business days</p>
                                            </div>
                                        </div>
                                        <span className="font-medium text-green-600">Free</span>
                                    </div>
                                    <div className="border p-4 rounded flex justify-between items-center cursor-pointer hover:border-black">
                                        <div className="flex items-center">
                                            <input type="radio" name="shipping" className="mr-3" />
                                            <div>
                                                <p className="font-medium">Express Shipping</p>
                                                <p className="text-sm text-gray-500">2-3 business days</p>
                                            </div>
                                        </div>
                                        <span className="font-medium">₹250</span>
                                    </div>
                                </div>
                            )}

                            {currentStep === 3 && (
                                <div className="space-y-4">
                                    <h2 className="text-xl font-bold mb-4">Payment Method</h2>
                                    <div className="border p-4 rounded flex items-center cursor-pointer hover:border-black">
                                        <input type="radio" name="payment" defaultChecked className="mr-3" />
                                        <span className="font-medium">Credit / Debit Card (Razorpay)</span>
                                    </div>
                                    <div className="border p-4 rounded flex items-center cursor-pointer hover:border-black">
                                        <input type="radio" name="payment" className="mr-3" />
                                        <span className="font-medium">UPI / Netbanking</span>
                                    </div>
                                    <div className="border p-4 rounded flex items-center cursor-pointer hover:border-black">
                                        <input type="radio" name="payment" className="mr-3" />
                                        <span className="font-medium">Cash on Delivery</span>
                                    </div>
                                </div>
                            )}

                            <div className="mt-8 flex justify-between">
                                {currentStep > 1 && (
                                    <button
                                        onClick={() => setCurrentStep(currentStep - 1)}
                                        className="text-gray-500 hover:text-black font-medium"
                                    >
                                        Back
                                    </button>
                                )}
                                <button
                                    onClick={handleNext}
                                    disabled={loading}
                                    className="bg-black text-white px-8 py-3 font-bold tracking-widest hover:bg-gray-800 transition-colors ml-auto disabled:opacity-50"
                                >
                                    {loading ? 'PROCESSING...' : (currentStep === 3 ? 'PLACE ORDER' : 'CONTINUE')}
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Order Summary */}
                    <div className="lg:col-span-1">
                        <div className="bg-gray-50 p-6 rounded-lg sticky top-24">
                            <h2 className="text-xl font-serif font-bold mb-6">Order Summary</h2>
                            <div className="space-y-4 mb-6 border-b border-gray-200 pb-6 max-h-60 overflow-y-auto">
                                {items.map((item) => (
                                    <div key={item.id} className="flex justify-between text-sm">
                                        <span>{item.title} x {item.quantity}</span>
                                        <span>₹{(item.price * item.quantity).toLocaleString('en-IN')}</span>
                                    </div>
                                ))}
                            </div>
                            <div className="flex justify-between text-lg font-bold">
                                <span>Total</span>
                                <span>₹{total.toLocaleString('en-IN')}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    );
}
