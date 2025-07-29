import { useEffect } from 'react';
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom';

interface ProtectLoginProps {
  children: React.ReactNode;
}

export default function ProtectLogin({ children }: ProtectLoginProps) {
  const navigate = useNavigate();
  useEffect(() => {
    const token = Cookies.get('token');
    if (token) {
      navigate('/admin/dashboard', { replace: true });
    }
  }, [navigate]);
  return <>{children}</>;
} 