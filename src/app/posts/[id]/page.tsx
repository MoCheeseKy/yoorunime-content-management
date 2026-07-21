import Link from "next/link";
import { ArrowLeft, Sparkles } from "lucide-react";
import { PostForm } from "@/components/PostForm";
import prisma from "@/lib/prisma";
import { notFound } from "next/navigation";

export default async function EditPostPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const post = await prisma.post.findUnique({
    where: { id }
  });

  if (!post) {
    notFound();
  }

  return (
    <div className="container mx-auto py-12 max-w-[1400px] px-4">
      {/* Header section identical to create page */}
      <div className="mb-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <Link href="/" className="inline-flex items-center text-sm font-medium text-zinc-400 hover:text-white transition-colors mb-6 bg-white/5 px-4 py-2 rounded-full border border-white/5 hover:bg-white/10">
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Dashboard
        </Link>
        <div className="flex items-center gap-3 mb-2">
          <h1 className="text-4xl font-extrabold tracking-tight">
            Edit <span className="text-blue-400">Post</span>
          </h1>
          <Sparkles className="w-8 h-8 text-purple-400 animate-pulse" />
        </div>
        <p className="text-zinc-400 max-w-xl text-lg">
          Update your existing Instagram content, tweak the copy, and perfect your layout in real-time.
        </p>
      </div>

      <div className="animate-in fade-in slide-in-from-bottom-8 duration-700 delay-150 fill-mode-both">
        <PostForm initialData={post} />
      </div>
    </div>
  );
}
