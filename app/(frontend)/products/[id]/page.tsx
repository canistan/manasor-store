"use client";

import { useState, useEffect, use } from 'react';
import Image from 'next/image';
import { useCartStore } from '@/store/useCartStore';
import { Minus, Plus, ShoppingCart, Check } from 'lucide-react';

interface Variation {
  variantId: string;
  size: string;
  packaging: string;
  price: number;
  stock: number;
}

interface ProductData {
  id: string;
  slug: string;
  name: string;
  shortDescription?: string;
  description?: string;
  category: string;
  image: any;
  variations: Variation[];
}

export default function ProductDetail({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const [mounted, setMounted] = useState(false);
  const [product, setProduct] = useState<ProductData | null>(null);
  const [selectedVariation, setSelectedVariation] = useState<Variation | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  
  const { addItem } = useCartStore();

  useEffect(() => {
    setMounted(true);
    
    // Payload API'den ürünü çek
    fetch(`/api/products?where[slug][equals]=${resolvedParams.id}&limit=1`)
      .then(res => res.json())
      .then(data => {
        if (data.docs && data.docs.length > 0) {
          const doc = data.docs[0];
          setProduct(doc);
          if (doc.variations && doc.variations.length > 0) {
            setSelectedVariation(doc.variations[0]);
          }
        }
      })
      .catch(console.error);
  }, [resolvedParams.id]);

  if (!mounted || !product || !selectedVariation) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-cream">
        <div className="w-10 h-10 border-t-2 border-olive-700 rounded-full animate-spin"></div>
      </div>
    );
  }

  const imageUrl = typeof product.image === 'object' && product.image?.url 
    ? product.image.url 
    : '/images/olive_oil_bottle_1779729109843.png';

  const handleAddToCart = () => {
    addItem({
      variationId: selectedVariation.variantId,
      productId: product.slug,
      name: product.name,
      price: selectedVariation.price,
      quantity: quantity,
      image: imageUrl,
      size: selectedVariation.size,
      packaging: selectedVariation.packaging
    });
    
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <div className="bg-[#FDFBF7] min-h-screen pt-24 pb-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Breadcrumb */}
        <div className="flex items-center text-sm text-olive-500 mb-8">
          <a href="/" className="hover:text-luxury-charcoal">Ana Sayfa</a>
          <span className="mx-2">/</span>
          <span className="hover:text-luxury-charcoal cursor-pointer">{product.category}</span>
          <span className="mx-2">/</span>
          <span className="text-luxury-charcoal font-medium">{product.name}</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 bg-white p-6 md:p-12 rounded-sm shadow-sm border border-olive-100">
          
          {/* Sol: Ürün Görseli */}
          <div className="relative aspect-square overflow-hidden bg-cream border border-olive-100 rounded-sm">
            <Image
              src={imageUrl}
              alt={product.name}
              fill
              className="object-contain p-8"
              priority
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
          </div>

          {/* Sağ: Ürün Bilgileri ve Satın Alma */}
          <div className="flex flex-col">
            
            <h1 className="text-3xl md:text-4xl font-serif text-luxury-charcoal mb-4">
              {product.name}
            </h1>
            
            <div className="text-3xl font-medium text-luxury-charcoal mb-6">
              {selectedVariation.price.toLocaleString('tr-TR', { style: 'currency', currency: 'TRY' })}
            </div>
            
            <p className="text-olive-700 leading-relaxed mb-8 border-b border-olive-100 pb-8">
              {product.description}
            </p>

            <div className="mb-8">
              <h3 className="text-sm font-medium text-luxury-charcoal mb-3">Seçenekler:</h3>
              <div className="flex flex-wrap gap-3">
                {product.variations.map((variation) => (
                  <button
                    key={variation.variantId}
                    onClick={() => {
                      setSelectedVariation(variation);
                      setQuantity(1);
                    }}
                    className={`px-5 py-3 rounded-sm border transition-all ${
                      selectedVariation.variantId === variation.variantId 
                      ? 'border-olive-700 bg-olive-50 text-olive-900 shadow-inner' 
                      : 'border-olive-200 text-olive-600 hover:border-olive-400 bg-white'
                    }`}
                  >
                    <div className="font-medium">{variation.size}</div>
                    <div className="text-xs opacity-80">{variation.packaging}</div>
                  </button>
                ))}
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 mb-8">
              {/* Miktar Seçici */}
              <div className="flex items-center border border-olive-200 rounded-sm bg-white">
                <button 
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="p-4 text-olive-500 hover:text-luxury-charcoal hover:bg-olive-50 transition-colors"
                >
                  <Minus className="w-5 h-5" />
                </button>
                <span className="w-12 text-center font-medium text-luxury-charcoal">{quantity}</span>
                <button 
                  onClick={() => setQuantity(quantity + 1)}
                  className="p-4 text-olive-500 hover:text-luxury-charcoal hover:bg-olive-50 transition-colors"
                >
                  <Plus className="w-5 h-5" />
                </button>
              </div>

              {/* Sepete Ekle Butonu */}
              <button 
                onClick={handleAddToCart}
                disabled={added}
                className={`flex-1 flex items-center justify-center space-x-2 py-4 px-8 rounded-sm font-medium uppercase tracking-wider transition-all ${
                  added 
                  ? 'bg-green-600 text-white' 
                  : 'bg-olive-700 hover:bg-olive-900 text-white'
                }`}
              >
                {added ? (
                  <>
                    <Check className="w-5 h-5" />
                    <span>Sepete Eklendi</span>
                  </>
                ) : (
                  <>
                    <ShoppingCart className="w-5 h-5" />
                    <span>Sepete Ekle</span>
                  </>
                )}
              </button>
            </div>
            
            {/* Güven ve Kargo Bilgisi */}
            <div className="bg-olive-50 border border-olive-100 p-4 rounded-sm text-sm text-olive-700 space-y-2 mt-auto">
              <p>✓ <strong>Ücretsiz Kargo:</strong> 500 TL ve üzeri alışverişlerinizde.</p>
              <p>✓ <strong>Güvenli Alışveriş:</strong> 256-bit SSL sertifikası ile korunmaktadır.</p>
              <p>✓ <strong>Hızlı Gönderim:</strong> Siparişleriniz 24 saat içinde kargoda.</p>
            </div>
            
          </div>
        </div>
      </div>
    </div>
  );
}
