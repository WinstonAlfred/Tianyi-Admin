'use client'

import React, { useState } from 'react';
import Link from 'next/link';
import { Layers, Anchor, FileText, Menu, X } from 'lucide-react';
import { LucideIcon } from 'lucide-react';

interface NavLinkProps {
  href: string;
  icon: LucideIcon;
  children: React.ReactNode;
}

const NavLink: React.FC<NavLinkProps> = ({ href, icon: Icon, children }) => (
  <Link href={href} className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-200">
    <Icon className="mr-2" size={20} />
    <span>{children}</span>
  </Link>
);

const HomePage: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-gray-100">
      {/* Mobile Header */}
      <div className="md:hidden bg-white shadow-md p-4 flex justify-between items-center">
        <h1 className="text-xl font-bold text-gray-800">Admin Dashboard</h1>
        <button onClick={toggleMobileMenu} className="text-gray-700">
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Left Panel / Mobile Menu */}
      <div className={`${isMobileMenuOpen ? 'block' : 'hidden'} md:block w-full md:w-64 bg-white shadow-md`}>
        <div className="p-4 hidden md:block">
          <h1 className="text-2xl font-bold text-gray-800">Admin Dashboard</h1>
        </div>
        <nav className="mt-4">
          <NavLink href="/ship" icon={Anchor}>Ships</NavLink>
          <NavLink href="/shipment" icon={Layers}>Shipments</NavLink>
          <NavLink href="/details" icon={FileText}>Details</NavLink>
        </nav>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 p-6 md:p-10">
        <h2 className="text-2xl md:text-3xl font-semibold text-gray-800">Welcome to your Dashboard</h2>
        <p className="mt-4 text-gray-600">Select a category from the {isMobileMenuOpen ? 'menu above' : 'left panel'} to manage your data.</p>
      </div>
    </div>
  );
};

export default HomePage;