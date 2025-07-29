import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface NavbarProps {
  color? : string
}

export default function Navbar({color}: NavbarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate()

  const navItems = (
    <>
      <a
        onClick={() => navigate("/berita")}
        className={`${isOpen ? 'text-white' : (color || 'text-white')} cursor-pointer relative after:content-[''] after:absolute after:left-0 after:-bottom-1 after:w-0 after:h-[2px] after:bg-white after:transition-all after:duration-300 hover:after:w-full`}
      >
        Berita
      </a>
      <a
        onClick={() => navigate("/umkm")}
        className={`${isOpen ? 'text-white' : (color || 'text-white')} cursor-pointer relative after:content-[''] after:absolute after:left-0 after:-bottom-1 after:w-0 after:h-[2px] after:bg-white after:transition-all after:duration-300 hover:after:w-full`}
      >
        UMKM
      </a>
      <div
        onClick={() => navigate("/register")}
        className="px-6 py-2 bg-primary text-white rounded-full font-semibold cursor-pointer hover:scale-105 transform transition-all"
      >
        Registrasi UMKM
      </div>
    </>
  );

  return (
    <header className="flex justify-between items-center w-full relative z-50">
      <img src={`${color ? '/icons/logo-black.svg' : '/icons/logo.svg'}`} alt="logo" className="h-10" />

      <nav className="hidden md:flex flex-row gap-10 items-center text-medium">
        {navItems}
      </nav>

      <button
        className="md:hidden z-50"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Toggle menu"
      >
        {isOpen ? (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className={`h-6 w-6 text-white`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        ) : (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className={`h-6 w-6 ${color ? color : 'text-white'}`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        )}
      </button>

      <div
        className={`fixed inset-0 bg-black bg-black/90 flex flex-col items-center justify-center gap-10 text-xl text-white transform transition-transform duration-300 ease-in-out md:hidden ${isOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
      >
        {navItems}
      </div>
    </header>
  );
}
