"use client";

import { X, Trash2, Plus, Minus, ShoppingBag } from 'lucide-react';
import { useCartStore } from '@/store/useCartStore';
import Image from 'next/image';

export default function CartDrawer() {
  const { isDrawerOpen, closeDrawer, items, updateQuantity, removeItem, getCartTotal } = useCartStore();

  if (!isDrawerOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-olive-900/40 backdrop-blur-sm z-50 transition-opacity"
        onClick={closeDrawer}
      />

      {/* Drawer */}
      <div className="fixed inset-y-0 right-0 w-full md:w-96 bg-cream shadow-2xl z-50 flex flex-col animate-in slide-in-from-right duration-300">
        
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

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {items.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-olive-500 space-y-4">
              <ShoppingBag className="w-16 h-16 opacity-20" />
              <p>Sepetiniz şu an boş.</p>
              <button 
                onClick={closeDrawer}
                className="px-6 py-2 bg-olive-900 text-cream rounded-full hover:bg-olive-700 transition-colors"
              >
                Alışverişe Başla
              </button>
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
            <div className="flex items-center justify-between mb-4">
              <span className="text-olive-700 font-medium">Ara Toplam</span>
              <span className="text-xl font-serif text-olive-900">
                {getCartTotal().toLocaleString('tr-TR', { style: 'currency', currency: 'TRY' })}
              </span>
            </div>
            <p className="text-xs text-olive-500 mb-6 text-center">Kargo ve vergiler ödeme adımında hesaplanacaktır.</p>
            <button className="w-full bg-gold-500 hover:bg-gold-600 text-white font-medium py-4 rounded-full transition-colors flex items-center justify-center space-x-2">
              <span>Ödemeye Geç</span>
            </button>
          </div>
        )}
      </div>
    </>
  );
}
