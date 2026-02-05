// app/dashboard/layout.tsx
import Link from "next/link";
import { LayoutDashboard, Users, Settings, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";

function Sidebar() {
    return (
        <aside className="w-64 border-r bg-white dark:bg-slate-900 hidden md:block h-screen fixed left-0 top-0 overflow-y-auto">
            <div className="flex h-16 items-center border-b px-6 justify-between">
                <h2 className="text-xl font-bold">CigarManager</h2>
            </div>

            <div className="flex flex-col justify-between h-[calc(100vh-4rem)] p-4">
                <nav className="flex flex-col gap-2">
                    {/* NOTA: I link ora puntano a /dashboard/... */}
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

                {/* Tasto Logout */}
                <Link href="/">
                    <Button variant="outline" className="w-full justify-start gap-2 text-red-500 hover:text-red-600">
                        <LogOut size={18} /> Esci
                    </Button>
                </Link>
            </div>
        </aside>
    );
}

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="flex min-h-screen">
            <Sidebar />
            {/* Contenuto a destra della sidebar */}
            <main className="flex-1 md:ml-64 p-8">
                {children}
            </main>
        </div>
    );
}
