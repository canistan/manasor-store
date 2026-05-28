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
  secondaryImage?: string;
  variations: Variation[];
}

export default function ProductCard({ product }: { product: Product }) {
  const startingPrice = Math.min(...product.variations.map(v => v.price));
  const oldPrice = startingPrice * 1.25; // Dummy %20 indirim gösterimi

  return (
    <div className="group flex flex-col h-full bg-white border border-olive-100 hover:border-gold-500 transition-all duration-300 rounded-xl overflow-hidden hover:shadow-xl hover:-translate-y-2">
      <Link href={`/products/${product.id}`} className="block relative aspect-square overflow-hidden bg-[#F4EFE6] p-4 group/image">
        <Image
          src={product.image}
          alt={`Manasor ${product.category} - ${product.name}`}
          fill
          className={`object-contain p-6 transition-opacity duration-700 ${product.secondaryImage ? 'group-hover/image:opacity-0' : 'group-hover/image:scale-105'}`}
          sizes="(max-width: 768px) 100vw, 33vw"
        />
        {product.secondaryImage && (
          <Image
            src={product.secondaryImage}
            alt={`Manasor ${product.category} Dokusu - ${product.name}`}
            fill
            className="object-cover transition-opacity duration-700 opacity-0 group-hover/image:opacity-100"
            sizes="(max-width: 768px) 100vw, 33vw"
          />
        )}
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
        
        <div className="mt-auto pt-4 border-t border-olive-50">
          <div className="flex items-center justify-center space-x-3 mb-5">
            <span className="text-sm text-olive-400 line-through">
              {oldPrice.toLocaleString('tr-TR', { style: 'currency', currency: 'TRY' })}
            </span>
            <span className="text-xl font-bold text-olive-900">
              {startingPrice.toLocaleString('tr-TR', { style: 'currency', currency: 'TRY' })}
            </span>
          </div>
          
          <Link 
            href={`/products/${product.id}`}
            className="w-full flex items-center justify-center space-x-2 bg-olive-700 hover:bg-olive-900 text-white py-3 px-4 rounded-full transition-all duration-300 text-sm font-medium uppercase tracking-wider group-hover:bg-gold-500"
          >
            <ShoppingBag className="w-4 h-4" />
            <span>Sepete Ekle</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
