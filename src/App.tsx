import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from '@/pages/home/Home';
import NotFound from '@/pages/404/NotFound';
import News from '@/pages/news/News';
import NewsDetail from '@/pages/news/detail/NewsDetail';
import ScrollToTop from '@/components/ScrollToTop';
import UmkmPage from '@/pages/umkm/Umkm';
import UmkmDetail from '@/pages/umkm/detail/UmkmDetail';
import Register from '@/pages/register/Register';
import Login from '@/pages/admin/login/Login';
import Dashboard from '@/pages/admin/dashboard/Dashboard';
import AdminUmkm from '@/pages/admin/umkm/Umkm';
import AdminNews from '@/pages/admin/news/News';
import AddNews from '@/pages/admin/news/AddNews';
import EditNews from '@/pages/admin/news/EditNews';
import AddUmkm from '@/pages/admin/umkm/AddUmkm';
import EditUmkm from '@/pages/admin/umkm/EditUmkm';
import ProtectAdmin from '@/components/guards/ProtectAdmin';
import AdminLayout from '@/components/layout/AdminLayout';

const AdminRoute = ({ children }: { children: React.ReactNode }) => (
  <ProtectAdmin>
    <AdminLayout>{children}</AdminLayout>
  </ProtectAdmin>
);

const adminRoutes = [
  { path: '/admin/dashboard', element: <Dashboard /> },
  { path: '/admin/berita', element: <AdminNews /> },
  { path: '/admin/berita/tambah', element: <AddNews /> },
  { path: '/admin/berita/edit/:id', element: <EditNews /> },
  { path: '/admin/umkm', element: <AdminUmkm /> },
  { path: '/admin/umkm/tambah', element: <AddUmkm /> },
  { path: '/admin/umkm/edit/:id', element: <EditUmkm /> },
];

const publicRoutes = [
  { path: '/', element: <Home /> },
  { path: '/berita', element: <News /> },
  { path: '/berita/:id', element: <NewsDetail /> },
  { path: '/umkm', element: <UmkmPage /> },
  { path: '/umkm/:id', element: <UmkmDetail /> },
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

        <Route path="/admin/login" element={<Login />} />

        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
