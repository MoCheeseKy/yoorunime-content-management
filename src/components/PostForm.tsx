'use client';

import { useForm } from 'react-hook-form';
import { Copy, Loader2 } from 'lucide-react';
import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { createPost, updatePost } from '@/actions/post.actions';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { IGPreview } from './IGPreview';
import { HookValuator } from './HookValuator';

export function PostForm({ initialData = null, admins = [], categories = [] }: { initialData?: any, admins?: any[], categories?: any[] }) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  
  const form = useForm({ defaultValues: initialData || { status: 'DRAFT', title: '', description: '', caption: '', hashtags: '', adminId: '', categoryId: '', type: 'POST' } });

  const [isNewAdmin, setIsNewAdmin] = useState(false);
  const [isNewCategory, setIsNewCategory] = useState(false);

  const [slides, setSlides] = useState<string[]>(() => {
    if (initialData?.type === 'CAROUSEL' && initialData?.slidesDescription) {
      try {
        const parsed = JSON.parse(initialData.slidesDescription);
        if (Array.isArray(parsed)) return parsed;
      } catch (e) {
        return [initialData.slidesDescription];
      }
    }
    return [''];
  });

  const status = form.watch('status');
  const caption = form.watch('caption');
  const hashtags = form.watch('hashtags');
  const title = form.watch('title');
  const description = form.watch('description');
  const type = form.watch('type');

  const handleCopyCaption = () => {
    const fullText = [caption, hashtags].filter(Boolean).join('\n\n');
    navigator.clipboard.writeText(fullText);
    alert('Caption & Hashtags copied to clipboard!');
  };

  const updateSlide = (index: number, val: string) => {
    const newSlides = [...slides];
    newSlides[index] = val;
    setSlides(newSlides);
  };

  const addSlide = () => {
    if (slides.length < 19) { // Max 20 slides total (1 cover + 19 sub-slides)
      setSlides([...slides, '']);
    }
  };

  const removeSlide = (index: number) => {
    if (slides.length > 1) {
      setSlides(slides.filter((_, i) => i !== index));
    }
  };

  const onSubmit = (data: any) => {
    startTransition(async () => {
      try {
        const payload = {
          ...data,
          slidesDescription: type === 'CAROUSEL' ? JSON.stringify(slides) : null
        };

        let result;
        if (initialData?.id) {
          result = await updatePost(initialData.id, payload);
        } else {
          result = await createPost(payload);
        }

        if (result.success) {
          router.push('/');
          router.refresh();
        } else {
          alert('Failed to save post: ' + result.error);
        }
      } catch (error) {
        console.error('Submission error:', error);
        alert('An unexpected error occurred.');
      }
    });
  };

  return (
    <div className='grid grid-cols-1 lg:grid-cols-2 gap-10'>
      {/* Form Area */}
      <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-8 bg-zinc-900/50 border border-zinc-800/60 p-8 rounded-2xl h-fit'>
        
        {/* Top Info Area: Admin, Type, Category */}
        <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
          <div className='space-y-2'>
            <Label className='text-zinc-300'>Pemilik Ide (Codename)</Label>
            {!isNewAdmin ? (
              <Select
                defaultValue={form.getValues('adminId')}
                onValueChange={(val) => {
                  if (val === 'NEW') setIsNewAdmin(true);
                  else form.setValue('adminId', val);
                }}
              >
                <SelectTrigger className="w-full bg-zinc-950 border-zinc-800">
                  <SelectValue placeholder='Pilih Admin' />
                </SelectTrigger>
                <SelectContent>
                  {admins.map(a => (
                    <SelectItem key={a.id} value={a.codename}>{a.codename}</SelectItem>
                  ))}
                  <SelectItem value="NEW" className="text-blue-400 font-medium">+ Buat Baru...</SelectItem>
                </SelectContent>
              </Select>
            ) : (
              <div className="grid grid-cols-[1fr_auto] gap-2">
                <Input
                  className='bg-zinc-950 border-zinc-800 focus-visible:ring-blue-500/50'
                  placeholder='Nama Admin Baru...'
                  {...form.register('adminId')}
                  autoFocus
                />
                <Button type="button" variant="outline" className="border-zinc-800 px-3" onClick={() => { setIsNewAdmin(false); form.setValue('adminId', ''); }}>Batal</Button>
              </div>
            )}
          </div>
          
          <div className='space-y-2'>
            <Label className='text-zinc-300'>Jenis Konten</Label>
            {!isNewCategory ? (
              <Select
                defaultValue={form.getValues('categoryId')}
                onValueChange={(val) => {
                  if (val === 'NEW') setIsNewCategory(true);
                  else form.setValue('categoryId', val);
                }}
              >
                <SelectTrigger className="w-full bg-zinc-950 border-zinc-800">
                  <SelectValue placeholder='Pilih Jenis' />
                </SelectTrigger>
                <SelectContent>
                  {categories.map(c => (
                    <SelectItem key={c.id} value={c.name}>{c.name}</SelectItem>
                  ))}
                  <SelectItem value="NEW" className="text-blue-400 font-medium">+ Buat Baru...</SelectItem>
                </SelectContent>
              </Select>
            ) : (
              <div className="grid grid-cols-[1fr_auto] gap-2">
                <Input
                  className='bg-zinc-950 border-zinc-800 focus-visible:ring-blue-500/50'
                  placeholder='Jenis Konten Baru...'
                  {...form.register('categoryId')}
                  autoFocus
                />
                <Button type="button" variant="outline" className="border-zinc-800 px-3" onClick={() => { setIsNewCategory(false); form.setValue('categoryId', ''); }}>Batal</Button>
              </div>
            )}
          </div>

          <div className='space-y-2'>
            <Label className='text-zinc-300'>Tipe Visual</Label>
            <Select
              defaultValue={type}
              onValueChange={(val) => form.setValue('type', val)}
            >
              <SelectTrigger className="w-full bg-zinc-950 border-zinc-800">
                <SelectValue placeholder='Pilih Tipe Visual' />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='POST'>Post (1 Slide)</SelectItem>
                <SelectItem value='CAROUSEL'>Carousel (Slide)</SelectItem>
                <SelectItem value='REELS'>Reels / Video</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className='space-y-5'>
          <div className='space-y-2'>
            <div className='flex justify-between items-center'>
              <Label className='text-zinc-300'>Post Title</Label>
              <span className='text-[10px] text-zinc-500'>
                Gunakan *teks* untuk warna kuning
              </span>
            </div>
            <Input
              className='bg-zinc-950 border-zinc-800 focus-visible:ring-blue-500/50 text-white placeholder:text-zinc-600 transition-all rounded-lg'
              placeholder='e.g. 5 Tips to *boost* your engagement'
              {...form.register('title')}
            />
          </div>

          <HookValuator title={title} />

          <div className='space-y-2'>
            <div className='flex justify-between items-center'>
              <Label className='text-zinc-300'>Description</Label>
              <span className='text-[10px] text-zinc-500'>
                Gunakan *teks* untuk warna kuning
              </span>
            </div>
            <Textarea
              className='bg-zinc-950 border-zinc-800 focus-visible:ring-blue-500/50 text-white placeholder:text-zinc-600 transition-all rounded-lg resize-none'
              placeholder='Internal notes for this post...'
              {...form.register('description')}
            />
          </div>

          {type === 'CAROUSEL' && (
            <div className='space-y-4 animate-in fade-in slide-in-from-top-2 pt-4 border-t border-zinc-800/60'>
              <div className="flex justify-between items-center">
                <Label className='text-blue-400'>Keterangan Isi Carousel (Maksimal 20 Slide)</Label>
                <span className="text-xs text-zinc-500">{slides.length + 1} / 20 Slide</span>
              </div>
              
              <div className="space-y-3">
                {slides.map((slide, idx) => (
                  <div key={idx} className="flex gap-3 items-start">
                    <div className="bg-zinc-950 border border-zinc-800 text-zinc-400 w-10 h-10 rounded-lg flex items-center justify-center shrink-0 font-bold text-sm">
                      {idx + 2}
                    </div>
                    <Textarea
                      className='bg-blue-500/5 border-blue-500/20 focus-visible:ring-blue-500/50 text-white placeholder:text-blue-200/40 transition-all rounded-lg resize-none min-h-[60px]'
                      placeholder={`Isi pembahasan slide ke-${idx + 2}...`}
                      value={slide}
                      onChange={(e) => updateSlide(idx, e.target.value)}
                    />
                    {slides.length > 1 && (
                      <Button type="button" variant="ghost" className="text-zinc-500 hover:text-red-400" onClick={() => removeSlide(idx)}>
                        &times;
                      </Button>
                    )}
                  </div>
                ))}
              </div>

              {slides.length < 19 && (
                <Button type="button" variant="outline" className="w-full border-dashed border-zinc-700 text-zinc-400 hover:text-white" onClick={addSlide}>
                  + Tambah Slide Berikutnya
                </Button>
              )}
            </div>
          )}
        </div>

        {/* Caption & Hashtags */}
        <div className='space-y-5'>
          <div className='space-y-2'>
            <Label className='text-zinc-300'>Caption</Label>
            <Textarea
              rows={4}
              className='bg-zinc-950 border-zinc-800 focus-visible:ring-blue-500/50 text-white placeholder:text-zinc-500 transition-all rounded-lg resize-none'
              placeholder='Write your compelling caption here...'
              {...form.register('caption')}
            />
          </div>

          <div className='space-y-2'>
            <Label className='text-zinc-300'>Hashtags</Label>
            <Textarea
              rows={2}
              className='bg-zinc-950 border-zinc-800 focus-visible:ring-blue-500/50 text-white placeholder:text-zinc-500 transition-all rounded-lg resize-none'
              placeholder='#instagramtips #socialmedia #marketing'
              {...form.register('hashtags')}
            />
          </div>

          <Button
            type='button'
            variant='secondary'
            onClick={handleCopyCaption}
            className='w-full bg-blue-500/10 text-blue-400 hover:bg-blue-500/20 hover:text-blue-300 border border-blue-500/20 transition-all rounded-xl py-6 font-medium'
          >
            <Copy className='mr-2 h-4 w-4' /> Copy Caption & Hashtags
          </Button>
        </div>

        {/* Status */}
        <div className='space-y-2'>
          <Label>Status</Label>
          <Select
            defaultValue={status}
            onValueChange={(val) => form.setValue('status', val)}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder='Pilih Status' />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value='DRAFT'>Belum Posting</SelectItem>
              <SelectItem value='PUBLISHED'>Sudah Posting</SelectItem>
              <SelectItem value='REJECTED'>Rejected</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Reject Reason (Conditional) */}
        {status === 'REJECTED' && (
          <div className='space-y-2 animate-in fade-in slide-in-from-top-2'>
            <Label className='text-red-500'>Alasan Penolakan</Label>
            <Textarea
              className='border-red-200 focus-visible:ring-red-500'
              placeholder='Jelaskan kenapa konten ini ditolak...'
              {...form.register('rejectReason')}
              required
            />
          </div>
        )}

        <Button type='submit' className='w-full text-base py-6' disabled={isPending}>
          {isPending && <Loader2 className="mr-2 h-5 w-5 animate-spin" />}
          {initialData?.id ? 'Update Content' : 'Save Content'}
        </Button>
      </form>

      <div className='sticky top-6 self-start'>
        {type !== 'REELS' ? (
          <>
            <h2 className='text-xl font-semibold mb-4 text-white flex items-center gap-2'>
              Instagram Preview
              {type === 'CAROUSEL' && <span className="text-xs bg-blue-500/20 text-blue-400 px-2 py-1 rounded-md border border-blue-500/20">Cover Only</span>}
            </h2>
            <IGPreview
              caption={caption}
              hashtags={hashtags}
              title={title}
              description={description}
            />
          </>
        ) : (
          <div className="h-full min-h-[400px] flex flex-col items-center justify-center bg-zinc-900/50 border border-dashed border-zinc-800 rounded-2xl p-8 text-center">
            <div className="w-16 h-16 bg-zinc-800 rounded-full flex items-center justify-center mb-4">
              <span className="text-2xl">📱</span>
            </div>
            <h3 className="text-lg font-medium text-white mb-2">Reels Preview Tidak Tersedia</h3>
            <p className="text-zinc-400 text-sm max-w-sm">
              Untuk tipe konten Reels/Video, silakan tinjau langsung *draft* video menggunakan aplikasi pihak ketiga.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
