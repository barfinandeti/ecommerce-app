import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Loader2, ArrowRight, ArrowLeft } from 'lucide-react';
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    InputOTP,
    InputOTPGroup,
    InputOTPSlot,
} from "@/components/ui/input-otp";

interface LoginFormProps {
    onSuccess?: () => void;
    redirectUrl?: string;
}

export default function LoginForm({ onSuccess, redirectUrl = '/account/orders' }: LoginFormProps) {
    const [phone, setPhone] = useState('');
    const [otp, setOtp] = useState('');
    const [step, setStep] = useState<'PHONE' | 'OTP'>('PHONE');
    const [loading, setLoading] = useState(false);

    // Auto-submit OTP when 6 digits are entered
    useEffect(() => {
        if (step === 'OTP' && otp.length === 6) {
            handleVerifyOtp();
        }
    }, [otp]);

    const handleSendOtp = async (e?: React.FormEvent) => {
        if (e) e.preventDefault();
        setLoading(true);

        if (phone.length < 10) {
            toast.error('Please enter a valid phone number');
            setLoading(false);
            return;
        }

        const formattedPhone = phone.startsWith('+') ? phone : `+91${phone}`;

        try {
            const { error } = await supabase.auth.signInWithOtp({
                phone: formattedPhone,
            });

            if (error) {
                toast.error(error.message);
            } else {
                setStep('OTP');
                toast.success('OTP sent successfully');
            }
        } catch (err) {
            toast.error('Failed to send OTP');
        } finally {
            setLoading(false);
        }
    };

    const handleVerifyOtp = async (e?: React.FormEvent) => {
        if (e) e.preventDefault();
        setLoading(true);

        const formattedPhone = phone.startsWith('+') ? phone : `+91${phone}`;

        try {
            const { error } = await supabase.auth.verifyOtp({
                phone: formattedPhone,
                token: otp,
                type: 'sms',
            });

            if (error) {
                toast.error(error.message);
                setLoading(false);
                setOtp(''); // Clear OTP on error
            } else {
                toast.success('Login successful!');
                if (onSuccess) {
                    onSuccess();
                } else if (typeof window !== 'undefined') {
                    window.location.href = redirectUrl;
                }
            }
        } catch (err) {
            toast.error('Verification failed');
            setLoading(false);
        }
    };

    return (
        <div className="space-y-4 py-4">
            <div className="text-center mb-6">
                <h2 className="text-2xl font-bold tracking-tight text-pink-600">
                    {step === 'PHONE' ? 'Welcome Back' : 'Verify OTP'}
                </h2>
                <p className="text-sm text-muted-foreground mt-1">
                    {step === 'PHONE'
                        ? 'Enter your mobile number to continue'
                        : `Enter the 6-digit code sent to +91 ${phone}`
                    }
                </p>
            </div>

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
                                onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
                                className="pl-12 border-pink-200 focus-visible:ring-pink-500"
                                placeholder="Mobile Number"
                                maxLength={10}
                                required
                                autoFocus
                            />
                        </div>
                    </div>
                    <Button type="submit" className="w-full bg-pink-600 hover:bg-pink-700 text-white font-bold" disabled={loading}>
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
                    <a href="#" className="underline hover:text-pink-600">Terms of Service</a>
                    {' '}and{' '}
                    <a href="#" className="underline hover:text-pink-600">Privacy Policy</a>
                </p>
            </div>
        </div>
    );
}
