"use client";

import { useEffect, useState } from 'react';
import { User as UserIcon, Package, MapPin, CreditCard, LogOut, Heart, ChevronDown, ChevronUp, CheckCircle, Truck, ClipboardList, Clock } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import citiesData from '@/lib/cities.json';

export default function DashboardPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('orders');
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [orders, setOrders] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);
  
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [addressForm, setAddressForm] = useState<any>({ invoiceType: 'bireysel' });

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await fetch('/api/users/me');
        const data = await res.json();
        
        if (res.ok && data.user) {
          setUser(data.user);
          
          // Siparişleri Çek
          try {
            const ordersRes = await fetch(`/api/orders?where[email][equals]=${data.user.email}&sort=-createdAt`);
            if (ordersRes.ok) {
              const ordersData = await ordersRes.json();
              setOrders(ordersData.docs || []);
            }
          } catch (e) {
            console.error('Siparişler çekilemedi', e);
          }

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

  const handleSaveAddress = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const currentAddresses = user.addresses || [];
      const newAddress = { ...addressForm };
      
      const res = await fetch(`/api/users/${user.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          addresses: [...currentAddresses, newAddress]
        })
      });
      if (res.ok) {
        const data = await res.json();
        setUser(data.doc);
        setShowAddressForm(false);
        setAddressForm({ invoiceType: 'bireysel' });
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteAddress = async (id: string) => {
    if (!confirm('Bu adresi silmek istediğinize emin misiniz?')) return;
    try {
      const newAddresses = user.addresses.filter((a: any) => a.id !== id);
      const res = await fetch(`/api/users/${user.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ addresses: newAddresses })
      });
      if (res.ok) {
        const data = await res.json();
        setUser(data.doc);
      }
    } catch (err) {
      console.error(err);
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
            
            {orders.length > 0 ? (
              orders.map((order: any) => (
                <div key={order.id} className="bg-white border border-olive-100 rounded-xl shadow-sm hover:shadow-md transition-shadow overflow-hidden">
                  {/* Header (Clickable for Accordion) */}
                  <div 
                    onClick={() => setExpandedOrder(expandedOrder === order.id ? null : order.id)}
                    className="p-6 cursor-pointer flex justify-between items-center bg-white"
                  >
                    <div className="flex items-center space-x-4 sm:space-x-6">
                      <div className="w-12 h-12 sm:w-16 sm:h-16 bg-olive-50 rounded-lg flex items-center justify-center flex-shrink-0">
                        <Package className="w-6 h-6 sm:w-8 sm:h-8 text-olive-400" />
                      </div>
                      <div>
                        <p className="text-xs sm:text-sm text-olive-500 mb-1">
                          #{order.orderNumber} • {new Date(order.createdAt).toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' })}
                        </p>
                        <p className="font-medium text-luxury-charcoal text-base sm:text-lg">
                          {order.items?.[0]?.name || 'Ürün'} {order.items?.length > 1 ? `ve ${order.items.length - 1} ürün daha` : ''}
                        </p>
                        <p className="text-sm text-olive-600 mt-1">Toplam: <span className="font-bold">{order.totalPrice?.toFixed(2)} ₺</span></p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-4">
                      <div className="text-right hidden sm:block">
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                          order.status === 'paid' ? 'bg-blue-100 text-blue-800' : 
                          order.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                          order.status === 'shipped' ? 'bg-purple-100 text-purple-800' :
                          order.status === 'delivered' ? 'bg-green-100 text-green-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {order.status === 'paid' ? 'Hazırlanıyor' : 
                           order.status === 'pending' ? 'Beklemede' : 
                           order.status === 'shipped' ? 'Kargoya Verildi' : 
                           order.status === 'delivered' ? 'Teslim Edildi' : 'İptal'}
                        </span>
                      </div>
                      <div className="text-olive-400">
                        {expandedOrder === order.id ? <ChevronUp className="w-6 h-6" /> : <ChevronDown className="w-6 h-6" />}
                      </div>
                    </div>
                  </div>

                  {/* Expanded Content */}
                  {expandedOrder === order.id && (
                    <div className="border-t border-olive-100 bg-olive-50/30 p-6">
                      
                      {/* Tracker Path */}
                      {order.status !== 'cancelled' && (
                        <div className="mb-8 hidden sm:block">
                          <div className="relative">
                            <div className="overflow-hidden h-2 mb-4 text-xs flex rounded-full bg-olive-200 relative z-0">
                              <div style={{ width: 
                                order.status === 'pending' ? '25%' : 
                                order.status === 'paid' ? '50%' : 
                                order.status === 'shipped' ? '75%' : 
                                order.status === 'delivered' ? '100%' : '0%' 
                              }} className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-gold-500 transition-all duration-500 z-10"></div>
                            </div>
                            
                            <div className="flex justify-between w-full text-sm font-medium text-olive-600 px-1 relative z-20" style={{ marginTop: '-26px' }}>
                              <div className="flex flex-col items-center">
                                <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 ${['pending', 'paid', 'shipped', 'delivered'].includes(order.status) ? 'bg-gold-500 text-white shadow-md' : 'bg-olive-100 text-olive-400 border-2 border-white'}`}>
                                  <ClipboardList className="w-5 h-5" />
                                </div>
                                <span>Sipariş Alındı</span>
                              </div>
                              <div className="flex flex-col items-center">
                                <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 ${['paid', 'shipped', 'delivered'].includes(order.status) ? 'bg-gold-500 text-white shadow-md' : 'bg-olive-100 text-olive-400 border-2 border-white'}`}>
                                  <Package className="w-5 h-5" />
                                </div>
                                <span>Hazırlanıyor</span>
                              </div>
                              <div className="flex flex-col items-center">
                                <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 ${['shipped', 'delivered'].includes(order.status) ? 'bg-gold-500 text-white shadow-md' : 'bg-olive-100 text-olive-400 border-2 border-white'}`}>
                                  <Truck className="w-5 h-5" />
                                </div>
                                <span>Kargoya Verildi</span>
                              </div>
                              <div className="flex flex-col items-center">
                                <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 ${order.status === 'delivered' ? 'bg-green-500 text-white shadow-md' : 'bg-olive-100 text-olive-400 border-2 border-white'}`}>
                                  <CheckCircle className="w-5 h-5" />
                                </div>
                                <span>Teslim Edildi</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Address Info */}
                        <div className="bg-white p-5 rounded-xl border border-olive-100 shadow-sm">
                          <h4 className="font-serif text-lg text-luxury-charcoal mb-3 flex items-center border-b border-olive-50 pb-2">
                            <MapPin className="w-5 h-5 text-gold-500 mr-2" />
                            Teslimat ve Fatura Adresi
                          </h4>
                          <p className="font-medium text-olive-900">{order.firstName} {order.lastName}</p>
                          <p className="text-sm text-olive-600 mt-1">{order.phone}</p>
                          <p className="text-sm text-olive-600 mt-2">{order.address}</p>
                          <p className="text-sm text-olive-600">{order.district} / {order.city}</p>
                          {order.invoiceType === 'kurumsal' && (
                            <div className="mt-3 pt-3 border-t border-olive-50 text-xs text-olive-500">
                              <p><strong>Firma:</strong> {order.companyName}</p>
                              <p><strong>Vergi:</strong> {order.taxOffice} - {order.taxNumber}</p>
                            </div>
                          )}
                        </div>

                        {/* Order Summary */}
                        <div className="bg-white p-5 rounded-xl border border-olive-100 shadow-sm">
                          <h4 className="font-serif text-lg text-luxury-charcoal mb-3 flex items-center border-b border-olive-50 pb-2">
                            <CreditCard className="w-5 h-5 text-gold-500 mr-2" />
                            Ödeme Bilgileri
                          </h4>
                          <div className="space-y-2 mb-4">
                            {order.items?.map((item: any, i: number) => (
                              <div key={i} className="flex justify-between text-sm">
                                <span className="text-olive-700">{item.name} (x{item.quantity})</span>
                                <span className="font-medium text-olive-900">{(item.price * item.quantity).toFixed(2)} ₺</span>
                              </div>
                            ))}
                          </div>
                          
                          <div className="pt-3 border-t border-olive-100 space-y-2">
                            <div className="flex justify-between text-sm">
                              <span className="text-olive-600">Ara Toplam</span>
                              <span className="text-olive-900">{order.totalPrice?.toFixed(2)} ₺</span>
                            </div>
                            <div className="flex justify-between text-sm">
                              <span className="text-olive-600">Kargo</span>
                              <span className="text-olive-900">{order.shippingPrice ? `${order.shippingPrice.toFixed(2)} ₺` : 'Ücretsiz'}</span>
                            </div>
                            <div className="flex justify-between pt-2 border-t border-olive-100 mt-2">
                              <span className="font-medium text-luxury-charcoal">Toplam</span>
                              <span className="font-bold text-lg text-gold-600">{(order.totalPrice + (order.shippingPrice || 0)).toFixed(2)} ₺</span>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                    </div>
                  )}
                </div>
              ))
            ) : (
              <div className="text-center py-12 bg-olive-50/50 rounded-xl border border-dashed border-olive-200">
                <Package className="w-12 h-12 text-olive-300 mx-auto mb-4" />
                <h4 className="text-lg font-medium text-olive-900">Başka siparişiniz bulunmuyor</h4>
                <p className="text-olive-500 mt-2 mb-6">Manasor'un eşsiz lezzetlerini keşfetmeye devam edin.</p>
                <Link href="/products" className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-xl text-white bg-olive-900 hover:bg-gold-500 transition-colors">
                  Alışverişe Başla
                </Link>
              </div>
            )}
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
                  <input type="text" defaultValue={user.name} className="w-full p-3 border border-olive-200 rounded-xl focus:ring-gold-500 focus:border-gold-500 text-olive-900 placeholder:text-olive-400" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-olive-900 mb-1">E-posta Adresi</label>
                <input type="email" defaultValue={user.email} disabled className="w-full p-3 border border-olive-100 bg-olive-50 text-olive-500 rounded-xl cursor-not-allowed" />
                <p className="text-xs text-olive-400 mt-1">E-posta adresinizi değiştirmek için müşteri hizmetleriyle iletişime geçin.</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-olive-900 mb-1">Telefon</label>
                <input type="tel" defaultValue={user.phone_number || ''} placeholder="0555 123 45 67" className="w-full p-3 border border-olive-200 rounded-xl focus:ring-gold-500 focus:border-gold-500 text-olive-900 placeholder:text-olive-400" />
              </div>
              <button type="button" className="bg-olive-900 text-white px-6 py-3 rounded-xl font-medium hover:bg-gold-500 transition-colors">
                Bilgileri Güncelle
              </button>
            </form>
          </div>
        );
      case 'addresses':
        if (showAddressForm) {
          return (
            <div className="space-y-6">
              <div className="flex justify-between items-center border-b border-olive-100 pb-4">
                <h3 className="text-xl font-serif text-luxury-charcoal">Yeni Adres Ekle</h3>
                <button onClick={() => setShowAddressForm(false)} className="text-olive-500 hover:text-olive-700 text-sm">Vazgeç</button>
              </div>
              <form onSubmit={handleSaveAddress} className="space-y-4 max-w-2xl">
                <div>
                  <input required placeholder="Adres Başlığı (Örn: Ev, İş)" value={addressForm.title || ''} onChange={e => setAddressForm({...addressForm, title: e.target.value})} className="w-full p-3 border border-olive-200 rounded-xl text-olive-900 placeholder:text-olive-400" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <input required placeholder="Ad" value={addressForm.firstName || ''} onChange={e => setAddressForm({...addressForm, firstName: e.target.value})} className="w-full p-3 border border-olive-200 rounded-xl text-olive-900 placeholder:text-olive-400" />
                  <input required placeholder="Soyad" value={addressForm.lastName || ''} onChange={e => setAddressForm({...addressForm, lastName: e.target.value})} className="w-full p-3 border border-olive-200 rounded-xl text-olive-900 placeholder:text-olive-400" />
                </div>
                <div>
                  <input required placeholder="Telefon" value={addressForm.phone || ''} onChange={e => setAddressForm({...addressForm, phone: e.target.value})} className="w-full p-3 border border-olive-200 rounded-xl text-olive-900 placeholder:text-olive-400" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <select 
                      required 
                      value={addressForm.city || ''} 
                      onChange={e => setAddressForm({...addressForm, city: e.target.value, district: ''})} 
                      className="w-full p-3 border border-olive-200 rounded-xl"
                    >
                      <option value="">İl Seçiniz</option>
                      {citiesData.map(c => <option key={c.name} value={c.name}>{c.name}</option>)}
                    </select>
                  </div>
                  <div>
                    <select 
                      required 
                      disabled={!addressForm.city}
                      value={addressForm.district || ''} 
                      onChange={e => setAddressForm({...addressForm, district: e.target.value})} 
                      className="w-full p-3 border border-olive-200 rounded-xl disabled:bg-gray-50"
                    >
                      <option value="">İlçe Seçiniz</option>
                      {addressForm.city && citiesData.find(c => c.name === addressForm.city)?.districts.map((d: string) => (
                        <option key={d} value={d}>{d}</option>
                      ))}
                    </select>
                  </div>
                </div>
                <div>
                  <textarea required placeholder="Açık Adres" value={addressForm.address || ''} onChange={e => setAddressForm({...addressForm, address: e.target.value})} className="w-full p-3 border border-olive-200 rounded-xl" rows={3}></textarea>
                </div>
                
                <div className="flex gap-6 mt-4">
                  <label className="flex items-center cursor-pointer">
                    <input type="radio" checked={addressForm.invoiceType === 'bireysel'} onChange={() => setAddressForm({...addressForm, invoiceType: 'bireysel'})} className="form-radio text-gold-500" />
                    <span className="ml-2">Bireysel</span>
                  </label>
                  <label className="flex items-center cursor-pointer">
                    <input type="radio" checked={addressForm.invoiceType === 'kurumsal'} onChange={() => setAddressForm({...addressForm, invoiceType: 'kurumsal'})} className="form-radio text-gold-500" />
                    <span className="ml-2">Kurumsal</span>
                  </label>
                </div>

                {addressForm.invoiceType === 'bireysel' && (
                  <input placeholder="T.C. Kimlik No" value={addressForm.identityNumber || ''} onChange={e => setAddressForm({...addressForm, identityNumber: e.target.value})} className="w-full p-3 border border-olive-200 rounded-xl text-olive-900 placeholder:text-olive-400" />
                )}

                {addressForm.invoiceType === 'kurumsal' && (
                  <div className="space-y-4">
                    <input placeholder="Firma Adı" value={addressForm.companyName || ''} onChange={e => setAddressForm({...addressForm, companyName: e.target.value})} className="w-full p-3 border border-olive-200 rounded-xl text-olive-900 placeholder:text-olive-400" />
                    <div className="grid grid-cols-2 gap-4">
                      <input placeholder="Vergi Dairesi" value={addressForm.taxOffice || ''} onChange={e => setAddressForm({...addressForm, taxOffice: e.target.value})} className="w-full p-3 border border-olive-200 rounded-xl text-olive-900 placeholder:text-olive-400" />
                      <input placeholder="Vergi No" value={addressForm.taxNumber || ''} onChange={e => setAddressForm({...addressForm, taxNumber: e.target.value})} className="w-full p-3 border border-olive-200 rounded-xl text-olive-900 placeholder:text-olive-400" />
                    </div>
                  </div>
                )}
                
                <button type="submit" className="bg-olive-900 text-white px-6 py-3 rounded-xl font-medium hover:bg-gold-500 transition-colors mt-4">Adresi Kaydet</button>
              </form>
            </div>
          );
        }

        return (
          <div className="space-y-6">
            <div className="flex justify-between items-center border-b border-olive-100 pb-4">
              <h3 className="text-xl font-serif text-luxury-charcoal">Adreslerim</h3>
              <button onClick={() => setShowAddressForm(true)} className="text-gold-600 font-medium hover:text-gold-500 text-sm transition-colors">
                + Yeni Adres Ekle
              </button>
            </div>
            
            {(!user.addresses || user.addresses.length === 0) ? (
              <div className="text-center py-8 text-olive-500">
                Kayıtlı adresiniz bulunmuyor. Sipariş vermek için hemen bir tane ekleyin.
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {user.addresses.map((addr: any) => (
                  <div key={addr.id} className="border border-olive-200 rounded-xl p-5 relative group hover:border-gold-500 transition-colors">
                    <div className="absolute top-5 right-5 space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button onClick={() => handleDeleteAddress(addr.id)} className="text-xs font-medium text-red-600 hover:text-red-700">Sil</button>
                    </div>
                    <div className="flex items-center space-x-2 mb-3">
                      <MapPin className="w-5 h-5 text-gold-500" />
                      <h4 className="font-medium text-olive-900">{addr.title}</h4>
                    </div>
                    <p className="text-sm text-olive-600 mb-1">{addr.firstName} {addr.lastName}</p>
                    <p className="text-sm text-olive-600 mb-1">{addr.phone}</p>
                    <p className="text-sm text-olive-600 line-clamp-2">{addr.address} {addr.district} / {addr.city}</p>
                    {addr.invoiceType === 'kurumsal' && (
                      <p className="text-xs text-olive-400 mt-2">Kurumsal: {addr.companyName}</p>
                    )}
                  </div>
                ))}
              </div>
            )}
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
