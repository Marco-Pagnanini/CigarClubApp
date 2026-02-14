'use client';

import Link from "next/link";
import { useRouter } from "next/navigation";
import { LayoutDashboard, Users, Settings, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { removeToken } from "@/api/api";

export function Sidebar() {
    const router = useRouter();

    const handleLogout = () => {
        removeToken();
        router.push('/');
    };

    return (
        <aside className="w-64 border-r bg-white dark:bg-slate-900 hidden md:block h-screen fixed left-0 top-0 overflow-y-auto">
            <div className="flex h-16 items-center border-b px-6 justify-between">
                <h2 className="text-xl font-bold">CigarManager</h2>
            </div>

            <div className="flex flex-col justify-between h-[calc(100vh-4rem)] p-4">
                <nav className="flex flex-col gap-2">
                    <Link href="/dashboard">
                        <Button variant="ghost" className="w-full justify-start gap-2">
                            <LayoutDashboard size={18} /> Home
                        </Button>
                    </Link>
                    <Link href="/dashboard/users">
                        <Button variant="ghost" className="w-full justify-start gap-2">
                            <Users size={18} /> Utenti
                        </Button>
                    </Link>
                    <Link href="/dashboard/settings">
                        <Button variant="ghost" className="w-full justify-start gap-2">
                            <Settings size={18} /> Impostazioni
                        </Button>
                    </Link>
                </nav>

                <Button
                    variant="outline"
                    className="w-full justify-start gap-2 text-red-500 hover:text-red-600"
                    onClick={handleLogout}
                >
                    <LogOut size={18} /> Esci
                </Button>
            </div>
        </aside>
    );
}
