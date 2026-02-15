interface FeatureSectionProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  backgroundColor?: string;
  reverse?: boolean;
}

export default function FeatureSection({
  title,
  description,
  icon,
  backgroundColor = 'bg-white',
  reverse = false,
}: FeatureSectionProps) {
  return (
    <section className={`py-20 lg:py-28 ${backgroundColor}`}>
      <div className="max-w-6xl mx-auto px-6 lg:px-8">
        <div
          className={`flex flex-col lg:flex-row lg:items-center gap-8 lg:gap-16 ${reverse ? 'lg:flex-row-reverse' : ''}`}
        >
          {/* 左側: アイコン + タイトル */}
          <div className="lg:w-1/2 flex items-center gap-4">
            <div className="text-sky-600 shrink-0">{icon}</div>
            <h2 className="text-3xl lg:text-5xl font-bold tracking-tight text-slate-900">
              {title}
            </h2>
          </div>

          {/* 右側: 説明文 */}
          <div className="lg:w-1/2">
            <p className="text-lg lg:text-xl text-slate-500 leading-relaxed lg:leading-loose">
              {description}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
