'use client';

import { useState } from 'react';
import { useCartStore } from '@/store/useCartStore';
import { Minus, Plus, ShoppingBag, ShieldCheck, Truck, Leaf } from 'lucide-react';

interface Variation {
  id: string;
  size: string;
  packaging: string;
  price: number;
  stock: number;
}

interface AddToCartProps {
  product: {
    id: string;
    name: string;
    shortDescription: string;
    category: string;
    image: string;
    secondaryImage?: string;
    variations: Variation[];
  };
}

export default function AddToCartSection({ product }: AddToCartProps) {
  const { addItem, openDrawer } = useCartStore();
  
  // Varsayılan olarak ilk varyasyonu seçiyoruz
  const [selectedVariantId, setSelectedVariantId] = useState<string>(product.variations[0]?.id || '');
  const [quantity, setQuantity] = useState(1);

  const selectedVariant = product.variations.find(v => v.id === selectedVariantId) || product.variations[0];

  const handleDecrease = () => {
    if (quantity > 1) setQuantity(prev => prev - 1);
  };

  const handleIncrease = () => {
    if (selectedVariant && quantity < selectedVariant.stock) {
      setQuantity(prev => prev + 1);
    }
  };

  const handleAddToCart = () => {
    if (!selectedVariant) return;

    addItem({
      productId: product.id,
      variationId: selectedVariant.id,
      name: product.name,
      size: selectedVariant.size,
      packaging: selectedVariant.packaging,
      price: selectedVariant.price,
      image: product.image,
      quantity: quantity
    });
    
    openDrawer();
  };

  if (!selectedVariant) return <p className="text-red-500">Bu ürün şu an stokta yok.</p>;

  return (
    <div className="flex flex-col h-full space-y-8">
      {/* Ürün Temel Bilgileri */}
      <div>
        <div className="flex items-center space-x-2 text-sm text-gold-600 mb-2 font-medium tracking-wider uppercase">
          <span>{product.category}</span>
        </div>
        <h1 className="text-3xl md:text-4xl font-serif text-luxury-charcoal mb-4 leading-tight">{product.name}</h1>
        <p className="text-2xl font-light text-olive-900 mb-6 flex items-center">
          <span className="text-3xl font-medium mr-1">₺{selectedVariant.price.toLocaleString('tr-TR', { minimumFractionDigits: 2 })}</span>
          <span className="text-sm text-olive-500 ml-2">KDV Dahil</span>
        </p>
        <p className="text-olive-700 leading-relaxed text-lg font-light mb-8 pb-8 border-b border-olive-100">
          {product.shortDescription}
        </p>
      </div>

      {/* Varyasyon (Gramaj/Boyut) Seçimi */}
      {product.variations.length > 1 && (
        <div>
          <h3 className="text-sm font-medium text-luxury-charcoal uppercase tracking-wider mb-3">Gramaj / Ambalaj Seçimi</h3>
          <div className="flex flex-wrap gap-3">
            {product.variations.map((variant) => {
              const isSelected = selectedVariantId === variant.id;
              const isOutOfStock = variant.stock <= 0;
              
              return (
                <button
                  key={variant.id}
                  disabled={isOutOfStock}
                  onClick={() => {
                    setSelectedVariantId(variant.id);
                    setQuantity(1); // Varyasyon değişince adedi 1'e sıfırla
                  }}
                  className={`
                    relative px-6 py-3 rounded-lg border text-sm font-medium transition-all duration-200
                    ${isSelected 
                      ? 'border-gold-500 bg-gold-50/50 text-olive-900 shadow-sm ring-1 ring-gold-500' 
                      : 'border-olive-200 text-olive-700 hover:border-gold-400 hover:bg-olive-50'}
                    ${isOutOfStock ? 'opacity-50 cursor-not-allowed bg-gray-50 text-gray-400' : ''}
                  `}
                >
                  <div className="flex flex-col items-center">
                    <span>{variant.size}</span>
                    <span className={`text-xs mt-1 ${isSelected ? 'text-gold-700' : 'text-olive-500'}`}>{variant.packaging}</span>
                  </div>
                  {isOutOfStock && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-full h-px bg-red-400 rotate-12" />
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Adet Seçimi ve Sepete Ekle */}
      <div className="flex flex-col sm:flex-row gap-4 pt-6">
        <div className="flex items-center justify-between border border-olive-200 rounded-lg p-1 w-full sm:w-32 h-14 bg-white">
          <button 
            onClick={handleDecrease}
            className="w-10 h-10 flex items-center justify-center text-olive-500 hover:text-gold-600 hover:bg-olive-50 rounded-md transition-colors"
            disabled={quantity <= 1}
          >
            <Minus className="w-4 h-4" />
          </button>
          <span className="font-medium text-olive-900 w-8 text-center">{quantity}</span>
          <button 
            onClick={handleIncrease}
            className="w-10 h-10 flex items-center justify-center text-olive-500 hover:text-gold-600 hover:bg-olive-50 rounded-md transition-colors"
            disabled={quantity >= selectedVariant.stock}
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>
        
        <button 
          onClick={handleAddToCart}
          className="flex-1 bg-olive-900 hover:bg-gold-500 text-white flex items-center justify-center space-x-2 h-14 rounded-lg font-medium tracking-wide uppercase transition-colors shadow-lg shadow-olive-900/20 group"
        >
          <ShoppingBag className="w-5 h-5 group-hover:animate-bounce" />
          <span>Sepete Ekle</span>
        </button>
      </div>

      {/* Trust Badges */}
      <div className="grid grid-cols-3 gap-4 pt-8 mt-auto border-t border-olive-100">
        <div className="flex flex-col items-center text-center">
          <Truck className="w-6 h-6 text-gold-500 mb-2" />
          <span className="text-xs text-olive-600 font-medium leading-tight">Hızlı<br/>Teslimat</span>
        </div>
        <div className="flex flex-col items-center text-center">
          <ShieldCheck className="w-6 h-6 text-gold-500 mb-2" />
          <span className="text-xs text-olive-600 font-medium leading-tight">Güvenli<br/>Alışveriş</span>
        </div>
        <div className="flex flex-col items-center text-center">
          <Leaf className="w-6 h-6 text-gold-500 mb-2" />
          <span className="text-xs text-olive-600 font-medium leading-tight">%100 Doğal<br/>Ürün</span>
        </div>
      </div>
    </div>
  );
}
