"use client";

import { X, Trash2, Plus, Minus, ShoppingBag, Truck } from 'lucide-react';
import { useCartStore } from '@/store/useCartStore';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState } from 'react';

export default function CartDrawer() {
  const { isDrawerOpen, closeDrawer, items, updateQuantity, removeItem, getCartTotal, shippingSettings, fetchShippingSettings, appliedCoupon, applyCoupon, removeCoupon, getDiscountedTotal, getDiscountAmount } = useCartStore();
  const FREE_SHIPPING_THRESHOLD = shippingSettings?.freeShippingThreshold || 1500;
  
  const [couponInput, setCouponInput] = useState('');
  const [couponError, setCouponError] = useState('');
  const [isApplyingCoupon, setIsApplyingCoupon] = useState(false);

  useEffect(() => {
    fetchShippingSettings();
  }, [fetchShippingSettings]);
  
  const currentTotal = getDiscountedTotal();
  const remaining = FREE_SHIPPING_THRESHOLD - currentTotal;
  const progress = Math.min((currentTotal / FREE_SHIPPING_THRESHOLD) * 100, 100);

  const handleApplyCoupon = async () => {
    if (!couponInput.trim()) return;
    setIsApplyingCoupon(true);
    setCouponError('');
    
    try {
      const res = await fetch('/api/coupons/apply', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: couponInput, cartTotal: getCartTotal() })
      });
      
      const data = await res.json();
      
      if (res.ok && data.success) {
        applyCoupon(data.coupon);
        setCouponInput('');
      } else {
        setCouponError(data.error || 'Kupon geçersiz.');
      }
    } catch (err) {
      setCouponError('Bağlantı hatası.');
    } finally {
      setIsApplyingCoupon(false);
    }
  };

  return (
    <AnimatePresence>
      {isDrawerOpen && (
        <>
          {/* Backdrop */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-luxury-black/40 backdrop-blur-sm z-50"
            onClick={closeDrawer}
          />

          {/* Drawer */}
          <motion.div 
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed inset-y-0 right-0 w-full sm:w-[400px] bg-cream shadow-2xl z-50 flex flex-col"
          >
        
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-olive-100">
          <div className="flex items-center space-x-2">
            <ShoppingBag className="w-5 h-5 text-olive-900" />
            <h2 className="text-xl font-serif text-olive-900">Sepetiniz</h2>
          </div>
          <button 
            onClick={closeDrawer}
            className="p-2 text-olive-500 hover:text-olive-900 transition-colors rounded-full hover:bg-olive-50"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Free Shipping Progress */}
        {items.length > 0 && (
          <div className="px-6 pb-4 bg-cream border-b border-olive-100">
            <div className="flex items-center space-x-2 mb-2">
              <Truck className="w-4 h-4 text-olive-600" />
              <p className="text-sm font-medium text-olive-700">
                {remaining > 0 
                  ? `Ücretsiz kargoya ${remaining.toLocaleString('tr-TR', { style: 'currency', currency: 'TRY' })} kaldı!`
                  : 'Tebrikler! Ücretsiz kargo kazandınız.'}
              </p>
            </div>
            <div className="w-full bg-olive-100 rounded-full h-1.5 overflow-hidden">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className={`h-full rounded-full ${remaining <= 0 ? 'bg-green-500' : 'bg-gold-500'}`}
              />
            </div>
          </div>
        )}

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {items.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-olive-500 space-y-4">
              <ShoppingBag className="w-16 h-16 opacity-20" />
              <p>Sepetiniz şu an boş.</p>
              <Link 
                href="/products"
                onClick={closeDrawer}
                className="px-6 py-2 bg-olive-900 text-cream rounded-full hover:bg-olive-700 transition-colors inline-block text-center"
              >
                Alışverişe Başla
              </Link>
            </div>
          ) : (
            <div className="space-y-6">
              {items.map((item: any) => (
                <div key={item.variationId} className="flex gap-4">
                  <div className="relative w-20 h-20 rounded-lg overflow-hidden bg-olive-50 flex-shrink-0">
                    <Image 
                      src={item.image} 
                      alt={item.name} 
                      fill 
                      className="object-cover"
                    />
                  </div>
                  
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <h3 className="text-sm font-medium text-olive-900 line-clamp-2">{item.name}</h3>
                      <p className="text-xs text-olive-500 mt-1">{item.size} - {item.packaging}</p>
                    </div>
                    
                    <div className="flex items-center justify-between mt-2">
                      <div className="flex items-center space-x-2 border border-olive-200 rounded-full px-2 py-1">
                        <button 
                          onClick={() => updateQuantity(item.variationId, Math.max(1, item.quantity - 1))}
                          className="p-1 text-olive-500 hover:text-olive-900 transition-colors"
                          disabled={item.quantity <= 1}
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="text-sm font-medium text-olive-900 w-4 text-center">{item.quantity}</span>
                        <button 
                          onClick={() => updateQuantity(item.variationId, item.quantity + 1)}
                          className="p-1 text-olive-500 hover:text-olive-900 transition-colors"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="font-medium text-olive-900">
                          {(item.price * item.quantity).toLocaleString('tr-TR', { style: 'currency', currency: 'TRY' })}
                        </span>
                        <button 
                          onClick={() => removeItem(item.variationId)}
                          className="text-red-400 hover:text-red-600 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="border-t border-olive-100 p-6 bg-olive-50/50">
            {/* Kupon Alanı */}
            <div className="mb-4">
              {!appliedCoupon ? (
                <div>
                  <div className="flex gap-2">
                    <input 
                      type="text" 
                      placeholder="İndirim Kodu" 
                      value={couponInput}
                      onChange={(e) => setCouponInput(e.target.value)}
                      className="flex-1 p-3 text-sm bg-white text-olive-900 placeholder-olive-400 border border-olive-200 rounded-lg outline-none focus:ring-1 focus:ring-gold-500 focus:border-gold-500 uppercase transition-all shadow-sm"
                    />
                    <button 
                      onClick={handleApplyCoupon}
                      disabled={isApplyingCoupon || !couponInput.trim()}
                      className="bg-olive-800 text-white px-5 py-3 rounded-lg text-sm font-medium hover:bg-olive-900 disabled:opacity-50 transition-colors shadow-sm"
                    >
                      {isApplyingCoupon ? '...' : 'Uygula'}
                    </button>
                  </div>
                  {couponError && <p className="text-red-500 text-xs mt-1">{couponError}</p>}
                </div>
              ) : (
                <div className="flex items-center justify-between bg-green-50 text-green-700 p-2 rounded-lg text-sm border border-green-200">
                  <div className="flex items-center">
                    <span className="font-medium mr-2">{appliedCoupon.code}</span> 
                    <span>uygulandı!</span>
                  </div>
                  <button onClick={removeCoupon} className="text-red-500 hover:text-red-700 font-medium text-xs">Kaldır</button>
                </div>
              )}
            </div>

            <div className="flex items-center justify-between mb-2">
              <span className="text-olive-700">Ara Toplam</span>
              <span className="font-serif text-olive-900">
                {getCartTotal().toLocaleString('tr-TR', { style: 'currency', currency: 'TRY' })}
              </span>
            </div>

            {appliedCoupon && (
              <div className="flex items-center justify-between mb-2 text-green-600">
                <span>İndirim ({appliedCoupon.code})</span>
                <span className="font-medium">
                  -{getDiscountAmount().toLocaleString('tr-TR', { style: 'currency', currency: 'TRY' })}
                </span>
              </div>
            )}

            <div className="flex items-center justify-between mb-4 pt-2 border-t border-olive-200">
              <span className="text-olive-900 font-medium">Toplam</span>
              <span className="text-xl font-serif text-luxury-charcoal">
                {getDiscountedTotal().toLocaleString('tr-TR', { style: 'currency', currency: 'TRY' })}
              </span>
            </div>
            
            <p className="text-xs text-olive-500 mb-6 text-center">Kargo ve vergiler ödeme adımında hesaplanacaktır.</p>
            <Link 
              href="/checkout" 
              onClick={closeDrawer}
              className="w-full bg-gold-500 hover:bg-gold-600 text-white font-medium py-4 rounded-full transition-colors flex items-center justify-center space-x-2"
            >
              <span>Ödemeye Geç</span>
            </Link>
          </div>
        )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
