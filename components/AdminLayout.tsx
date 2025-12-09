import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { LayoutDashboard, ShoppingBag, Users, Settings, LogOut, Tag, Menu } from 'lucide-react';
import { GridBackground } from '@/components/ui/aceternity/grid-background';
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { cn } from "@/lib/utils"

interface AdminLayoutProps {
    children: React.ReactNode;
    title?: string;
}

const AdminLayout = ({ children, title = 'Admin Dashboard' }: AdminLayoutProps) => {
    const router = useRouter();
    const [isAuthorized, setIsAuthorized] = useState(false);
    const [loading, setLoading] = useState(true);
    const [adminName, setAdminName] = useState('Admin');

    useEffect(() => {
        checkAuth();
    }, []);

    const checkAuth = () => {
        const sessionData = localStorage.getItem('adminSession');

        if (!sessionData) {
            router.push('/admin-login');
            return;
        }

        try {
            const session = JSON.parse(sessionData);

            // Check if session is expired (24 hours)
            const isExpired = Date.now() - session.timestamp > 24 * 60 * 60 * 1000;

            if (isExpired || (session.role !== 'ADMIN' && session.role !== 'SUPERADMIN')) {
                localStorage.removeItem('adminSession');
                router.push('/admin-login');
                return;
            }

            setIsAuthorized(true);
            setAdminName(session.email?.split('@')[0] || 'Admin');
            setLoading(false);
        } catch (error) {
            localStorage.removeItem('adminSession');
            router.push('/admin-login');
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('adminSession');
        router.push('/admin-login');
    };

    const navItems = [
        { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
        { href: '/admin/products', label: 'Products', icon: ShoppingBag },
        { href: '/admin/categories', label: 'Categories', icon: Tag },
        { href: '/admin/orders', label: 'Orders', icon: Users },
    ];

    const SidebarContent = () => (
        <div className="flex flex-col h-full">
            <div className="p-6 border-b border-border/40">
                <h1 className="text-2xl font-serif font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
                    LUXE Admin
                </h1>
            </div>
            <nav className="flex-1 p-4 space-y-2">
                {navItems.map((item) => {
                    const isActive = router.pathname === item.href;
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={cn(
                                "flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 group",
                                isActive
                                    ? "bg-primary text-primary-foreground shadow-md"
                                    : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                            )}
                        >
                            <item.icon className={cn("w-5 h-5", isActive ? "text-primary-foreground" : "text-muted-foreground group-hover:text-accent-foreground")} />
                            <span className="font-medium">{item.label}</span>
                        </Link>
                    );
                })}
            </nav>
            <div className="p-4 border-t border-border/40">
                <Button
                    variant="ghost"
                    className="w-full justify-start text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/20"
                    onClick={handleLogout}
                >
                    <LogOut className="w-5 h-5 mr-3" />
                    Logout
                </Button>
            </div>
        </div>
    );

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-background">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
            </div>
        );
    }

    if (!isAuthorized) {
        return null;
    }

    return (
        <GridBackground>
            <div className="flex h-screen w-full overflow-hidden relative z-30">
                {/* Desktop Sidebar */}
                <aside className="hidden md:block w-64 bg-card/50 backdrop-blur-xl border-r border-border/40 shadow-xl">
                    <SidebarContent />
                </aside>

                {/* Main Content */}
                <div className="flex-1 flex flex-col h-full overflow-hidden bg-background/50 backdrop-blur-sm">
                    {/* Header */}
                    <header className="h-16 border-b border-border/40 bg-card/50 backdrop-blur-xl flex items-center justify-between px-6 shadow-sm">
                        <div className="md:hidden">
                            <Sheet>
                                <SheetTrigger asChild>
                                    <Button variant="ghost" size="icon">
                                        <Menu className="w-6 h-6" />
                                    </Button>
                                </SheetTrigger>
                                <SheetContent side="left" className="p-0 w-64 bg-card/95 backdrop-blur-xl border-r border-border/40">
                                    <SidebarContent />
                                </SheetContent>
                            </Sheet>
                        </div>

                        <div className="flex items-center justify-end w-full space-x-4">
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                                        <Avatar className="h-10 w-10 border-2 border-primary/20">
                                            <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${adminName}`} alt={adminName} />
                                            <AvatarFallback>{adminName.substring(0, 2).toUpperCase()}</AvatarFallback>
                                        </Avatar>
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent className="w-56" align="end" forceMount>
                                    <DropdownMenuLabel className="font-normal">
                                        <div className="flex flex-col space-y-1">
                                            <p className="text-sm font-medium leading-none">{adminName}</p>
                                            <p className="text-xs leading-none text-muted-foreground">Administrator</p>
                                        </div>
                                    </DropdownMenuLabel>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem onClick={handleLogout} className="text-red-500 focus:text-red-500">
                                        <LogOut className="mr-2 h-4 w-4" />
                                        <span>Log out</span>
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>
                    </header>

                    {/* Page Content */}
                    <main className="flex-1 overflow-y-auto p-6 md:p-8">
                        <div className="max-w-7xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
                            {children}
                        </div>
                    </main>
                </div>
            </div>
        </GridBackground>
    );
};

export default AdminLayout;
