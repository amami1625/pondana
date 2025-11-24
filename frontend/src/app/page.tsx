import { BookOpen, List, StickyNote } from 'lucide-react';
import Hero from '@/components/topPage/Hero';
import FeatureSection from '@/components/topPage/FeatureSection';

export default async function Home() {
  return (
    <div className="min-h-screen flex flex-col text-stone-800 antialiased">
      <main className="flex-grow">
        <Hero />

        <FeatureSection
          title="書籍の管理"
          description="読んだ本、読みたい本を一元管理。読書の進捗を可視化して、インプットを習慣化しましょう。"
          icon={<BookOpen className="w-6 h-6 text-sky-600" />}
        />

        <FeatureSection
          title="リストの作成"
          description="テーマごとに書籍をまとめて、自分だけの学習カリキュラムを構築。体系的な知識習得をサポートします。"
          icon={<List className="w-6 h-6 text-sky-600" />}
          backgroundColor="bg-sky-50/30"
        />

        <FeatureSection
          title="ナレッジカードの作成"
          description="本から得た気づきや学びをカードに記録。散らばった知識を整理して、いつでも振り返れる状態に。"
          icon={<StickyNote className="w-6 h-6 text-sky-600" />}
        />
      </main>
    </div>
  );
}
