'use client';

import { useState, useEffect } from 'react';
import { X } from 'lucide-react';

export default function CookieConsent() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    // İlk yüklemede kontrol et
    const consent = localStorage.getItem('cookieConsent');
    if (!consent) {
      setShow(true);
    }

    // Footer'dan gelen eventi dinle
    const handleOpenConsent = () => setShow(true);
    window.addEventListener('openCookieConsent', handleOpenConsent);

    return () => window.removeEventListener('openCookieConsent', handleOpenConsent);
  }, []);

  const handleAccept = () => {
    localStorage.setItem('cookieConsent', 'accepted');
    setShow(false);
  };

  const handleReject = () => {
    localStorage.setItem('cookieConsent', 'rejected');
    setShow(false);
  };

  if (!show) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-[100] p-4 pointer-events-none">
      <div className="max-w-5xl mx-auto bg-white rounded-2xl shadow-2xl border border-olive-100 p-6 md:p-8 pointer-events-auto flex flex-col md:flex-row items-center justify-between gap-6 relative animate-in slide-in-from-bottom-10 duration-500">
        <button 
          onClick={handleReject} 
          className="absolute top-4 right-4 text-olive-400 hover:text-luxury-charcoal transition-colors p-1"
        >
          <X className="w-5 h-5" />
        </button>
        
        <div className="flex-1 pr-6">
          <h3 className="text-lg font-serif text-luxury-charcoal mb-2">Çerez Kullanımı</h3>
          <p className="text-sm text-olive-600 leading-relaxed">
            Sizlere daha iyi bir alışveriş deneyimi sunabilmek, site trafiğimizi analiz etmek ve kişiselleştirilmiş reklamlar gösterebilmek amacıyla çerezler (cookies) kullanmaktayız. Detaylı bilgi için <a href="/kvkk" className="text-gold-600 hover:underline">Çerez Politikamızı</a> inceleyebilirsiniz.
          </p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto flex-shrink-0">
          <button 
            onClick={handleReject}
            className="px-6 py-2.5 rounded-lg border border-olive-200 text-olive-700 font-medium hover:bg-olive-50 transition-colors whitespace-nowrap"
          >
            Reddet
          </button>
          <button 
            onClick={handleAccept}
            className="px-6 py-2.5 rounded-lg bg-olive-900 text-white font-medium hover:bg-gold-500 transition-colors whitespace-nowrap shadow-md"
          >
            Tümünü Kabul Et
          </button>
        </div>
      </div>
    </div>
  );
}
