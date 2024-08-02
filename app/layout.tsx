'use client'

import React, { useState } from 'react';
import { Inter } from 'next/font/google';
import Link from 'next/link';
import './globals.css';
import Image from 'next/image';
import { Menu, X } from 'lucide-react';

const inter = Inter({ subsets: ['latin'] });


const Layout = ({ children }: { children: React.ReactNode }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <html lang="en">
      <body className={`${inter.className} flex flex-col min-h-screen`}>
        <header className="bg-gradient-to-r from-white to-blue-400 text-blue-950 shadow-lg">
          <div className="container mx-auto px-4 py-4">
            <div className="flex justify-between items-center">
              <Link href="/" className="text-2xl font-bold">
                <Image
                  src="/logo.png"
                  width={200}
                  height={200}
                  alt="Company Logo"
                  className="max-w-[150px] md:max-w-[200px] cursor-pointer"
                />
              </Link>
              <div className="md:hidden">
                <button onClick={toggleMenu} className="text-blue-950">
                  {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
              </div>
              <nav className="hidden md:flex space-x-4">
                <Link href="/ship" className="hover:text-blue-700">Ship</Link>
                <Link href="/shipment" className="hover:text-blue-700">Shipment</Link>
                <Link href="/details" className="hover:text-blue-700">Details</Link>
              </nav>
            </div>
            {isMenuOpen && (
              <nav className="md:hidden mt-4 flex flex-col space-y-2">
                <Link href="/ship" className="hover:text-blue-700">Ship</Link>
                <Link href="/shipment" className="hover:text-blue-700">Shipment</Link>
                <Link href="/details" className="hover:text-blue-700">Details</Link>
              </nav>
            )}
          </div>
        </header>

        <main className="flex-grow container mx-auto px-4 py-8">
          {children}
        </main>

        <footer className="bg-gray-800 text-white">
          <div className="container mx-auto px-4 py-4 text-center">
            <p>&copy; 2024 PT Tianyi Decoration Construcion. All rights reserved.</p>
          </div>
        </footer>
      </body>
    </html>
  );
};

export default Layout;