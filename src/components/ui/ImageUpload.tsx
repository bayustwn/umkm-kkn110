import { useRef } from 'react';

interface ImageUploadProps {
  value: File | null;
  currentImage?: string;
  onChange: (file: File | null) => void;
  label?: string;
  placeholder?: string;
  className?: string;
}

export default function ImageUpload({
  value,
  currentImage,
  onChange,
  label,
  placeholder = 'Klik untuk upload foto',
  className = 'w-full h-50 md:h-120',
}: ImageUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  const preview = value ? URL.createObjectURL(value) : currentImage || null;

  return (
    <div className="flex flex-col gap-2">
      {label && <span className="font-bold text-xl mb-2">{label}</span>}
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        className={`${className} border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center cursor-pointer bg-gray-50 hover:border-primary transition`}
      >
        {preview ? (
          <img src={preview} alt="Preview" className="object-cover w-full h-full rounded-lg" />
        ) : (
          <span className="text-gray-400 text-center text-xs">{placeholder}</span>
        )}
      </button>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => onChange(e.target.files?.[0] || null)}
      />
    </div>
  );
}
