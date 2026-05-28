"use client";

import { useState } from 'react';
import Link from 'next/link';
import ProductCard from '@/components/ProductCard';
import { Filter, ChevronDown, X } from 'lucide-react';

// Dummy data for PLP
const dummyProducts = [
  {
    id: "soguk-sikim-zeytinyagi",
    name: "Erken Hasat Soğuk Sıkım Natürel Sızma Zeytinyağı",
    shortDescription: "0.3 asit oranına sahip, taş baskı yöntemiyle üretilmiş ödüllü zeytinyağımız.",
    category: "Zeytinyağı",
    image: "https://images.unsplash.com/photo-1610547939489-73202bc6afda?w=600&q=80",
    secondaryImage: "https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=600&q=80",
    variations: [{ id: 'v1', size: '500ml', packaging: 'Cam Şişe', price: 450, stock: 50 }]
  },
  {
    id: "gemlik-siyah-zeytin",
    name: "Gemlik Lüks Siyah Zeytin (XL Boy)",
    shortDescription: "İnce kabuklu, küçük çekirdekli ve etli Gemlik tipi siyah zeytin.",
    category: "Zeytin",
    image: "https://images.unsplash.com/photo-1591122523233-22037c1dec9f?w=600&q=80",
    secondaryImage: "https://images.unsplash.com/photo-1505253758473-96b7015fcd40?w=600&q=80",
    variations: [{ id: 'v2', size: '1Kg', packaging: 'Vakum', price: 320, stock: 100 }]
  },
  {
    id: "cizik-yesil-zeytin",
    name: "Edremit Çizik Yeşil Zeytin",
    shortDescription: "Sadece su ve tuz ile fermente edilmiş doğal yeşil zeytin.",
    category: "Zeytin",
    image: "https://images.unsplash.com/photo-1668094497457-29f4bd775c95?w=600&q=80",
    secondaryImage: "https://images.unsplash.com/photo-1599839619722-39751411ea63?w=600&q=80",
    variations: [{ id: 'v3', size: '1Kg', packaging: 'Kavanoz', price: 290, stock: 30 }]
  },
  {
    id: "zeytinyagli-sabun",
    name: "Geleneksel Zeytinyağlı Sabun",
    shortDescription: "Saf zeytinyağından el yapımı, cildi besleyen doğal sabun.",
    category: "Kişisel Bakım",
    image: "https://images.unsplash.com/photo-1600857544200-b2f666a9a2ec?w=600&q=80",
    secondaryImage: "https://images.unsplash.com/photo-1600857062241-98e5dba7f214?w=600&q=80",
    variations: [{ id: 'v4', size: 'Standart', packaging: 'Kutu', price: 120, stock: 200 }]
  }
];

