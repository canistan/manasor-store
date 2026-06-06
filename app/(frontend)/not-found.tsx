import Link from 'next/link';
import { Leaf, Home, Search } from 'lucide-react';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Sayfa Bulunamadı | Manasor',
  description: 'Aradığınız sayfa zeytinlikler arasında kaybolmuş olabilir.',
  robots: {
    index: false,
    follow: true,
  },
};

export default function NotFound() {
  return (
    <div className="min-h-[70vh] bg-[#FDFBF7] flex flex-col items-center justify-center px-4 py-20 text-center">
      <div className="relative mb-8">
        <h1 className="text-9xl font-serif text-olive-100 font-bold select-none">404</h1>
        <div className="absolute inset-0 flex items-center justify-center">
          <Leaf className="w-16 h-16 text-gold-500 animate-pulse" strokeWidth={1.5} />
        </div>
      </div>
      
      <h2 className="text-3xl md:text-4xl font-serif text-luxury-charcoal mb-4">
        Görünüşe göre kayboldunuz...
      </h2>
      
      <p className="text-olive-600 max-w-md mx-auto mb-10 text-lg font-light leading-relaxed">
        Aradığınız sayfa zeytinliklerimiz arasında kaybolmuş olabilir, adı değişmiş veya artık mevcut olmayabilir.
      </p>
      
      <div className="flex flex-col sm:flex-row gap-4 w-full max-w-md justify-center">
        <Link 
          href="/" 
          className="flex items-center justify-center px-8 py-4 bg-olive-900 text-white rounded-full hover:bg-gold-500 transition-colors duration-300 font-medium tracking-wider uppercase text-sm shadow-lg shadow-olive-900/20 group"
        >
          <Home className="w-4 h-4 mr-2 group-hover:-translate-y-1 transition-transform" />
          Ana Sayfaya Dön
        </Link>
        
        <Link 
          href="/products" 
          className="flex items-center justify-center px-8 py-4 bg-white text-olive-900 border border-olive-200 rounded-full hover:border-gold-500 hover:text-gold-600 transition-colors duration-300 font-medium tracking-wider uppercase text-sm group"
        >
          <Search className="w-4 h-4 mr-2 group-hover:scale-110 transition-transform" />
          Ürünleri Keşfet
        </Link>
      </div>
    </div>
  );
}
