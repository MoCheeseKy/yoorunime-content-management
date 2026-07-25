import prisma from "@/lib/prisma";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { revalidatePath } from "next/cache";

export const dynamic = "force-dynamic";

async function addAdmin(formData: FormData) {
  'use server';
  const codename = formData.get('codename') as string;
  if (codename) {
    await prisma.admin.create({ data: { codename } });
    revalidatePath('/admins');
  }
}

export default async function AdminDashboardPage() {
  const admins = await prisma.admin.findMany({
    orderBy: { createdAt: 'desc' },
    include: {
      _count: {
        select: { posts: true }
      }
    }
  });

  return (
    <div className="py-10 px-8 max-w-[1400px] mx-auto">
      <div className="mb-10">
        <h1 className="text-3xl font-bold tracking-tight text-white mb-2">Dashboard Admin</h1>
        <p className="text-zinc-400">Kelola daftar tim admin dan pantau kontribusi mereka.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Form Add Admin */}
        <div className="col-span-1">
          <Card className="bg-zinc-900/50 border-zinc-800/60 text-white sticky top-6">
            <CardHeader>
              <CardTitle className="text-lg">Tambah Admin Baru</CardTitle>
            </CardHeader>
            <CardContent>
              <form action={addAdmin} className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm text-zinc-300">Codename Admin</label>
                  <input
                    name="codename"
                    required
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                    placeholder="e.g. Admin Kal"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
                >
                  Tambah Admin
                </button>
              </form>
            </CardContent>
          </Card>
        </div>

        {/* List Admin */}
        <div className="col-span-1 lg:col-span-2">
          <div className="bg-zinc-900/50 border border-zinc-800/60 rounded-xl overflow-hidden">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-zinc-400 bg-zinc-950/50 border-b border-zinc-800">
                <tr>
                  <th className="px-6 py-4 font-medium">Codename</th>
                  <th className="px-6 py-4 font-medium text-center">Total Ide Konten</th>
                  <th className="px-6 py-4 font-medium text-right">Tanggal Bergabung</th>
                </tr>
              </thead>
              <tbody>
                {admins.map((admin) => (
                  <tr key={admin.id} className="border-b border-zinc-800/60 hover:bg-zinc-800/30 transition-colors text-white">
                    <td className="px-6 py-4 font-medium">{admin.codename}</td>
                    <td className="px-6 py-4 text-center">
                      <Badge variant="outline" className="bg-blue-500/10 text-blue-400 border-blue-500/20">
                        {admin._count.posts} Ide
                      </Badge>
                    </td>
                    <td className="px-6 py-4 text-right text-zinc-400">
                      {new Date(admin.createdAt).toLocaleDateString('id-ID', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric'
                      })}
                    </td>
                  </tr>
                ))}
                
                {admins.length === 0 && (
                  <tr>
                    <td colSpan={3} className="px-6 py-12 text-center text-zinc-500">
                      Belum ada admin yang terdaftar.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
