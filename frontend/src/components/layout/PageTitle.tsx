interface PageTitleProps {
  title: string;
}

export default function PageTitle({ title }: PageTitleProps) {
  return <h1 className="text-2xl font-bold text-gray-900 mb-6">{title}</h1>;
}
