"use client";

import { useState, useMemo } from 'react';
import Link from 'next/link';
import ProductCard from '@/components/ProductCard';
import { Filter, ChevronDown, X } from 'lucide-react';

export default function ProductsClient({ products }: { products: any[] }) {
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('Tümü');

  const categories = ['Tümü', ...Array.from(new Set(products.map(p => p.category)))].filter(Boolean);

  const filteredProducts = useMemo(() => {
    let result = products;
    if (selectedCategory !== 'Tümü') {
      result = result.filter(p => p.category === selectedCategory);
    }
    return result;
  }, [products, selectedCategory]);

  const FilterContent = () => (
    <div className="space-y-8">
      {/* Kategori Filtresi */}
      <div>
        <h3 className="font-medium text-olive-900 mb-4">Kategori</h3>
        <div className="space-y-3">
          {categories.map((cat, i) => (
            <label key={i} className="flex items-center space-x-3 cursor-pointer group">
              <input 
                type="radio" 
                name="category"
                checked={selectedCategory === cat}
                onChange={() => setSelectedCategory(cat as string)}
                className="form-radio h-5 w-5 text-gold-500 border-olive-300 focus:ring-gold-500" 
              />
              <span className="text-olive-700 group-hover:text-gold-600 transition-colors">{cat}</span>
            </label>
          ))}
        </div>
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
              <button 
                className="lg:hidden flex items-center space-x-2 bg-olive-50 text-olive-700 px-4 py-2 rounded-lg font-medium border border-olive-200"
                onClick={() => setIsFilterOpen(true)}
              >
                <Filter className="w-4 h-4" />
                <span>Filtrele</span>
              </button>

              <p className="hidden sm:block text-sm text-olive-600">
                <span className="font-bold text-luxury-charcoal">{filteredProducts.length}</span> ürün listeleniyor
              </p>
            </div>

            {/* Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredProducts.map((product) => (
                <ProductCard key={product.id || product.slug} product={product} />
              ))}
              {filteredProducts.length === 0 && (
                <div className="col-span-full text-center py-12 text-olive-500">
                  Bu kategoride ürün bulunamadı.
                </div>
              )}
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
