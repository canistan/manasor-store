'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { CheckCircle } from 'lucide-react';
import { useCartStore } from '@/store/useCartStore';

export default function SuccessPage() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get('orderId');
  const clearCart = useCartStore(state => state.clearCart);

  useEffect(() => {
    // Sepeti temizle
    clearCart();
  }, [clearCart]);

  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-cream px-4">
      <div className="bg-white p-10 md:p-16 rounded-2xl shadow-xl text-center max-w-2xl w-full border border-olive-100">
        <div className="w-24 h-24 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-8">
          <CheckCircle className="w-12 h-12" />
        </div>
        
        <h1 className="text-4xl font-serif text-luxury-charcoal mb-4">Siparişiniz Alındı!</h1>
        
        <p className="text-lg text-olive-700 font-light mb-8">
          Teşekkür ederiz. Siparişiniz başarıyla oluşturuldu ve en kısa sürede kargoya teslim edilmek üzere hazırlanmaya başlandı.
        </p>

        {orderId && (
          <div className="bg-olive-50 p-6 rounded-xl border border-olive-100 mb-10">
            <span className="text-sm text-olive-500 uppercase tracking-widest block mb-2">Sipariş Numaranız</span>
            <span className="text-2xl font-medium text-luxury-charcoal tracking-wider">{orderId}</span>
          </div>
        )}

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link 
            href="/products"
            className="bg-olive-900 hover:bg-gold-500 text-white px-8 py-4 rounded-xl font-medium uppercase tracking-wider transition-all duration-300 shadow-md"
          >
            Alışverişe Devam Et
          </Link>
        </div>
      </div>
    </div>
  );
}
