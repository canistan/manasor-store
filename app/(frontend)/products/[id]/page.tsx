"use client";

import { useState, useEffect, use } from 'react';
import Image from 'next/image';
import { useCartStore } from '@/store/useCartStore';
import { Minus, Plus, ShoppingCart, Check, Star, ChevronDown, Info } from 'lucide-react';

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
  const [activeImage, setActiveImage] = useState<string>('');
  
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
    : 'https://images.unsplash.com/photo-1668094497457-29f4bd775c95?w=600&q=80';

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

  const currentImage = activeImage || imageUrl;

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

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 bg-white p-6 md:p-12 rounded-2xl shadow-sm border border-olive-100">
          
          {/* Sol: Ürün Görseli Galerisi */}
          <div className="flex flex-col gap-4">
            <div className="relative aspect-square overflow-hidden bg-cream border border-olive-100 rounded-2xl">
              <Image
                src={currentImage}
                alt={product.name}
                fill
                className="object-contain p-8 transition-transform duration-500 hover:scale-105"
                priority
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            </div>
            {/* Thumbnail Galerisi */}
            <div className="flex gap-4">
              {[imageUrl, "https://images.unsplash.com/photo-1610547939489-73202bc6afda?w=600&q=80", "https://images.unsplash.com/photo-1591122523233-22037c1dec9f?w=600&q=80"].map((img, i) => (
                <div key={i} onClick={() => setActiveImage(img)} className={`relative w-20 h-20 rounded-xl overflow-hidden cursor-pointer border-2 transition-all ${currentImage === img ? 'border-gold-500' : 'border-transparent hover:border-olive-200'}`}>
                  <Image src={img} alt="" fill className="object-cover opacity-70 hover:opacity-100 bg-cream" />
                </div>
              ))}
            </div>

            {/* Müşteri Yorumları */}
            <div className="mt-8 pt-8 border-t border-olive-100">
              <h3 className="text-xl font-serif text-luxury-charcoal mb-6">Müşteri Yorumları (124)</h3>
              
              {/* Yorum Yapma Barı */}
              <div className="bg-olive-50 p-6 rounded-xl mb-8 border border-olive-100">
                <h4 className="text-sm font-medium text-luxury-charcoal mb-3">Siz de yorum yapın</h4>
                <div className="flex flex-col gap-3">
                  <div className="flex text-olive-300 gap-1 cursor-pointer">
                    <Star className="w-5 h-5 hover:text-gold-500 hover:fill-gold-500 transition-all" />
                    <Star className="w-5 h-5 hover:text-gold-500 hover:fill-gold-500 transition-all" />
                    <Star className="w-5 h-5 hover:text-gold-500 hover:fill-gold-500 transition-all" />
                    <Star className="w-5 h-5 hover:text-gold-500 hover:fill-gold-500 transition-all" />
                    <Star className="w-5 h-5 hover:text-gold-500 hover:fill-gold-500 transition-all" />
                  </div>
                  <div className="flex flex-col sm:flex-row gap-3">
                    <input type="text" placeholder="Yorumunuzu buraya yazın..." className="flex-1 bg-white border border-olive-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-olive-500 transition-colors" />
                    <button className="bg-olive-900 text-white px-8 py-3 rounded-lg text-sm font-medium hover:bg-gold-500 transition-colors whitespace-nowrap shadow-sm">Gönder</button>
                  </div>
                </div>
              </div>

              {/* Yorum Listesi */}
              <div className="space-y-6">
                <div className="border-b border-olive-50 pb-6">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium text-luxury-charcoal">Ayşe Yılmaz</span>
                    <div className="flex text-gold-500"><Star className="w-4 h-4 fill-current"/><Star className="w-4 h-4 fill-current"/><Star className="w-4 h-4 fill-current"/><Star className="w-4 h-4 fill-current"/><Star className="w-4 h-4 fill-current"/></div>
                  </div>
                  <p className="text-sm text-olive-600 leading-relaxed">Kokusuna ve rengine bayıldık. Kesinlikle gerçek bir soğuk sıkım. Kargolama çok özenliydi.</p>
                </div>
                <div className="border-b border-olive-50 pb-6">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium text-luxury-charcoal">Mehmet K.</span>
                    <div className="flex text-gold-500"><Star className="w-4 h-4 fill-current"/><Star className="w-4 h-4 fill-current"/><Star className="w-4 h-4 fill-current"/><Star className="w-4 h-4 fill-current"/><Star className="w-4 h-4 fill-current"/></div>
                  </div>
                  <p className="text-sm text-olive-600 leading-relaxed">Salatalarda mükemmel bir tat bırakıyor. Boğazı yakan o orijinal hissi veriyor. Sürekli alacağım.</p>
                </div>
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium text-luxury-charcoal">Zeynep D.</span>
                    <div className="flex text-gold-500"><Star className="w-4 h-4 fill-current"/><Star className="w-4 h-4 fill-current"/><Star className="w-4 h-4 fill-current"/><Star className="w-4 h-4 fill-current"/><Star className="w-4 h-4 text-olive-200 fill-current"/></div>
                  </div>
                  <p className="text-sm text-olive-600 leading-relaxed">Teneke ambalajı çok pratik. Yağın lezzeti de tam beklediğim gibi, hafif ve taze.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Sağ: Ürün Bilgileri ve Satın Alma */}
          <div className="flex flex-col">
            
            <div className="flex items-center space-x-2 mb-3">
              <div className="flex text-gold-500">
                {[1,2,3,4,5].map(i => <Star key={i} className="w-4 h-4 fill-current" />)}
              </div>
              <span className="text-sm text-olive-500 underline cursor-pointer">4.8 (124 Yorum)</span>
            </div>

            <h1 className="text-3xl md:text-4xl font-serif text-luxury-charcoal mb-4">
              {product.name}
            </h1>
            
            <div className="flex items-end space-x-4 mb-6">
              <div className="text-4xl font-bold text-olive-900">
                {selectedVariation.price.toLocaleString('tr-TR', { style: 'currency', currency: 'TRY' })}
              </div>
              <div className="text-xl text-olive-400 line-through mb-1">
                {(selectedVariation.price * 1.25).toLocaleString('tr-TR', { style: 'currency', currency: 'TRY' })}
              </div>
            </div>
            
            <p className="text-olive-700 leading-relaxed mb-6">
              Erken hasat döneminde, zeytinler henüz yeşilken özenle toplanır ve 24°C'nin altında soğuk sıkım yöntemiyle sıkılır. Meyvemsi aroması ve nefis kokusuyla Manasor kalitesini sofralarınıza taşır.
            </p>

            {/* Hızlı Bilgiler */}
            <div className="flex flex-col space-y-2 mb-8 bg-olive-50 p-4 rounded-xl border border-olive-100">
              <div className="flex items-center text-sm text-olive-700"><Check className="w-4 h-4 text-gold-500 mr-2"/> Asitlik Derecesi: Maksimum %0.3</div>
              <div className="flex items-center text-sm text-olive-700"><Check className="w-4 h-4 text-gold-500 mr-2"/> Hasat Zamanı: Ekim 2026 (Erken Hasat)</div>
              <div className="flex items-center text-sm text-olive-700"><Check className="w-4 h-4 text-gold-500 mr-2"/> Sıkım Tipi: 24°C Soğuk Sıkım</div>
            </div>

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
                    className={`px-6 py-3 rounded-full border transition-all ${
                      selectedVariation.variantId === variation.variantId 
                      ? 'border-olive-900 bg-olive-900 text-white shadow-md' 
                      : 'border-olive-200 text-olive-600 hover:border-olive-400 bg-white'
                    }`}
                  >
                    <div className="font-medium">{variation.size}</div>
                    <div className="text-xs opacity-80">{variation.packaging}</div>
                  </button>
                ))}
              </div>
            </div>

            <div className="fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-olive-100 p-4 shadow-[0_-10px_20px_-10px_rgba(0,0,0,0.1)] lg:static lg:bg-transparent lg:border-none lg:p-0 lg:shadow-none lg:mb-8">
              <div className="max-w-7xl mx-auto flex flex-col gap-4">
                <div className="flex gap-4">
                  {/* Miktar Seçici */}
                  <div className="flex items-center border border-olive-200 rounded-full bg-cream px-2 w-32 justify-between">
                    <button 
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="p-3 text-olive-500 hover:text-luxury-charcoal transition-colors"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="font-medium text-luxury-charcoal">{quantity}</span>
                    <button 
                      onClick={() => setQuantity(quantity + 1)}
                      className="p-3 text-olive-500 hover:text-luxury-charcoal transition-colors"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Sepete Ekle Butonu */}
                  <button 
                    onClick={handleAddToCart}
                    disabled={added}
                    className={`flex-1 flex items-center justify-center space-x-2 py-4 px-8 rounded-full font-medium uppercase tracking-wider transition-all active:scale-95 ${
                      added 
                      ? 'bg-green-600 text-white' 
                      : 'bg-olive-900 hover:bg-gold-500 text-white shadow-lg hover:shadow-xl hover:-translate-y-1'
                    }`}
                  >
                  {added ? (
                    <>
                      <Check className="w-5 h-5" />
                      <span>Eklendi</span>
                    </>
                  ) : (
                    <>
                      <ShoppingCart className="w-5 h-5" />
                      <span>Sepete Ekle</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
          
            {/* Güven ve Kargo Bilgisi */}
            <div className="bg-cream border border-olive-100 p-4 rounded-xl text-sm text-olive-700 space-y-2 mb-8">
              <p className="flex items-center"><Check className="w-4 h-4 text-green-500 mr-2"/> <strong>Ücretsiz Kargo:</strong> 1500 TL ve üzeri alışverişlerinizde.</p>
              <p className="flex items-center"><Check className="w-4 h-4 text-green-500 mr-2"/> <strong>Güvenli Alışveriş:</strong> 256-bit SSL sertifikası ile korunmaktadır.</p>
              <p className="flex items-center"><Check className="w-4 h-4 text-green-500 mr-2"/> <strong>Hızlı Gönderim:</strong> Siparişleriniz 24 saat içinde kargoda.</p>
            </div>

            {/* Akordeon Detaylar */}
            <div className="space-y-3">
              {['Ürün Açıklaması', 'Kullanım Tavsiyesi'].map((tab, idx) => (
                <details key={idx} className="group bg-white border border-olive-100 rounded-xl overflow-hidden cursor-pointer" open={idx === 0}>
                  <summary className="flex justify-between items-center font-medium p-4 text-luxury-charcoal bg-olive-50/30 hover:bg-olive-50 transition-colors">
                    {tab}
                    <ChevronDown className="w-5 h-5 text-olive-500 group-open:rotate-180 transition-transform" />
                  </summary>
                  <div className="p-4 text-sm text-olive-600 border-t border-olive-100 bg-white leading-relaxed">
                    {idx === 0 && (
                      "Erken hasat döneminde, zeytinler henüz yeşilken özenle toplanır ve 24°C'nin altında soğuk sıkım yöntemiyle sıkılır. Bu sayede zeytinin içerdiği fenolik bileşenler ve antioksidanlar maksimum seviyede korunur. Meyvemsi aroması, boğazda bıraktığı hafif yakıcılık ve nefis kokusuyla Manasor kalitesini sofralarınıza taşır."
                    )}
                    {idx === 1 && (
                      "Soğuk ve sıcak tüm yemeklerinizde güvenle kullanabilirsiniz. Özellikle sabah kahvaltılarında çiğ olarak tüketilmesi, salatalara ve mezelere son dokunuş olarak eklenmesi tavsiye edilir. Isıdan ve güneş ışığından koruyarak, serin ve rutubetsiz ortamda saklayınız."
                    )}
                  </div>
                </details>
              ))}
            </div>
            
          </div>
        </div>
      </div>
    </div>
  );
}
