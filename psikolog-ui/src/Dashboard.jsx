

// import { useEffect, useState, useRef } from 'react';
// import api from './api/axios';
// import AppFrame from './components/AppFrame';
// import { 
//   PieChart, Pie, Cell, ResponsiveContainer, Tooltip, 
//   AreaChart, Area, XAxis, YAxis, CartesianGrid, Legend,
//   BarChart, Bar
// } from 'recharts';

// const filterOptions = {
//   duygu: ["Korku", "Üzüntü", "Öfke", "Tiksinti", "Utanç", "Coşku", "Şaşkınlık", "Hiçbiri"],
//   istek: ["1 (Yok)", "2 (Az)", "3 (Orta)", "4 (Fazla)", "5 (Çok Fazla)"],
//   sonKullanim: ["0-1 Saat önce", "1-3 Saat önce", "3-6 Saat önce", "6-12 Saat önce", "12-24 Saat önce", "1 Gün ve üzeri zaman önce"],
//   parametre: ["Esrar", "Eroin", "Kokain", "Sentetik kannobinoidler (Bonzai, jamaika)", "Amfetamin ve türevleri (Metanfetamin)", "Uçucular (Bali, tiner, çakmak gazı vb.)", "Pregabalin", "LSD", "Hiçbiri"]
// };

// const AnalysisCharts = ({ data }) => {
//   const totalReports = data.length;

//   // 1. Grafik: Duygu Durum Analizi (Pie)
//   const emotionCounts = data.reduce((acc, curr) => {
//     const emotion = curr.answers?.["0"] || "Belirtilmedi";
//     acc[emotion] = (acc[emotion] || 0) + 1;
//     return acc;
//   }, {});

//   const pieData = Object.keys(emotionCounts).map(name => ({
//     name, value: emotionCounts[name]
//   }));

//   // 2. Grafik: Semptom Trend Takibi (Area)
//   const trendData = [...data]
//     .sort((a, b) => (a.createdAt?.seconds || 0) - (b.createdAt?.seconds || 0))
//     .map(survey => ({
//       tarih: survey.createdAt?.seconds 
//         ? new Date(survey.createdAt.seconds * 1000).toLocaleDateString('tr-TR') 
//         : "Bilinmiyor",
//       istek: Number(survey.answers?.["1"]) || 0 
//     }));

//   // 3. Grafik: Madde Bazlı Ortalama İstek Şiddeti (Bar)
//   const substanceAnalysis = data.reduce((acc, curr) => {
//     const substances = Array.isArray(curr.answers?.["3"]) ? curr.answers["3"] : [curr.answers?.["3"]];
//     const severity = Number(curr.answers?.["1"]) || 0;
    
//     substances.forEach(sub => {
//       if (sub && sub !== "Hiçbiri") {
//         if (!acc[sub]) acc[sub] = { name: sub, totalSeverity: 0, count: 0 };
//         acc[sub].totalSeverity += severity;
//         acc[sub].count += 1;
//       }
//     });
//     return acc;
//   }, {});

//   const barData = Object.values(substanceAnalysis).map(item => ({
//     name: item.name,
//     ortalamaIstek: (item.totalSeverity / item.count).toFixed(1)
//   }));

//   // 4. Grafik: Son Kullanım Zamanı Dağılımı (Pie - Donut)
//   const timeCounts = data.reduce((acc, curr) => {
//     const time = curr.answers?.["2"] || "Belirtilmedi";
//     acc[time] = (acc[time] || 0) + 1;
//     return acc;
//   }, {});

//   const timePieData = Object.keys(timeCounts).map(name => ({
//     name, value: timeCounts[name]
//   }));

//   const COLORS = ['#2D5A56', '#5E8B87', '#92B4B1', '#C5D6D4', '#E1E9E8'];

//   // Tooltip için Yüzdelik Oran Formatlayıcı
//   const formatTooltipValue = (value) => {
//     const percent = ((value / totalReports) * 100).toFixed(1);
//     return `${value} Rapor (%${percent})`;
//   };

