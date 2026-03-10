import Sidebar from './Sidebar';

interface AdminLayoutProps {
    children: React.ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
    return (
        <div className="flex h-screen">
            <Sidebar />
            <main className="flex-1 overflow-auto bg-white md:ml-64">
                <div className="p-6">
                    {children}
                </div>
            </main>
        </div>
    );
} 