import Link from 'next/link';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-sky-50 py-16">
      <div className="mx-auto max-w-3xl px-4">
        <h1 className="mb-8 text-3xl font-bold text-gray-900">ぽんダナについて</h1>

        <section className="mb-12 space-y-4 text-gray-700">
          <h2 className="mb-4 text-2xl font-semibold text-gray-900">サービス概要</h2>
          <p className="leading-relaxed">
            技術書など難解な書籍の読書記録に特化し、
            <strong>知識を分野ごとに棚卸し・管理</strong>するアプリです。
          </p>
          <p className="leading-relaxed">
            読み終えた本の詳細なメモや感想を記録し、自身の学習進捗と習得範囲を可視化することで客観的に自分の学習を振り返れるようにします。
          </p>
          <p className="leading-relaxed">
            他のエンジニアと読書リストを共有し、学習意欲の高いエンジニアの学習経路を築く手助けをします。
          </p>
        </section>

        <section className="mb-12 space-y-4 text-gray-700">
          <h2 className="mb-4 text-2xl font-semibold text-gray-900">主な機能</h2>
          <ul className="list-disc space-y-2 pl-6">
            <li>技術書の登録とカテゴリ分類</li>
            <li>読書中の知識メモ（ナレッジカード）作成</li>
            <li>5段階評価と詳細な感想の記録</li>
            <li>読書リストの公開・共有</li>
            <li>学習進捗の可視化</li>
          </ul>
        </section>

        <section className="mb-12 space-y-4 text-gray-700">
          <h2 className="mb-4 text-2xl font-semibold text-gray-900">こんな方におすすめ</h2>
          <div className="space-y-4">
            <div>
              <h3 className="mb-2 font-semibold text-gray-900">
                学習ルートを確立したい初学者・若手エンジニア
              </h3>
              <p className="leading-relaxed">
                優れたエンジニアが何を読んで成長したかを参考に、効率的な学習ルートを見つけられます。
              </p>
            </div>
            <div>
              <h3 className="mb-2 font-semibold text-gray-900">技術書・専門書を読むエンジニア</h3>
              <p className="leading-relaxed">
                複雑な知識を体系的に管理し、どの技術分野の学習を終えたかを深掘りして記録できます。
              </p>
            </div>
          </div>
        </section>

        <div className="mt-12 text-center">
          <Link
            href="/register"
            className="inline-block rounded-md bg-blue-600 px-6 py-3 text-white transition-colors hover:bg-blue-700"
          >
            今すぐ始める
          </Link>
        </div>
      </div>
    </div>
  );
}
