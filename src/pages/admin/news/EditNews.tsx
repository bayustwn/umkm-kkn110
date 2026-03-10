import { useState, useRef, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useNewsById, useUpdateNews } from '@/hooks/useNews';
import { FullPageLoader } from '@/components/skeletons';
import LoadingOverlay from '@/components/ui/LoadingOverlay';
import ImageUpload from '@/components/ui/ImageUpload';

export default function EditNews() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { data: news, isLoading: loadingNews } = useNewsById(id);
  const updateNews = useUpdateNews();

  const [formData, setFormData] = useState({ image: null as File | null, title: '', content: '' });
  const [currentImage, setCurrentImage] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (news) {
      setFormData({ image: null, title: news.title, content: news.content });
      setCurrentImage(news.image);
    }
  }, [news]);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = textareaRef.current.scrollHeight + 'px';
    }
  }, [formData.content]);

  const canSubmit = () => formData.title.trim() && formData.content.trim();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit()) {
      toast.error('Mohon lengkapi semua field');
      return;
    }

    const data = new FormData();
    if (formData.image) data.append('image', formData.image);
    data.append('title', formData.title);
    data.append('content', formData.content);

    updateNews.mutate({ id: id!, formData: data }, { onSuccess: () => navigate('/admin/berita') });
  };

  if (loadingNews) return <FullPageLoader message="Memuat data berita..." />;

  return (
    <div className="py-15 md:px-10 md:py-[2%]">
      <LoadingOverlay isLoading={updateNews.isPending} message="Memperbarui Berita..." />
      <div className="mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Edit Berita</h1>
          <p className="text-gray-600">Edit berita yang sudah ada</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Gambar Berita *</label>
            <ImageUpload
              value={formData.image}
              currentImage={currentImage}
              onChange={(file) => setFormData((d) => ({ ...d, image: file }))}
              className="w-full h-100 md:h-130 mt-2"
              placeholder="Upload Gambar"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Judul Berita *</label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData((d) => ({ ...d, title: e.target.value }))}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
              placeholder="Masukkan judul berita"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Konten Berita *</label>
            <textarea
              ref={textareaRef}
              value={formData.content}
              onChange={(e) => setFormData((d) => ({ ...d, content: e.target.value }))}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all resize-none overflow-hidden"
              placeholder="Masukkan konten berita..."
            />
          </div>
          <div className="flex gap-2 pt-2">
            <button
              type="button"
              onClick={() => navigate('/admin/berita')}
              className="px-6 py-2 border border-gray-300 text-gray-700 rounded-full hover:bg-gray-50 transition-colors"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={!canSubmit() || updateNews.isPending}
              className="px-6 py-2 bg-primary text-white rounded-full hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {updateNews.isPending ? 'Memperbarui...' : 'Perbarui Berita'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
