import { useState } from 'react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from './firebase';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
      alert("Giriş Başarılı!");
    } catch (error) {
      alert("Hata: " + error.message);
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <form onSubmit={handleLogin} className="p-10 bg-white rounded shadow-xl">
        <h2 className="mb-5 text-2xl font-bold">Psikolog Girişi</h2>
        <input type="email" placeholder="E-posta" className="w-full p-2 mb-4 border" onChange={(e) => setEmail(e.target.value)} />
        <input type="password" placeholder="Şifre" className="w-full p-2 mb-4 border" onChange={(e) => setPassword(e.target.value)} />
        <button type="submit" className="w-full p-2 text-white bg-indigo-600 rounded">Giriş Yap</button>
      </form>
    </div>
  );
};

export default Login;