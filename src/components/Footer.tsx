import { useState, useEffect } from 'react';
import Api from './Api';

interface UserInfo {
  telp: string;
  email: string;
  instagram: string;
}

export default function Footer() {
  const [userInfo, setUserInfo] = useState<UserInfo>({
    telp: "085156203867",
    email: "manukan.wetan@gmail.com",
    instagram: "manukan_wetan"
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const response = await Api.get('/user/info');
        if (response.data.data) {
          setUserInfo(response.data.data);
        }
      } catch (error) {
        console.error('Gagal mengambil data admin:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserInfo();
  }, []);

  if (isLoading) {
    return (
      <div className="flex flex-col md:flex-row gap-3 md:gap-5 mt-30 w-full justify-center items-center">
        <div className="flex cursor-pointer flex-row hover:scale-105 transition-all items-center">
          <img src="/icons/phone.svg" alt="phone" className="w-7 md:w-8" />
          <p className="font-medium text-sm md:text-base">Loading...</p>
        </div>
        <div className="flex cursor-pointer flex-row hover:scale-105 transition-all items-center gap-2">
          <img src="/icons/email.svg" alt="email" className="w-6" />
          <p className="font-medium text-sm md:text-base">Loading...</p>
        </div>
        <div className="flex cursor-pointer hover:scale-105 transition-all flex-row items-center gap-2">
          <img src="/icons/instagram.svg" alt="instagram" className="w-7 md:w-8" />
          <p className="font-medium text-sm md:text-base">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col md:flex-row gap-3 md:gap-5 mt-30 w-full justify-center items-center">
      <div className="flex cursor-pointer flex-row hover:scale-105 transition-all items-center">
        <img src="/icons/phone.svg" alt="phone" className="w-7 md:w-8" />
        <p className="font-medium text-sm md:text-base">{userInfo.telp}</p>
      </div>
      <div className="flex cursor-pointer flex-row hover:scale-105 transition-all items-center gap-2">
        <img src="/icons/email.svg" alt="email" className="w-6" />
        <p className="font-medium text-sm md:text-base">{userInfo.email}</p>
      </div>
      <div className="flex cursor-pointer hover:scale-105 transition-all flex-row items-center gap-2">
        <img src="/icons/instagram.svg" alt="instagram" className="w-7 md:w-8" />
        <p className="font-medium text-sm md:text-base">{userInfo.instagram}</p>
      </div>
    </div>
  );
} 