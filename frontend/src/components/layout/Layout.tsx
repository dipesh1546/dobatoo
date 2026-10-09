import React from 'react';
import type { ReactNode } from 'react';
import { Outlet } from 'react-router-dom';
import { Navbar } from './Navbar/Navbar';
import { Footer } from './Footer/Footer';

interface LayoutProps {
  children?: ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="dobato-app-layout">
      <Navbar />
      <main id="main-content" style={{ flex: 1 }}>
        {children || <Outlet />}
      </main>
      <Footer />
    </div>
  );
};
