import prisma from "@/lib/prisma";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const dynamic = "force-dynamic";

export default async function AnalyticsPage() {
  const publishedPosts = await prisma.post.findMany({
    where: { status: 'PUBLISHED' },
    include: { admin: true, category: true },
  });

  const admins = Array.from(new Set(publishedPosts.map(p => p.admin?.codename).filter(Boolean))) as string[];
  const types = ['POST', 'CAROUSEL', 'REELS'];
  const getIndonesianMonth = (date: Date) => {
    const monthNames = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];
    return monthNames[date.getMonth()];
  };

  const months = Array.from(new Set(publishedPosts.map(p => p.postedAt ? getIndonesianMonth(p.postedAt) : null).filter(Boolean))) as string[];
  
  // Modul 1: Count of Codename (Bulan vs Admin)
  const countByMonthAndAdmin: Record<string, Record<string, number>> = {};
  months.forEach(m => {
    countByMonthAndAdmin[m] = {};
    admins.forEach(a => countByMonthAndAdmin[m][a] = 0);
  });
  
  // Modul 2: Count of Content (Tipe)
  const countByType: Record<string, number> = { POST: 0, CAROUSEL: 0, REELS: 0 };
  
  // Modul 3: Count of Tanggal Postingan (Tipe vs Admin)
  const countByTypeAndAdmin: Record<string, Record<string, number>> = {};
  types.forEach(t => {
    countByTypeAndAdmin[t] = {};
    admins.forEach(a => countByTypeAndAdmin[t][a] = 0);
  });

  // Calculate Data
  publishedPosts.forEach(post => {
    const admin = post.admin?.codename;
    const type = post.type;
    const month = post.postedAt ? getIndonesianMonth(post.postedAt) : null;

    if (type && countByType[type] !== undefined) {
      countByType[type]++;
    }
    
    if (admin && type && countByTypeAndAdmin[type] && countByTypeAndAdmin[type][admin] !== undefined) {
      countByTypeAndAdmin[type][admin]++;
    }

    if (admin && month && countByMonthAndAdmin[month] && countByMonthAndAdmin[month][admin] !== undefined) {
      countByMonthAndAdmin[month][admin]++;
    }
  });

  return (
    <div className="py-10 px-8 max-w-[1400px] mx-auto">
      <div className="mb-10">
        <h1 className="text-3xl font-bold tracking-tight text-white mb-2">Statistik Konten</h1>
        <p className="text-zinc-400">Rekap performa dan produktivitas tim Yooruunime.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Modul 1: Count of Codename */}
        <Card className="bg-zinc-900/50 border-zinc-800/60 text-white">
          <CardHeader>
            <CardTitle className="text-lg">Produktivitas Bulanan (Bulan vs Admin)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="text-xs text-zinc-400 bg-zinc-950/50 border-b border-zinc-800">
                  <tr>
                    <th className="px-4 py-3">Bulan</th>
                    {admins.map(a => <th key={a} className="px-4 py-3">{a}</th>)}
                    <th className="px-4 py-3 font-bold text-blue-400">Grand Total</th>
                  </tr>
                </thead>
                <tbody>
                  {months.map(m => {
                    const totalRow = admins.reduce((sum, a) => sum + countByMonthAndAdmin[m][a], 0);
                    return (
                      <tr key={m} className="border-b border-zinc-800/60">
                        <td className="px-4 py-3 font-medium">{m}</td>
                        {admins.map(a => (
                          <td key={a} className="px-4 py-3">{countByMonthAndAdmin[m][a] || ''}</td>
                        ))}
                        <td className="px-4 py-3 font-bold text-blue-400">{totalRow}</td>
                      </tr>
                    );
                  })}
                  <tr className="bg-zinc-950/30">
                    <td className="px-4 py-3 font-bold">Grand Total</td>
                    {admins.map(a => {
                      const totalCol = months.reduce((sum, m) => sum + countByMonthAndAdmin[m][a], 0);
                      return <td key={a} className="px-4 py-3 font-bold">{totalCol}</td>;
                    })}
                    <td className="px-4 py-3 font-bold text-blue-400">{publishedPosts.length}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Modul 3: Count of Tanggal Postingan */}
        <Card className="bg-zinc-900/50 border-zinc-800/60 text-white">
          <CardHeader>
            <CardTitle className="text-lg">Distribusi Tipe Konten (Tipe vs Admin)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="text-xs text-zinc-400 bg-zinc-950/50 border-b border-zinc-800">
                  <tr>
                    <th className="px-4 py-3">Tipe</th>
                    {admins.map(a => <th key={a} className="px-4 py-3">{a}</th>)}
                    <th className="px-4 py-3 font-bold text-blue-400">Grand Total</th>
                  </tr>
                </thead>
                <tbody>
                  {types.map(t => {
                    const totalRow = admins.reduce((sum, a) => sum + countByTypeAndAdmin[t][a], 0);
                    return (
                      <tr key={t} className="border-b border-zinc-800/60">
                        <td className="px-4 py-3 font-medium capitalize">{t.toLowerCase()}</td>
                        {admins.map(a => (
                          <td key={a} className="px-4 py-3">{countByTypeAndAdmin[t][a] || ''}</td>
                        ))}
                        <td className="px-4 py-3 font-bold text-blue-400">{totalRow}</td>
                      </tr>
                    );
                  })}
                  <tr className="bg-zinc-950/30">
                    <td className="px-4 py-3 font-bold">Grand Total</td>
                    {admins.map(a => {
                      const totalCol = types.reduce((sum, t) => sum + countByTypeAndAdmin[t][a], 0);
                      return <td key={a} className="px-4 py-3 font-bold">{totalCol}</td>;
                    })}
                    <td className="px-4 py-3 font-bold text-blue-400">{publishedPosts.length}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Modul 2: Count of Content */}
        <Card className="bg-zinc-900/50 border-zinc-800/60 text-white">
          <CardHeader>
            <CardTitle className="text-lg">Total Konten Rilis (Per Tipe)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="text-xs text-zinc-400 bg-zinc-950/50 border-b border-zinc-800">
                  <tr>
                    <th className="px-4 py-3">Tipe</th>
                    <th className="px-4 py-3 text-right">Yoruunime (Total)</th>
                  </tr>
                </thead>
                <tbody>
                  {types.map(t => (
                    <tr key={t} className="border-b border-zinc-800/60">
                      <td className="px-4 py-3 font-medium capitalize">{t.toLowerCase()}</td>
                      <td className="px-4 py-3 text-right">{countByType[t]}</td>
                    </tr>
                  ))}
                  <tr className="bg-zinc-950/30">
                    <td className="px-4 py-3 font-bold">Grand Total</td>
                    <td className="px-4 py-3 font-bold text-right text-blue-400">{publishedPosts.length}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

      </div>
    </div>
  );
}