//   return (
//     <div className="w-full space-y-8 mb-12">
//       <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
//         {/* DUYGU ANALİZİ GRAFİĞİ - GENİŞLETİLDİ VE TEMİZLENDİ */}
//         <div className="xl:col-span-1 bg-white p-6 rounded-lg shadow-sm border border-gray-100 flex flex-col justify-center overflow-hidden">
//           <h3 className="text-xl font-medium mb-4 text-[#2D5A56] italic border-l-4 border-[#2D5A56] pl-4">Duygu Analizi</h3>
//           <div style={{ width: '100%', height: 320 }}>
//             <ResponsiveContainer>
//               <PieChart>
//                 <Pie 
//                   data={pieData} 
//                   innerRadius={65} 
//                   outerRadius={90} 
//                   paddingAngle={5} 
//                   dataKey="value"
//                   label={({ name }) => name} // Sadece isim görünüyor, sayılar temizlendi
//                   labelLine={true}
//                 >
//                   {pieData.map((entry, index) => <Cell key={index} fill={COLORS[index % COLORS.length]} />)}
//                 </Pie>
//                 <Tooltip formatter={formatTooltipValue} /> {/* İmleç gelince yüzdelik görünür */}
//                 <Legend verticalAlign="bottom" wrapperStyle={{paddingTop: '10px'}} />
//               </PieChart>
//             </ResponsiveContainer>
//           </div>
//         </div>
        
//         <div className="xl:col-span-2 bg-white p-8 rounded-lg shadow-sm border border-gray-100">
//           <h3 className="text-xl font-medium mb-6 text-[#2D5A56] italic border-l-4 border-[#2D5A56] pl-4">Semptom Trend Takibi</h3>
//           <div style={{ width: '100%', height: 300 }}>
//             <ResponsiveContainer>
//               <AreaChart data={trendData}>
//                 <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#EDF2F1" />
//                 <XAxis dataKey="tarih" fontSize={11} tickMargin={10} axisLine={false} tickLine={false} />
//                 <YAxis domain={[0, 5]} fontSize={11} axisLine={false} tickLine={false} />
//                 <Tooltip />
//                 <Area type="monotone" dataKey="istek" stroke="#2D5A56" fill="#2D5A56" fillOpacity={0.1} strokeWidth={2} />
//               </AreaChart>
//             </ResponsiveContainer>
//           </div>
//         </div>
//       </div>

//       <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
//         <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-100">
//           <h3 className="text-xl font-medium mb-6 text-[#2D5A56] italic border-l-4 border-[#2D5A56] pl-4">Madde Bazlı İstek Şiddeti</h3>
//           <div style={{ width: '100%', height: 300 }}>
//             <ResponsiveContainer>
//               <BarChart data={barData}>
//                 <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#EDF2F1" />
//                 <XAxis dataKey="name" fontSize={10} axisLine={false} tickLine={false} />
//                 <YAxis domain={[0, 5]} fontSize={11} axisLine={false} tickLine={false} />
//                 <Tooltip cursor={{fill: '#f8fafc'}} />
//                 <Bar dataKey="ortalamaIstek" fill="#2D5A56" radius={[4, 4, 0, 0]} barSize={35} />
//               </BarChart>
//             </ResponsiveContainer>
//           </div>
//         </div>
//         <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-100">
//           <h3 className="text-xl font-medium mb-6 text-[#2D5A56] italic border-l-4 border-[#2D5A56] pl-4">Son Kullanım Zamanı Dağılımı</h3>
//           <div style={{ width: '100%', height: 300 }}>
//             <ResponsiveContainer>
//               <PieChart>
//                 <Pie data={timePieData} innerRadius={0} outerRadius={90} dataKey="value" labelLine={false} label={({name, percent}) => `${name} ${(percent * 100).toFixed(0)}%`}>
//                   {timePieData.map((entry, index) => <Cell key={index} fill={COLORS[index % COLORS.length]} />)}
//                 </Pie>
//                 <Tooltip formatter={formatTooltipValue} />
//               </PieChart>
//             </ResponsiveContainer>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// const Dashboard = () => {
//   const [surveys, setSurveys] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [isParamDropdownOpen, setIsParamDropdownOpen] = useState(false);
//   const paramDropdownRef = useRef(null);
  
