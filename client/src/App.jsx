import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import ReportForm from './pages/ReportForm';

export default function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen" style={{ background: 'var(--bg-primary)' }}>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/report" element={<ReportForm />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}
