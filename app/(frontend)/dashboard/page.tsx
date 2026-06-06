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
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  
  const [confirmModal, setConfirmModal] = useState<{isOpen: boolean, orderId: string, action: 'cancel'|'return'|null, loading: boolean}>({
    isOpen: false, orderId: '', action: null, loading: false
  });
  const [successModal, setSuccessModal] = useState<{isOpen: boolean, message: string}>({
    isOpen: false, message: ''
  });

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await fetch('/api/customers/me');
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
      await fetch('/api/customers/logout', { method: 'POST' });
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
      
      const res = await fetch(`/api/customers/${user.id}`, {
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
      const res = await fetch(`/api/customers/${user.id}`, {
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

  const handleOrderAction = (orderId: string, action: 'cancel' | 'return') => {
    setConfirmModal({
      isOpen: true,
      orderId,
      action,
      loading: false
    });
  };

  const confirmOrderAction = async () => {
    const { orderId, action } = confirmModal;
    if (!orderId || !action) return;

    setConfirmModal(prev => ({ ...prev, loading: true }));

    try {
      const res = await fetch('/api/orders/action', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId, action })
      });

      if (res.ok) {
        const isCancel = action === 'cancel';
        setConfirmModal({ isOpen: false, orderId: '', action: null, loading: false });
        setSuccessModal({
          isOpen: true,
          message: isCancel ? 'İptal talebiniz başarıyla alınmıştır. İnceleme sonrası iade işleminiz gerçekleştirilecektir.' : 'İade talebiniz başarıyla alınmıştır. Müşteri hizmetlerimiz sizinle iletişime geçecektir.'
        });
        
        router.refresh();
        setOrders(orders.map(o => o.id === orderId ? { ...o, status: isCancel ? 'cancel_requested' : 'return_requested' } : o));
      } else {
        const data = await res.json();
        alert(data.error || 'Bir hata oluştu.');
        setConfirmModal(prev => ({ ...prev, loading: false }));
      }
    } catch (err) {
      console.error(err);
      alert('Sistemde geçici bir hata oluştu.');
      setConfirmModal(prev => ({ ...prev, loading: false }));
    }
  };

  const handleDeleteAccount = async () => {
    setIsDeleting(true);
    try {
      const res = await fetch('/api/customers/delete', { method: 'POST' });
      if (res.ok) {
        // Çıkış yap ve anasayfaya yönlendir
        await fetch('/api/customers/logout', { method: 'POST' });
        router.push('/');
        router.refresh();
      } else {
        const errorData = await res.json();
        alert('Bir hata oluştu: ' + (errorData.error || 'Bilinmeyen hata'));
        setIsDeleting(false);
      }
    } catch (err) {
      console.error(err);
      alert('Hesap silinirken bir hata oluştu.');
      setIsDeleting(false);
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
                           order.status === 'delivered' ? 'Teslim Edildi' :
                           order.status === 'cancel_requested' ? 'İptal Bekliyor' :
                           order.status === 'return_requested' ? 'İade Bekliyor' :
                           order.status === 'cancelled' ? 'İptal Edildi' : 'İptal'}
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
                      {['pending', 'paid', 'shipped', 'delivered'].includes(order.status) ? (
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
                      ) : (
                        <div className="mb-8">
                          <div className={`p-6 rounded-xl border ${order.status === 'cancelled' ? 'bg-red-50 border-red-100 text-red-800' : 'bg-orange-50 border-orange-100 text-orange-800'}`}>
                            <h4 className="font-serif text-lg mb-2 flex items-center">
                              {order.status === 'cancel_requested' ? 'Sipariş İptal Talebi Alındı' : 
                               order.status === 'return_requested' ? 'Sipariş İade Talebi Alındı' : 'Sipariş İptal Edildi'}
                            </h4>
                            <p className="text-sm">
                              {order.status === 'cancel_requested' || order.status === 'return_requested' 
                                ? 'Talebiniz ekibimize ulaştı ve inceleniyor. Müşteri temsilcimiz en kısa sürede sizinle iletişime geçecek veya ödeme iadeniz Iyzico üzerinden yapılacaktır.'
                                : 'Bu siparişiniz iptal edilmiş olup ilgili tutar kartınıza iade edilmiştir. İadenin kartınıza yansıması bankanıza bağlı olarak 1-3 iş günü sürebilir.'}
                            </p>
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
                      
                      {/* Action Buttons */}
                      <div className="mt-6 flex justify-end space-x-4 border-t border-olive-100 pt-6">
                        {(order.status === 'pending' || order.status === 'paid') && (
                          <button
                            onClick={() => handleOrderAction(order.id, 'cancel')}
                            className="px-6 py-2 bg-white border border-red-200 text-red-600 rounded-lg hover:bg-red-50 hover:border-red-300 font-medium transition-colors text-sm flex items-center"
                          >
                            Siparişi İptal Et
                          </button>
                        )}
                        {order.status === 'delivered' && (
                          <button
                            onClick={() => handleOrderAction(order.id, 'return')}
                            className="px-6 py-2 bg-white border border-olive-200 text-olive-700 rounded-lg hover:bg-olive-50 hover:border-olive-300 font-medium transition-colors text-sm flex items-center"
                          >
                            İade Talebi Oluştur
                          </button>
                        )}
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

            <div className="mt-12 pt-8 border-t border-red-100 max-w-xl">
              <h4 className="text-lg font-medium text-luxury-charcoal mb-2">Hesap İşlemleri</h4>
              <p className="text-sm text-olive-600 mb-4">
                KVKK kapsamında hesabınızı silmek ve kişisel verilerinizi sistemden kaldırmak istiyorsanız bu seçeneği kullanabilirsiniz.
              </p>
              <button 
                onClick={() => setShowDeleteModal(true)}
                className="bg-white border border-red-200 text-red-600 px-6 py-3 rounded-xl font-medium hover:bg-red-50 transition-colors"
              >
                Hesabımı Sil (Anonimleştir)
              </button>
            </div>
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
                      className="w-full p-3 border border-olive-200 rounded-xl text-olive-900 bg-white"
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
                      className="w-full p-3 border border-olive-200 rounded-xl disabled:bg-gray-50 text-olive-900 bg-white"
                    >
                      <option value="">İlçe Seçiniz</option>
                      {addressForm.city && citiesData.find(c => c.name === addressForm.city)?.districts.map((d: string) => (
                        <option key={d} value={d}>{d}</option>
                      ))}
                    </select>
                  </div>
                </div>
                <div>
                  <textarea required placeholder="Açık Adres" value={addressForm.address || ''} onChange={e => setAddressForm({...addressForm, address: e.target.value})} className="w-full p-3 border border-olive-200 rounded-xl text-olive-900 bg-white" rows={3}></textarea>
                </div>
                
                <div className="flex gap-6 mt-4">
                  <label className="flex items-center cursor-pointer text-olive-900">
                    <input type="radio" checked={addressForm.invoiceType === 'bireysel'} onChange={() => setAddressForm({...addressForm, invoiceType: 'bireysel'})} className="form-radio text-gold-500" />
                    <span className="ml-2">Bireysel</span>
                  </label>
                  <label className="flex items-center cursor-pointer text-olive-900">
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

      {/* Hesap Silme Onay Modalı */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" onClick={() => !isDeleting && setShowDeleteModal(false)}></div>
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6 relative z-10 animate-fade-in-up">
            <h3 className="text-xl font-serif text-red-600 mb-4">Hesabınızı Silmek İstediğinize Emin Misiniz?</h3>
            <p className="text-olive-700 mb-4 text-sm leading-relaxed">
              Bu işlem geri alınamaz. KVKK kapsamında kişisel profil bilgileriniz kalıcı olarak silinecek ve anonimleştirilecektir.
            </p>
            <p className="text-olive-700 mb-6 text-sm leading-relaxed bg-red-50 p-3 rounded-lg border border-red-100">
              <strong>Önemli:</strong> Daha önce vermiş olduğunuz siparişlere ait fatura verileri yasal zorunluluklar (Vergi Usul Kanunu) gereği yasal süreler boyunca saklanmaya devam edecektir.
            </p>
            <div className="flex gap-4 justify-end">
              <button 
                onClick={() => setShowDeleteModal(false)}
                disabled={isDeleting}
                className="px-5 py-2.5 rounded-xl font-medium text-olive-600 hover:bg-olive-50 transition-colors disabled:opacity-50"
              >
                Vazgeç
              </button>
              <button 
                onClick={handleDeleteAccount}
                disabled={isDeleting}
                className="px-5 py-2.5 rounded-xl font-medium bg-red-600 text-white hover:bg-red-700 transition-colors disabled:opacity-50 flex items-center"
              >
                {isDeleting ? 'Siliniyor...' : 'Evet, Hesabımı Sil'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Sipariş Aksiyon (İptal/İade) Onay Modalı */}
      {confirmModal.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" onClick={() => !confirmModal.loading && setConfirmModal({ ...confirmModal, isOpen: false })}></div>
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6 relative z-10 animate-fade-in-up">
            <h3 className={`text-xl font-serif mb-4 ${confirmModal.action === 'cancel' ? 'text-red-600' : 'text-orange-600'}`}>
              {confirmModal.action === 'cancel' ? 'Siparişi İptal Et' : 'İade Talebi Oluştur'}
            </h3>
            <p className="text-olive-700 mb-6 text-sm leading-relaxed">
              {confirmModal.action === 'cancel' 
                ? 'Siparişinizi iptal etmek istediğinize emin misiniz? Müşteri hizmetlerimiz iptal işleminizi onayladıktan sonra Iyzico üzerinden para iadeniz yapılacaktır.' 
                : 'Bu siparişiniz için iade talebi oluşturmak istediğinize emin misiniz? Ekiplerimiz iade kargo kodu ve süreci için sizinle iletişime geçecektir.'}
            </p>
            <div className="flex gap-4 justify-end">
              <button 
                onClick={() => setConfirmModal({ ...confirmModal, isOpen: false })}
                disabled={confirmModal.loading}
                className="px-5 py-2.5 rounded-xl font-medium text-olive-600 hover:bg-olive-50 transition-colors disabled:opacity-50"
              >
                Vazgeç
              </button>
              <button 
                onClick={confirmOrderAction}
                disabled={confirmModal.loading}
                className={`px-5 py-2.5 rounded-xl font-medium text-white transition-colors disabled:opacity-50 flex items-center ${confirmModal.action === 'cancel' ? 'bg-red-600 hover:bg-red-700' : 'bg-orange-500 hover:bg-orange-600'}`}
              >
                {confirmModal.loading ? 'İşleniyor...' : 'Evet, Onaylıyorum'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Başarı Modalı */}
      {successModal.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setSuccessModal({ isOpen: false, message: '' })}></div>
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-8 relative z-10 animate-fade-in-up text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            <h3 className="text-xl font-serif text-luxury-charcoal mb-2">Talebiniz Alındı</h3>
            <p className="text-olive-600 mb-8 text-sm leading-relaxed">
              {successModal.message}
            </p>
            <button 
              onClick={() => setSuccessModal({ isOpen: false, message: '' })}
              className="w-full py-3 rounded-xl font-medium bg-olive-900 text-white hover:bg-gold-500 transition-colors"
            >
              Tamam
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
