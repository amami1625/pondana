import Image from 'next/image';

interface DetailCardProps {
  thumbnail?: {
    src: string;
    alt: string;
  };
  children: React.ReactNode;
}

export default function DetailCard({ thumbnail, children }: DetailCardProps) {
  return (
    <div className="flex flex-col sm:flex-row gap-6 p-6 sm:p-8 bg-white rounded-xl border border-slate-200">
      {thumbnail && (
        <Image
          src={thumbnail.src}
          alt={thumbnail.alt}
          width={128}
          height={176}
          className="w-32 h-44 shrink-0 object-cover rounded-lg"
        />
      )}
      <div className="flex flex-1 flex-col gap-6">{children}</div>
    </div>
  );
}
