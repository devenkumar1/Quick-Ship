import AdminLayout from "@/components/AdminLayout";

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex min-h-screen bg-gray-100 dark:bg-gray-800">
      <AdminLayout />
      <main className="flex-1 ml-64 p-8">
        {children}
      </main>
    </div>
  );
}
