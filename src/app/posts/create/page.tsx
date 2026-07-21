import Link from "next/link";
import { ArrowLeft, Sparkles } from "lucide-react";
import { PostForm } from "@/components/PostForm";

export default function CreatePostPage() {
  return (
    <div className="container mx-auto py-12 max-w-[1400px] px-6 relative">
      {/* Decorative Glow */}
      <div className="absolute top-0 right-1/4 w-[600px] h-[300px] bg-purple-500/10 blur-[100px] rounded-full pointer-events-none -z-10" />

      <div className="mb-12 pt-6">
        <Link href="/" className="inline-flex items-center text-sm font-medium text-zinc-400 hover:text-white transition-colors mb-6 group">
          <ArrowLeft className="mr-2 h-4 w-4 group-hover:-translate-x-1 transition-transform" />
          Back to Dashboard
        </Link>
        <div className="flex items-center gap-3 mb-2">
           <h1 className="text-4xl font-extrabold tracking-tight">Create <span className="text-gradient">New Post</span></h1>
           <Sparkles className="w-6 h-6 text-purple-400" />
        </div>
        <p className="text-lg text-zinc-400 max-w-xl">Draft your new Instagram content, add slides, and see how it looks in real-time.</p>
      </div>
      
      <PostForm />
    </div>
  );
}
