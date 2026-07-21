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
    <div className="container mx-auto py-12 max-w-7xl px-6 relative">
      {/* Decorative Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[300px] bg-blue-500/20 blur-[120px] rounded-full pointer-events-none -z-10" />
      
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-16 gap-6 pt-10">
        <div className="space-y-3">
          <div className="inline-flex items-center rounded-full border border-blue-500/30 bg-blue-500/10 px-3 py-1 text-sm font-medium text-blue-400 backdrop-blur-sm mb-4">
            <Sparkles className="mr-2 h-4 w-4" />
            <span>Manage your ideas seamlessly</span>
          </div>
          <h1 className="text-5xl font-extrabold tracking-tight">
            Content <span className="text-gradient">Dashboard</span>
          </h1>
          <p className="text-lg text-zinc-400 max-w-xl">
            Draft, schedule, and preview your Instagram posts in one unified, beautiful workspace.
          </p>
        </div>
        
        <Link href="/posts/create">
          <Button className="rounded-full px-8 py-6 text-base font-medium shadow-[0_0_20px_rgba(59,130,246,0.3)] hover:shadow-[0_0_30px_rgba(59,130,246,0.5)] transition-all bg-white text-black hover:bg-zinc-200">
            <Plus className="mr-2 h-5 w-5" /> Create New Post
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