//   const [selectedFilters, setSelectedFilters] = useState({
//     duygu: '',
//     istek: '',
//     sonKullanim: '',
//     parametre: []
//   });

//   useEffect(() => {
//     const handleClickOutside = (event) => {
//       if (paramDropdownRef.current && !paramDropdownRef.current.contains(event.target)) {
//         setIsParamDropdownOpen(false);
//       }
//     };
//     document.addEventListener("mousedown", handleClickOutside);
//     return () => document.removeEventListener("mousedown", handleClickOutside);
//   }, []);

//   const filteredSurveys = surveys
//     .filter(survey => {
//       const selectedIstekMapped = selectedFilters.istek.split(' ')[0];
//       const surveyParams = Array.isArray(survey.answers?.["3"]) ? survey.answers["3"] : [survey.answers?.["3"]];
//       const matchesParametre = selectedFilters.parametre.length === 0 || 
//         selectedFilters.parametre.some(p => surveyParams.includes(p));

//       return (
//         (selectedFilters.duygu === '' || survey.answers?.["0"] === selectedFilters.duygu) &&
//         (selectedFilters.istek === '' || String(survey.answers?.["1"]) === selectedIstekMapped) &&
//         (selectedFilters.sonKullanim === '' || survey.answers?.["2"] === selectedFilters.sonKullanim) &&
//         matchesParametre
//       );
//     })
//     .sort((a, b) => (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0));

//   useEffect(() => {
//     const fetchSurveys = async () => {
//       try {
//         const response = await api.get('/api/Analysis/surveys');
//         setSurveys(response.data);
//       } catch (error) {
//         console.error("Veri çekme hatası:", error);
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchSurveys();
//   }, []);

//   if (loading) return <div className="text-center py-20 italic font-mono text-[#2D5A56]">Analizler hazırlanıyor...</div>;

//   return (
//     <AppFrame>
//       <header className="mb-12 border-b border-gray-200 pb-8 text-left">
//         <h1 className="text-5xl font-light text-[#2D5A56] mb-4 italic tracking-tight uppercase">Vaka Analizleri</h1>
//         <p className="text-xl text-gray-500 max-w-5xl font-light leading-relaxed">Sisteme kayıtlı anonim vakaların madde kullanım döngüleri ve psikometrik raporları.</p>
//       </header>

//       <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
//         <div className="bg-white border-l-4 border-[#2D5A56] p-8 rounded-lg shadow-sm text-left">
//           <p className="text-xs uppercase tracking-widest text-gray-400 mb-2 font-bold">Toplam Rapor</p>
//           <h2 className="text-4xl font-light italic text-[#2D5A56]">{surveys.length}</h2>
//         </div>
//       </div>

//       <AnalysisCharts data={filteredSurveys} />

//       <div className="bg-white rounded-[32px] shadow-sm border border-gray-100 overflow-hidden w-full mt-10 mb-20">
//         <div className="p-10 bg-gray-50/30 border-b border-gray-100 flex justify-between items-center">
//           <h2 className="text-2xl font-medium text-[#2D5A56] italic border-l-4 border-[#2D5A56] pl-5 uppercase tracking-tighter">Detaylı Yanıt Listesi</h2>
//           <div className="flex gap-4">
//             <button 
//                 onClick={() => setSelectedFilters({ duygu: '', istek: '', sonKullanim: '', parametre: [] })}
//                 className="text-[#2D5A56] text-[10px] font-bold border border-[#2D5A56] px-6 py-2 rounded-full hover:bg-[#2D5A56] hover:text-white transition-all uppercase tracking-widest"
//             >
//                 Filtreleri Sıfırla
//             </button>
//           </div>
//         </div>
        
