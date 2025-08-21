interface PageHeaderProps {
  title: string;
  description?: string;
}

export default function PageHeader({ title, description }: PageHeaderProps) {
  return (
    <div className="mb-8">
      <h1 className="text-3xl font-bold text-white mb-2">{title}</h1>
      {description && <p className="text-gray-400 max-w-2xl">{description}</p>}
    </div>
  );
}
