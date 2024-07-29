import React from 'react';
import { Inter } from 'next/font/google';
import Link from 'next/link';
import './globals.css';
import Image from 'next/image';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'Admin Dashboard',
  description: 'Manage ships, shipments, and details',
};

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <html lang="en">
      <body className={`${inter.className} flex flex-col min-h-screen`}>
        <header className="bg-gradient-to-r from-white to-blue-400 text-blue-950 shadow-lg">
          <div className="container mx-auto px-4 py-4 flex justify-between items-center">
            <Link href="/" className="text-2xl font-bold">
              <Image
                    src="/logo.png"
                    width={200}
                    height={200}
                    alt="Company Logo"
                    className="max-w-[150px] md:max-w-[200px] cursor-pointer" // Add cursor-pointer for visual cue
              />
            </Link>
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