export default function ProductsPage() {
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const FilterContent = () => (
    <div className="space-y-8">
      {/* Kategori Filtresi */}
      <div>
        <h3 className="font-medium text-olive-900 mb-4">Kategori</h3>
        <div className="space-y-3">
          {['Tümü', 'Zeytinyağı', 'Zeytin', 'Gurme Paketler', 'Kişisel Bakım'].map((cat, i) => (
            <label key={i} className="flex items-center space-x-3 cursor-pointer group">
              <input type="checkbox" className="form-checkbox h-5 w-5 text-gold-500 border-olive-300 rounded focus:ring-gold-500" defaultChecked={i===0} />
              <span className="text-olive-700 group-hover:text-gold-600 transition-colors">{cat}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Gramaj Filtresi */}
      <div>
        <h3 className="font-medium text-olive-900 mb-4">Gramaj</h3>
        <div className="space-y-3">
          {['500 ml', '1 Litre', '5 Litre', '1 Kg', '2 Kg'].map((size, i) => (
            <label key={i} className="flex items-center space-x-3 cursor-pointer group">
              <input type="checkbox" className="form-checkbox h-5 w-5 text-gold-500 border-olive-300 rounded focus:ring-gold-500" />
              <span className="text-olive-700 group-hover:text-gold-600 transition-colors">{size}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Fiyat Filtresi */}
      <div>
        <h3 className="font-medium text-olive-900 mb-4">Fiyat Aralığı</h3>
        <div className="flex items-center space-x-2">
          <input 
            type="number" 
            placeholder="Min ₺" 
            className="w-1/2 bg-white border border-olive-200 text-luxury-charcoal px-3 py-2 rounded-lg focus:outline-none focus:border-gold-500"
          />
          <span className="text-olive-400">-</span>
          <input 
            type="number" 
            placeholder="Max ₺" 
            className="w-1/2 bg-white border border-olive-200 text-luxury-charcoal px-3 py-2 rounded-lg focus:outline-none focus:border-gold-500"
          />
        </div>
        <button className="w-full mt-4 bg-olive-50 hover:bg-olive-100 text-olive-700 font-medium py-2 rounded-lg transition-colors border border-olive-200">
          Uygula
        </button>
      </div>
    </div>
  );

  return (
    <div className="bg-cream min-h-screen pt-24 pb-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Breadcrumb & Header */}
        <div className="mb-8">
          <div className="flex text-sm text-olive-500 mb-4">
            <Link href="/" className="hover:text-gold-600 transition-colors">Ana Sayfa</Link>
            <span className="mx-2">/</span>
            <span className="text-luxury-charcoal">Tüm Ürünler</span>
          </div>
          <h1 className="text-4xl font-serif text-luxury-charcoal">Tüm Ürünler</h1>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* Masaüstü Sol Kolon (Filters) */}
          <aside className="hidden lg:block w-64 flex-shrink-0">
            <div className="bg-white p-6 rounded-2xl border border-olive-100 sticky top-28 shadow-sm">
              <div className="flex items-center space-x-2 mb-8 pb-4 border-b border-olive-100">
                <Filter className="w-5 h-5 text-gold-500" />
                <h2 className="font-serif text-luxury-charcoal text-xl">Filtreler</h2>
              </div>
              <FilterContent />
            </div>
          </aside>

          {/* Sağ İçerik (Product Grid & Toolbar) */}
          <div className="flex-1">
            
            {/* Toolbar */}
            <div className="bg-white p-4 rounded-xl border border-olive-100 flex justify-between items-center mb-8 shadow-sm">
              {/* Mobil Filtre Butonu */}
              <button 
                className="lg:hidden flex items-center space-x-2 bg-olive-50 text-olive-700 px-4 py-2 rounded-lg font-medium border border-olive-200"
                onClick={() => setIsFilterOpen(true)}
              >
                <Filter className="w-4 h-4" />
                <span>Filtrele</span>
              </button>

              <p className="hidden sm:block text-sm text-olive-600">
                <span className="font-bold text-luxury-charcoal">4</span> ürün listeleniyor
              </p>

              <div className="flex items-center space-x-2 ml-auto">
                <span className="hidden sm:inline text-sm text-olive-600">Sırala:</span>
                <div className="relative">
                  <select className="appearance-none bg-olive-50 border border-olive-200 text-sm text-luxury-charcoal py-2 pl-4 pr-10 rounded-lg focus:outline-none focus:ring-1 focus:ring-gold-500 focus:border-gold-500 cursor-pointer">
                    <option>En Yeniler</option>
                    <option>En Düşük Fiyat</option>
                    <option>En Yüksek Fiyat</option>
                    <option>Çok Satanlar</option>
                  </select>
                  <ChevronDown className="w-4 h-4 text-olive-500 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
              </div>
            </div>

            {/* Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
              {dummyProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>

            {/* Pagination Placeholder */}
            <div className="mt-12 flex justify-center">
              <div className="flex space-x-2">
                <button className="w-10 h-10 flex items-center justify-center rounded-lg border border-gold-500 bg-gold-500 text-white font-medium shadow-md">1</button>
                <button className="w-10 h-10 flex items-center justify-center rounded-lg border border-olive-200 text-olive-600 hover:bg-olive-50 transition-colors">2</button>
                <button className="w-10 h-10 flex items-center justify-center rounded-lg border border-olive-200 text-olive-600 hover:bg-olive-50 transition-colors">3</button>
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* Mobil Filtre Modal / Drawer */}
      {isFilterOpen && (
        <div className="fixed inset-0 z-50 flex justify-end lg:hidden">
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setIsFilterOpen(false)} />
          <div className="relative w-4/5 max-w-sm h-full bg-cream shadow-2xl overflow-y-auto transform transition-transform animate-slide-in-right">
            <div className="sticky top-0 bg-white/90 backdrop-blur border-b border-olive-100 p-4 flex items-center justify-between z-10">
              <h2 className="font-serif text-luxury-charcoal text-xl flex items-center">
                <Filter className="w-5 h-5 text-gold-500 mr-2" />
                Filtreler
              </h2>
              <button 
                onClick={() => setIsFilterOpen(false)}
                className="p-2 text-olive-400 hover:text-luxury-charcoal transition-colors rounded-full hover:bg-olive-50"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="p-6">
              <FilterContent />
            </div>
            
            <div className="sticky bottom-0 bg-white border-t border-olive-100 p-4 mt-8">
              <button 
                onClick={() => setIsFilterOpen(false)}
                className="w-full bg-olive-900 text-white font-medium py-3 rounded-xl shadow-lg hover:bg-gold-500 transition-colors"
              >
                Sonuçları Göster
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
