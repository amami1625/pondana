import { BookOpen, List, StickyNote } from 'lucide-react';
import Hero from '@/app/_components/Hero';
import FeatureSection from '@/app/_components/FeatureSection';

export default async function Home() {
  return (
    <div className="min-h-screen flex flex-col text-stone-800 antialiased">
      <main className="flex-grow">
        <Hero />

        <FeatureSection
          title="書籍の管理"
          description="読んだ本、読みたい本を一元管理。読書の進捗を可視化して、インプットを習慣化しましょう。"
          icon={<BookOpen className="w-10 h-10" strokeWidth={1.5} />}
        />

        <FeatureSection
          title="リストの作成"
          description="テーマごとに書籍をまとめて、自分だけの学習カリキュラムを構築。体系的な知識習得をサポートします。"
          icon={<List className="w-10 h-10" strokeWidth={1.5} />}
          backgroundColor="bg-slate-50"
          reverse
        />

        <FeatureSection
          title="ナレッジカードの作成"
          description="本から得た気づきや学びをカードに記録。散らばった知識を整理して、いつでも振り返れる状態に。"
          icon={<StickyNote className="w-10 h-10" strokeWidth={1.5} />}
        />
      </main>
    </div>
  );
}
