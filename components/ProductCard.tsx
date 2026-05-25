import Image from 'next/image';
import Link from 'next/link';
import { ShoppingBag } from 'lucide-react';

interface Variation {
  id: string;
  size: string;
  packaging: string;
  price: number;
  stock: number;
}

interface Product {
  id: string;
  name: string;
  shortDescription: string;
  category: string;
  image: string;
  variations: Variation[];
}

export default function ProductCard({ product }: { product: Product }) {
  const startingPrice = Math.min(...product.variations.map(v => v.price));

  return (
    <div className="group flex flex-col h-full bg-white border border-olive-100 hover:border-olive-300 transition-all duration-300 rounded-sm overflow-hidden hover:shadow-lg">
      <Link href={`/products/${product.id}`} className="block relative aspect-square overflow-hidden bg-cream p-4">
        <Image
          src={product.image}
          alt={product.name}
          fill
          className="object-contain p-6 transition-transform duration-500 group-hover:scale-105"
          sizes="(max-width: 768px) 100vw, 33vw"
        />
        {/* Etiket / Category Tag */}
        <div className="absolute top-4 left-4 bg-olive-600 text-white text-[10px] uppercase tracking-wider px-2 py-1 rounded-sm">
          {product.category}
        </div>
      </Link>
      
      <div className="flex flex-col flex-grow p-6 text-center">
        <Link href={`/products/${product.id}`}>
          <h3 className="text-lg font-serif text-luxury-charcoal mb-2 group-hover:text-gold-600 transition-colors line-clamp-2">
            {product.name}
          </h3>
        </Link>
        
        <p className="text-sm text-olive-600 mb-6 line-clamp-2">
          {product.shortDescription}
        </p>
        
        <div className="mt-auto">
          <div className="text-xl font-medium text-luxury-charcoal mb-4">
            {startingPrice.toLocaleString('tr-TR', { style: 'currency', currency: 'TRY' })}
          </div>
          
          <Link 
            href={`/products/${product.id}`}
            className="w-full flex items-center justify-center space-x-2 bg-olive-700 hover:bg-olive-900 text-white py-3 px-4 rounded-sm transition-colors text-sm font-medium uppercase tracking-wider"
          >
            <ShoppingBag className="w-4 h-4" />
            <span>İncele & Sepete Ekle</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
