interface FeatureSectionProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  backgroundColor?: string;
}

export default function FeatureSection({
  title,
  description,
  icon,
  backgroundColor = 'bg-slate-50/50',
}: FeatureSectionProps) {
  return (
    <section className={`py-16 lg:py-24 ${backgroundColor}`}>
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="flex items-center justify-center gap-3 mb-4">
          <div className="inline-flex items-center justify-center w-10 h-10 rounded-lg bg-slate-100">
            {icon}
          </div>
          <h2 className="text-2xl lg:text-3xl font-bold text-slate-900">{title}</h2>
        </div>
        <p className="text-lg text-slate-600 leading-relaxed">{description}</p>
      </div>
    </section>
  );
}
