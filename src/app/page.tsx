import Link from "next/link";
import { Plus, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DashboardCard } from "@/components/DashboardCard";
import prisma from "@/lib/prisma";

// Ensure this page is dynamically rendered
export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const posts = await prisma.post.findMany({
    orderBy: { createdAt: 'desc' },
    include: {
      category: true
    }
  });

  return (
    <div className="py-10 px-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white mb-2">
            Ide Konten
          </h1>
          <p className="text-zinc-400">
            Kelola dan jadwalkan ide konten Instagram Yoorunime dengan mudah.
          </p>
        </div>
        
        <Link href="/posts/create">
          <Button className="rounded-md px-6 py-5 text-sm font-medium bg-white text-black hover:bg-zinc-200 transition-colors">
            <Plus className="mr-2 h-4 w-4" /> Buat Ide Baru
          </Button>
        </Link>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {posts.map((post) => (
          <DashboardCard key={post.id} post={post} />
        ))}
      </div>
    </div>
  );
}
