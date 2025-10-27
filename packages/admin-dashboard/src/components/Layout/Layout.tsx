import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useUIStore } from '@/stores/uiStore';
import Sidebar from './Sidebar';
import Topbar from './Topbar';
import Footer from './Footer';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { sidebarCollapsed, mobileMenuOpen, setMobileMenuOpen } = useUIStore();
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    const checkScreenSize = () => {
      const desktop = window.innerWidth >= 1024;
      setIsDesktop(desktop);
      
      // Close mobile menu when switching to desktop
      if (desktop && mobileMenuOpen) {
        setMobileMenuOpen(false);
      }
    };

    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    return () => window.removeEventListener('resize', checkScreenSize);
  }, [mobileMenuOpen, setMobileMenuOpen]);

  return (
    <div className="flex h-screen bg-[#f2f4f6]">
      {/* Sidebar - Mobile: overlay, Desktop: sidebar */}
      <motion.div
        initial={false}
        animate={{ 
          x: isDesktop ? '0%' : (mobileMenuOpen ? '0%' : '-100%')
        }}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
        className="
          fixed lg:relative
          inset-y-0 left-0
          z-50 lg:z-auto
          w-64 lg:w-auto
        "
      >
        <Sidebar />
      </motion.div>

      {/* Mobile Overlay */}
      {mobileMenuOpen && !isDesktop && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 lg:ml-0">
        {/* Topbar */}
        <Topbar />

        {/* Page Content */}
        <main className="flex-1 overflow-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="min-h-full"
          >
            {children}
          </motion.div>
        </main>

        {/* Footer */}
        <Footer />
      </div>
    </div>
  );
};

export default Layout;
