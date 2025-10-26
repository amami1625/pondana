interface DetailActionsProps {
  children: React.ReactNode;
}

export default function DetailActions({ children }: DetailActionsProps) {
  return <div className="flex gap-3">{children}</div>;
}
