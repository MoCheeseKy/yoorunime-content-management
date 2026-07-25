'use client';

import { differenceInDays } from "date-fns";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Pencil, Trash2, Loader2 } from "lucide-react";
import Link from "next/link";
import { useTransition } from "react";
import { deletePost } from "@/actions/post.actions";
import { useRouter } from "next/navigation";

export function DashboardCard({ post }: { post: any }) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const daysUntilPost = post.scheduledAt ? differenceInDays(new Date(post.scheduledAt), new Date()) : null;
  
  let alertStyle = "border-zinc-800/60 hover:border-zinc-700";
  let alertBadge = null;
  
  if (daysUntilPost !== null) {
    if (daysUntilPost < 0 && post.status !== "PUBLISHED") {
      alertStyle = "border-red-900/50 hover:border-red-800/80 bg-red-950/10";
      alertBadge = <Badge variant="destructive" className="ml-2 bg-red-500/20 text-red-400 border-none">Overdue!</Badge>;
    } else if (daysUntilPost <= 2 && post.status !== "PUBLISHED") {
      alertStyle = "border-amber-900/50 hover:border-amber-800/80 bg-amber-950/10";
      alertBadge = <Badge variant="secondary" className="bg-amber-500/20 text-amber-400 hover:bg-amber-500/30 ml-2 border-none">Due in {daysUntilPost}d</Badge>;
    } else if (post.status === "PUBLISHED") {
      alertBadge = <Badge variant="default" className="ml-2 bg-green-500/20 text-green-400 border-none">Published</Badge>;
    }
  }

  const handleDelete = (e: React.MouseEvent) => {
    e.preventDefault();
    if (confirm("Are you sure you want to delete this post?")) {
      startTransition(async () => {
        await deletePost(post.id);
        router.refresh();
      });
    }
  };

  return (
    <Link href={`/posts/${post.id}`}>
      <Card className={`group bg-zinc-900/50 border transition-all duration-200 hover:bg-zinc-800/50 relative h-full flex flex-col cursor-pointer rounded-xl ${alertStyle}`}>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start gap-4">
          <CardTitle className="text-lg leading-tight group-hover:text-blue-400 transition-colors">{post.title}</CardTitle>
          <div className="shrink-0">{alertBadge}</div>
        </div>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col">
        <p className="text-sm text-zinc-400 line-clamp-2 leading-relaxed flex-1">{post.description || "No description provided."}</p>
        <div className="mt-6 flex justify-between items-end">
          <div className="flex flex-wrap items-center gap-2">
            {post.status === "DRAFT" && !alertBadge && <Badge variant="outline" className="border-white/10 text-zinc-400">Draft</Badge>}
            {post.status === "REJECTED" && <Badge variant="destructive" className="bg-red-500/20 text-red-400 border-none">Rejected</Badge>}
            {post.category && (
              <Badge variant="secondary" className="bg-white/5 text-zinc-300 hover:bg-white/10 border-white/5">
                {post.category.name}
              </Badge>
            )}
          </div>
          
          <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <button 
              onClick={(e) => { e.preventDefault(); router.push(`/posts/${post.id}`); }}
              className="p-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-400 hover:text-zinc-200 rounded-md transition-colors"
              disabled={isPending}
            >
              <Pencil className="w-4 h-4" />
            </button>
            <button 
              onClick={handleDelete}
              className="p-2 bg-zinc-800 hover:bg-red-950 text-zinc-400 hover:text-red-400 rounded-md transition-colors"
              disabled={isPending}
            >
              {isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </CardContent>
      </Card>
    </Link>
  );
}
