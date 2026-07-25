'use client';

import { useForm } from 'react-hook-form';
import { Loader2 } from 'lucide-react';
import { useTransition, useState } from 'react';
import { useRouter } from 'next/navigation';
import { updateMonitoringData } from '@/actions/post.actions';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

export function MonitoringForm({ initialData = {}, availablePosts = [], isCreateMode = false }: { initialData?: any, availablePosts?: any[], isCreateMode?: boolean }) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  
  const [selectedPostId, setSelectedPostId] = useState(initialData?.id || '');

  const form = useForm({ 
    defaultValues: { 
      instagramLink: initialData?.instagramLink || '', 
      likesRange: initialData?.likesRange || '',
      repostCount: initialData?.repostCount || 0,
      shareCount: initialData?.shareCount || 0,
      postedMonth: initialData?.postedMonth || ''
    } 
  });

  const onSubmit = (data: any) => {
    if (isCreateMode && !selectedPostId) {
      alert('Pilih Ide Konten terlebih dahulu!');
      return;
    }
    
    startTransition(async () => {
      try {
        const result = await updateMonitoringData(isCreateMode ? selectedPostId : initialData.id, data);

        if (result.success) {
          router.push('/monitoring');
          router.refresh();
        } else {
          alert('Gagal menyimpan data: ' + result.error);
        }
      } catch (error) {
        console.error('Submission error:', error);
        alert('Terjadi kesalahan yang tidak terduga.');
      }
    });
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-8 bg-zinc-900/50 border border-zinc-800/60 p-8 rounded-2xl h-fit'>
      <div className='space-y-5'>
        {isCreateMode && (
          <div className='space-y-2 mb-6 pb-6 border-b border-zinc-800/60'>
            <Label className='text-zinc-300'>Pilih Ide Konten</Label>
            <Select
              value={selectedPostId}
              onValueChange={setSelectedPostId}
            >
              <SelectTrigger className="bg-zinc-950 border-zinc-800">
                <SelectValue placeholder='Pilih konten yang sudah rilis...' />
              </SelectTrigger>
              <SelectContent>
                {availablePosts.map((post: any) => (
                  <SelectItem key={post.id} value={post.id}>
                    {post.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}

        <div className='space-y-2'>
          <Label className='text-zinc-300'>Link Konten (Instagram URL)</Label>
          <Input
            type="url"
            className='bg-zinc-950 border-zinc-800 focus-visible:ring-blue-500/50 text-white placeholder:text-zinc-600 transition-all rounded-lg'
            placeholder='https://instagram.com/p/...'
            {...form.register('instagramLink')}
          />
        </div>

        <div className='grid grid-cols-1 md:grid-cols-2 gap-5'>
          <div className='space-y-2'>
            <Label className='text-zinc-300'>Bulan Posting</Label>
            <Select
              defaultValue={form.getValues('postedMonth')}
              onValueChange={(val) => form.setValue('postedMonth', val)}
            >
              <SelectTrigger className="bg-zinc-950 border-zinc-800">
                <SelectValue placeholder='Pilih Bulan' />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='Januari'>Januari</SelectItem>
                <SelectItem value='Februari'>Februari</SelectItem>
                <SelectItem value='Maret'>Maret</SelectItem>
                <SelectItem value='April'>April</SelectItem>
                <SelectItem value='Mei'>Mei</SelectItem>
                <SelectItem value='Juni'>Juni</SelectItem>
                <SelectItem value='Juli'>Juli</SelectItem>
                <SelectItem value='Agustus'>Agustus</SelectItem>
                <SelectItem value='September'>September</SelectItem>
                <SelectItem value='Oktober'>Oktober</SelectItem>
                <SelectItem value='November'>November</SelectItem>
                <SelectItem value='Desember'>Desember</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className='space-y-2'>
            <Label className='text-zinc-300'>Suka (Rentang / Angka)</Label>
            <Input
              className='bg-zinc-950 border-zinc-800 focus-visible:ring-blue-500/50 text-white placeholder:text-zinc-600 transition-all rounded-lg'
              placeholder='e.g. <5k, >5k'
              {...form.register('likesRange')}
            />
          </div>

          <div className='space-y-2'>
            <Label className='text-zinc-300'>Repost</Label>
            <Input
              type="number"
              className='bg-zinc-950 border-zinc-800 focus-visible:ring-blue-500/50 text-white placeholder:text-zinc-600 transition-all rounded-lg'
              placeholder='0'
              {...form.register('repostCount')}
            />
          </div>

          <div className='space-y-2'>
            <Label className='text-zinc-300'>Share</Label>
            <Input
              type="number"
              className='bg-zinc-950 border-zinc-800 focus-visible:ring-blue-500/50 text-white placeholder:text-zinc-600 transition-all rounded-lg'
              placeholder='0'
              {...form.register('shareCount')}
            />
          </div>
        </div>
      </div>

      <div className="flex gap-4 mt-8 pt-4 border-t border-zinc-800/60">
        <Button 
          type="button" 
          variant="outline" 
          onClick={() => router.push('/monitoring')}
          className="flex-1 bg-transparent border-zinc-700 text-zinc-300 hover:bg-zinc-800 hover:text-white"
        >
          Batal
        </Button>
        <Button type='submit' className='flex-1 bg-blue-600 hover:bg-blue-700 text-white' disabled={isPending}>
          {isPending && <Loader2 className="mr-2 h-5 w-5 animate-spin" />}
          Simpan Data
        </Button>
      </div>
    </form>
  );
}
