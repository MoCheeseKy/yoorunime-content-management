'use client';

import { useForm } from 'react-hook-form';
import { Copy, Loader2 } from 'lucide-react';
import { useTransition } from 'react';
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

export function PostForm({ initialData = null }: { initialData?: any }) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  
  const form = useForm({ defaultValues: initialData || { status: 'DRAFT', title: '', description: '', caption: '', hashtags: '' } });

  const status = form.watch('status');
  const caption = form.watch('caption');
  const hashtags = form.watch('hashtags');
  const title = form.watch('title');
  const description = form.watch('description');

  const handleCopyCaption = () => {
    const fullText = [caption, hashtags].filter(Boolean).join('\n\n');
    navigator.clipboard.writeText(fullText);
    alert('Caption & Hashtags copied to clipboard!');
  };

  const onSubmit = (data: any) => {
    startTransition(async () => {
      try {
        let result;
        if (initialData?.id) {
          result = await updatePost(initialData.id, data);
        } else {
          result = await createPost(data);
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
      <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-8 glass-card p-8 rounded-2xl h-fit border-white/5'>
        <div className='space-y-5'>
          <div className='space-y-2'>
            <div className='flex justify-between items-center'>
              <Label className='text-zinc-300'>Post Title</Label>
              <span className='text-[10px] text-zinc-500'>
                Gunakan *teks* untuk warna kuning
              </span>
            </div>
            <Input
              className='bg-white/5 border-white/10 focus-visible:ring-blue-500/50 text-white placeholder:text-zinc-600 transition-all rounded-lg'
              placeholder='e.g. 5 Tips to *boost* your engagement'
              {...form.register('title')}
            />
          </div>

          <div className='space-y-2'>
            <div className='flex justify-between items-center'>
              <Label className='text-zinc-300'>Description</Label>
              <span className='text-[10px] text-zinc-500'>
                Gunakan *teks* untuk warna kuning
              </span>
            </div>
            <Textarea
              className='bg-white/5 border-white/10 focus-visible:ring-blue-500/50 text-white placeholder:text-zinc-600 transition-all rounded-lg resize-none'
              placeholder='Internal notes for this post...'
              {...form.register('description')}
            />
          </div>
        </div>

        {/* Template Selector (Optional, hardcoded for now or just removed entirely) */}
        {/* We just use the template image for preview */}

        {/* Caption & Hashtags */}
        <div className='space-y-5'>
          <div className='space-y-2'>
            <Label className='text-zinc-300'>Caption</Label>
            <Textarea
              rows={4}
              className='bg-white/5 border-white/10 focus-visible:ring-blue-500/50 text-white placeholder:text-zinc-500 transition-all rounded-lg resize-none'
              placeholder='Write your compelling caption here...'
              {...form.register('caption')}
            />
          </div>

          <div className='space-y-2'>
            <Label className='text-zinc-300'>Hashtags</Label>
            <Textarea
              rows={2}
              className='bg-white/5 border-white/10 focus-visible:ring-blue-500/50 text-white placeholder:text-zinc-500 transition-all rounded-lg resize-none'
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
            <SelectTrigger>
              <SelectValue placeholder='Select status' />
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

      <div className='sticky top-6'>
        <h2 className='text-xl font-semibold mb-4 text-white'>
          Instagram Preview
        </h2>
        <IGPreview
          caption={caption}
          hashtags={hashtags}
          title={title}
          description={description}
        />
      </div>
    </div>
  );
}
