import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-slate-50 to-sky-50 pt-20 pb-32 lg:pt-32 lg:pb-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-3xl mx-auto">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-slate-900 leading-tight mb-8">
            学びの記録は
            <br className="hidden sm:block" />
            <span className="text-sky-600">ぽんダナ</span>で。
          </h1>
          <p className="text-xl text-slate-600 mb-10 leading-relaxed max-w-2xl mx-auto">
            ぽんダナはあなたの学びの記録、知識の整理をサポートします。
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link
              href="/login"
              className="w-full sm:w-auto px-8 py-4 bg-sky-600 hover:bg-sky-700 text-white rounded-xl font-bold text-lg shadow-lg shadow-sky-200 transition-all hover:-translate-y-0.5 flex items-center justify-center gap-2"
            >
              今すぐ始める
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
