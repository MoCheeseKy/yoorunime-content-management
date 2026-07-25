import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import prisma from "@/lib/prisma";
import { MonitoringForm } from "@/components/MonitoringForm";

export const dynamic = "force-dynamic";

export default async function CreateMonitoringPage() {
  const availablePosts = await prisma.post.findMany({
    where: { instagramLink: null },
    orderBy: { createdAt: 'desc' }
  });

  return (
    <div className="py-10 px-8 max-w-[800px] mx-auto">
      <div className="mb-10">
        <Link href="/monitoring" className="inline-flex items-center text-sm font-medium text-zinc-400 hover:text-white transition-colors mb-6 group">
          <ArrowLeft className="mr-2 h-4 w-4 group-hover:-translate-x-1 transition-transform" />
          Kembali ke Data Postingan
        </Link>
        <div className="flex items-center gap-3 mb-2">
          <h1 className="text-3xl font-bold tracking-tight text-white">Tambah Data Postingan</h1>
        </div>
        <p className="text-zinc-400">
          Pilih ide konten yang sudah rilis dan tambahkan data performanya.
        </p>
      </div>

      <MonitoringForm availablePosts={availablePosts} isCreateMode={true} initialData={{}} />
    </div>
  );
}
