import { formatDate } from '@/utils/formatDate';

interface NewsCardProps {
  id: string;
  title: string;
  content: string;
  image: string;
  createdAt: string;
  onNavigate: (id: string) => void;
}

export default function NewsCard({
  id,
  title,
  content,
  image,
  createdAt,
  onNavigate,
}: NewsCardProps) {
  return (
    <div className="w-full flex flex-row gap-5 items-center min-w-0">
      <img
        src={image}
        className="h-40 rounded-md w-32 md:w-60 object-cover flex-shrink-0"
        alt={title}
      />
      <div className="flex flex-col gap-2 min-w-0 flex-1">
        <p className="text-sm">{formatDate(createdAt)}</p>
        <h1 className="font-bold text-md md:text-lg line-clamp-1 break-words w-full">{title}</h1>
        <p className="md:text-md text-sm line-clamp-2 break-words w-full">{content}</p>
        <p
          onClick={() => onNavigate(id)}
          className="text-sm font-medium mt-1 cursor-pointer w-fit hover:pl-1 pl-0 transition-all text-primary"
        >
          Lihat →
        </p>
      </div>
    </div>
  );
}
