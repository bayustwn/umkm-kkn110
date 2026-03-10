import { useNavigate } from 'react-router-dom';

export default function useNavigation() {
  const navigate = useNavigate();

  return {
    goToHome: () => navigate('/'),
    goToRegister: () => navigate('/register'),
    goToNews: () => navigate('/berita'),
    goToNewsDetail: (id: string) => navigate(`/berita/${id}`),
    goToUmkm: () => navigate('/umkm'),
    goToUmkmDetail: (id: string) => navigate(`/umkm/${id}`),
  };
}
