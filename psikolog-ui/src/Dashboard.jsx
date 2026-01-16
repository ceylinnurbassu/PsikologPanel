import { useEffect, useState } from 'react';
import { auth } from './firebase';
import { signOut } from 'firebase/auth';
import api from './api/axios';
import { 
  PieChart, Pie, Cell, ResponsiveContainer, Tooltip, 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Legend 
} from 'recharts';

// --- GRAFİK BİLEŞENİ: Verileri Görselleştirir ---
const AnalysisCharts = ({ data }) => {
  // 1. Duygu Dağılımını Hesapla (Pasta Grafiği için)
  const emotionCounts = data.reduce((acc, curr) => {
    const emotion = curr.answers?.["0"] || "Belirtilmedi";
    acc[emotion] = (acc[emotion] || 0) + 1;
    return acc;
  }, {});

  const pieData = Object.keys(emotionCounts).map(name => ({
    name, value: emotionCounts[name]
  }));

  // 2. İstek Trendini Hazırla (Alan Grafiği için - Tarihe göre sıralı)
  const trendData = [...data]
    .sort((a, b) => (a.createdAt?.seconds || 0) - (b.createdAt?.seconds || 0))
    .map(survey => ({
      tarih: survey.createdAt?.seconds 
        ? new Date(survey.createdAt.seconds * 1000).toLocaleDateString('tr-TR') 
        : "Bilinmiyor",
      istek: Number(survey.answers?.["1"]) || 0 // Sayısal olduğundan emin oluyoruz
    }));

  const COLORS = ['#6366f1', '#f43f5e', '#ec4899', '#8b5cf6', '#10b981'];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
      {/* Pasta Grafiği - Duygu Analizi */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
        <h3 className="text-lg font-bold mb-4 text-gray-800">Genel Duygu Dağılımı</h3>
        {/* Yükseklik Sorunu Çözümü: Sabit 300px div ekledik */}
        <div style={{ width: '100%', height: 300 }}>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie 
                data={pieData} 
                innerRadius={60} 
                outerRadius={80} 
                paddingAngle={5} 
                dataKey="value" 
                nameKey="name"
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend verticalAlign="bottom" height={36}/>
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Alan Grafiği - İstek Seviyesi Takibi */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
        <h3 className="text-lg font-bold mb-4 text-gray-800">Madde Kullanma İsteği Trendi</h3>
        {/* Yükseklik Sorunu Çözümü: Sabit 300px div ekledik */}
        <div style={{ width: '100%', height: 300 }}>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={trendData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
              <XAxis dataKey="tarih" fontSize={10} tickMargin={10} axisLine={false} tickLine={false} />
              <YAxis domain={[0, 5]} fontSize={10} axisLine={false} tickLine={false} />
              <Tooltip />
              <Area 
                type="monotone" 
                dataKey="istek" 
                stroke="#6366f1" 
                fillOpacity={0.4} 
                fill="#6366f1" 
                strokeWidth={3} 
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

// --- ANA DASHBOARD BİLEŞENİ ---
const Dashboard = () => {
  const [surveys, setSurveys] = useState([]);
  const [loading, setLoading] = useState(true);

  const handleLogout = () => signOut(auth);

  useEffect(() => {
    const fetchSurveys = async () => {
      try {
        const response = await api.get('/api/Analysis/surveys');
        setSurveys(response.data);
      } catch (error) {
        console.error("Veri çekme hatası:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchSurveys();
  }, []);

  return (
    <div className="flex h-screen bg-[#F8FAFC]">
      {/* Sidebar - Yan Menü */}
      <div className="w-64 bg-indigo-950 text-white flex flex-col shrink-0">
        <div className="p-6 text-xl font-bold tracking-tight border-b border-indigo-900">PSİKOLOG PANELİ</div>
        <nav className="flex-1 p-4 space-y-1">
          <button className="w-full text-left py-3 px-4 rounded-lg bg-indigo-800 font-medium">Genel Analiz</button>
          <button className="w-full text-left py-3 px-4 rounded-lg hover:bg-indigo-900 transition text-indigo-200">Hasta Listesi</button>
          <button className="w-full text-left py-3 px-4 rounded-lg hover:bg-indigo-900 transition text-indigo-200">Raporlar</button>
        </nav>
        <button 
          onClick={handleLogout} 
          className="m-6 p-3 bg-red-600 text-white rounded-xl hover:bg-red-700 shadow-lg shadow-red-200 transition font-bold"
        >
          Güvenli Çıkış
        </button>
      </div>

      {/* Main Content - Ana İçerik */}
      <div className="flex-1 overflow-y-auto p-10">
        <header className="flex justify-between items-end mb-10">
          <div>
            <h1 className="text-4xl font-extrabold text-slate-900">Hoş Geldiniz</h1>
            <p className="text-slate-500 mt-2 font-medium">Anonim hasta verileri üzerinden analizleriniz hazır.</p>
          </div>
          <div className="bg-white px-6 py-3 rounded-2xl shadow-sm border border-slate-200 flex items-center gap-3">
            <div className="w-3 h-3 bg-indigo-500 rounded-full animate-pulse"></div>
            <span className="font-bold text-slate-700">{surveys.length} Toplam Kayıt</span>
          </div>
        </header>

        {/* Grafik Bölümü (Veri varsa gösterilir) */}
        {!loading && surveys.length > 0 && <AnalysisCharts data={surveys} />}

        {/* Tablo Bölümü */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="px-8 py-6 border-b border-slate-100 flex justify-between items-center">
            <h2 className="font-bold text-slate-800 text-lg">Gelen Son Yanıtlar</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/50 text-slate-400 text-[11px] uppercase tracking-widest font-bold border-b border-slate-100">
                  <th className="px-8 py-5">Kullanıcı (Anonim)</th>
                  <th className="px-8 py-5">Duygu Durumu</th>
                  <th className="px-8 py-5">İstek Seviyesi</th>
                  <th className="px-8 py-5">Madde Türü</th>
                  <th className="px-8 py-5 text-right">Tarih</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {loading ? (
                  <tr><td colSpan="5" className="text-center py-24 text-slate-400 italic">Veriler yükleniyor...</td></tr>
                ) : surveys.length === 0 ? (
                  <tr><td colSpan="5" className="text-center py-24 text-slate-400 italic">Henüz bir yanıt bulunamadı.</td></tr>
                ) : (
                  surveys.map((survey) => (
                    <tr key={survey.id} className="hover:bg-slate-50/80 transition-all cursor-default">
                      <td className="px-8 py-5 font-mono text-xs text-indigo-500">{survey.userId?.substring(0, 8)}...</td>
                      <td className="px-8 py-5 font-semibold text-slate-700">{survey.answers?.["0"] || "Belirtilmedi"}</td>
                      <td className="px-8 py-5">
                        <div className="flex flex-col">
                          <span className={`text-sm font-bold ${survey.answers?.["1"] >= 4 ? 'text-rose-500' : 'text-emerald-600'}`}>
                            {survey.answers?.["1"] === 1 ? "Düşük (1)" : survey.answers?.["1"] >= 4 ? "Yüksek ("+survey.answers?.["1"]+")" : "Orta ("+survey.answers?.["1"]+")"}
                          </span>
                          <span className="text-[10px] text-slate-400 font-medium">{survey.answers?.["2"]}</span>
                        </div>
                      </td>
                      <td className="px-8 py-5">
                        <div className="flex flex-wrap gap-1">
                          {Array.isArray(survey.answers?.["3"]) ? (
                            survey.answers["3"].map((m, i) => (
                              <span key={i} className="bg-slate-100 text-slate-600 px-2 py-0.5 rounded text-[10px] border border-slate-200">
                                {m}
                              </span>
                            ))
                          ) : (
                            <span className="text-slate-300 text-xs">-</span>
                          )}
                        </div>
                      </td>
                      <td className="px-8 py-5 text-[11px] text-slate-500 text-right font-medium">
                        {survey.createdAt?.seconds ? new Date(survey.createdAt.seconds * 1000).toLocaleString('tr-TR') : "Bilinmiyor"}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;