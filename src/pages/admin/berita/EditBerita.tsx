import { useState, useRef, useEffect } from 'react';
import Api from '../../../components/Api';
import toast from 'react-hot-toast';
import { useNavigate, useParams } from 'react-router-dom';

export default function EditBerita() {
    const navigate = useNavigate();
    const { id } = useParams();
    const [beritaData, setBeritaData] = useState({
        image: null as File | null,
        title: '',
        content: '',
    });
    const [currentImage, setCurrentImage] = useState('');
    const imageInputRef = useRef<HTMLInputElement>(null);
    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [isLoadingData, setIsLoadingData] = useState(true);

    useEffect(() => {
        const loadNewsData = async () => {
            if (!id) return;
            
            try {
                const response = await Api.get(`/news/${id}`);
                const news = response.data.data;
                
                setBeritaData({
                    image: null,
                    title: news.title,
                    content: news.content,
                });
                setCurrentImage(news.image);
            } catch (error: any) {
                toast.error(error?.response?.data?.message || 'Gagal memuat data berita');
                navigate('/admin/berita');
            } finally {
                setIsLoadingData(false);
            }
        };

        loadNewsData();
    }, [id, navigate]);

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setBeritaData(prev => ({ ...prev, image: file }));
        }
    };

    const handleInputChange = (field: string, value: string) => {
        setBeritaData(prev => ({ ...prev, [field]: value }));
    };

    useEffect(() => {
        if (textareaRef.current) {
            textareaRef.current.style.height = 'auto';
            textareaRef.current.style.height = textareaRef.current.scrollHeight + 'px';
        }
    }, [beritaData.content]);

    const canSubmit = () => {
        return beritaData.title.trim() && beritaData.content.trim();
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!canSubmit()) {
            toast.error('Mohon lengkapi semua field');
            return;
        }

        setIsLoading(true);
        const formData = new FormData();
        
        if (beritaData.image) {
            formData.append('image', beritaData.image);
        }
        formData.append('title', beritaData.title);
        formData.append('content', beritaData.content);

        try {
            await Api.patch(`/news/edit/${id}`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            toast.success('Berita berhasil diperbarui!');
            navigate('/admin/berita');
        } catch (error: any) {
            toast.error(error?.response?.data?.message || 'Gagal memperbarui berita');
        } finally {
            setIsLoading(false);
        }
    };

    if (isLoadingData) {
        return (
            <div className="py-15 md:px-10 md:py-[2%]">
                <div className="mx-auto">
                    <div className="flex items-center justify-center h-64">
                        <img src="/icons/loading.svg" alt="Loading" className="w-12 h-12 animate-spin" />
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="py-15 md:px-10 md:py-[2%]">
            <div className="mx-auto">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-800 mb-2">Edit Berita</h1>
                    <p className="text-gray-600">Edit berita yang sudah ada</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Gambar Berita *
                        </label>
                        <div className="flex items-center space-x-4">
                            <button
                                type="button"
                                onClick={() => imageInputRef.current?.click()}
                                className="flex-shrink-0 w-full h-100 md:h-130 mt-2 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center hover:border-primary transition-colors cursor-pointer"
                            >
                                {beritaData.image ? (
                                    <img
                                        src={URL.createObjectURL(beritaData.image)}
                                        alt="Preview"
                                        className="w-full h-full object-cover rounded-lg"
                                    />
                                ) : currentImage ? (
                                    <img
                                        src={currentImage}
                                        alt="Current"
                                        className="w-full h-full object-cover rounded-lg"
                                    />
                                ) : (
                                    <div className="text-center">
                                        <svg className="mx-auto h-8 w-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                        </svg>
                                        <p className="mt-1 text-xs text-gray-500">Upload Gambar</p>
                                    </div>
                                )}
                            </button>
                            <div>
                                <input
                                    ref={imageInputRef}
                                    type="file"
                                    accept="image/*"
                                    onChange={handleImageChange}
                                    className="hidden"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Judul Berita */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Judul Berita *
                        </label>
                        <input
                            type="text"
                            value={beritaData.title}
                            onChange={(e) => handleInputChange('title', e.target.value)}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                            placeholder="Masukkan judul berita"
                        />
                    </div>

                    {/* Konten Berita */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Konten Berita *
                        </label>
                        <textarea
                            ref={textareaRef}
                            value={beritaData.content}
                            onChange={(e) => handleInputChange('content', e.target.value)}
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
                            disabled={!canSubmit() || isLoading}
                            className="px-6 py-2 bg-primary text-white rounded-full hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isLoading ? 'Memperbarui...' : 'Perbarui Berita'}
                        </button>
                    </div>
                </form>
            </div>

            {/* Loading Modal */}
            {isLoading && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
                    <div className="bg-white rounded-lg flex flex-col items-center px-8 py-10 shadow-lg">
                        <img src="/icons/loading.svg" alt="Loading" className="w-12 h-12 animate-spin mb-4" />
                        <span className="text-lg font-semibold text-gray-700">Memperbarui Berita...</span>
                    </div>
                </div>
            )}
        </div>
    );
} 