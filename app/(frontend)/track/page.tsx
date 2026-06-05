"use client";

import { useState } from 'react';
import { Package, Search, MapPin, CheckCircle, Clock, Truck, ExternalLink } from 'lucide-react';

export default function TrackOrderPage() {
  const [orderNumber, setOrderNumber] = useState('');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [orderData, setOrderData] = useState<any>(null);

  const handleTrack = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setOrderData(null);

    try {
      const res = await fetch('/api/track', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderNumber, email })
      });
      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data.error || 'Bir hata oluştu');
      }

      setOrderData(data.data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const getStatusStep = (status: string) => {
    switch(status) {
      case 'pending': return 1;
      case 'paid': return 2;
      case 'shipped': return 3;
      case 'delivered': return 4;
      case 'cancelled': return -1;
      default: return 1;
    }
  };

  const step = orderData ? getStatusStep(orderData.status) : 0;

  return (
    <div className="bg-cream min-h-screen pt-24 pb-24">
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        
        {/* Başlık ve Form */}
        <div className="text-center mb-12">
          <div className="w-16 h-16 bg-olive-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Package className="w-8 h-8 text-olive-700" />
          </div>
          <h1 className="text-3xl font-serif text-luxury-charcoal mb-4">Sipariş Takibi</h1>
          <p className="text-olive-600">Sipariş durumunuzu öğrenmek için bilgilerinizi girin.</p>
        </div>

        <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-sm border border-olive-100 mb-12">
          <form onSubmit={handleTrack} className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-olive-900 mb-2">Sipariş Numarası</label>
                <input 
                  type="text" 
                  value={orderNumber}
                  onChange={e => setOrderNumber(e.target.value)}
                  placeholder="Örn: MANASOR-12345"
                  className="w-full bg-olive-50 border border-olive-200 text-luxury-charcoal px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-gold-500"
                  required 
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-olive-900 mb-2">E-Posta Adresiniz</label>
                <input 
                  type="email" 
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="Siparişte kullandığınız adres"
                  className="w-full bg-olive-50 border border-olive-200 text-luxury-charcoal px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-gold-500"
                  required 
                />
              </div>
            </div>
            
            {error && <div className="p-4 bg-red-50 text-red-600 rounded-lg text-sm">{error}</div>}

            <button 
              type="submit" 
              disabled={loading}
              className="w-full bg-olive-900 hover:bg-gold-500 text-white font-medium py-3 rounded-xl transition-colors flex justify-center items-center"
            >
              {loading ? <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div> : (
                <><Search className="w-5 h-5 mr-2" /> Sorgula</>
              )}
            </button>
          </form>
        </div>

        {/* Sonuç Alanı */}
        {orderData && (
          <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-lg border border-gold-200 animate-slide-in-up">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 border-b border-olive-100 pb-6">
              <div>
                <h2 className="text-xl font-serif text-luxury-charcoal">Sipariş Özeti</h2>
                <p className="text-sm text-olive-500 mt-1">{orderData.orderNumber}</p>
              </div>
              <div className="mt-4 sm:mt-0 text-right">
                <p className="text-sm text-olive-500">Tarih</p>
                <p className="font-medium text-luxury-charcoal">{new Date(orderData.createdAt).toLocaleDateString('tr-TR')}</p>
              </div>
            </div>

            {/* Durum Çubuğu */}
            {step > 0 ? (
              <div className="mb-12">
                <div className="relative">
                  <div className="absolute top-1/2 left-0 w-full h-1 bg-olive-100 -translate-y-1/2 rounded-full z-0"></div>
                  <div 
                    className="absolute top-1/2 left-0 h-1 bg-gold-500 -translate-y-1/2 rounded-full z-0 transition-all duration-1000"
                    style={{ width: `${((step - 1) / 3) * 100}%` }}
                  ></div>
                  
                  <div className="relative z-10 flex justify-between">
                    <div className="flex flex-col items-center">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center border-4 border-white transition-colors duration-500 ${step >= 1 ? 'bg-gold-500 text-white' : 'bg-olive-200 text-olive-400'}`}>
                        <Clock className="w-5 h-5" />
                      </div>
                      <span className="text-xs font-medium mt-2 text-olive-700">Bekliyor</span>
                    </div>
                    <div className="flex flex-col items-center">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center border-4 border-white transition-colors duration-500 ${step >= 2 ? 'bg-gold-500 text-white' : 'bg-olive-200 text-olive-400'}`}>
                        <Package className="w-5 h-5" />
                      </div>
                      <span className="text-xs font-medium mt-2 text-olive-700">Hazırlanıyor</span>
                    </div>
                    <div className="flex flex-col items-center">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center border-4 border-white transition-colors duration-500 ${step >= 3 ? 'bg-gold-500 text-white' : 'bg-olive-200 text-olive-400'}`}>
                        <Truck className="w-5 h-5" />
                      </div>
                      <span className="text-xs font-medium mt-2 text-olive-700">Kargoda</span>
                    </div>
                    <div className="flex flex-col items-center">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center border-4 border-white transition-colors duration-500 ${step >= 4 ? 'bg-gold-500 text-white' : 'bg-olive-200 text-olive-400'}`}>
                        <CheckCircle className="w-5 h-5" />
                      </div>
                      <span className="text-xs font-medium mt-2 text-olive-700">Teslim Edildi</span>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="p-4 bg-red-50 text-red-600 rounded-lg text-center mb-8 font-medium border border-red-100">
                Bu sipariş maalesef iptal edilmiştir.
              </div>
            )}

            {/* Kargo Detayları */}
            {(orderData.trackingNumber || orderData.shippingCompany) && (
              <div className="bg-olive-50 p-6 rounded-xl border border-olive-100 mb-8 flex flex-col sm:flex-row justify-between items-center gap-4">
                <div className="flex items-center">
                  <MapPin className="w-8 h-8 text-olive-500 mr-4" />
                  <div>
                    <p className="text-sm text-olive-500">Kargo Firması</p>
                    <p className="font-medium text-luxury-charcoal">{orderData.shippingCompany || 'Belirtilmedi'}</p>
                  </div>
                </div>
                {orderData.trackingNumber && (
                  <div className="text-center sm:text-right">
                    <p className="text-sm text-olive-500">Takip Numarası</p>
                    <p className="font-medium text-luxury-charcoal tracking-wider">{orderData.trackingNumber}</p>
                  </div>
                )}
                {orderData.trackingUrl && (
                  <a href={orderData.trackingUrl} target="_blank" rel="noopener noreferrer" className="bg-white border border-olive-200 text-olive-700 px-4 py-2 rounded-lg hover:border-gold-500 hover:text-gold-600 transition-colors flex items-center text-sm font-medium">
                    Kargoyu Takip Et <ExternalLink className="w-4 h-4 ml-2" />
                  </a>
                )}
              </div>
            )}

            {/* Ürün Listesi */}
            <div>
              <h3 className="text-sm font-medium text-olive-900 mb-4 uppercase tracking-wider">Sipariş İçeriği</h3>
              <div className="space-y-4">
                {orderData.items?.map((item: any, i: number) => (
                  <div key={i} className="flex justify-between items-center py-3 border-b border-olive-50 last:border-0">
                    <div className="flex items-center">
                      <div className="w-8 h-8 bg-olive-100 rounded flex items-center justify-center text-olive-600 text-xs font-medium mr-4">
                        {item.quantity}x
                      </div>
                      <div>
                        <p className="text-luxury-charcoal font-medium">{item.name}</p>
                        <p className="text-xs text-olive-500">{item.size} - {item.packaging}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-6 pt-6 border-t border-olive-100 flex justify-between items-center">
                <span className="text-olive-700 font-medium">Toplam Tutar</span>
                <span className="text-xl font-serif text-gold-600">{orderData.totalPrice} ₺</span>
              </div>
            </div>

          </div>
        )}

      </div>
    </div>
  );
}
