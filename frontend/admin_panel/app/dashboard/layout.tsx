import { Sidebar } from "@/components/myComponents/Sidebar";

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="flex min-h-screen">
            <Sidebar />
            <main className="flex-1 md:ml-64 p-8">
                {children}
            </main>
        </div>
    );
}
