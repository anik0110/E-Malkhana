import Sidebar from '@/components/Sidebar';
import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { authOptions } from '@/lib/auth'; // <--- Make sure this is imported

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // FIX: Pass authOptions here
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect('/'); 
  }

  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar />
      <main className="flex-1 overflow-y-auto h-screen">
        {children}
      </main>
    </div>
  );
}