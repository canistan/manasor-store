import Image from "next/image";
import Link from "next/link";
import ProductCard from "@/components/ProductCard";
import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { Truck, Leaf, ShieldCheck } from "lucide-react";

export default async function Home() {
  let products: any[] = [];
  
  try {
    const payload = await getPayload({ config: configPromise });
    const result = await payload.find({
      collection: 'products',
      limit: 10,
      sort: '-createdAt',
    });
    products = result.docs;
  } catch {
    // Veritabanı henüz bağlı değilse veya hata varsa boş array
    products = [];
  }

  // EĞER ÜRÜN YOKSA DUMMY DATA KULLAN (Test ve UI/UX gösterimi için)
  if (products.length === 0) {
    products = [
      {
        slug: "soguk-sikim-zeytinyagi",
        name: "Erken Hasat Soğuk Sıkım Natürel Sızma Zeytinyağı",
        shortDescription: "0.3 asit oranına sahip, taş baskı yöntemiyle üretilmiş ödüllü zeytinyağımız.",
        category: "Zeytinyağı",
        image: { url: "https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=600&q=80" },
        secondaryImage: "https://images.unsplash.com/photo-1610547939489-73202bc6afda?w=600&q=80",
        variations: [{ variantId: 'v1', size: '500ml', packaging: 'Cam Şişe', price: 450, stock: 50 }]
      },
      {
        slug: "gemlik-siyah-zeytin",
        name: "Gemlik Lüks Siyah Zeytin (XL Boy)",
        shortDescription: "İnce kabuklu, küçük çekirdekli ve etli Gemlik tipi siyah zeytin.",
        category: "Zeytin",
        image: { url: "https://images.unsplash.com/photo-1591122523233-22037c1dec9f?w=600&q=80" },
        secondaryImage: "/images/black_olives_hover.png",
        variations: [{ variantId: 'v2', size: '1Kg', packaging: 'Vakum', price: 320, stock: 100 }]
      },
      {
        slug: "cizik-yesil-zeytin",
        name: "Edremit Çizik Yeşil Zeytin",
        shortDescription: "Sadece su ve tuz ile fermente edilmiş doğal yeşil zeytin.",
        category: "Zeytin",
        image: { url: "https://images.unsplash.com/photo-1501959915551-4e8d30928317?w=600&q=80" },
        secondaryImage: "/images/green_olives_hover.png",
        variations: [{ variantId: 'v3', size: '1Kg', packaging: 'Kavanoz', price: 290, stock: 30 }]
      }
    ];
  }

  // Ürün görseli URL'sini belirle
  const getImageUrl = (product: any): string => {
    if (typeof product.image === 'object' && product.image?.url) {
      return product.image.url;
    }
    return '/images/olive_oil_bottle_1779729109843.png'; // fallback
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#FDFBF7]">
      
      {/* 1. HERO SLIDER / BANNER ALANI (E-Ticaret Stili) */}
      <section className="relative w-full h-[80vh] min-h-[600px] flex items-center justify-center text-center">
        <div className="absolute inset-0 z-0">
          <Image
            src="https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?q=80&w=2000&auto=format&fit=crop"
            alt="Zeytin Bahçesi"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-luxury-black/40"></div>
        </div>
        
        <div className="relative z-10 max-w-4xl mx-auto px-4 flex flex-col items-center">
          <span className="text-gold-400 font-medium tracking-widest-plus uppercase text-sm md:text-base mb-6 drop-shadow-md">
            Doğadan Sofranıza
          </span>
          <h1 className="text-5xl md:text-7xl font-serif text-white mb-8 leading-tight drop-shadow-lg">
            Yeni Hasat <br/> Soğuk Sıkım
          </h1>
          <p className="text-olive-50 text-lg md:text-xl mb-10 max-w-2xl font-light">
            Ege'nin bereketli topraklarından özenle toplanan zeytinlerle hazırlanan, asit oranı düşük premium lezzet.
          </p>
          <Link 
            href="/products" 
            className="bg-gold-500 hover:bg-gold-600 text-white font-medium px-10 py-4 uppercase tracking-wider transition-all duration-300 rounded-full hover:scale-105 shadow-lg"
          >
            Hemen Keşfet
          </Link>
        </div>
      </section>

      {/* 1.5 GÜVEN ROZETLERİ (Trust Badges) */}
      <section className="bg-olive-900 text-white py-8 border-t border-olive-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center divide-y md:divide-y-0 md:divide-x divide-olive-800">
            <div className="p-4 flex flex-col items-center justify-center group">
              <span className="text-gold-400 mb-3 group-hover:scale-110 transition-transform duration-300">
                <Truck size={36} strokeWidth={1.5} />
              </span>
              <h3 className="font-semibold text-lg mb-1 tracking-wide">Hızlı & Güvenli Kargo</h3>
              <p className="text-olive-300 text-sm">Özenle paketlenmiş, kırılmaya karşı garantili</p>
            </div>
            <div className="p-4 flex flex-col items-center justify-center group">
              <span className="text-gold-400 mb-3 group-hover:scale-110 transition-transform duration-300">
                <Leaf size={36} strokeWidth={1.5} />
              </span>
              <h3 className="font-semibold text-lg mb-1 tracking-wide">%100 Doğal Ürünler</h3>
              <p className="text-olive-300 text-sm">Ege'nin bahçelerinden, katkısız ve koruyucusuz</p>
            </div>
            <div className="p-4 flex flex-col items-center justify-center group">
              <span className="text-gold-400 mb-3 group-hover:scale-110 transition-transform duration-300">
                <ShieldCheck size={36} strokeWidth={1.5} />
              </span>
              <h3 className="font-semibold text-lg mb-1 tracking-wide">Güvenli Ödeme</h3>
              <p className="text-olive-300 text-sm">256-bit SSL ve Iyzico güvencesiyle</p>
            </div>
          </div>
        </div>
      </section>

      {/* 2. KATEGORİ VİTRİNİ */}
      <section className="py-20 bg-cream">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-serif text-luxury-charcoal">Kategorilerimiz</h2>
            <div className="w-16 h-1 bg-gold-500 mx-auto mt-6 rounded-full"></div>
          </div>
          
          <div className="grid grid-cols-2 gap-8 justify-center max-w-3xl mx-auto">
            <Link href="/products" className="group flex flex-col items-center text-center">
              <div className="relative w-32 h-32 md:w-48 md:h-48 rounded-full overflow-hidden mb-6 border-4 border-white shadow-lg group-hover:border-gold-400 transition-colors bg-white">
                <Image src="https://images.unsplash.com/photo-1610547939489-73202bc6afda?w=500&q=80" alt="Ahşap masada dalıyla birlikte organik natürel sızma zeytinyağı" fill className="object-cover group-hover:scale-110 transition-transform duration-700" />
              </div>
              <h3 className="text-lg font-medium text-luxury-charcoal group-hover:text-gold-600 transition-colors">Zeytinyağları</h3>
            </Link>
            <Link href="/products" className="group flex flex-col items-center text-center">
              <div className="relative w-32 h-32 md:w-48 md:h-48 rounded-full overflow-hidden mb-6 border-4 border-white shadow-lg group-hover:border-gold-400 transition-colors bg-white">
                <Image src="https://images.unsplash.com/photo-1591122523233-22037c1dec9f?w=500&q=80" alt="Doğal ahşap tabakta taze siyah ve yeşil zeytin çeşitleri" fill className="object-cover group-hover:scale-110 transition-transform duration-700" />
              </div>
              <h3 className="text-lg font-medium text-luxury-charcoal group-hover:text-gold-600 transition-colors">Zeytin Çeşitleri</h3>
            </Link>
          </div>
        </div>
      </section>

      {/* 3. ÖNE ÇIKAN ÜRÜNLER (E-Ticaret Grid) */}
      <section id="products" className="py-24 bg-olive-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-end mb-16">
            <div>
              <h2 className="text-3xl md:text-4xl font-serif text-luxury-charcoal mb-4">Öne Çıkanlar</h2>
              <p className="text-olive-600">Manasor&apos;un en çok tercih edilen doğal ürünleri.</p>
            </div>
            <Link href="/products" className="hidden md:flex items-center text-olive-700 hover:text-gold-600 font-medium uppercase tracking-wider text-sm">
              Tümünü Gör
              <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7"/></svg>
            </Link>
          </div>
          
          {products.length > 0 ? (
            <div className="flex flex-wrap justify-center gap-6 md:gap-8 mx-auto w-full">
              {products.map((product: any) => (
                <div key={product.id || product.slug} className="w-full sm:w-[calc(50%-1.5rem)] lg:w-[calc(33.333%-1.5rem)] xl:w-[calc(25%-1.5rem)] max-w-sm flex-shrink-0">
                  <ProductCard 
                    product={{
                      id: product.slug,
                      name: product.name,
                      shortDescription: product.shortDescription || '',
                      category: product.category,
                      image: getImageUrl(product),
                      secondaryImage: product.secondaryImage,
                      variations: (product.variations || []).map((v: any) => ({
                        id: v.variantId,
                        size: v.size,
                        packaging: v.packaging,
                        price: v.price,
                        stock: v.stock
                      }))
                    }} 
                  />
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16 text-olive-500">
              <p className="text-lg">Henüz ürün eklenmemiş.</p>
              <p className="text-sm mt-2">Admin panelinden ürün eklemek için <Link href="/admin" className="text-gold-600 underline">/admin</Link> adresine gidin.</p>
            </div>
          )}
          
          <div className="mt-12 text-center md:hidden">
            <Link href="/products" className="inline-block border border-olive-700 text-olive-700 hover:bg-olive-700 hover:text-white px-8 py-3 rounded-sm transition-colors font-medium">
              Tüm Ürünleri Gör
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}
