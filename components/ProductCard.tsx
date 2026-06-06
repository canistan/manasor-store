"use client";

import Image from 'next/image';
import Link from 'next/link';
import { ShoppingBag, ShieldCheck } from 'lucide-react';
import { useCartStore } from '@/store/useCartStore';
import { useState } from 'react';

interface Variation {
  id: string;
  size: string;
  packaging: string;
  price: number;
  stock: number;
}

interface Product {
  id: string;
  slug?: string;
  name: string;
  shortDescription: string;
  category: string;
  image: string;
  secondaryImage?: string;
  variations: Variation[];
}

export default function ProductCard({ product }: { product: Product }) {
  const { addItem } = useCartStore();
  const startingPrice = Math.min(...product.variations.map(v => v.price));
  const oldPrice = startingPrice * 1.25; // Dummy %20 indirim gösterimi

  const [isAdded, setIsAdded] = useState(false);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent Link navigation if it's wrapped in one, though it's not here
    
    // Varsayılan olarak ilk varyasyonu sepete ekliyoruz
    const defaultVariation = product.variations[0];
    
    addItem({
      id: product.id,
      name: product.name,
      variationId: defaultVariation.id,
      size: defaultVariation.size,
      price: defaultVariation.price,
      image: product.image,
      quantity: 1
    });

    setIsAdded(true);
    setTimeout(() => {
      setIsAdded(false);
    }, 2000);
  };

  return (
    <div className="group flex flex-col h-full bg-white border border-olive-100 hover:border-gold-500 transition-all duration-300 rounded-xl overflow-hidden hover:shadow-xl hover:-translate-y-2">
      <Link href={`/products/${product.slug || product.id}`} className="block relative aspect-square overflow-hidden bg-[#F4EFE6] p-4 group/image">
        <Image
          src={product.image}
          alt={`Manasor ${product.category} - ${product.name}`}
          fill
          className={`object-cover transition-opacity duration-700 ${product.secondaryImage ? 'group-hover/image:opacity-0' : 'group-hover/image:scale-105'}`}
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
        <Link href={`/products/${product.slug || product.id}`}>
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
          
          <button 
            onClick={handleAddToCart}
            disabled={isAdded}
            className={`w-full flex items-center justify-center space-x-2 py-3 px-4 rounded-full transition-all duration-300 text-sm font-medium uppercase tracking-wider group ${
              isAdded 
                ? 'bg-green-600 text-white shadow-lg shadow-green-900/20' 
                : 'bg-olive-700 hover:bg-gold-500 text-white shadow-lg'
            }`}
          >
            {isAdded ? (
              <>
                <ShieldCheck className="w-4 h-4" />
                <span>Sepete Eklendi</span>
              </>
            ) : (
              <>
                <ShoppingBag className="w-4 h-4 group-hover:animate-bounce" />
                <span>Sepete Ekle</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
