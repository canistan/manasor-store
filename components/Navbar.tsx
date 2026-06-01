"use client";

import Link from 'next/link';
import { ShoppingBag, Menu, X, Search, User } from 'lucide-react';
import { useCartStore } from '@/store/useCartStore';
import { useState, useEffect } from 'react';

export default function Navbar() {
  const { getCartCount, openDrawer } = useCartStore();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    setMounted(true);
    
    // Check Auth Status
    const checkAuth = async () => {
      try {
        const res = await fetch('/api/customers/me');
        if (res.ok) {
          const data = await res.json();
          if (data?.user) {
            setIsLoggedIn(true);
          }
        }
      } catch (e) {
        // ignore errors for navbar
      }
    };
    
    checkAuth();
  }, []);

  return (
    <nav className="sticky top-0 z-40 w-full bg-cream/95 backdrop-blur-md border-b border-olive-100 shadow-sm transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center">
            <Link href="/" className="text-3xl font-serif text-olive-900 tracking-tight">
              MANASOR
            </Link>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex space-x-8 items-center">
            <Link href="/" className="text-olive-700 hover:text-gold-500 transition-colors font-medium">Ana Sayfa</Link>
            <Link href="/products" className="text-olive-700 hover:text-gold-500 transition-colors font-medium">Ürünlerimiz</Link>
            <Link href="/about" className="text-olive-700 hover:text-gold-500 transition-colors font-medium">Hakkımızda</Link>
            <Link href="/contact" className="text-olive-700 hover:text-gold-500 transition-colors font-medium">İletişim</Link>
          </div>

          {/* Icons & Mobile menu button */}
          <div className="flex items-center space-x-2 md:space-x-4">
            <Link href="/dashboard" className="flex items-center space-x-2 p-2 text-olive-900 hover:text-gold-500 transition-colors hidden md:flex" aria-label="Hesabım">
              <User className="w-5 h-5" />
              <span className="text-sm font-medium">
                {!mounted ? "Giriş Yap" : (isLoggedIn ? "Hesabım" : "Giriş Yap / Üye Ol")}
              </span>
            </Link>
            <button 
              onClick={openDrawer}
              className="relative p-2 text-olive-900 hover:text-gold-500 transition-colors"
              aria-label="Sepeti Aç"
            >
              <ShoppingBag className="w-6 h-6" />
              {mounted && getCartCount() > 0 && (
                <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/4 -translate-y-1/4 bg-gold-500 rounded-full">
                  {getCartCount()}
                </span>
              )}
            </button>
            
            <div className="md:hidden flex items-center">
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="text-olive-900 hover:text-gold-500 p-2"
              >
                {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-cream border-b border-olive-100">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <Link 
              href="/" 
              className="block px-3 py-2 text-olive-700 hover:text-gold-500 hover:bg-olive-50 rounded-md font-medium"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Ana Sayfa
            </Link>
            <Link 
              href="/products" 
              className="block px-3 py-2 text-olive-700 hover:text-gold-500 hover:bg-olive-50 rounded-md font-medium"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Ürünlerimiz
            </Link>
            <Link 
              href="/about" 
              className="block px-3 py-2 text-olive-700 hover:text-gold-500 hover:bg-olive-50 rounded-md font-medium"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Hakkımızda
            </Link>
            <Link 
              href="/contact" 
              className="block px-3 py-2 text-olive-700 hover:text-gold-500 hover:bg-olive-50 rounded-md font-medium"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              İletişim
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
