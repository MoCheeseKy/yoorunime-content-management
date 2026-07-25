import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { PostForm } from "@/components/PostForm";
import prisma from "@/lib/prisma";
import { notFound } from "next/navigation";
import { getFormData } from "@/actions/post.actions";

export default async function EditPostPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const post = await prisma.post.findUnique({
    where: { id }
  });

  if (!post) {
    notFound();
  }

  const { admins, categories } = await getFormData();

  return (
    <div className="py-10 px-8 max-w-[1400px] mx-auto">
      <div className="mb-10">
        <Link href="/" className="inline-flex items-center text-sm font-medium text-zinc-400 hover:text-white transition-colors mb-6 group">
          <ArrowLeft className="mr-2 h-4 w-4 group-hover:-translate-x-1 transition-transform" />
          Kembali ke Dashboard
        </Link>
        <div className="flex items-center gap-3 mb-2">
          <h1 className="text-3xl font-bold tracking-tight text-white">Edit Post</h1>
        </div>
        <p className="text-zinc-400 max-w-xl">
          Perbarui ide konten ini dan sesuaikan dengan kebutuhan barumu.
        </p>
      </div>

      <PostForm initialData={post} admins={admins} categories={categories} />
    </div>
  );
}
