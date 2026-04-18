import React, { useEffect, useState, useRef } from 'react';
import { 
  PieChart, Pie, Cell, ResponsiveContainer, Tooltip, 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Legend,
  BarChart, Bar
} from 'recharts';

// --- SON DÜZENLEME: LUCIDE-REACT HATASINI GİDERMEK İÇİN İKONLARIN INLINE SVG OLARAK TANIMLANMASI ---
const Icons = {
  LayoutDashboard: ({ size = 24, className = "" }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <rect width="7" height="9" x="3" y="3" rx="1" /><rect width="7" height="5" x="14" y="3" rx="1" /><rect width="7" height="9" x="14" y="12" rx="1" /><rect width="7" height="5" x="3" y="16" rx="1" />
    </svg>
  ),
  Users: ({ size = 24, className = "" }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M22 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  ),
  Activity: ({ size = 24, className = "" }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
    </svg>
  ),
  ClipboardCheck: ({ size = 24, className = "" }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <rect width="8" height="4" x="8" y="2" rx="1" /><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" /><path d="m9 14 2 2 4-4" />
    </svg>
  ),
  RefreshCw: ({ size = 24, className = "" }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8" /><path d="M21 3v5h-5" /><path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16" /><path d="M3 21v-5h5" />
    </svg>
  ),
  User: ({ size = 24, className = "" }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" />
    </svg>
  ),
  BarChart3: ({ size = 24, className = "" }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M3 3v18h18" /><path d="M18 17V9" /><path d="M13 17V5" /><path d="M8 17v-3" />
    </svg>
  )
};

// --- ÖNİZLEME İÇİN GEREKLİ YEREL YAPILAR ---

const api = {
  get: async (url) => {
    return {
      data: [
        {
          id: "27mjxJx4qBrMSZyTZT6X",
          userId: "5297ea67-babc-4b2a-9260-8bb6b42eda54",
          answers: { "0": "Utanç", "1": 4, "2": "12-24 Saat önce", "3": ["Amfetamin ve türevleri (Metanfetamin)"] },
          createdAt: { seconds: 1713089328 }
        },
        {
          id: "8HDuFelNVzuBLnJaSWj6",
          userId: "5297ea67-babc-4b2a-9260-8bb6b42eda54",
          answers: { "0": "Öfke", "1": 2, "2": "3-6 Saat önce", "3": ["Esrar"] },
          createdAt: { seconds: 1713175728 }
        },
        {
          id: "BNTLB1QPNBF9XtudWZ6D",
          userId: "9988ee22-aaaa-1111-2222-333344445555",
          answers: { "0": "Korku", "1": 5, "2": "0-1 Saat önce", "3": ["Eroin", "Kokain"] },
          createdAt: { seconds: 1713262128 }
        }
      ]
    };
  }
};

const AppFrame = ({ children }) => (
  <div className="min-h-screen bg-slate-50 flex">
    <aside className="w-64 bg-[#2D5A56] text-white fixed h-full p-6 hidden lg:flex flex-col shadow-2xl">
      <div className="mb-10 flex items-center gap-3">
        <div className="bg-white/10 p-2 rounded-xl">
          <Icons.Activity size={24} className="text-white" />
        </div>
        <h1 className="text-xl font-bold tracking-tighter text-left uppercase">PSİKOLOG PANEL</h1>
      </div>
      <nav className="flex-1 space-y-2">
        <button className="w-full flex items-center gap-3 px-4 py-3 bg-white/10 rounded-xl font-bold text-sm transition-all text-left">
          <Icons.LayoutDashboard size={18} /> Dashboard
        </button>
        <button className="w-full flex items-center gap-3 px-4 py-3 text-white/60 hover:text-white rounded-xl font-bold text-sm transition-all text-left">
          <Icons.Users size={18} /> Vaka Listesi
        </button>
      </nav>
      <div className="pt-6 border-t border-white/10">
        <div className="flex items-center gap-3 bg-black/20 p-4 rounded-2xl">
          <div className="w-8 h-8 bg-[#5E8B87] rounded-full flex items-center justify-center font-bold text-xs">U</div>
          <div className="overflow-hidden text-left">
            <p className="text-xs font-bold truncate">Uzman Kullanıcı</p>
            <p className="text-[10px] opacity-50 uppercase font-black">Klinik Psikolog</p>
          </div>
        </div>
      </div>
    </aside>
    <main className="flex-1 lg:ml-64 p-4 lg:p-10">
      {children}
    </main>
  </div>
);

