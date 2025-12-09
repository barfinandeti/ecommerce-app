import {
    Dialog,
    DialogContent,
    DialogTrigger,
} from "@/components/ui/dialog"
import LoginForm from "./LoginForm";
import { useState } from "react";

interface LoginModalProps {
    children: React.ReactNode;
}

export default function LoginModal({ children }: LoginModalProps) {
    const [open, setOpen] = useState(false);

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                {children}
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
                <LoginForm onSuccess={() => setOpen(false)} />
            </DialogContent>
        </Dialog>
    );
}
