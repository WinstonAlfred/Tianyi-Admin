'use client'

import React, { useState } from 'react';
import Link from 'next/link';
import { Layers, Anchor, FileText, Menu, X, Globe } from 'lucide-react';
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

type Language = 'en' | 'zh' | 'id';

interface TranslationStrings {
  title: string;
  welcome: string;
  selectCategory: string;
  ships: string;
  shipments: string;
  details: string;
  menuAbove: string;
  leftPanel: string;
}

const translations: Record<Language, TranslationStrings> = {
  en: {
    title: "Admin Dashboard",
    welcome: "Welcome to your Dashboard",
    selectCategory: "Select a category from the {0} to manage your data.",
    ships: "Ships",
    shipments: "Shipments",
    details: "Details",
    menuAbove: "menu above",
    leftPanel: "left panel",
  },
  zh: {
    title: "管理员仪表板",
    welcome: "欢迎来到您的仪表板",
    selectCategory: "从{0}选择一个类别来管理您的数据。",
    ships: "船舶",
    shipments: "货运",
    details: "详情",
    menuAbove: "上方菜单",
    leftPanel: "左侧面板",
  },
  id: {
    title: "Dasbor Admin",
    welcome: "Selamat datang di Dasbor Anda",
    selectCategory: "Pilih kategori dari {0} untuk mengelola data Anda.",
    ships: "Kapal",
    shipments: "Pengiriman",
    details: "Detail",
    menuAbove: "menu di atas",
    leftPanel: "panel kiri",
  },
};

const HomePage: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [language, setLanguage] = useState<Language>('en');

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const changeLanguage = (lang: Language) => {
    setLanguage(lang);
  };

  const t = translations[language];

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-gray-100">
      {/* Mobile Header */}
      <div className="md:hidden bg-white shadow-md p-4 flex justify-between items-center">
        <h1 className="text-xl font-bold text-gray-800">{t.title}</h1>
        <button onClick={toggleMobileMenu} className="text-gray-700">
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Left Panel / Mobile Menu */}
      <div className={`${isMobileMenuOpen ? 'block' : 'hidden'} md:block w-full md:w-64 bg-white shadow-md`}>
        <div className="p-4 hidden md:block">
          <h1 className="text-2xl font-bold text-gray-800">{t.title}</h1>
        </div>
        <nav className="mt-4">
          <NavLink href="/ship" icon={Anchor}>{t.ships}</NavLink>
          <NavLink href="/shipment" icon={Layers}>{t.shipments}</NavLink>
          <NavLink href="/details" icon={FileText}>{t.details}</NavLink>
        </nav>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 p-6 md:p-10">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl md:text-3xl font-semibold text-gray-800">{t.welcome}</h2>
          <div className="flex items-center">
            <Globe className="mr-2" size={20} />
            <select
              value={language}
              onChange={(e) => changeLanguage(e.target.value as Language)}
              className="bg-white border border-gray-300 rounded-md px-2 py-1"
            >
              <option value="en">English</option>
              <option value="zh">中文</option>
              <option value="id">Bahasa Indonesia</option>
            </select>
          </div>
        </div>
        <p className="mt-4 text-gray-600">
          {t.selectCategory.replace('{0}', isMobileMenuOpen ? t.menuAbove : t.leftPanel)}
        </p>
      </div>
    </div>
  );
};

export default HomePage;