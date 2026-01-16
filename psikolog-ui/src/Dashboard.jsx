import { auth } from './firebase';
import { signOut } from 'firebase/auth';

const Dashboard = () => {
  const handleLogout = () => signOut(auth);

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar - Yan Menü */}
      <div className="w-64 bg-indigo-900 text-white flex flex-col">
        <div className="p-6 text-2xl font-bold border-b border-indigo-800">Psikolog Pro</div>
        <nav className="flex-1 p-4 space-y-2">
          <a href="#" className="block py-2.5 px-4 rounded transition bg-indigo-700">Hastalarım</a>
          <a href="#" className="block py-2.5 px-4 rounded transition hover:bg-indigo-800">Analizler</a>
          <a href="#" className="block py-2.5 px-4 rounded transition hover:bg-indigo-800">Randevular</a>
        </nav>
        <button onClick={handleLogout} className="p-4 bg-red-600 hover:bg-red-700 transition">Çıkış Yap</button>
      </div>

      {/* Main Content - Ana İçerik */}
      <div className="flex-1 overflow-y-auto p-10">
        <header className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-semibold text-gray-800">Hasta Listesi</h1>
          <button className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700">+ Yeni Hasta</button>
        </header>

        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-6 py-4 text-sm font-medium text-gray-500">Hasta Adı</th>
                <th className="px-6 py-4 text-sm font-medium text-gray-500">Durum</th>
                <th className="px-6 py-4 text-sm font-medium text-gray-500">Son Analiz</th>
                <th className="px-6 py-4 text-sm font-medium text-gray-500">İşlem</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              <tr className="hover:bg-gray-50 transition">
                <td className="px-6 py-4">Ahmet Yılmaz</td>
                <td className="px-6 py-4"><span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs">Aktif</span></td>
                <td className="px-6 py-4 text-gray-400">12.01.2026</td>
                <td className="px-6 py-4 text-indigo-600 cursor-pointer font-medium">Detayları Gör</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;