import { useEffect } from 'react';
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import toast from 'react-hot-toast';

interface ProtectAdminProps {
  children: React.ReactNode;
}

interface JwtPayload {
  exp?: number;
  [key: string]: any;
}

export default function ProtectAdmin({ children }: ProtectAdminProps) {
  const navigate = useNavigate();
  useEffect(() => {
    const token = Cookies.get('token');
    if (!token) {
      navigate('/admin/login', { replace: true });
      return;
    }
    try {
      const decoded = jwtDecode<JwtPayload>(token);
      if (decoded.exp && decoded.exp * 1000 < Date.now()) {
        Cookies.remove('token');
        toast.error('Sesi login telah berakhir, silakan login kembali.');
        navigate('/admin/login', { replace: true });
      }
    } catch (e) {
      Cookies.remove('token');
      navigate('/admin/login', { replace: true });
    }
  }, [navigate]);
  return <>{children}</>;
} 