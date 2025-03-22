interface AuthHeaderProps {
  title: string;
  description: string;
}

export default function AuthHeader({ title, description }: AuthHeaderProps) {
  return (
    <div className="grid place-items-center">
      <div className="text-7xl">🔐</div>
      <h1 className="text-2xl text-center font-bold mt-4">{title}</h1>
      <p className="text-sm text-center text-muted-foreground">{description}</p>
    </div>
  );
}
