import { useState } from 'react';
import { auth } from './firebase';
import { signInWithEmailAndPassword, sendPasswordResetEmail } from 'firebase/auth'; // Şifre sıfırlama fonksiyonu eklendi
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState(''); // Başarı mesajları için
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setMessage('');
    
    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate('/'); 
    } catch (err) {
      setError("Giriş bilgileri hatalı.");
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async () => {
    if (!email) {
      setError("Lütfen önce e-posta adresinizi girin.");
      return;
    }
    try {
      await sendPasswordResetEmail(auth, email);
      setMessage("Şifre sıfırlama bağlantısı e-postanıza gönderildi.");
      setError('');
    } catch (err) {
      setError("Şifre sıfırlama gönderilemedi. E-posta adresini kontrol edin.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F9FAFB] font-sans px-4">
      {/* Kart Kapsayıcısı */}
      <div className="max-w-md w-full bg-white p-12 rounded-[32px] shadow-xl border border-gray-100">
        
        {/* Logo Bölümü */}
        <div className="text-center mb-12">
          <div className="text-3xl font-bold tracking-tighter text-[#2D5A56] uppercase">
            Uzman <span className="font-light text-gray-400 ml-1">Paneli</span>
          </div>
          <div className="h-1 w-10 bg-[#2D5A56] mx-auto mt-4 rounded-full opacity-20"></div>
        </div>

        {/* Bilgilendirme Mesajları */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 text-red-700 text-xs font-medium rounded-xl text-center">
            {error}
          </div>
        )}
        {message && (
          <div className="mb-6 p-4 bg-green-50 text-green-700 text-xs font-medium rounded-xl text-center">
            {message}
          </div>
        )}

        {/* Giriş Formu */}
        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label className="block text-[10px] uppercase tracking-[0.2em] font-bold text-gray-400 mb-2 ml-1">
              E-Posta
            </label>
            <input
              type="email"
              required
              className="w-full px-5 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-[#2D5A56] focus:border-transparent outline-none transition-all text-sm placeholder:text-gray-300"
              placeholder="uzman@psikoloji.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div>
            <div className="flex justify-between items-center mb-2 ml-1">
              <label className="block text-[10px] uppercase tracking-[0.2em] font-bold text-gray-400">
                Şifre
              </label>
          
            </div>
            <input
              type="password"
              required
              className="w-full px-5 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-[#2D5A56] focus:border-transparent outline-none transition-all text-sm placeholder:text-gray-300"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
    <button 
                type="button"
                onClick={handleForgotPassword}
                className="text-[10px] font-bold text-[#2D5A56] hover:underline uppercase tracking-widest opacity-70 hover:opacity-100 transition-opacity"
              >
                Şifremi Unuttum
              </button>
          <button
            type="submit"
            disabled={loading}
            className={`w-full bg-[#2D5A56] text-white py-4 mt-4 rounded-2xl font-bold tracking-[0.2em] uppercase text-xs hover:bg-[#1e3d3a] transition-all shadow-lg active:scale-95 ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
          >
            {loading ? 'Giriş Yapılıyor...' : 'Giriş Yap'}
          </button>
        </form>

        <div className="mt-12 text-center border-t border-gray-50 pt-6">
          <p className="text-[9px] text-gray-300 uppercase tracking-[0.4em] font-medium">
            Professional Healthcare Systems
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;