//         <div className="w-full overflow-x-auto text-left">
//           <table className="w-full text-left border-collapse table-fixed">
//             <thead>
//               <tr className="bg-gray-50/50 text-[11px] uppercase tracking-[0.2em] text-gray-400 font-bold border-b text-left">
//                 <th className="px-6 py-7 w-[120px]">Kayıt No</th>
//                 <th className="px-6 py-7 w-[160px]">
//                   <div className="flex flex-col gap-2">
//                     <span>Baskın Duygu</span>
//                     <select className="bg-transparent border-none text-[11px] text-[#2D5A56] outline-none font-bold cursor-pointer uppercase p-0" value={selectedFilters.duygu} onChange={(e) => setSelectedFilters({...selectedFilters, duygu: e.target.value})}>
//                       <option value="">TÜMÜ</option>
//                       {filterOptions.duygu.map(opt => <option key={opt} value={opt}>{opt.toUpperCase()}</option>)}
//                     </select>
//                   </div>
//                 </th>
//                 <th className="px-6 py-7 w-[160px]">
//                   <div className="flex flex-col gap-2">
//                     <span>İstek Şiddeti</span>
//                     <select className="bg-transparent border-none text-[11px] text-[#2D5A56] outline-none font-bold cursor-pointer uppercase p-0" value={selectedFilters.istek} onChange={(e) => setSelectedFilters({...selectedFilters, istek: e.target.value})}>
//                       <option value="">TÜMÜ</option>
//                       {filterOptions.istek.map(opt => <option key={opt} value={opt}>{opt.toUpperCase()}</option>)}
//                     </select>
//                   </div>
//                 </th>
//                 <th className="px-6 py-7 w-[260px] relative" ref={paramDropdownRef}>
//                   <div className="flex flex-col gap-2">
//                     <span>Parametreler</span>
//                     <div onClick={() => setIsParamDropdownOpen(!isParamDropdownOpen)} className="text-[11px] text-[#2D5A56] font-bold cursor-pointer uppercase flex items-center justify-between bg-gray-50/50 px-2 py-1 rounded border border-transparent hover:border-gray-200 transition-all">
//                       {selectedFilters.parametre.length > 0 ? `${selectedFilters.parametre.length} SEÇİLDİ` : "TÜMÜ"}
//                       <span className="text-[8px] opacity-40 ml-2">▼</span>
//                     </div>
//                     {isParamDropdownOpen && (
//                       <div className="absolute top-full left-0 mt-1 w-[320px] bg-white shadow-2xl border border-gray-100 rounded-xl p-4 z-[1000] animate-in fade-in zoom-in duration-200">
//                         <div className="max-h-[250px] overflow-y-auto space-y-1 pr-2">
//                           {filterOptions.parametre.map(opt => (
//                             <label key={opt} className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded-lg cursor-pointer transition-colors group">
//                               <input type="checkbox" className="w-4 h-4 accent-[#2D5A56] rounded border-gray-300 cursor-pointer" checked={selectedFilters.parametre.includes(opt)} onChange={(e) => {
//                                 const isChecked = e.target.checked;
//                                 const newParams = isChecked ? [...selectedFilters.parametre, opt] : selectedFilters.parametre.filter(p => p !== opt);
//                                 setSelectedFilters({...selectedFilters, parametre: newParams});
//                               }} />
//                               <span className="text-[11px] font-medium text-gray-700 normal-case group-hover:text-[#2D5A56]">{opt}</span>
//                             </label>
//                           ))}
//                         </div>
//                       </div>
//                     )}
//                   </div>
//                 </th>
//                 <th className="px-6 py-7 w-[150px]">
//                   <div className="flex flex-col gap-2">
//                     <span>Son Kullanım</span>
//                     <select className="bg-transparent border-none text-[11px] text-[#2D5A56] outline-none font-bold cursor-pointer uppercase p-0" value={selectedFilters.sonKullanim} onChange={(e) => setSelectedFilters({...selectedFilters, sonKullanim: e.target.value})}>
//                       <option value="">TÜMÜ</option>
//                       {filterOptions.sonKullanim.map(opt => <option key={opt} value={opt}>{opt.toUpperCase()}</option>)}
//                     </select>
//                   </div>
//                 </th>
//                 <th className="px-6 py-7 text-right w-[180px]">Sistem Tarihi</th>
//               </tr>
//             </thead>
//             <tbody className="divide-y divide-gray-50">
//               {filteredSurveys.map((survey) => (
//                 <tr key={survey.id} className="hover:bg-gray-50/40 transition-colors group text-left">
//                   <td className="px-6 py-8 text-xs font-mono text-gray-400">#{survey.id?.substring(0, 10).toUpperCase()}</td>
//                   <td className="px-6 py-8 font-medium text-gray-700">{survey.answers?.["0"]}</td>
//                   <td className="px-6 py-8">
//                     <span className={`px-5 py-2 rounded-full text-[10px] font-bold tracking-tighter ${survey.answers?.["1"] >= 4 ? 'bg-red-50 text-red-600' : 'bg-[#E1E9E8] text-[#2D5A56]'}`}>
//                       SEVİYE {survey.answers?.["1"]}
//                     </span>
//                   </td>
//                   <td className="px-6 py-8 text-sm italic text-gray-400 truncate max-w-[200px]" title={Array.isArray(survey.answers?.["3"]) ? survey.answers["3"].join(", ") : ""}>
//                     {Array.isArray(survey.answers?.["3"]) ? survey.answers["3"].join(", ") : "Belirtilmedi"}
//                   </td>
//                   <td className="px-6 py-8 text-sm font-medium text-slate-600 italic">
//                     {survey.answers?.["2"] || "Veri Yok"} 
//                   </td>
//                   <td className="px-6 py-8 text-[11px] text-gray-400 font-medium text-right">
//                     {survey.createdAt?.seconds ? new Date(survey.createdAt.seconds * 1000).toLocaleString('tr-TR') : "-"}
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       </div>
//     </AppFrame>
//   );
// };

