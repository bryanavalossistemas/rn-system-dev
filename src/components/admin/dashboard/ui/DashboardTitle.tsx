interface DashboardTitleProps {
  title: string;
  description: string;
}

export default function DashboardTitle({ title, description }: DashboardTitleProps) {
  return (
    <div className="hidden sm:flex sm:flex-col sm:gap-1.5">
      <h1 className="scroll-m-20 font-extrabold tracking-tight text-4xl">{title}</h1>
      <p className="leading-2.5 text-muted-foreground text-sm">{description}</p>
    </div>
  );
}
