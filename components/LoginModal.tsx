import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Loader2, ArrowRight, ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/router';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
    InputOTP,
    InputOTPGroup,
    InputOTPSlot,
} from "@/components/ui/input-otp";

interface LoginModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
}

export default function LoginModal({ isOpen, onClose, onSuccess }: LoginModalProps) {
    const [phone, setPhone] = useState('');
    const [otp, setOtp] = useState('');
    const [step, setStep] = useState<'PHONE' | 'OTP'>('PHONE');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const router = useRouter();

    // Auto-submit OTP when 6 digits are entered
    useEffect(() => {
        if (step === 'OTP' && otp.length === 6) {
            handleVerifyOtp();
        }
    }, [otp]);

    const handleSendOtp = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const { error } = await supabase.auth.signInWithOtp({
                phone: `+91${phone}`,
            });

            if (error) throw error;
            setStep('OTP');
        } catch (err: any) {
            setError(err.message || 'Failed to send OTP');
        } finally {
            setLoading(false);
        }
    };

    const handleVerifyOtp = async (e?: React.FormEvent) => {
        if (e) e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const { error } = await supabase.auth.verifyOtp({
                phone: `+91${phone}`,
                token: otp,
                type: 'sms',
            });

            if (error) throw error;
            onSuccess();
        } catch (err: any) {
            setError(err.message || 'Invalid OTP');
            setOtp(''); // Clear OTP on error
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle className="text-center text-2xl font-bold text-pink-600">
                        {step === 'PHONE' ? 'Login to Continue' : 'Verify OTP'}
                    </DialogTitle>
                    <DialogDescription className="text-center">
                        {step === 'PHONE'
                            ? 'Enter your mobile number to proceed to checkout'
                            : `Enter the 6-digit code sent to +91 ${phone}`
                        }
                    </DialogDescription>
                </DialogHeader>

                <div className="py-4">
                    {step === 'PHONE' ? (
                        <form onSubmit={handleSendOtp} className="space-y-4">
                            <div className="space-y-2">
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-pink-600 font-bold">
                                        +91
                                    </div>
                                    <Input
                                        type="tel"
                                        value={phone}
                                        onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                                        className="pl-12 border-pink-200 focus-visible:ring-pink-500"
                                        placeholder="Mobile Number"
                                        maxLength={10}
                                        required
                                        autoFocus
                                    />
                                </div>
                            </div>
                            {error && <p className="text-red-500 text-sm text-center">{error}</p>}
                            <Button
                                type="submit"
                                className="w-full bg-pink-600 hover:bg-pink-700 text-white font-bold"
                                disabled={loading || phone.length !== 10}
                            >
                                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Continue'}
                                {!loading && <ArrowRight className="w-4 h-4 ml-2" />}
                            </Button>
                        </form>
                    ) : (
                        <div className="space-y-6 flex flex-col items-center">
                            <InputOTP
                                maxLength={6}
                                value={otp}
                                onChange={(value) => setOtp(value)}
                                disabled={loading}
                            >
                                <InputOTPGroup>
                                    <InputOTPSlot index={0} className="w-12 h-12 text-xl border-pink-200 focus:border-pink-500" />
                                    <InputOTPSlot index={1} className="w-12 h-12 text-xl border-pink-200 focus:border-pink-500" />
                                    <InputOTPSlot index={2} className="w-12 h-12 text-xl border-pink-200 focus:border-pink-500" />
                                    <InputOTPSlot index={3} className="w-12 h-12 text-xl border-pink-200 focus:border-pink-500" />
                                    <InputOTPSlot index={4} className="w-12 h-12 text-xl border-pink-200 focus:border-pink-500" />
                                    <InputOTPSlot index={5} className="w-12 h-12 text-xl border-pink-200 focus:border-pink-500" />
                                </InputOTPGroup>
                            </InputOTP>

                            {error && <p className="text-red-500 text-sm text-center">{error}</p>}

                            {loading && (
                                <div className="flex items-center text-sm text-muted-foreground">
                                    <Loader2 className="w-4 h-4 animate-spin mr-2" />
                                    Verifying...
                                </div>
                            )}

                            <Button
                                variant="link"
                                className="text-sm text-pink-600 hover:text-pink-700"
                                onClick={() => {
                                    setStep('PHONE');
                                    setOtp('');
                                    setError('');
                                }}
                                disabled={loading}
                            >
                                <ArrowLeft className="w-4 h-4 mr-2" />
                                Change Number
                            </Button>
                        </div>
                    )}

                    <div className="text-center pt-4">
                        <p className="text-xs text-muted-foreground">
                            By continuing, you agree to our{' '}
                            <a href="#" className="underline hover:text-pink-600">Terms</a>
                            {' '}and{' '}
                            <a href="#" className="underline hover:text-pink-600">Privacy Policy</a>
                        </p>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
