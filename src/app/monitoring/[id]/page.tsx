import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import prisma from "@/lib/prisma";
import { notFound } from "next/navigation";
import { MonitoringForm } from "@/components/MonitoringForm";

export default async function EditMonitoringPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const post = await prisma.post.findUnique({
    where: { id }
  });

  if (!post) {
    notFound();
  }

  return (
    <div className="py-10 px-8 max-w-[800px] mx-auto">
      <div className="mb-10">
        <Link href="/monitoring" className="inline-flex items-center text-sm font-medium text-zinc-400 hover:text-white transition-colors mb-6 group">
          <ArrowLeft className="mr-2 h-4 w-4 group-hover:-translate-x-1 transition-transform" />
          Kembali ke Data Postingan
        </Link>
        <div className="flex items-center gap-3 mb-2">
          <h1 className="text-3xl font-bold tracking-tight text-white">Update Data Bulanan</h1>
        </div>
        <p className="text-zinc-400">
          Masukkan link postingan Instagram dan lengkapi data engagement untuk "{post.title}".
        </p>
      </div>

      <MonitoringForm initialData={post} />
    </div>
  );
}
