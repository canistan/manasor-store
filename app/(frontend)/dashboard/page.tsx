"use client";

import { useEffect, useState } from 'react';
import { User as UserIcon, Package, MapPin, CreditCard, LogOut, Heart } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function DashboardPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('orders');
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await fetch('/api/users/me');
        const data = await res.json();
        
        if (res.ok && data.user) {
          setUser(data.user);
        } else {
          router.push('/login');
        }
      } catch (err) {
        router.push('/login');
      } finally {
        setIsLoading(false);
      }
    };
    checkAuth();
  }, [router]);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await fetch('/api/users/logout', { method: 'POST' });
      router.push('/login');
      router.refresh();
    } catch (err) {
      console.error(err);
      setIsLoggingOut(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-cream flex justify-center items-center">
        <div className="w-8 h-8 border-4 border-gold-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!user) return null;

  const renderTabContent = () => {
    switch (activeTab) {
      case 'orders':
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-serif text-luxury-charcoal border-b border-olive-100 pb-4">Siparişlerim</h3>
            {/* Dummy Order List */}
            <div className="bg-white border border-olive-100 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex justify-between items-center mb-4 pb-4 border-b border-olive-50">
                <div>
                  <p className="text-sm text-olive-500">Sipariş No</p>
                  <p className="font-medium text-olive-900">#ORD-1005</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-olive-500">Tarih</p>
                  <p className="font-medium text-olive-900">24 Ekim 2023</p>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <div className="flex items-center space-x-4">
                  <div className="w-16 h-16 bg-olive-50 rounded-lg flex items-center justify-center">
                    <Package className="w-8 h-8 text-olive-400" />
                  </div>
                  <div>
                    <p className="font-medium text-luxury-charcoal">Zeytinyağı ve Zeytin Seti</p>
                    <p className="text-sm text-olive-500">2 Ürün</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold text-olive-900">1.250,00 ₺</p>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    Teslim Edildi
                  </span>
                </div>
              </div>
            </div>
            
            {/* Empty State */}
            <div className="text-center py-12 bg-olive-50/50 rounded-xl border border-dashed border-olive-200">
              <Package className="w-12 h-12 text-olive-300 mx-auto mb-4" />
              <h4 className="text-lg font-medium text-olive-900">Başka siparişiniz bulunmuyor</h4>
              <p className="text-olive-500 mt-2 mb-6">Manasor'un eşsiz lezzetlerini keşfetmeye devam edin.</p>
              <Link href="/products" className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-xl text-white bg-olive-900 hover:bg-gold-500 transition-colors">
                Alışverişe Başla
              </Link>
            </div>
          </div>
        );
      case 'profile':
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-serif text-luxury-charcoal border-b border-olive-100 pb-4">Profil Bilgileri</h3>
            <form className="space-y-6 max-w-xl">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-olive-900 mb-1">Ad Soyad</label>
                  <input type="text" defaultValue={user.name} className="w-full p-3 border border-olive-200 rounded-xl focus:ring-gold-500 focus:border-gold-500" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-olive-900 mb-1">E-posta Adresi</label>
                <input type="email" defaultValue={user.email} disabled className="w-full p-3 border border-olive-100 bg-olive-50 text-olive-500 rounded-xl cursor-not-allowed" />
                <p className="text-xs text-olive-400 mt-1">E-posta adresinizi değiştirmek için müşteri hizmetleriyle iletişime geçin.</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-olive-900 mb-1">Telefon</label>
                <input type="tel" defaultValue="0555 123 45 67" className="w-full p-3 border border-olive-200 rounded-xl focus:ring-gold-500 focus:border-gold-500" />
              </div>
              <button type="button" className="bg-olive-900 text-white px-6 py-3 rounded-xl font-medium hover:bg-gold-500 transition-colors">
                Bilgileri Güncelle
              </button>
            </form>
          </div>
        );
      case 'addresses':
        return (
          <div className="space-y-6">
            <div className="flex justify-between items-center border-b border-olive-100 pb-4">
              <h3 className="text-xl font-serif text-luxury-charcoal">Adreslerim</h3>
              <button className="text-gold-600 font-medium hover:text-gold-500 text-sm transition-colors">
                + Yeni Adres Ekle
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Adres Kartı */}
              <div className="border border-olive-200 rounded-xl p-5 relative group hover:border-gold-500 transition-colors">
                <div className="absolute top-5 right-5 space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button className="text-xs font-medium text-olive-600 hover:text-gold-600">Düzenle</button>
                  <button className="text-xs font-medium text-red-600 hover:text-red-700">Sil</button>
                </div>
                <div className="flex items-center space-x-2 mb-3">
                  <MapPin className="w-5 h-5 text-gold-500" />
                  <h4 className="font-medium text-olive-900">Ev Adresim</h4>
                </div>
                <p className="text-sm text-olive-600 mb-1">{user.name}</p>
                <p className="text-sm text-olive-600 mb-1">0555 123 45 67</p>
                <p className="text-sm text-olive-600 line-clamp-2">Moda Cad. No:15 D:4 Kadıköy / İstanbul</p>
              </div>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-cream pt-12 pb-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="mb-10 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-serif text-luxury-charcoal">Hesabım</h1>
            <p className="text-olive-600 mt-1">Hoş geldiniz, <span className="font-medium text-olive-900">{user.name}</span></p>
          </div>
          <button 
            onClick={handleLogout}
            disabled={isLoggingOut}
            className="flex items-center space-x-2 text-olive-500 hover:text-red-600 transition-colors disabled:opacity-50"
          >
            <LogOut className="w-5 h-5" />
            <span className="font-medium">{isLoggingOut ? 'Çıkış yapılıyor...' : 'Çıkış Yap'}</span>
          </button>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* Sidebar Menu */}
          <aside className="w-full lg:w-64 flex-shrink-0">
            <div className="bg-white rounded-2xl shadow-sm border border-olive-100 overflow-hidden sticky top-28">
              <div className="p-6 bg-olive-50/50 border-b border-olive-100 flex flex-col items-center text-center">
                <div className="w-20 h-20 bg-olive-100 rounded-full flex items-center justify-center mb-3">
                  <UserIcon className="w-10 h-10 text-olive-400" />
                </div>
                <h2 className="font-medium text-olive-900">{user.name}</h2>
                <p className="text-xs text-olive-500 mt-1">{new Date(user.createdAt || Date.now()).toLocaleDateString('tr-TR', { month: 'long', year: 'numeric' })}'den beri üye</p>
              </div>
              <nav className="flex flex-col p-2">
                <button
                  onClick={() => setActiveTab('orders')}
                  className={`flex items-center space-x-3 px-4 py-3 rounded-xl transition-colors ${activeTab === 'orders' ? 'bg-zinc-900 text-white font-medium shadow-md' : 'text-olive-700 hover:bg-olive-50'}`}
                >
                  <Package className="w-5 h-5" />
                  <span>Siparişlerim</span>
                </button>
                <button
                  onClick={() => setActiveTab('profile')}
                  className={`flex items-center space-x-3 px-4 py-3 rounded-xl transition-colors ${activeTab === 'profile' ? 'bg-zinc-900 text-white font-medium shadow-md' : 'text-olive-700 hover:bg-olive-50'}`}
                >
                  <UserIcon className="w-5 h-5" />
                  <span>Profil Bilgileri</span>
                </button>
                <button
                  onClick={() => setActiveTab('addresses')}
                  className={`flex items-center space-x-3 px-4 py-3 rounded-xl transition-colors ${activeTab === 'addresses' ? 'bg-zinc-900 text-white font-medium shadow-md' : 'text-olive-700 hover:bg-olive-50'}`}
                >
                  <MapPin className="w-5 h-5" />
                  <span>Adreslerim</span>
                </button>
              </nav>
            </div>
          </aside>

          {/* Main Content Area */}
          <main className="flex-1 bg-white rounded-2xl shadow-sm border border-olive-100 p-6 md:p-8">
            {renderTabContent()}
          </main>

        </div>
      </div>
    </div>
  );
}