// export default Dashboard;

import { useEffect, useState, useRef } from 'react';
import api from './api/axios';
import AppFrame from './components/AppFrame';
import { 
  PieChart, Pie, Cell, ResponsiveContainer, Tooltip, 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Legend,
  BarChart, Bar
} from 'recharts';

const filterOptions = {
  duygu: ["Korku", "Üzüntü", "Öfke", "Tiksinti", "Utanç", "Coşku", "Şaşkınlık", "Hiçbiri"],
  istek: ["1 (Yok)", "2 (Az)", "3 (Orta)", "4 (Fazla)", "5 (Çok Fazla)"],
  sonKullanim: ["0-1 Saat önce", "1-3 Saat önce", "3-6 Saat önce", "6-12 Saat önce", "12-24 Saat önce", "1 Gün ve üzeri zaman önce"],
  parametre: ["Esrar", "Eroin", "Kokain", "Sentetik kannobinoidler (Bonzai, jamaika)", "Amfetamin ve türevleri (Metanfetamin)", "Uçucular (Bali, tiner, çakmak gazı vb.)", "Pregabalin", "LSD", "Hiçbiri"]
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

  const COLORS = ['#2D5A56', '#5E8B87', '#92B4B1', '#C5D6D4', '#E1E9E8'];

  const formatTooltipValue = (value) => {
    const percent = totalReports > 0 ? ((value / totalReports) * 100).toFixed(1) : 0;
    return `${value} Rapor (%${percent})`;
  };

  return (
    <div className="w-full space-y-8 mb-12">
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-1 bg-white p-6 rounded-lg shadow-sm border border-gray-100 flex flex-col justify-center overflow-hidden">
          <h3 className="text-xl font-medium mb-4 text-[#2D5A56] italic border-l-4 border-[#2D5A56] pl-4">Duygu Analizi</h3>
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
          <h3 className="text-xl font-medium mb-6 text-[#2D5A56] italic border-l-4 border-[#2D5A56] pl-4">Semptom Trend Takibi</h3>
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
          <h3 className="text-xl font-medium mb-6 text-[#2D5A56] italic border-l-4 border-[#2D5A56] pl-4">Madde Bazlı İstek Şiddeti</h3>
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
          <h3 className="text-xl font-medium mb-6 text-[#2D5A56] italic border-l-4 border-[#2D5A56] pl-4">Son Kullanım Zamanı Dağılımı</h3>
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

  // Pagination Stateleri
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

  // Filtrelenmiş ve Sıralanmış Veri
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

  // Pagination Mantığı: Mevcut sayfadaki verileri dilimle
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredSurveys.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredSurveys.length / itemsPerPage);

  // Filtre değiştiğinde 1. sayfaya dön
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

  if (loading) return <div className="text-center py-20 italic font-mono text-[#2D5A56]">Analizler hazırlanıyor...</div>;

  return (
    <AppFrame>
      <header className="mb-12 border-b border-gray-200 pb-8 text-left">
        <h1 className="text-5xl font-light text-[#2D5A56] mb-4 italic tracking-tight uppercase">Vaka Analizleri</h1>
        <p className="text-xl text-gray-500 max-w-5xl font-light leading-relaxed">Sisteme kayıtlı anonim vakaların madde kullanım döngüleri ve psikometrik raporları.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
        <div className="bg-white border-l-4 border-[#2D5A56] p-8 rounded-lg shadow-sm text-left">
          <p className="text-xs uppercase tracking-widest text-gray-400 mb-2 font-bold">Toplam Rapor</p>
          <h2 className="text-4xl font-light italic text-[#2D5A56]">{surveys.length}</h2>
        </div>
      </div>

      <AnalysisCharts data={filteredSurveys} />

      <div className="bg-white rounded-[32px] shadow-sm border border-gray-100 overflow-hidden w-full mt-10 mb-20">
        <div className="p-10 bg-gray-50/30 border-b border-gray-100 flex justify-between items-center">
          <h2 className="text-2xl font-medium text-[#2D5A56] italic border-l-4 border-[#2D5A56] pl-5 uppercase tracking-tighter">Detaylı Yanıt Listesi</h2>
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
          <table className="w-full text-left border-collapse table-fixed">
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
              {/* filteredSurveys yerine currentItems map ediliyor */}
              {currentItems.map((survey) => (
                <tr key={survey.id} className="hover:bg-gray-50/40 transition-colors group text-left">
                  <td className="px-6 py-8 text-xs font-mono text-gray-400">#{survey.id?.substring(0, 10).toUpperCase()}</td>
                  <td className="px-6 py-8 font-medium text-gray-700">{survey.answers?.["0"]}</td>
                  <td className="px-6 py-8 text-left">
                    <span className={`px-5 py-2 rounded-full text-[10px] font-bold tracking-tighter ${survey.answers?.["1"] >= 4 ? 'bg-red-50 text-red-600' : 'bg-[#E1E9E8] text-[#2D5A56]'}`}>
                      SEVİYE {survey.answers?.["1"]}
                    </span>
                  </td>
                  <td className="px-6 py-8 text-sm italic text-gray-400 truncate max-w-[200px]" title={Array.isArray(survey.answers?.["3"]) ? survey.answers["3"].join(", ") : ""}>
                    {Array.isArray(survey.answers?.["3"]) ? survey.answers["3"].join(", ") : "Belirtilmedi"}
                  </td>
                  <td className="px-6 py-8 text-sm font-medium text-slate-600 italic">
                    {survey.answers?.["2"] || "Veri Yok"} 
                  </td>
                  <td className="px-6 py-8 text-[11px] text-gray-400 font-medium text-right">
                    {survey.createdAt?.seconds ? new Date(survey.createdAt.seconds * 1000).toLocaleString('tr-TR') : "-"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* SAYFALAMA KONTROLLERİ */}
        {totalPages > 1 && (
          <div className="p-8 bg-gray-50/30 border-t border-gray-100 flex justify-center items-center gap-4">
            <button 
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(prev => prev - 1)}
              className="px-4 py-2 text-xs font-bold text-[#2D5A56] uppercase tracking-widest disabled:opacity-30"
            >
              Geri
            </button>
            <div className="flex gap-2">
              {[...Array(totalPages)].map((_, i) => (
                <button
                  key={i + 1}
                  onClick={() => setCurrentPage(i + 1)}
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
              onClick={() => setCurrentPage(prev => prev + 1)}
              className="px-4 py-2 text-xs font-bold text-[#2D5A56] uppercase tracking-widest disabled:opacity-30"
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