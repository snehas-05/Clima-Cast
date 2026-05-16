import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import TopBar from './TopBar';
import Footer from './Footer';
import AtmosphericBackground from './AtmosphericBackground';
import { useAtmosphericStyles } from '../../hooks/useAtmosphericStyles';

export default function DashboardLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  useAtmosphericStyles();

  return (
    <AtmosphericBackground>
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="lg:ml-[280px] min-h-screen flex flex-col main-content-responsive">
        {/* Mobile menu button */}
        <button
          className="lg:hidden fixed top-4 left-4 z-50 p-2 glass-card rounded-xl"
          onClick={() => setSidebarOpen(true)}
        >
          <span className="material-symbols-outlined">menu</span>
        </button>

        <Outlet />
        <Footer />
      </div>
    </AtmosphericBackground>
  );
}