const filterOptions = {
  duygu: ["Korku", "Üzüntü", "Öfke", "Tiksinti", "Utanç", "Coşku", "Şaşkınlık", "Hiçbiri"],
  istek: ["1 (Yok)", "2 (Az)", "3 (Orta)", "4 (Fazla)", "5 (Çok Fazla)"],
  sonKullanim: ["0-1 Saat önce", "1-3 Saat önce", "3-6 Saat önce", "6-12 Saat önce", "12-24 Saat önce", "1 Gün ve üzeri zaman önce"],
  parametre: ["Esrar", "Eroin", "Kokain", "Sentetik kannobinoidler (Bonzai, jamaika)", "Amfetamin ve türevleri (Metanfetamin)", "Uçucular (Bali, tiner, çakmak gazı vb.)", "Pregabalin", "LSD", "Hiçbiri"]
};

const COLORS = ['#2D5A56', '#5E8B87', '#92B4B1', '#C5D6D4', '#E1E9E8'];

// --- KULLANICI DETAY MODALI (POP-UP) ---
const UserHistoryModal = ({ isOpen, onClose, userId, allSurveys }) => {
  if (!isOpen || !userId) return null;

  const userHistory = allSurveys
    .filter(s => s.userId === userId)
    .sort((a, b) => (a.createdAt?.seconds || 0) - (b.createdAt?.seconds || 0));

  const chartData = userHistory.map(s => ({
    tarih: s.createdAt?.seconds ? new Date(s.createdAt.seconds * 1000).toLocaleDateString('tr-TR') : '-',
    istek: Number(s.answers?.["1"]) || 0
  }));

  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-4xl max-h-[85vh] rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col animate-in zoom-in-95 duration-200">
        
        {/* Modal Header */}
        <div className="p-8 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
          <div className="text-left">
            <h2 className="text-2xl font-bold text-[#2D5A56] italic">Bireysel Gelişim Analizi</h2>
            <p className="text-[10px] font-mono text-gray-400 mt-1 uppercase tracking-widest font-bold">VAKA_ID: {userId}</p>
          </div>
          <button 
            onClick={onClose}
            className="w-10 h-10 flex items-center justify-center rounded-full bg-white border border-gray-200 text-gray-400 hover:text-red-500 hover:border-red-100 transition-all font-bold"
          >
            ✕
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-8 space-y-8">
          
          {/* Trend Grafiği */}
          <div className="bg-[#f8fafc] p-6 rounded-3xl border border-gray-100 shadow-inner">
            <h3 className="text-[10px] font-black text-[#2D5A56] mb-6 uppercase tracking-[0.2em] opacity-50 text-left">Zaman Çizelgesi (İstek Şiddeti)</h3>
            <div style={{ width: '100%', height: 200 }}>
              <ResponsiveContainer>
                <AreaChart data={chartData}>
                  <defs>
                    <linearGradient id="popGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#2D5A56" stopOpacity={0.2}/>
                      <stop offset="95%" stopColor="#2D5A56" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                  <XAxis dataKey="tarih" fontSize={10} axisLine={false} tickLine={false} />
                  <YAxis domain={[0, 5]} fontSize={10} axisLine={false} tickLine={false} />
                  <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }} />
                  <Area type="monotone" dataKey="istek" stroke="#2D5A56" fill="url(#popGrad)" strokeWidth={3} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Kayıt Listesi */}
          <div className="space-y-4 text-left">
            <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] text-left">Klinik Kayıt Arşivi ({userHistory.length})</h3>
            <div className="grid gap-4 text-left">
              {userHistory.slice().reverse().map((item, idx) => (
                <div key={idx} className="bg-white border border-gray-100 p-6 rounded-2xl flex flex-wrap items-center justify-between hover:border-[#2D5A56]/20 transition-all shadow-sm">
                  <div className="flex flex-wrap items-center gap-10">
                    <div className="flex flex-col text-left">
                      <span className="text-[9px] font-black text-gray-300 uppercase tracking-tighter">Rapor Tarihi</span>
                      <span className="text-xs font-bold text-gray-600">
                        {item.createdAt?.seconds ? new Date(item.createdAt.seconds * 1000).toLocaleString('tr-TR') : '-'}
                      </span>
                    </div>
                    <div className="w-px h-10 bg-gray-100 hidden sm:block"></div>
                    <div className="flex flex-col text-left">
                      <span className="text-[9px] font-black text-gray-300 uppercase tracking-tighter">Baskın Duygu</span>
                      <span className="text-xs font-black text-[#2D5A56]">{item.answers?.["0"] || "N/A"}</span>
                    </div>

                    <div className="w-px h-10 bg-gray-100 hidden sm:block"></div>

                    <div className="flex flex-col text-left">
                      <span className="text-[9px] font-black text-gray-300 uppercase tracking-tighter">Son Kullanılan Madde(ler)</span>
                      <span className="text-xs font-bold text-gray-500 italic">
                        {Array.isArray(item.answers?.["3"]) ? item.answers["3"].join(", ") : item.answers?.["3"] || "Hiçbiri"}
                      </span>
                    </div>
                  </div>

                  <div className="flex gap-2 mt-4 lg:mt-0">
                    <div className={`px-4 py-2 rounded-lg text-[9px] font-black ${Number(item.answers?.["1"]) >= 4 ? 'bg-red-50 text-red-600' : 'bg-gray-50 text-gray-400'}`}>
                      İSTEK: {item.answers?.["1"]}
                    </div>
                    <div className="bg-[#E1E9E8] text-[#2D5A56] px-4 py-2 rounded-lg text-[9px] font-black uppercase border border-[#C5D6D4]">
                      {item.answers?.["2"] || "BELİRTİLMEDİ"}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="p-8 bg-gray-50 border-t border-gray-100 text-center">
          <p className="text-[10px] text-gray-400 font-bold uppercase tracking-[0.5em]">Klinik Karar Destek Sistemi - 2026</p>
        </div>
      </div>
    </div>
  );
};

const AnalysisCharts = ({ data }) => {
  const totalReports = data.length;

  const emotionCounts = data.reduce((acc, curr) => {
    const emotion = curr.answers?.["0"] || "Belirtilmedi";
    acc[emotion] = (acc[emotion] || 0) + 1;
    return acc;
  }, {});

  const pieData = Object.keys(emotionCounts).map(name => ({
    name, value: emotionCounts[name]
  }));

  const trendData = [...data]
    .sort((a, b) => (a.createdAt?.seconds || 0) - (b.createdAt?.seconds || 0))
    .map(survey => ({
      tarih: survey.createdAt?.seconds 
        ? new Date(survey.createdAt.seconds * 1000).toLocaleDateString('tr-TR') 
        : "Bilinmiyor",
      istek: Number(survey.answers?.["1"]) || 0 
    }));

  const substanceAnalysis = data.reduce((acc, curr) => {
    const substances = Array.isArray(curr.answers?.["3"]) ? curr.answers["3"] : [curr.answers?.["3"]];
    const severity = Number(curr.answers?.["1"]) || 0;
    
    substances.forEach(sub => {
      if (sub && sub !== "Hiçbiri") {
        if (!acc[sub]) acc[sub] = { name: sub, totalSeverity: 0, count: 0 };
        acc[sub].totalSeverity += severity;
        acc[sub].count += 1;
      }
    });
    return acc;
  }, {});

  const barData = Object.values(substanceAnalysis).map(item => ({
    name: item.name,
    ortalamaIstek: (item.totalSeverity / item.count).toFixed(1)
  }));

  const timeCounts = data.reduce((acc, curr) => {
    const time = curr.answers?.["2"] || "Belirtilmedi";
    acc[time] = (acc[time] || 0) + 1;
    return acc;
  }, {});

  const timePieData = Object.keys(timeCounts).map(name => ({
    name, value: timeCounts[name]
  }));

  const formatTooltipValue = (value) => {
    const percent = totalReports > 0 ? ((value / totalReports) * 100).toFixed(1) : 0;
    return `${value} Rapor (%${percent})`;
  };

  return (
    <div className="w-full space-y-8 mb-12 text-left">
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-1 bg-white p-6 rounded-lg shadow-sm border border-gray-100 flex flex-col justify-center overflow-hidden">
          <h3 className="text-xl font-medium mb-4 text-[#2D5A56] italic border-l-4 border-[#2D5A56] pl-4 text-left">Duygu Analizi</h3>
          <div style={{ width: '100%', height: 320 }}>
            <ResponsiveContainer>
              <PieChart>
                <Pie 
                  data={pieData} 
                  innerRadius={65} 
                  outerRadius={90} 
                  paddingAngle={5} 
                  dataKey="value"
                  label={({ name }) => name}
                  labelLine={true}
                >
                  {pieData.map((entry, index) => <Cell key={index} fill={COLORS[index % COLORS.length]} />)}
                </Pie>
                <Tooltip formatter={formatTooltipValue} />
                <Legend verticalAlign="bottom" wrapperStyle={{paddingTop: '10px'}} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
        
        <div className="xl:col-span-2 bg-white p-8 rounded-lg shadow-sm border border-gray-100">
          <h3 className="text-xl font-medium mb-6 text-[#2D5A56] italic border-l-4 border-[#2D5A56] pl-4 text-left">Semptom Trend Takibi</h3>
          <div style={{ width: '100%', height: 300 }}>
            <ResponsiveContainer>
              <AreaChart data={trendData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#EDF2F1" />
                <XAxis dataKey="tarih" fontSize={11} tickMargin={10} axisLine={false} tickLine={false} />
                <YAxis domain={[0, 5]} fontSize={11} axisLine={false} tickLine={false} />
                <Tooltip />
                <Area type="monotone" dataKey="istek" stroke="#2D5A56" fill="#2D5A56" fillOpacity={0.1} strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-100">
          <h3 className="text-xl font-medium mb-6 text-[#2D5A56] italic border-l-4 border-[#2D5A56] pl-4 text-left">Madde Bazlı İstek Şiddeti</h3>
          <div style={{ width: '100%', height: 300 }}>
            <ResponsiveContainer>
              <BarChart data={barData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#EDF2F1" />
                <XAxis dataKey="name" fontSize={10} axisLine={false} tickLine={false} />
                <YAxis domain={[0, 5]} fontSize={11} axisLine={false} tickLine={false} />
                <Tooltip cursor={{fill: '#f8fafc'}} />
                <Bar dataKey="ortalamaIstek" fill="#2D5A56" radius={[4, 4, 0, 0]} barSize={35} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-100">
          <h3 className="text-xl font-medium mb-6 text-[#2D5A56] italic border-l-4 border-[#2D5A56] pl-4 text-left">Son Kullanım Zamanı Dağılımı</h3>
          <div style={{ width: '100%', height: 300 }}>
            <ResponsiveContainer>
              <PieChart>
                <Pie data={timePieData} innerRadius={0} outerRadius={90} dataKey="value" labelLine={false} label={({name, percent}) => `${name} ${(percent * 100).toFixed(0)}%`}>
                  {timePieData.map((entry, index) => <Cell key={index} fill={COLORS[index % COLORS.length]} />)}
                </Pie>
                <Tooltip formatter={formatTooltipValue} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

const Dashboard = () => {
  const [surveys, setSurveys] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isParamDropdownOpen, setIsParamDropdownOpen] = useState(false);
  const paramDropdownRef = useRef(null);

  const [selectedUser, setSelectedUser] = useState({ isOpen: false, id: null });

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  
  const [selectedFilters, setSelectedFilters] = useState({
    duygu: '',
    istek: '',
    sonKullanim: '',
    parametre: []
  });

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (paramDropdownRef.current && !paramDropdownRef.current.contains(event.target)) {
        setIsParamDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const filteredSurveys = surveys
    .filter(survey => {
      const selectedIstekMapped = selectedFilters.istek.split(' ')[0];
      const surveyParams = Array.isArray(survey.answers?.["3"]) ? survey.answers["3"] : [survey.answers?.["3"]];
      const matchesParametre = selectedFilters.parametre.length === 0 || 
        selectedFilters.parametre.some(p => surveyParams.includes(p));

      return (
        (selectedFilters.duygu === '' || survey.answers?.["0"] === selectedFilters.duygu) &&
        (selectedFilters.istek === '' || String(survey.answers?.["1"]) === selectedIstekMapped) &&
        (selectedFilters.sonKullanim === '' || survey.answers?.["2"] === selectedFilters.sonKullanim) &&
        matchesParametre
      );
    })
    .sort((a, b) => (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0));

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredSurveys.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredSurveys.length / itemsPerPage);

  useEffect(() => {
    setCurrentPage(1);
  }, [selectedFilters]);

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

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-white flex-col gap-6">
      <div className="w-16 h-16 border-4 border-[#2D5A56] border-t-transparent rounded-full animate-spin"></div>
      <p className="text-[#2D5A56] font-black italic tracking-[0.3em] uppercase animate-pulse">Analizler Hazırlanıyor</p>
    </div>
  );

  return (
    <AppFrame>
      <header className="mb-12 border-b border-gray-200 pb-8 text-left">
        <h1 className="text-5xl font-light text-[#2D5A56] mb-4 italic tracking-tight uppercase text-left">Vaka Analizleri</h1>
        <p className="text-xl text-gray-500 max-w-5xl font-light leading-relaxed text-left">Sisteme kayıtlı anonim vakaların madde kullanım döngüleri ve psikometrik raporları.</p>
      </header>

      {/* MODAL BİLEŞENİ ÇAĞRISI */}
      <UserHistoryModal 
        isOpen={selectedUser.isOpen} 
        onClose={() => setSelectedUser({ isOpen: false, id: null })}
        userId={selectedUser.id}
        allSurveys={surveys}
      />

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12 text-left">
        <div className="bg-white border-l-4 border-[#2D5A56] p-8 rounded-lg shadow-sm text-left">
          <p className="text-xs uppercase tracking-widest text-gray-400 mb-2 font-bold">Toplam Rapor</p>
          <h2 className="text-4xl font-light italic text-[#2D5A56]">{surveys.length}</h2>
        </div>
      </div>

      <AnalysisCharts data={filteredSurveys} />

      <div className="bg-white rounded-[32px] shadow-sm border border-gray-100 overflow-hidden w-full mt-10 mb-20 text-left">
        <div className="p-10 bg-gray-50/30 border-b border-gray-100 flex justify-between items-center">
          <h2 className="text-2xl font-medium text-[#2D5A56] italic border-l-4 border-[#2D5A56] pl-5 uppercase tracking-tighter text-left">Detaylı Yanıt Listesi</h2>
          <div className="flex gap-4">
            <button 
                onClick={() => setSelectedFilters({ duygu: '', istek: '', sonKullanim: '', parametre: [] })}
                className="text-[#2D5A56] text-[10px] font-bold border border-[#2D5A56] px-6 py-2 rounded-full hover:bg-[#2D5A56] hover:text-white transition-all uppercase tracking-widest"
            >
                Filtreleri Sıfırla
            </button>
          </div>
        </div>
        
        <div className="w-full overflow-x-auto text-left">
          <table className="w-full text-left border-collapse table-fixed min-w-[900px]">
            <thead>
              <tr className="bg-gray-50/50 text-[11px] uppercase tracking-[0.2em] text-gray-400 font-bold border-b text-left">
                <th className="px-6 py-7 w-[120px]">Kayıt No</th>
                <th className="px-6 py-7 w-[160px]">
                  <div className="flex flex-col gap-2">
                    <span>Baskın Duygu</span>
                    <select className="bg-transparent border-none text-[11px] text-[#2D5A56] outline-none font-bold cursor-pointer uppercase p-0" value={selectedFilters.duygu} onChange={(e) => setSelectedFilters({...selectedFilters, duygu: e.target.value})}>
                      <option value="">TÜMÜ</option>
                      {filterOptions.duygu.map(opt => <option key={opt} value={opt}>{opt.toUpperCase()}</option>)}
                    </select>
                  </div>
                </th>
                <th className="px-6 py-7 w-[160px]">
                  <div className="flex flex-col gap-2">
                    <span>İstek Şiddeti</span>
                    <select className="bg-transparent border-none text-[11px] text-[#2D5A56] outline-none font-bold cursor-pointer uppercase p-0" value={selectedFilters.istek} onChange={(e) => setSelectedFilters({...selectedFilters, istek: e.target.value})}>
                      <option value="">TÜMÜ</option>
                      {filterOptions.istek.map(opt => <option key={opt} value={opt}>{opt.toUpperCase()}</option>)}
                    </select>
                  </div>
                </th>
                <th className="px-6 py-7 w-[260px] relative" ref={paramDropdownRef}>
                  <div className="flex flex-col gap-2">
                    <span>Parametreler</span>
                    <div onClick={() => setIsParamDropdownOpen(!isParamDropdownOpen)} className="text-[11px] text-[#2D5A56] font-bold cursor-pointer uppercase flex items-center justify-between bg-gray-50/50 px-2 py-1 rounded border border-transparent hover:border-gray-200 transition-all">
                      {selectedFilters.parametre.length > 0 ? `${selectedFilters.parametre.length} SEÇİLDİ` : "TÜMÜ"}
                      <span className="text-[8px] opacity-40 ml-2">▼</span>
                    </div>
                    {isParamDropdownOpen && (
                      <div className="absolute top-full left-0 mt-1 w-[320px] bg-white shadow-2xl border border-gray-100 rounded-xl p-4 z-[1000] animate-in fade-in zoom-in duration-200">
                        <div className="max-h-[250px] overflow-y-auto space-y-1 pr-2">
                          {filterOptions.parametre.map(opt => (
                            <label key={opt} className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded-lg cursor-pointer transition-colors group">
                              <input type="checkbox" className="w-4 h-4 accent-[#2D5A56] rounded border-gray-300 cursor-pointer" checked={selectedFilters.parametre.includes(opt)} onChange={(e) => {
                                const isChecked = e.target.checked;
                                const newParams = isChecked ? [...selectedFilters.parametre, opt] : selectedFilters.parametre.filter(p => p !== opt);
                                setSelectedFilters({...selectedFilters, parametre: newParams});
                              }} />
                              <span className="text-[11px] font-medium text-gray-700 normal-case group-hover:text-[#2D5A56]">{opt}</span>
                            </label>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </th>
                <th className="px-6 py-7 w-[150px]">
                  <div className="flex flex-col gap-2">
                    <span>Son Kullanım</span>
                    <select className="bg-transparent border-none text-[11px] text-[#2D5A56] outline-none font-bold cursor-pointer uppercase p-0" value={selectedFilters.sonKullanim} onChange={(e) => setSelectedFilters({...selectedFilters, sonKullanim: e.target.value})}>
                      <option value="">TÜMÜ</option>
                      {filterOptions.sonKullanim.map(opt => <option key={opt} value={opt}>{opt.toUpperCase()}</option>)}
                    </select>
                  </div>
                </th>
                <th className="px-6 py-7 text-right w-[180px]">Sistem Tarihi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {currentItems.map((survey) => (
                <tr 
                  key={survey.id} 
                  // SON DÜZENLEME: Satıra tıklanınca Modalı açıyoruz
                  onClick={() => setSelectedUser({ isOpen: true, id: survey.userId })}
                  className="hover:bg-blue-50/30 transition-all cursor-pointer group text-left"
                >
                  <td className="px-6 py-8 text-xs font-mono text-gray-400">#{survey.id?.substring(0, 10).toUpperCase()}</td>
                  <td className="px-6 py-8 font-medium text-gray-700 text-left">{survey.answers?.["0"]}</td>
                  <td className="px-6 py-8 text-left">
                    <span className={`px-5 py-2 rounded-full text-[10px] font-bold tracking-tighter ${survey.answers?.["1"] >= 4 ? 'bg-red-50 text-red-600' : 'bg-[#E1E9E8] text-[#2D5A56]'}`}>
                      SEVİYE {survey.answers?.["1"]}
                    </span>
                  </td>
                  <td className="px-6 py-8 text-sm italic text-gray-400 truncate max-w-[200px]" title={Array.isArray(survey.answers?.["3"]) ? survey.answers["3"].join(", ") : ""}>
                    {Array.isArray(survey.answers?.["3"]) ? survey.answers["3"].join(", ") : survey.answers?.["3"] || "Belirtilmedi"}
                  </td>
                  <td className="px-6 py-8 text-sm font-medium text-slate-600 italic text-left">
                    {survey.answers?.["2"] || "Veri Yok"} 
                  </td>
                  <td className="px-6 py-8 text-[11px] text-gray-400 font-medium text-right uppercase">
                    {survey.createdAt?.seconds ? new Date(survey.createdAt.seconds * 1000).toLocaleString('tr-TR') : "-"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Sayfalama */}
        {totalPages > 1 && (
          <div className="p-8 bg-gray-50/30 border-t border-gray-100 flex justify-center items-center gap-4">
            <button 
              disabled={currentPage === 1}
              onClick={(e) => { e.stopPropagation(); setCurrentPage(prev => prev - 1); }}
              className="px-4 py-2 text-xs font-bold text-[#2D5A56] uppercase tracking-widest disabled:opacity-30 transition-all"
            >
              Geri
            </button>
            <div className="flex gap-2">
              {[...Array(totalPages)].map((_, i) => (
                <button
                  key={i + 1}
                  onClick={(e) => { e.stopPropagation(); setCurrentPage(i + 1); }}
                  className={`w-8 h-8 rounded-full text-[10px] font-bold transition-all ${
                    currentPage === i + 1 
                      ? 'bg-[#2D5A56] text-white shadow-md' 
                      : 'bg-white text-gray-400 hover:bg-gray-100'
                  }`}
                >
                  {i + 1}
                </button>
              ))}
            </div>
            <button 
              disabled={currentPage === totalPages}
              onClick={(e) => { e.stopPropagation(); setCurrentPage(prev => prev + 1); }}
              className="px-4 py-2 text-xs font-bold text-[#2D5A56] uppercase tracking-widest disabled:opacity-30 transition-all"
            >
              İleri
            </button>
          </div>
        )}
      </div>
    </AppFrame>
  );
};

export default Dashboard;