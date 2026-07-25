export interface HookEvaluation {
  score: number;
  grade: 'A' | 'B' | 'C' | 'D';
  feedbacks: string[];
  strengths: string[];
}

export function evaluateHook(hookText: string): HookEvaluation {
  if (!hookText || hookText.trim().length === 0) {
    return {
      score: 0,
      grade: 'D',
      feedbacks: ['Hook tidak boleh kosong.'],
      strengths: [],
    };
  }

  // Membersihkan teks dari markdown seperti *bold*
  const cleanText = hookText.replace(/[*_~`]/g, '').toLowerCase();
  const words = cleanText.split(/\s+/).filter(w => w.length > 0);
  const wordCount = words.length;

  let score = 0;
  const feedbacks: string[] = [];
  const strengths: string[] = [];

  // 1. Length Criteria (15 points)
  // Hook terbaik biasanya antara 4 - 12 kata agar cepat ditangkap mata (Rule of thumb copywriting)
  if (wordCount >= 4 && wordCount <= 12) {
    score += 15;
    strengths.push('Panjang hook sangat ideal (4-12 kata).');
  } else if (wordCount > 12) {
    score += 5;
    feedbacks.push('Hook terlalu panjang. Coba ringkas menjadi 4-12 kata agar lebih nendang.');
  } else {
    score += 5;
    feedbacks.push('Hook terlalu pendek. Tambahkan sedikit konteks agar audiens penasaran.');
  }

  // 2. Curiosity / Question Words (25 points)
  const curiosityWords = ['kenapa', 'mengapa', 'bagaimana', 'apa', 'siapa', 'kapan', 'rahasia', 'fakta', 'misteri', 'teori', 'plot twist', 'easter egg', 'sadar', 'ternyata', 'alasan', 'gak nyangka', 'bikin'];
  const hasCuriosity = curiosityWords.some(w => cleanText.includes(w)) || cleanText.includes('?');
  if (hasCuriosity) {
    score += 25;
    strengths.push('Memiliki elemen curiosity/pertanyaan yang memancing rasa penasaran.');
  } else {
    feedbacks.push('Gunakan kata tanya (kenapa, bagaimana) atau kata pemancing (rahasia, fakta, teori) untuk memicu rasa penasaran.');
  }

  // 3. Numbers / Listicles (15 points)
  // Orang suka daftar (Top 5, 3 Alasan, dll)
  const hasNumbers = /\d+/.test(cleanText) || ['satu', 'dua', 'tiga', 'empat', 'lima', 'top'].some(w => cleanText.includes(w));
  if (hasNumbers) {
    score += 15;
    strengths.push('Menggunakan angka/listicle yang disukai audiens (membuat konten terlihat terstruktur).');
  } else {
    feedbacks.push('Coba tambahkan angka (contoh: 3 Alasan, Top 5) karena terbukti meningkatkan klik.');
  }

  // 4. Emotional / Power Words (25 points)
  const powerWords = ['mengejutkan', 'terbaik', 'terburuk', 'sedih', 'kacau', 'gila', 'masterpiece', 'overrated', 'underrated', 'epik', 'keren', 'nangis', 'merinding', 'mind blowing', 'wajib', 'jangan', 'parah', 'hancur', 'epic', 'brilian', 'gagal', 'mengecewakan'];
  const hasPowerWords = powerWords.some(w => cleanText.includes(w));
  if (hasPowerWords) {
    score += 25;
    strengths.push('Menggunakan power words/emosional yang kuat.');
  } else {
    feedbacks.push('Gunakan "Power Words" (contoh: mengejutkan, terbaik, gila, merinding) untuk memicu emosi.');
  }

  // 5. Niche Keywords (Anime context) (20 points)
  const animeKeywords = ['anime', 'manga', 'manhwa', 'wibu', 'otaku', 'karakter', 'mc', 'overpowered', 'op', 'isekai', 'shounen', 'seinen', 'romance', 'studio', 'season', 'episode', 'spoiler', 'review', 'news'];
  const hasAnimeKeywords = animeKeywords.some(w => cleanText.includes(w));
  if (hasAnimeKeywords) {
    score += 20;
    strengths.push('Sangat relevan dengan niche anime.');
  } else {
    feedbacks.push('Tambahkan kata kunci spesifik anime (nama karakter, judul, istilah wibu) agar relevan dengan followers.');
  }

  // Determine Grade
  let grade: 'A' | 'B' | 'C' | 'D' = 'D';
  if (score >= 80) grade = 'A';
  else if (score >= 60) grade = 'B';
  else if (score >= 40) grade = 'C';

  return {
    score,
    grade,
    feedbacks,
    strengths
  };
}
