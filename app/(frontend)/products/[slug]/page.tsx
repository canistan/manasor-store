import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getPayload } from 'payload';
import configPromise from '@payload-config';
import { ChevronRight, Star } from 'lucide-react';
import AddToCartSection from '@/components/AddToCartSection';

// Dummy base products for fallback
const baseProducts = [
  {
    baseName: "Soğuk Sıkım Natürel Sızma Zeytinyağı",
    shortDescription: "0.3 asit oranına sahip, taş baskı yöntemiyle üretilmiş ödüllü zeytinyağımız.",
    category: "Zeytinyağı",
    image: "https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=1000&q=80",
    secondaryImage: "https://images.unsplash.com/photo-1610547939489-73202bc6afda?w=1000&q=80",
    price: 450,
  },
  {
    baseName: "Gemlik Lüks Siyah Zeytin",
    shortDescription: "İnce kabuklu, küçük çekirdekli ve etli Gemlik tipi siyah zeytin.",
    category: "Zeytin",
    image: "https://images.unsplash.com/photo-1591122523233-22037c1dec9f?w=1000&q=80",
    secondaryImage: "/images/black_olives_hover.png",
    price: 320,
  },
  {
    baseName: "Edremit Çizik Yeşil Zeytin",
    shortDescription: "Sadece su ve tuz ile fermente edilmiş doğal yeşil zeytin.",
    category: "Zeytin",
    image: "https://images.unsplash.com/photo-1501959915551-4e8d30928317?w=1000&q=80",
    secondaryImage: "/images/green_olives_hover.png",
    price: 290,
  }
];

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return {
    title: `${slug.replace(/-/g, ' ').toUpperCase()} | Manasor`,
    description: 'Manasor premium zeytin ve zeytinyağı.',
    alternates: {
      canonical: `/products/${slug}`,
    }
  };
}

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params;
  let productData: any = null;

  try {
    const payload = await getPayload({ config: configPromise });
    const result = await payload.find({
      collection: 'products',
      where: { slug: { equals: slug } },
      limit: 1,
      depth: 1,
    });
    
    if (result.docs.length > 0) {
      const p = result.docs[0];
      const imageUrl = typeof p.image === 'object' && p.image?.url ? p.image.url.replace('/api/media/file/', '/media/') : '/images/olive_oil_bottle_1779729109843.png';
      
      productData = {
        id: p.id as string,
        name: p.name,
        shortDescription: p.shortDescription || '',
        category: p.category,
        image: imageUrl,
        secondaryImage: p.secondaryImage,
        traceability: p.traceability,
        variations: (p.variations || []).map((v: any) => ({
          id: v.variantId,
          size: v.size,
          packaging: v.packaging,
          price: v.price,
          stock: v.stock
        }))
      };
    }
  } catch (error) {
    console.error('Error fetching product from Payload:', error);
  }

  // Fallback to dummy logic if not found in DB
  if (!productData) {
    const match = slug.match(/^(?:soguk-sikim-zeytinyagi|gemlik-siyah-zeytin|cizik-yesil-zeytin|dummy-product)-(\d+)$/);
    if (match) {
      const index = parseInt(match[1]) - 1;
      const template = baseProducts[index % 3];
      productData = {
        id: `dummy-${index + 1}`,
        name: `${template.baseName} - Seri No: ${1000 + index}`,
        shortDescription: template.shortDescription,
        category: template.category,
        image: template.image,
        secondaryImage: template.secondaryImage,
        variations: [
          {
            id: `var-${index}-1`,
            size: template.category === 'Zeytinyağı' ? '500ml' : '1Kg',
            packaging: template.category === 'Zeytinyağı' ? 'Cam Şişe' : 'Vakum',
            price: template.price + (index * 5),
            stock: 100
          },
          {
            id: `var-${index}-2`,
            size: template.category === 'Zeytinyağı' ? '1 Litre' : '2Kg',
            packaging: template.category === 'Zeytinyağı' ? 'Teneke' : 'Kavanoz',
            price: (template.price + (index * 5)) * 1.8,
            stock: 50
          }
        ]
      };
    } else if (slug === 'soguk-sikim-zeytinyagi' || slug === 'gemlik-siyah-zeytin' || slug === 'cizik-yesil-zeytin') {
      // Anasayfadaki eski sabit dummy ürünler için
      const idx = slug === 'soguk-sikim-zeytinyagi' ? 0 : slug === 'gemlik-siyah-zeytin' ? 1 : 2;
      const template = baseProducts[idx];
      productData = {
        id: slug,
        name: template.baseName,
        shortDescription: template.shortDescription,
        category: template.category,
        image: template.image,
        secondaryImage: template.secondaryImage,
        variations: [
          {
            id: `var-main-${idx}`,
            size: template.category === 'Zeytinyağı' ? '500ml' : '1Kg',
            packaging: template.category === 'Zeytinyağı' ? 'Cam Şişe' : 'Vakum',
            price: template.price,
            stock: 100
          }
        ]
      };
    }
  }

  if (!productData) {
    notFound();
  }

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": productData.name,
    "image": productData.image,
    "description": productData.shortDescription,
    "sku": productData.id,
    "offers": {
      "@type": "AggregateOffer",
      "url": `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/products/${slug}`,
      "priceCurrency": "TRY",
      "lowPrice": Math.min(...productData.variations.map((v: any) => v.price)),
      "highPrice": Math.max(...productData.variations.map((v: any) => v.price)),
      "offerCount": productData.variations.length,
      "availability": "https://schema.org/InStock"
    }
  };

  return (
    <div className="bg-cream min-h-screen">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      
      {/* Breadcrumb */}
      <div className="bg-[#FDFBF7] border-b border-olive-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <nav className="flex items-center text-sm font-medium text-olive-500">
            <Link href="/" className="hover:text-gold-600 transition-colors">Ana Sayfa</Link>
            <ChevronRight className="w-4 h-4 mx-2 text-olive-300" />
            <Link href="/products" className="hover:text-gold-600 transition-colors">Ürünler</Link>
            <ChevronRight className="w-4 h-4 mx-2 text-olive-300" />
            <span className="text-luxury-charcoal truncate max-w-[200px] sm:max-w-none">{productData.name}</span>
          </nav>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <div className="flex flex-col lg:flex-row gap-12 lg:gap-20">
          
          {/* Sol Kolon: Görseller */}
          <div className="w-full lg:w-1/2 flex flex-col gap-4">
            <div className="relative aspect-square w-full rounded-2xl overflow-hidden bg-white border border-olive-100 shadow-sm group">
              <Image 
                src={productData.image} 
                alt={productData.name}
                fill
                priority
                className="object-cover group-hover:scale-105 transition-transform duration-700"
                sizes="(max-w-screen-lg) 100vw, 50vw"
              />
            </div>
            
            {/* Küçük Görseller (Thumbnail) */}
            <div className="flex gap-4">
              <div className="relative w-24 h-24 rounded-lg overflow-hidden border-2 border-gold-500 cursor-pointer">
                <Image src={productData.image} alt="Thumbnail 1" fill className="object-cover" />
              </div>
              {productData.secondaryImage && (
                <div className="relative w-24 h-24 rounded-lg overflow-hidden border border-transparent hover:border-gold-300 transition-colors cursor-pointer opacity-70 hover:opacity-100">
                  <Image src={productData.secondaryImage} alt="Thumbnail 2" fill className="object-cover" />
                </div>
              )}
            </div>
          </div>

          {/* Sağ Kolon: Detaylar ve Sepete Ekle */}
          <div className="w-full lg:w-1/2">
            <AddToCartSection product={productData} />
          </div>
        </div>

        {/* Alt Kısım: Detaylı Açıklamalar */}
        <div className="mt-24 border-t border-olive-100 pt-16">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
            <div>
              <h2 className="text-2xl font-serif text-luxury-charcoal mb-6">Ürün Hakkında</h2>
              <div className="text-olive-700 leading-relaxed font-light space-y-4">
                <p>
                  Ege ve Marmara'nın en verimli zeytin bahçelerinden, doğru zamanda özenle hasat edilen zeytinlerimiz, Manasor'un kendi üretim tesislerinde geleneksel ve modern yöntemlerin harmanlanmasıyla işlenir.
                </p>
                <p>
                  Amacımız, sofranıza sadece bir lezzet değil, aynı zamanda sağlık ve doğallık sunmaktır. Bu ürünümüz, katkısız ve koruyucusuz yapısıyla doğanın en saf halini temsil eder.
                </p>
              </div>
            </div>
            <div>
              <h2 className="text-2xl font-serif text-luxury-charcoal mb-6">Tadım Notları ve Kullanım</h2>
              <div className="bg-white p-6 rounded-2xl border border-olive-100 shadow-sm">
                <ul className="space-y-4 text-olive-700 font-light">
                  <li className="flex items-start">
                    <Star className="w-5 h-5 text-gold-500 mr-3 flex-shrink-0 mt-0.5" />
                    <span><strong>Tadım:</strong> Taze çimen, çağla ve hafif badem notaları içeren meyvemsi bir aroma.</span>
                  </li>
                  <li className="flex items-start">
                    <Star className="w-5 h-5 text-gold-500 mr-3 flex-shrink-0 mt-0.5" />
                    <span><strong>Önerilen Kullanım:</strong> Çiğ tüketim (salata, meze ve kahvaltı) için mükemmeldir. Sıcak yemeklerde de güvenle kullanılabilir.</span>
                  </li>
                  <li className="flex items-start">
                    <Star className="w-5 h-5 text-gold-500 mr-3 flex-shrink-0 mt-0.5" />
                    <span><strong>Saklama Koşulları:</strong> Güneş görmeyen, serin ve kuru bir ortamda kendi ambalajında saklayınız.</span>
                  </li>
                </ul>
              </div>

              {/* Kalite ve İzlenebilirlik */}
              {productData.traceability && (
                <div className="mt-8">
                  <h3 className="text-xl font-serif text-luxury-charcoal mb-4 border-b border-olive-100 pb-2">Kalite ve İzlenebilirlik</h3>
                  <div className="bg-[#FDFBF7] p-5 rounded-xl border border-olive-100 grid grid-cols-2 gap-4 text-sm">
                    {productData.traceability.batch_number && (
                      <div>
                        <span className="block text-olive-500 font-medium text-xs uppercase tracking-wider mb-1">Parti No</span>
                        <span className="text-olive-900">{productData.traceability.batch_number}</span>
                      </div>
                    )}
                    {productData.traceability.harvest_year && (
                      <div>
                        <span className="block text-olive-500 font-medium text-xs uppercase tracking-wider mb-1">Hasat Yılı</span>
                        <span className="text-olive-900">{productData.traceability.harvest_year}</span>
                      </div>
                    )}
                    {productData.traceability.expiry_date && (
                      <div>
                        <span className="block text-olive-500 font-medium text-xs uppercase tracking-wider mb-1">SKT</span>
                        <span className="text-olive-900">
                          {new Date(productData.traceability.expiry_date).toLocaleDateString('tr-TR')}
                        </span>
                      </div>
                    )}
                    {productData.traceability.acidity_level && (
                      <div>
                        <span className="block text-olive-500 font-medium text-xs uppercase tracking-wider mb-1">Asit Oranı</span>
                        <span className="text-olive-900">% {productData.traceability.acidity_level}</span>
                      </div>
                    )}
                    
                    {productData.traceability.analysis_report && (
                      <div className="col-span-2 mt-2 pt-4 border-t border-olive-100">
                        <a 
                          href={typeof productData.traceability.analysis_report === 'object' ? productData.traceability.analysis_report.url : productData.traceability.analysis_report} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="inline-flex items-center text-sm font-medium text-gold-600 hover:text-gold-700 transition-colors"
                        >
                          <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                          </svg>
                          Laboratuvar Analiz Raporunu İndir (PDF)
                        </a>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
