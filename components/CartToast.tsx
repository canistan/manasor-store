'use client';

import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCartStore } from '@/store/useCartStore';
import { CheckCircle2, X, ShoppingBag } from 'lucide-react';
import Image from 'next/image';

export default function CartToast() {
  const { showToast, hideToast, lastAddedItem, openDrawer } = useCartStore();

  useEffect(() => {
    if (showToast) {
      const timer = setTimeout(() => {
        hideToast();
      }, 4000); // 4 saniye sonra otomatik kapanır
      return () => clearTimeout(timer);
    }
  }, [showToast, hideToast]);

  const handleGoToCart = () => {
    hideToast();
    openDrawer();
  };

  return (
    <AnimatePresence>
      {showToast && lastAddedItem && (
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.9 }}
          transition={{ type: 'spring', stiffness: 300, damping: 25 }}
          className="fixed bottom-6 left-1/2 -translate-x-1/2 md:left-auto md:translate-x-0 md:right-6 md:bottom-6 z-[60] w-[90vw] md:w-[400px] bg-white rounded-2xl shadow-2xl shadow-olive-900/20 border border-olive-100 p-4 flex flex-col gap-4 overflow-hidden"
        >
          {/* Üst Kısım: Başarı Mesajı ve Kapat */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-green-600">
              <CheckCircle2 className="w-5 h-5" />
              <span className="font-medium text-sm">Ürün sepete eklendi</span>
            </div>
            <button 
              onClick={hideToast}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Orta Kısım: Ürün Özeti */}
          <div className="flex items-center gap-4 bg-olive-50/50 p-3 rounded-xl">
            <div className="relative w-12 h-12 rounded-lg bg-white overflow-hidden flex-shrink-0 border border-olive-100">
              <Image 
                src={lastAddedItem.image} 
                alt={lastAddedItem.name}
                fill
                className="object-contain p-1"
              />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-luxury-charcoal truncate">{lastAddedItem.name}</p>
              <p className="text-xs text-olive-500 mt-0.5">{lastAddedItem.size} - {lastAddedItem.packaging}</p>
            </div>
            <div className="text-right">
              <span className="text-sm font-bold text-olive-900">
                {(lastAddedItem.price * lastAddedItem.quantity).toLocaleString('tr-TR', { style: 'currency', currency: 'TRY' })}
              </span>
            </div>
          </div>

          {/* Alt Kısım: Sepete Git Butonu */}
          <button
            onClick={handleGoToCart}
            className="w-full bg-olive-900 hover:bg-gold-500 text-white flex items-center justify-center gap-2 py-3 rounded-xl font-medium text-sm transition-colors uppercase tracking-wider group"
          >
            <ShoppingBag className="w-4 h-4 group-hover:animate-bounce" />
            <span>Sepete Git</span>
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
