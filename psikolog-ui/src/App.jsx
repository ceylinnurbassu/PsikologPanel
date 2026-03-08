import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./firebase";

import Login from "./Login";
import Dashboard from "./Dashboard";
import SifreDegistir from './SifreDegistir'; // YENİ EKLE
function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    return () => unsub();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen italic text-gray-400">
        Oturum doğrulanıyor...
      </div>
    );
  }

  return (
    <Router>
      <Routes>

        {/* LOGIN */}
        <Route
          path="/login"
          element={!user ? <Login /> : <Navigate to="/" />}
        />

        {/* ANA SAYFA / DASHBOARD */}
        <Route
          path="/"
          element={user ? <Dashboard /> : <Navigate to="/login" />}
        />

        {/* FALLBACK */}
        <Route
          path="*"
          element={<Navigate to={user ? "/" : "/login"} />}
        />
        <Route path="/sifre-degistir" element={<SifreDegistir />} /> {/* YENİ EKLE */}
    </Routes>
    </Router>
  );
}

export default App;
