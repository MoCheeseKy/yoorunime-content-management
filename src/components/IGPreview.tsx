'use client';

import { useState } from 'react';
import { Heart, MessageCircle, Send, Bookmark } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface IGPreviewProps {
  caption?: string;
  hashtags?: string;
  title?: string;
  description?: string;
}

export function IGPreview({
  caption = '',
  hashtags = '',
  title = '',
  description = '',
}: IGPreviewProps) {
  const [aspectRatio, setAspectRatio] = useState<'1/1' | '4/5'>('4/5');
  const fullCaption = [caption, hashtags].filter(Boolean).join('\n\n');

  const displayImage = '/images/template-utama.jpeg';

  return (
    <div className='flex flex-col gap-4'>
      {/* Toggle Controls Outside */}
      <div className='flex gap-2'>
        <Button
          size='sm'
          variant='secondary'
          className={`backdrop-blur-md border border-white/10 ${aspectRatio === '1/1' ? 'bg-white text-black' : 'bg-black/50 text-white hover:bg-white/20'}`}
          onClick={() => setAspectRatio('1/1')}
        >
          1:1
        </Button>
        <Button
          size='sm'
          variant='secondary'
          className={`backdrop-blur-md border border-white/10 ${aspectRatio === '4/5' ? 'bg-white text-black' : 'bg-black/50 text-white hover:bg-white/20'}`}
          onClick={() => setAspectRatio('4/5')}
        >
          4:5
        </Button>
      </div>

      <div className='glass-card border-white/10 rounded-2xl overflow-hidden flex flex-col md:flex-row max-w-4xl mx-auto shadow-2xl relative w-full'>
        {/* Decorative Glow inside preview */}
        <div className='absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] bg-blue-500/20 blur-[100px] rounded-full pointer-events-none z-0' />

        {/* Left: Media Area */}
        <div
          className='bg-black/40 flex items-center justify-center relative w-full md:w-[60%] transition-all duration-500 z-10 border-r border-white/5'
          style={{ aspectRatio: aspectRatio === '1/1' ? '1/1' : '4/5' }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={displayImage}
            alt='Post preview template'
            className='object-cover w-full h-full'
          />

          {/* Text Overlay for Title and Description */}
          <div className='absolute top-0 left-0 w-full h-[45%] flex flex-col justify-start pt-[8%] px-[8%] overflow-hidden z-20'>
            <h1 className='text-[1.5rem] md:text-[1.8rem] lg:text-[1.4rem] font-black text-white leading-[1.1] mb-2 text-left tracking-tight drop-shadow-md w-full'>
              {title.split(/(\*[^*]+\*)/g).map((part, i) => {
                if (part.startsWith('*') && part.endsWith('*')) {
                  return (
                    <span key={i} className='text-[#FFD700]'>
                      {part.slice(1, -1)}
                    </span>
                  );
                }
                return part;
              })}
            </h1>
            <p className='text-xs md:text-sm lg:text-[0.80rem] text-white/95 drop-shadow-sm leading-snug font-medium text-left max-w-[95%]'>
              {description.split(/(\*[^*]+\*)/g).map((part, i) => {
                if (part.startsWith('*') && part.endsWith('*')) {
                  return (
                    <span key={i} className='text-[#FFD700]'>
                      {part.slice(1, -1)}
                    </span>
                  );
                }
                return part;
              })}
            </p>
          </div>
        </div>

        {/* Right: Info & Caption Area */}
        <div className='w-full md:w-[40%] relative min-h-[400px] md:min-h-0'>
          <div className='absolute inset-0 flex flex-col bg-zinc-950/50 backdrop-blur-xl z-10'>
            {/* Header */}
            <div className='flex items-center p-4 border-b border-white/5'>
              <div className='w-8 h-8 rounded-full bg-gradient-to-tr from-yellow-400 via-pink-500 to-purple-500 p-[2px] mr-3 shrink-0'>
                <div className='w-full h-full bg-zinc-900 rounded-full border border-black overflow-hidden'>
                  <img
                    src='https://ui-avatars.com/api/?name=Yooru&background=random'
                    alt='Avatar'
                    className='w-full h-full object-cover'
                  />
                </div>
              </div>
              <span className='font-semibold text-sm text-white'>yooru.id</span>
            </div>

            {/* Caption Scrollable Area */}
            <div className='p-4 flex-1 overflow-y-auto whitespace-pre-wrap text-sm text-zinc-300 scrollbar-thin scrollbar-thumb-white/10'>
              <span className='font-semibold mr-2 text-white'>yooru.id</span>
              {fullCaption || (
                <span className='text-zinc-500 italic'>
                  Caption will appear here...
                </span>
              )}
            </div>

            {/* Action Buttons */}
            <div className='p-4 border-t border-white/5 space-y-3'>
              <div className='flex justify-between'>
                <div className='flex gap-4'>
                  <Heart className='w-6 h-6 hover:text-red-500 text-white cursor-pointer transition-colors' />
                  <MessageCircle className='w-6 h-6 hover:text-zinc-400 text-white cursor-pointer transition-colors' />
                  <Send className='w-6 h-6 hover:text-zinc-400 text-white cursor-pointer transition-colors' />
                </div>
                <Bookmark className='w-6 h-6 hover:text-zinc-400 text-white cursor-pointer transition-colors' />
              </div>
              <p className='font-semibold text-sm text-white'>1,234 likes</p>
              <p className='text-[10px] text-zinc-500 uppercase tracking-wide font-medium'>
                1 Day Ago
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
