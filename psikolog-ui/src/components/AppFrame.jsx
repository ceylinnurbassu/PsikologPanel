import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth } from '../firebase';
import { signOut } from 'firebase/auth';

const AppFrame = ({ children }) => {
  const navigate = useNavigate();
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const dropdownRef = useRef(null);

  const handleLogout = async () => {
    await signOut(auth);
    navigate('/login');
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsProfileOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="min-h-screen bg-[#F9FAFB] flex flex-col w-full overflow-x-hidden">
     {/* --- KESİN ÇALIŞAN SABİT NAVBAR --- */}
    <nav className="fixed top-0 left-0 right-0 h-20 bg-[#2D5A56] text-white z-[999] shadow-md flex items-center">
    <div className="w-full px-10 flex items-center justify-between">
        
        {/* SOL TARAF: Logo ve Linkler */}
        <div className="flex items-center gap-12">
        <div 
            className="text-2xl font-bold tracking-tight text-white cursor-pointer select-none" 
            onClick={() => navigate('/')}
        >
            UZMAN<span className="font-light opacity-60 ml-1">PANELİ</span>
        </div>
        
        {/* Safari'de görünmeyen linkleri görünür kılmak için flex yapısı */}
        <div className="hidden lg:flex items-center gap-8 text-[11px] font-bold uppercase tracking-widest text-white/80">
            <button onClick={() => navigate('/')} className="text-white border-b-2 border-white pb-1 transition-all">Analizler</button>
           {/* <button className="hover:text-white transition-colors">Hasta Listesi</button>
            <button className="hover:text-white transition-colors">Klinik Kaynaklar</button>
            <button className="hover:text-white transition-colors">Eğitimler</button>*/}
        </div>
        </div>

        {/* SAĞ TARAF: Profil Paneli */}
        <div className="relative" ref={dropdownRef}>
        <button 
            onClick={() => setIsProfileOpen(!isProfileOpen)} 
            className="flex items-center gap-3 py-2 px-5 rounded bg-white/10 border border-white/20 text-white hover:bg-white/20 transition-all shadow-sm"
        >
            <div className="w-8 h-8 rounded bg-white text-[#2D5A56] flex items-center justify-center text-[10px] font-extrabold shadow-inner">DR</div>
            <span className="text-[11px] font-bold uppercase tracking-widest hidden sm:inline">Kullanıcı Paneli</span>
            <span className="text-[8px] opacity-60">▼</span>
        </button>

        {/* PROFİL PANELİ GÜNCELLEME */}
{isProfileOpen && (
  <div className="absolute right-0 mt-4 w-56 bg-white rounded-2xl shadow-2xl border border-gray-100 py-3 z-[110] text-gray-700">
    <div className="px-5 py-2 mb-2 border-b border-gray-50">
      <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Hesap Yönetimi</p>
    </div>
    
    <button 
      onClick={() => navigate('/sifre-degistir')} 
      className="w-full text-left px-5 py-3 text-sm hover:bg-gray-50 transition font-medium flex items-center justify-between group"
    >
      Şifre Değiştir
      <span className="opacity-0 group-hover:opacity-100 transition-opacity">→</span>
    </button>
    
    <div className="h-px bg-gray-100 my-2 mx-5"></div>
    
    <button 
      onClick={handleLogout} 
      className="w-full text-left px-5 py-3 text-sm text-red-600 font-bold hover:bg-red-50 transition"
    >
      Güvenli Çıkış
    </button>
  </div>
)}
        </div>
    </div>
    </nav>

      <main className="w-full px-10 pt-32 pb-12 flex-grow">
        {children}
      </main>

      <footer className="py-8 bg-white border-t border-gray-100 px-10 flex justify-between items-center text-[10px] text-gray-300 uppercase tracking-widest">
        <p>© 2026 PSYCHOLOGY PANEL</p>
        <p>Professional Healthcare Systems</p>
      </footer>
    </div>
  );
};

export default AppFrame;