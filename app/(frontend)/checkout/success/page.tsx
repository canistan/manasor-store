'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { CheckCircle2, Package, ArrowRight } from 'lucide-react';
import { useCartStore } from '@/store/useCartStore';

function SuccessContent() {
  const searchParams = useSearchParams();
  const token = searchParams.get('token'); // Iyzico'dan dönen token
  const { clearCart } = useCartStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Gerçek senaryoda bu token ile backend'e istek atılıp ödemenin "success" durumu teyit edilir
    // ve sipariş Payload CMS'de "Ödendi" olarak güncellenir.
    
    // İşlem bittikten sonra sepeti temizle
    clearCart();
  }, [clearCart]);

  if (!mounted) return null;

  return (
    <div className="max-w-md w-full bg-white p-8 rounded-2xl shadow-xl border border-olive-100 text-center animate-in zoom-in-95 duration-500">
      
      <div className="mx-auto w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-6">
        <CheckCircle2 className="w-12 h-12 text-green-600" />
      </div>
      
      <h2 className="text-3xl font-serif text-luxury-charcoal mb-4">Siparişiniz Alındı!</h2>
      
      <p className="text-olive-600 mb-8 leading-relaxed">
        Teşekkür ederiz. Ödemeniz başarıyla gerçekleşti ve siparişiniz onaylandı. 
        Sipariş detaylarınız e-posta adresinize gönderilecektir.
      </p>

      <div className="bg-olive-50 p-4 rounded-xl mb-8 flex items-center text-left">
        <Package className="w-8 h-8 text-gold-500 mr-4" />
        <div>
          <p className="text-xs text-olive-500 font-medium uppercase tracking-wider">Sipariş Numarası</p>
          <p className="font-mono text-luxury-charcoal font-bold">{token ? `MNS-${token.substring(0,8)}` : 'MNS-10492849'}</p>
        </div>
      </div>

      <Link 
        href="/products" 
        className="w-full flex items-center justify-center space-x-2 bg-olive-900 text-white py-4 px-8 rounded-xl font-medium hover:bg-gold-500 transition-colors"
      >
        <span>Alışverişe Devam Et</span>
        <ArrowRight className="w-5 h-5" />
      </Link>
      
    </div>
  );
}

export default function CheckoutSuccessPage() {
  return (
    <div className="min-h-[70vh] bg-[#FDFBF7] flex items-center justify-center py-24 px-4 sm:px-6 lg:px-8">
      <Suspense fallback={<div className="animate-pulse w-32 h-32 bg-olive-100 rounded-full"></div>}>
        <SuccessContent />
      </Suspense>
    </div>
  );
}
