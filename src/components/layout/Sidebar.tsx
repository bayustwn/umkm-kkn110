import { useLocation, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { useUserInfo, useUpdateProfile, useLogout } from '@/hooks/useAuth';
import ConfirmModal from '@/components/ui/ConfirmModal';

export default function Sidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const logout = useLogout();
  const { data: userInfo } = useUserInfo();
  const updateProfile = useUpdateProfile();

  const [isOpen, setIsOpen] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [userData, setUserData] = useState({ telp: '', email: '', instagram: '', currentPassword: '', newPassword: '', confirmPassword: '' });

  useEffect(() => {
    if (showSettingsModal && userInfo) {
      setUserData(prev => ({ ...prev, telp: userInfo.telp || '', email: userInfo.email || '', instagram: userInfo.instagram || '' }));
    }
  }, [showSettingsModal, userInfo]);

  const handleUpdateProfile = () => {
    if (userData.newPassword && userData.newPassword !== userData.confirmPassword) { toast.error('Password baru dan konfirmasi password tidak cocok!'); return; }
    if (userData.newPassword && !userData.currentPassword) { toast.error('Password saat ini harus diisi untuk mengubah password!'); return; }

    const data: any = {};
    if (userData.telp !== undefined) data.telp = userData.telp;
    if (userData.email !== undefined) data.email = userData.email;
    if (userData.instagram !== undefined) data.instagram = userData.instagram;
    if (userData.currentPassword) data.currentPassword = userData.currentPassword;
    if (userData.newPassword) data.newPassword = userData.newPassword;

    updateProfile.mutate(data, {
      onSuccess: () => {
        setShowSettingsModal(false);
        setUserData(prev => ({ ...prev, currentPassword: '', newPassword: '', confirmPassword: '' }));
      },
    });
  };

  const handleMenuClick = (path: string) => { navigate(path); setIsOpen(false); };

  const menuItems = [
    { path: '/admin/dashboard', name: 'Dashboard', icon: '/icons/dashboard.svg' },
    { path: '/admin/berita', name: 'Berita', icon: '/icons/news.svg' },
    { path: '/admin/umkm', name: 'UMKM', icon: '/icons/product-admin.svg' },
    { path: '/admin/pengaturan', name: 'Pengaturan', icon: '/icons/settings.svg', isSettings: true },
  ];

  return (
    <>
      {showSettingsModal && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center">
          <div className="absolute inset-0 bg-black bg-black/50" onClick={() => setShowSettingsModal(false)} />
          <div className="relative bg-white rounded-lg shadow-xl p-6 w-full max-w-md mx-4 max-h-[90vh] overflow-y-auto">
            <div className="text-center mb-6">
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-primary/10 mb-4">
                <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Pengaturan Profil</h3>
              <p className="text-sm text-gray-600">Perbarui informasi profil Anda</p>
            </div>
            <form onSubmit={e => { e.preventDefault(); handleUpdateProfile(); }} className="space-y-4">
              <div><label className="block text-sm font-medium text-gray-700 mb-1">Nomor Telepon</label><input type="tel" value={userData.telp} onChange={e => setUserData(prev => ({ ...prev, telp: e.target.value }))} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent" placeholder="Masukkan nomor telepon" /></div>
              <div><label className="block text-sm font-medium text-gray-700 mb-1">Email</label><input type="email" value={userData.email} onChange={e => setUserData(prev => ({ ...prev, email: e.target.value }))} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent" placeholder="Masukkan email" /></div>
              <div><label className="block text-sm font-medium text-gray-700 mb-1">Instagram</label><input type="text" value={userData.instagram} onChange={e => setUserData(prev => ({ ...prev, instagram: e.target.value }))} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent" placeholder="Masukkan username Instagram" /></div>
              <div className="border-t pt-4">
                <h4 className="text-sm font-medium text-gray-700 mb-3">Ubah Password</h4>
                <div className="space-y-3">
                  <div><label className="block text-sm font-medium text-gray-700 mb-1">Password Saat Ini</label><input type="password" value={userData.currentPassword} onChange={e => setUserData(prev => ({ ...prev, currentPassword: e.target.value }))} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent" placeholder="Masukkan password saat ini" /></div>
                  <div><label className="block text-sm font-medium text-gray-700 mb-1">Password Baru</label><input type="password" value={userData.newPassword} onChange={e => setUserData(prev => ({ ...prev, newPassword: e.target.value }))} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent" placeholder="Masukkan password baru" /></div>
                  <div><label className="block text-sm font-medium text-gray-700 mb-1">Konfirmasi Password Baru</label><input type="password" value={userData.confirmPassword} onChange={e => setUserData(prev => ({ ...prev, confirmPassword: e.target.value }))} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent" placeholder="Konfirmasi password baru" /></div>
                </div>
              </div>
              <div className="flex gap-2 justify-center pt-4">
                <button type="button" onClick={() => setShowSettingsModal(false)} className="cursor-pointer px-4 py-2 text-sm font-medium text-primary bg-primary/10 border border-primary rounded-full hover:bg-gray-200 transition-colors">Batal</button>
                <button type="submit" disabled={updateProfile.isPending} className="cursor-pointer px-4 py-2 text-sm font-medium text-white bg-primary rounded-full hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">{updateProfile.isPending ? 'Menyimpan...' : 'Simpan'}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      <ConfirmModal isOpen={showLogoutModal} onClose={() => setShowLogoutModal(false)} onConfirm={() => { setShowLogoutModal(false); logout(); }} title="Konfirmasi Logout" message="Apakah Anda yakin ingin keluar dari admin panel?" confirmText="Logout" variant="danger" />

      <button onClick={() => setIsOpen(!isOpen)} className="md:hidden fixed top-4 left-4 z-50 p-2 bg-white rounded-lg shadow-lg">
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>
      </button>

      {isOpen && <div className="md:hidden fixed inset-0 bg-black bg-black/50 z-40" onClick={() => setIsOpen(false)} />}

      <div className={`bg-white shadow-lg h-full fixed left-0 top-0 z-50 transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 w-64 flex-shrink-0`}>
        <div className="p-6 border-b border-gray-200">
          <h1 className="text-xl font-bold text-primary">Admin Panel</h1>
          <p className="text-sm text-gray-600">UMKM Manukan Wetan</p>
        </div>
        <nav className="mt-6">
          <ul className="space-y-2 px-4">
            {menuItems.map(item => (
              <li key={item.path}>
                <button onClick={() => item.isSettings ? setShowSettingsModal(true) : handleMenuClick(item.path)} className={`w-full text-sm cursor-pointer flex items-center px-4 py-3 rounded-lg transition-all duration-200 ${location.pathname === item.path ? 'bg-primary/10 text-primary' : 'text-gray-700 hover:bg-gray-100'}`}>
                  <img src={item.icon} alt={item.name} className="w-4 h-4 mr-3" />
                  <span className="font-medium">{item.name}</span>
                </button>
              </li>
            ))}
          </ul>
        </nav>
        <div className="absolute bottom-6 left-0 right-0 px-4">
          <button onClick={() => setShowLogoutModal(true)} className="w-full flex cursor-pointer text-sm items-center px-4 py-3 rounded-lg text-red-600 hover:bg-red-50 transition-all duration-200">
            <img src="/icons/logout.svg" alt="Logout" className="w-4 h-4 mr-3" />
            <span className="font-medium">Logout</span>
          </button>
        </div>
      </div>
    </>
  );
}