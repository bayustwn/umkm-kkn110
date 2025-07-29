import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/home/Home';
import NotFound from './pages/404/NotFound';
import Berita from './pages/berita/Berita';
import BeritaDetail from './pages/berita/detail/BeritaDetail';
import ScrollToTop from './components/ScrollToTop';
import UMKM from './pages/umkm/Umkm';
import DetailUmkm from './pages/umkm/detail/DetailUmkm';
import Register from './pages/register/Register';
import Login from './pages/admin/login/Login';
import Dashboard from './pages/admin/dashboard/Dashboard';
import Umkm from './pages/admin/umkm/Umkm';
import BeritaAdmin from './pages/admin/berita/Berita';
import TambahBerita from './pages/admin/berita/TambahBerita';
import EditBerita from './pages/admin/berita/EditBerita';
import TambahUmkm from './pages/admin/umkm/TambahUmkm';
import EditUmkm from './pages/admin/umkm/EditUmkm';
import ProtectAdmin from './components/ProtectAdmin';
import AdminLayout from './components/AdminLayout';

const AdminRoute = ({ children }: { children: React.ReactNode }) => (
  <ProtectAdmin>
    <AdminLayout>
      {children}
    </AdminLayout>
  </ProtectAdmin>
);

const adminRoutes = [
  { path: '/admin/dashboard', element: <Dashboard /> },
  { path: '/admin/berita', element: <BeritaAdmin /> },
  { path: '/admin/berita/tambah', element: <TambahBerita /> },
  { path: '/admin/berita/edit/:id', element: <EditBerita /> },
  { path: '/admin/umkm', element: <Umkm /> },
  { path: '/admin/umkm/tambah', element: <TambahUmkm /> },
  { path: '/admin/umkm/edit/:id', element: <EditUmkm /> },
];

const publicRoutes = [
  { path: '/', element: <Home /> },
  { path: '/berita', element: <Berita /> },
  { path: '/berita/:id', element: <BeritaDetail /> },
  { path: '/umkm', element: <UMKM /> },
  { path: '/umkm/:id', element: <DetailUmkm /> },
  { path: '/register', element: <Register /> },
];

function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Routes>
        {publicRoutes.map((route) => (
          <Route key={route.path} path={route.path} element={route.element} />
        ))}
        
        {adminRoutes.map((route) => (
          <Route
            key={route.path}
            path={route.path}
            element={<AdminRoute>{route.element}</AdminRoute>}
          />
        ))}
        
        <Route path='/admin/login' element={<Login />} />
        
        <Route path='*' element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;