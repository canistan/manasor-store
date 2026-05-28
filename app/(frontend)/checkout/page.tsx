'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useCartStore } from '@/store/useCartStore';
import { ShieldCheck, ChevronRight, Check } from 'lucide-react';
import Image from 'next/image';

export default function CheckoutPage() {
  const { items, getCartTotal } = useCartStore();
  const [step, setStep] = useState(1);
  const [invoiceType, setInvoiceType] = useState('bireysel');
  
  const total = getCartTotal();
  const shipping = total > 1500 || total === 0 ? 0 : 79.90;
  const grandTotal = total + shipping;

  return (
    <div className="bg-[#FDFBF7] min-h-screen pt-12 pb-24">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Güvenli Ödeme Header */}
        <div className="flex justify-between items-center border-b border-olive-200 pb-6 mb-10">
          <Link href="/" className="text-3xl font-serif text-olive-900">MANASOR</Link>
          <div className="flex items-center text-olive-600 text-sm font-medium">
            <ShieldCheck className="w-5 h-5 mr-2 text-green-600" />
            256-Bit SSL Güvenli Ödeme
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-12">
          
          {/* Sol: Checkout Adımları (Accordion) */}
          <div className="flex-1 space-y-6">
            
            {/* ADIM 1: İletişim */}
            <div className={`bg-white border rounded-2xl overflow-hidden transition-all duration-300 ${step === 1 ? 'border-gold-500 shadow-md' : 'border-olive-200 opacity-70'}`}>
              <div className="p-6 flex justify-between items-center cursor-pointer bg-olive-50/50" onClick={() => setStep(1)}>
                <h2 className="text-lg font-medium text-luxury-charcoal flex items-center">
                  <span className="w-8 h-8 rounded-full bg-olive-900 text-white flex items-center justify-center mr-3 text-sm">1</span>
                  İletişim Bilgileri
                </h2>
                {step > 1 && <span className="text-sm text-gold-600 font-medium hover:underline">Düzenle</span>}
              </div>
              
              {step === 1 && (
                <div className="p-6 border-t border-olive-100 animate-in slide-in-from-top-4 duration-300">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    <button className="flex items-center justify-center border border-olive-200 rounded-xl p-3 hover:bg-olive-50 transition-colors">
                      <Image src="/images/google.svg" alt="Google" width={20} height={20} className="mr-3" /> Google ile Devam Et
                    </button>
                    <button className="flex items-center justify-center bg-black text-white rounded-xl p-3 hover:bg-gray-800 transition-colors">
                      <Image src="/images/apple.svg" alt="Apple" width={20} height={20} className="mr-3 filter invert" /> Apple ile Devam Et
                    </button>
                  </div>
                  <div className="relative flex items-center justify-center mb-6">
                    <span className="bg-white px-4 text-sm text-olive-400 z-10">Veya misafir olarak devam et</span>
                    <div className="absolute w-full h-px bg-olive-100"></div>
                  </div>
                  <input type="email" placeholder="E-posta Adresiniz" className="w-full p-4 border border-olive-200 rounded-xl focus:ring-2 focus:ring-gold-500 focus:border-gold-500 outline-none mb-4" />
                  <button onClick={() => setStep(2)} className="w-full bg-olive-900 text-white py-4 rounded-xl font-medium hover:bg-gold-500 transition-colors">Devam Et</button>
                </div>
              )}
            </div>

            {/* ADIM 2: Adres */}
            <div className={`bg-white border rounded-2xl overflow-hidden transition-all duration-300 ${step === 2 ? 'border-gold-500 shadow-md' : 'border-olive-200 opacity-70'}`}>
              <div className="p-6 flex justify-between items-center cursor-pointer bg-olive-50/50" onClick={() => step > 2 && setStep(2)}>
                <h2 className="text-lg font-medium text-luxury-charcoal flex items-center">
                  <span className={`w-8 h-8 rounded-full flex items-center justify-center mr-3 text-sm ${step >= 2 ? 'bg-olive-900 text-white' : 'bg-olive-200 text-olive-500'}`}>2</span>
                  Teslimat & Fatura
                </h2>
                {step > 2 && <span className="text-sm text-gold-600 font-medium hover:underline">Düzenle</span>}
              </div>
              
              {step === 2 && (
                <div className="p-6 border-t border-olive-100 animate-in slide-in-from-top-4 duration-300">
                  <div className="flex gap-4 mb-6">
                    <label className="flex items-center cursor-pointer">
                      <input type="radio" name="invoice" className="form-radio text-gold-500 focus:ring-gold-500" checked={invoiceType === 'bireysel'} onChange={() => setInvoiceType('bireysel')} />
                      <span className="ml-2">Bireysel</span>
                    </label>
                    <label className="flex items-center cursor-pointer">
                      <input type="radio" name="invoice" className="form-radio text-gold-500 focus:ring-gold-500" checked={invoiceType === 'kurumsal'} onChange={() => setInvoiceType('kurumsal')} />
                      <span className="ml-2">Kurumsal</span>
                    </label>
                  </div>
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <input type="text" placeholder="Adınız" className="p-4 border border-olive-200 rounded-xl focus:ring-2 focus:ring-gold-500 outline-none" />
                    <input type="text" placeholder="Soyadınız" className="p-4 border border-olive-200 rounded-xl focus:ring-2 focus:ring-gold-500 outline-none" />
                  </div>
                  {invoiceType === 'kurumsal' ? (
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <input type="text" placeholder="Şirket Adı" className="p-4 border border-olive-200 rounded-xl focus:ring-2 focus:ring-gold-500 outline-none" />
                      <input type="text" placeholder="Vergi No / Dairesi" className="p-4 border border-olive-200 rounded-xl focus:ring-2 focus:ring-gold-500 outline-none" />
                    </div>
                  ) : (
                    <input type="text" placeholder="TC Kimlik No (Zorunlu)" className="w-full p-4 border border-olive-200 rounded-xl mb-4 focus:ring-2 focus:ring-gold-500 outline-none" />
                  )}
                  <input type="tel" placeholder="Telefon Numarası" className="w-full p-4 border border-olive-200 rounded-xl mb-4 focus:ring-2 focus:ring-gold-500 outline-none" />
                  <textarea placeholder="Açık Adres" rows={3} className="w-full p-4 border border-olive-200 rounded-xl mb-4 focus:ring-2 focus:ring-gold-500 outline-none"></textarea>
                  
                  <label className="flex items-center mt-2 mb-6 cursor-pointer">
                    <input type="checkbox" className="form-checkbox rounded border-olive-300 text-gold-500 focus:ring-gold-500" defaultChecked />
                    <span className="ml-2 text-sm text-olive-700">Fatura adresim teslimat adresimle aynı olsun</span>
                  </label>
                  <button onClick={() => setStep(3)} className="w-full bg-olive-900 text-white py-4 rounded-xl font-medium hover:bg-gold-500 transition-colors">Ödemeye Geç</button>
                </div>
              )}
            </div>

            {/* ADIM 3: Ödeme (Iyzico Mockup) */}
            <div className={`bg-white border rounded-2xl overflow-hidden transition-all duration-300 ${step === 3 ? 'border-gold-500 shadow-md' : 'border-olive-200 opacity-70'}`}>
              <div className="p-6 flex justify-between items-center cursor-pointer bg-olive-50/50">
                <h2 className="text-lg font-medium text-luxury-charcoal flex items-center">
                  <span className={`w-8 h-8 rounded-full flex items-center justify-center mr-3 text-sm ${step === 3 ? 'bg-olive-900 text-white' : 'bg-olive-200 text-olive-500'}`}>3</span>
                  Güvenli Ödeme
                </h2>
              </div>
              
              {step === 3 && (
                <div className="p-6 border-t border-olive-100 animate-in slide-in-from-top-4 duration-300">
                  
                  {/* Kart Mockup */}
                  <div className="bg-gradient-to-tr from-olive-900 to-olive-700 rounded-2xl p-6 text-white mb-6 shadow-xl relative overflow-hidden">
                    <div className="absolute right-[-10%] top-[-20%] w-48 h-48 bg-white/10 rounded-full blur-2xl"></div>
                    <div className="flex justify-between items-center mb-8">
                      <Image src="/images/chip.svg" alt="Chip" width={40} height={30} className="opacity-80" />
                      <span className="font-bold text-xl italic tracking-wider text-blue-300">iyzico</span>
                    </div>
                    <input type="text" placeholder="0000 0000 0000 0000" className="w-full bg-transparent text-2xl tracking-widest outline-none placeholder-white/40 mb-4" />
                    <div className="flex justify-between">
                      <input type="text" placeholder="Ad Soyad" className="bg-transparent uppercase tracking-wider outline-none placeholder-white/40 w-1/2" />
                      <div className="flex space-x-4">
                        <input type="text" placeholder="AA/YY" className="bg-transparent w-16 text-center outline-none placeholder-white/40" />
                        <input type="text" placeholder="CVV" className="bg-transparent w-12 text-center outline-none placeholder-white/40" />
                      </div>
                    </div>
                  </div>

                  {/* Hukuki Onaylar */}
                  <div className="bg-olive-50 p-4 rounded-xl mb-6 space-y-3 border border-olive-100">
                    <label className="flex items-start cursor-pointer">
                      <input type="checkbox" className="form-checkbox mt-1 rounded border-olive-300 text-gold-500 focus:ring-gold-500" />
                      <span className="ml-3 text-xs text-olive-700 leading-relaxed">Ön Bilgilendirme Koşullarını ve Mesafeli Satış Sözleşmesini okudum, onaylıyorum.</span>
                    </label>
                    <label className="flex items-start cursor-pointer">
                      <input type="checkbox" className="form-checkbox mt-1 rounded border-olive-300 text-gold-500 focus:ring-gold-500" />
                      <span className="ml-3 text-xs text-olive-700 leading-relaxed">Kişisel verilerimin KVKK kapsamında işlenmesini kabul ediyorum.</span>
                    </label>
                  </div>

                  <button className="w-full bg-green-600 text-white py-4 rounded-xl font-medium text-lg hover:bg-green-700 transition-colors shadow-lg shadow-green-600/30 flex items-center justify-center">
                    Siparişi Tamamla <ChevronRight className="w-5 h-5 ml-2" />
                  </button>
                </div>
              )}
            </div>
            
          </div>

          {/* Sağ: Sipariş Özeti */}
          <div className="w-full lg:w-96 flex-shrink-0">
            <div className="bg-white border border-olive-200 rounded-2xl p-6 sticky top-28 shadow-sm">
              <h3 className="text-xl font-serif text-luxury-charcoal mb-6 border-b border-olive-100 pb-4">Sipariş Özeti</h3>
              
              <div className="space-y-4 mb-6 max-h-64 overflow-y-auto pr-2">
                {items.length === 0 ? (
                  <p className="text-olive-500 text-sm">Sepetinizde ürün bulunmamaktadır.</p>
                ) : (
                  items.map((item: any) => (
                    <div key={item.variationId} className="flex justify-between items-center">
                      <div className="flex items-center space-x-3">
                        <div className="relative w-12 h-12 rounded bg-olive-50">
                          <Image src={item.image} alt="" fill className="object-cover" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-olive-900 line-clamp-1">{item.name}</p>
                          <p className="text-xs text-olive-500">{item.quantity} Adet x {item.size}</p>
                        </div>
                      </div>
                      <span className="text-sm font-medium">{(item.price * item.quantity).toLocaleString('tr-TR', { style: 'currency', currency: 'TRY' })}</span>
                    </div>
                  ))
                )}
              </div>

              <div className="space-y-3 text-sm border-t border-olive-100 pt-6">
                <div className="flex justify-between text-olive-600">
                  <span>Ara Toplam</span>
                  <span>{total.toLocaleString('tr-TR', { style: 'currency', currency: 'TRY' })}</span>
                </div>
                <div className="flex justify-between text-olive-600">
                  <span>Kargo Ücreti</span>
                  {shipping === 0 ? (
                    <span className="text-green-600 font-medium">Bedava</span>
                  ) : (
                    <span>{shipping.toLocaleString('tr-TR', { style: 'currency', currency: 'TRY' })}</span>
                  )}
                </div>
                <div className="flex justify-between text-lg font-medium text-luxury-charcoal pt-4 border-t border-olive-100">
                  <span>Genel Toplam</span>
                  <span>{grandTotal.toLocaleString('tr-TR', { style: 'currency', currency: 'TRY' })}</span>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
