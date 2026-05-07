import { useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';

import ThemeProvider from './components/ThemeProvider';
import ToastProvider from './components/Toast';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ManageReportModal from './components/ManageReportModal';

import Home from './pages/Home';
import ReportForm from './pages/ReportForm';
import CompanyProfile from './pages/CompanyProfile';

function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

function AnimatedRoutes() {
  const location = useLocation();
  
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<Home />} />
        <Route path="/report" element={<ReportForm />} />
        <Route path="/company/:name" element={<CompanyProfile />} />
      </Routes>
    </AnimatePresence>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <ToastProvider>
        <BrowserRouter>
          <ScrollToTop />
          <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
            <Navbar />
            <main style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
              <AnimatedRoutes />
            </main>
            <Footer />
            <ManageReportModal />
          </div>
        </BrowserRouter>
      </ToastProvider>
    </ThemeProvider>
  );
}
