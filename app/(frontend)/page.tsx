import Image from "next/image";
import Link from "next/link";
import ProductCard from "@/components/ProductCard";
import { getPayload } from 'payload'
import configPromise from '@payload-config'

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
      <section className="relative w-full h-[500px] md:h-[600px] flex items-center bg-olive-900">
        <div className="absolute inset-0 z-0">
          <Image
            src="/images/hero_banner_1779729149147.png"
            alt="Yeni Hasat Başladı"
            fill
            className="object-cover opacity-80"
            priority
          />
        </div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="max-w-xl bg-white/90 p-8 md:p-12 backdrop-blur-sm shadow-xl rounded-sm">
            <span className="text-gold-600 font-bold uppercase tracking-wider text-sm mb-4 block">
              Erken Hasat, Soğuk Sıkım
            </span>
            <h1 className="text-4xl md:text-5xl font-serif text-luxury-charcoal mb-6 leading-tight">
              2026 Yeni Hasat <br/> Zeytinyağları Çıktı!
            </h1>
            <p className="text-olive-700 mb-8 font-medium">
              Ege&apos;nin bereketli topraklarından özenle toplanan zeytinlerle hazırlanan, asit oranı düşük premium lezzet.
            </p>
            <Link 
              href={products.length > 0 ? `/products/${products[0].slug}` : "/products/soguk-sikim-zeytinyagi"} 
              className="inline-block bg-olive-700 hover:bg-olive-900 text-white font-medium px-8 py-4 uppercase tracking-wider transition-colors rounded-sm"
            >
              Hemen İncele
            </Link>
          </div>
        </div>
      </section>

      {/* 2. KATEGORİ VİTRİNİ */}
      <section className="py-16 bg-white border-b border-olive-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-2xl md:text-3xl font-serif text-luxury-charcoal">Kategoriler</h2>
            <div className="w-16 h-1 bg-gold-500 mx-auto mt-4"></div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Link href="#products" className="group block text-center">
              <div className="relative aspect-square md:aspect-video rounded-sm overflow-hidden mb-4 bg-cream border border-olive-100 group-hover:border-gold-400 transition-colors">
                <Image src="/images/olive_oil_bottle_1779729109843.png" alt="Zeytinyağları" fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
              </div>
              <h3 className="text-lg font-medium text-luxury-charcoal group-hover:text-gold-600">Zeytinyağları</h3>
            </Link>
            <Link href="#products" className="group block text-center">
              <div className="relative aspect-square md:aspect-video rounded-sm overflow-hidden mb-4 bg-cream border border-olive-100 group-hover:border-gold-400 transition-colors">
                <Image src="/images/black_olives_jar_1779729123320.png" alt="Zeytinler" fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
              </div>
              <h3 className="text-lg font-medium text-luxury-charcoal group-hover:text-gold-600">Zeytin Çeşitleri</h3>
            </Link>
            <Link href="#products" className="group block text-center">
              <div className="relative aspect-square md:aspect-video rounded-sm overflow-hidden mb-4 bg-cream border border-olive-100 group-hover:border-gold-400 transition-colors">
                <Image src="/images/olive_soap_1779729135941.png" alt="Kişisel Bakım" fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
              </div>
              <h3 className="text-lg font-medium text-luxury-charcoal group-hover:text-gold-600">Kişisel Bakım</h3>
            </Link>
          </div>
        </div>
      </section>

      {/* 3. ÖNE ÇIKAN ÜRÜNLER (E-Ticaret Grid) */}
      <section id="products" className="py-20 bg-[#FDFBF7]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-end mb-12">
            <div>
              <h2 className="text-3xl md:text-4xl font-serif text-luxury-charcoal mb-2">Çok Satanlar</h2>
              <p className="text-olive-600">Manasor&apos;un en çok tercih edilen doğal ürünleri.</p>
            </div>
            <Link href="/products" className="hidden md:inline-block text-olive-700 hover:text-gold-600 font-medium underline underline-offset-4">
              Tüm Ürünleri Gör
            </Link>
          </div>
          
          {products.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
              {products.map((product: any) => (
                <ProductCard 
                  key={product.id} 
                  product={{
                    id: product.slug,
                    name: product.name,
                    shortDescription: product.shortDescription || '',
                    category: product.category,
                    image: getImageUrl(product),
                    variations: (product.variations || []).map((v: any) => ({
                      id: v.variantId,
                      size: v.size,
                      packaging: v.packaging,
                      price: v.price,
                      stock: v.stock,
                    })),
                  }} 
                />
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
