import { useState } from 'react';
import { auth } from './firebase';
import { sendPasswordResetEmail } from 'firebase/auth';
import AppFrame from './components/AppFrame';

const SifreDegistir = () => {
  const [sent, setSent] = useState(false);
  const userEmail = auth.currentUser?.email;

  const handleReset = async () => {
    if (!userEmail) return;
    try {
      await sendPasswordResetEmail(auth, userEmail);
      setSent(true);
    } catch (err) {
      console.error("Hata:", err);
    }
  };

  return (
    <AppFrame>
      <div className="max-w-xl mx-auto mt-20 text-left">
        <header className="mb-10">
          <h1 className="text-4xl font-light text-[#2D5A56] uppercase italic tracking-tight">Şifre İşlemleri</h1>
          <p className="text-gray-400 mt-2">Hesap güvenliğiniz için e-posta doğrulaması ile şifrenizi yenileyin.</p>
        </header>

        <div className="bg-white p-12 rounded-[32px] shadow-sm border border-gray-100">
          {!sent ? (
            <div className="space-y-8">
              <p className="text-gray-600 font-light leading-relaxed">
                Şifre sıfırlama bağlantısı sistemde kayıtlı olan uzman adresine gönderilecektir: <br/>
                <span className="font-bold text-[#2D5A56]">{userEmail}</span>
              </p>
              <button 
                onClick={handleReset}
                className="bg-[#2D5A56] text-white px-10 py-4 rounded-2xl font-bold uppercase text-[10px] tracking-[0.2em] shadow-lg hover:bg-[#1e3d3a] transition-all"
              >
                Sıfırlama Bağlantısı Gönder
              </button>
            </div>
          ) : (
            <div className="py-10 text-center animate-in fade-in">
              <div className="text-5xl mb-6">✉️</div>
              <p className="text-[#2D5A56] font-bold uppercase tracking-widest text-sm">Bağlantı Gönderildi</p>
              <p className="text-gray-400 mt-2 text-xs">Lütfen gelen kutunuzu (ve spam klasörünü) kontrol edin.</p>
            </div>
          )}
        </div>
      </div>
    </AppFrame>
  );
};

export default SifreDegistir;