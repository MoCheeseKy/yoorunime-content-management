'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Calendar, LineChart, Sparkles, Users } from 'lucide-react';
import { cn } from '@/lib/utils';

const navigation = [
  { name: 'Ide Konten', href: '/', icon: LayoutDashboard },
  { name: 'Data Postingan', href: '/monitoring', icon: Calendar },
  { name: 'Statistik', href: '/analytics', icon: LineChart },
  { name: 'Dashboard Admin', href: '/admins', icon: Users },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <div className="flex h-full w-72 flex-col border-r border-white/[0.05] bg-white/[0.01] backdrop-blur-2xl">
      <div className="flex h-20 shrink-0 items-center px-8 border-b border-white/[0.05]">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center shadow-lg shadow-blue-500/20 group-hover:shadow-blue-500/40 transition-all duration-300">
            <Sparkles className="h-4 w-4 text-white" />
          </div>
          <span className="text-xl font-bold tracking-tight text-white group-hover:text-blue-400 transition-colors">Yoorunime</span>
        </Link>
      </div>
      
      <div className="flex-1 overflow-y-auto py-6 px-4">
        <nav className="flex-1 space-y-1.5 px-4 py-8">
          {navigation.map((item) => {
            const isActive = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href));
            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  isActive
                    ? 'bg-white/10 text-white shadow-sm ring-1 ring-white/10'
                    : 'text-zinc-400 hover:bg-white/5 hover:text-white',
                  'group flex items-center gap-x-3 rounded-xl p-3 text-sm font-medium leading-6 transition-all duration-300'
                )}
              >
                <item.icon
                  className={cn(
                    isActive ? 'text-white' : 'text-zinc-500 group-hover:text-white',
                    'h-5 w-5 shrink-0 transition-colors duration-300'
                  )}
                  aria-hidden="true"
                />
                {item.name}
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="border-t border-white/[0.05] p-6">
        <div className="flex items-center gap-x-4">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-zinc-800 to-zinc-900 border border-white/10 flex items-center justify-center text-sm font-bold text-white shadow-inner">
            Y
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-semibold text-white">Yoorunime Team</span>
            <span className="text-xs text-zinc-500 font-medium">Administrator</span>
          </div>
        </div>
      </div>
    </div>
  );
}
