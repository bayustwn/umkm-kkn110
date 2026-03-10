import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLogin } from '@/hooks/useAuth';
import ProtectLogin from '@/components/guards/ProtectLogin';

export default function Login() {
  const [formData, setFormData] = useState({ username: '', password: '' });
  const navigate = useNavigate();
  const login = useLogin();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    login.mutate(formData, {
      onSuccess: () => {
        setTimeout(() => navigate('/admin/dashboard'), 1000);
      },
    });
  };

  return (
    <ProtectLogin>
      <div className="login min-h-screen flex items-center justify-center bg-cover bg-center bg-no-repeat">
        <div className="absolute inset-0 bg-black bg-black/70" />
        <div className="relative z-10 bg-white bg-opacity-95 backdrop-blur-sm rounded-2xl shadow-2xl p-8 md:p-12 w-full max-w-md mx-4">
          <div className="flex flex-col items-center mb-8">
            <h1 className="text-2xl font-bold text-gray-800 mb-2">Admin Login</h1>
            <p className="text-gray-600 text-sm text-center">Masuk ke panel admin UMKM Manukan Wetan</p>
          </div>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="username" className="block text-sm font-semibold text-gray-700 mb-2">Username</label>
              <input
                type="text"
                id="username"
                value={formData.username}
                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-full focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200 outline-none"
                placeholder="Masukkan username"
                disabled={login.isPending}
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-2">Password</label>
              <input
                type="password"
                id="password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-full focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200 outline-none"
                placeholder="Masukkan password"
                disabled={login.isPending}
              />
            </div>
            <button
              type="submit"
              disabled={login.isPending}
              className="w-full bg-primary text-white font-semibold py-3 px-6 rounded-full hover:bg-primary/90 transition-all duration-200 transform hover:scale-105 shadow-lg disabled:bg-gray-400 disabled:cursor-not-allowed disabled:transform-none"
            >
              {login.isPending ? 'Memproses...' : 'Masuk'}
            </button>
          </form>
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-500">© 2025 UMKM Manukan Wetan.</p>
          </div>
        </div>
      </div>
    </ProtectLogin>
  );
}