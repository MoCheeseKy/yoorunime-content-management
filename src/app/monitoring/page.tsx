import { Sparkles } from "lucide-react";
import prisma from "@/lib/prisma";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { deleteMonitoringData } from "@/actions/post.actions";

export const dynamic = "force-dynamic";

export default async function MonitoringPage() {
  const posts = await prisma.post.findMany({
    where: { instagramLink: { not: null } },
    include: { admin: true, category: true },
    orderBy: { createdAt: 'desc' }
  });

  return (
    <div className="py-10 px-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white mb-2">
            Data Postingan Bulanan
          </h1>
          <p className="text-zinc-400">
            Monitoring performa postingan Instagram yang sudah terpublikasi (Tabel Data).
          </p>
        </div>
        <Link 
          href="/monitoring/create" 
          className="bg-white text-black hover:bg-zinc-200 px-5 py-2.5 rounded-full font-semibold transition-all duration-300 inline-flex items-center gap-2 shadow-lg shadow-white/10 hover:shadow-white/20 hover:-translate-y-0.5"
        >
          + Tambah Data Postingan
        </Link>
      </div>

      <div className="bg-white/[0.02] border border-white/[0.05] backdrop-blur-xl rounded-2xl overflow-hidden shadow-2xl">
        <table className="w-full text-sm text-left">
          <thead className="text-xs text-zinc-400 uppercase bg-black/20 border-b border-white/[0.05]">
            <tr>
              <th className="px-6 py-4 font-medium">Detail (Judul)</th>
              <th className="px-6 py-4 font-medium">Jenis</th>
              <th className="px-6 py-4 font-medium">Tipe</th>
              <th className="px-6 py-4 font-medium">Codename</th>
              <th className="px-6 py-4 font-medium">Tgl Post</th>
              <th className="px-6 py-4 font-medium text-right">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {posts.map((post) => (
              <tr key={post.id} className="border-b border-white/[0.05] hover:bg-white/[0.02] transition-colors group">
                <td className="px-6 py-4 text-white font-medium">{post.title}</td>
                <td className="px-6 py-4">
                  <Badge variant="outline" className="bg-blue-500/10 text-blue-400 border-blue-500/20">{post.category?.name || '-'}</Badge>
                </td>
                <td className="px-6 py-4 text-blue-300 capitalize">{post.type.toLowerCase()}</td>
                <td className="px-6 py-4 text-red-500 font-medium">{post.admin?.codename || '-'}</td>
                <td className="px-6 py-4 text-zinc-300">
                  {post.scheduledAt ? new Date(post.scheduledAt).toLocaleDateString('id-ID') : new Date(post.createdAt).toLocaleDateString('id-ID')}
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex justify-end items-center gap-2">
                    <Link href={`/monitoring/${post.id}`} className="text-blue-400 hover:text-white font-medium text-xs bg-blue-500/10 hover:bg-blue-600 px-4 py-2 rounded-full transition-all duration-300">
                      Update
                    </Link>
                    <form action={async () => {
                      "use server";
                      await deleteMonitoringData(post.id);
                    }}>
                      <button type="submit" className="text-red-400 hover:text-white font-medium text-xs bg-red-500/10 hover:bg-red-600 px-4 py-2 rounded-full transition-all duration-300">
                        Hapus
                      </button>
                    </form>
                  </div>
                </td>
              </tr>
            ))}
            
            {posts.length === 0 && (
              <tr>
                <td colSpan={6} className="px-6 py-12 text-center text-zinc-500">
                  Belum ada data postingan yang ditambahkan ke monitoring.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
