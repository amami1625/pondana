import SideNav from '@/components/navigation/SideNav';

export default function ListsLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-background-light font-display">
      <SideNav />
      <main className="flex-1 p-8">
        <div className="mx-auto max-w-6xl">{children}</div>
      </main>
    </div>
  );
}
