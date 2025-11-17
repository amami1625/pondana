interface DetailDescriptionProps {
  children: React.ReactNode;
}

export default function DetailDescription({ children }: DetailDescriptionProps) {
  return <p className="text-slate-600 text-base font-normal leading-relaxed">{children}</p>;
}
