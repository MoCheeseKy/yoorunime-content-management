'use client';

import { useMemo } from 'react';
import { evaluateHook } from '@/lib/hook-valuator';
import { CheckCircle2, AlertCircle, Info, Sparkles } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';

interface HookValuatorProps {
  title: string;
}

export function HookValuator({ title }: HookValuatorProps) {
  const evaluation = useMemo(() => evaluateHook(title), [title]);

  if (!title || title.trim().length === 0) {
    return null;
  }

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-400 bg-green-500/10 border-green-500/20';
    if (score >= 60) return 'text-yellow-400 bg-yellow-500/10 border-yellow-500/20';
    return 'text-red-400 bg-red-500/10 border-red-500/20';
  };

  const scoreColor = getScoreColor(evaluation.score);

  return (
    <Card className="p-5 bg-white/5 border-white/10 rounded-xl space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-blue-400" />
          <h3 className="font-semibold text-white">Hook Valuator</h3>
        </div>
        <div className={`flex items-center gap-2 px-3 py-1 rounded-full border ${scoreColor}`}>
          <span className="font-bold text-lg">{evaluation.score}</span>
          <span className="text-sm opacity-80">/ 100</span>
          <Badge variant="outline" className="ml-2 bg-white/10 border-none text-current">
            Grade {evaluation.grade}
          </Badge>
        </div>
      </div>

      <div className="space-y-3 mt-4">
        {evaluation.strengths.length > 0 && (
          <div className="space-y-1">
            <h4 className="text-xs font-medium text-green-400 uppercase tracking-wider flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3" /> Kekuatan Hook
            </h4>
            <ul className="space-y-1">
              {evaluation.strengths.map((s, i) => (
                <li key={i} className="text-sm text-zinc-300 flex items-start gap-2">
                  <span className="mt-1 text-green-400/50">•</span> {s}
                </li>
              ))}
            </ul>
          </div>
        )}

        {evaluation.feedbacks.length > 0 && (
          <div className="space-y-1 mt-3">
            <h4 className="text-xs font-medium text-yellow-400 uppercase tracking-wider flex items-center gap-1">
              <AlertCircle className="w-3 h-3" /> Saran Perbaikan
            </h4>
            <ul className="space-y-1">
              {evaluation.feedbacks.map((f, i) => (
                <li key={i} className="text-sm text-zinc-400 flex items-start gap-2">
                  <span className="mt-1 text-yellow-400/50">•</span> {f}
                </li>
              ))}
            </ul>
          </div>
        )}

        {evaluation.score < 100 && (
          <div className="mt-4 pt-3 border-t border-white/10 flex items-start gap-2 text-xs text-zinc-500">
            <Info className="w-4 h-4 shrink-0 mt-0.5" />
            <p>
              Tips: Gunakan power words, angka, elemen penasaran (curiosity gap), dan pastikan panjang hook ideal (4-12 kata) agar skor maksimal.
            </p>
          </div>
        )}
      </div>
    </Card>
  );
}
