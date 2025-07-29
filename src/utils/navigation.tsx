import { useNavigate } from "react-router-dom";

export default function RouterNavigation() {
  const navigate = useNavigate();

  return {
    goToHome: () => navigate("/"),
    goToRegister: () => navigate("/register"),
    goToBerita: () => navigate("/berita"),
    goToBeritaDetail: (id: string) => navigate(`/berita/${id}`),
    goToUMKM: () => navigate("/umkm"),
    goToUMKMDetail: (id: string) => navigate(`/umkm/${id}`),
  };
}