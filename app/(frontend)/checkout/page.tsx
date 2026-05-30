'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useCartStore } from '@/store/useCartStore';
import { ShieldCheck, ChevronRight, Check, AlertCircle } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

// Zod Validation Schema
const checkoutSchema = z.object({
  invoiceType: z.enum(['bireysel', 'kurumsal']),
  firstName: z.string().min(2, 'Ad en az 2 karakter olmalıdır'),
  lastName: z.string().min(2, 'Soyad en az 2 karakter olmalıdır'),
  email: z.string().email('Geçerli bir e-posta adresi giriniz'),
  phone: z.string().min(10, 'Geçerli bir telefon numarası giriniz'),
  city: z.string().min(2, 'İl seçiniz'),
  district: z.string().min(2, 'İlçe seçiniz'),
  address: z.string().min(10, 'Açık adres en az 10 karakter olmalıdır'),
  identityNumber: z.string().optional(),
  companyName: z.string().optional(),
  taxOffice: z.string().optional(),
  taxNumber: z.string().optional(),
  isSameAddress: z.boolean(),
  termsAccepted: z.literal(true, {
    message: 'Mesafeli Satış Sözleşmesini onaylamanız gerekmektedir.',
  }),
  kvkkAccepted: z.literal(true, {
    message: 'KVKK aydınlatma metnini onaylamanız gerekmektedir.',
  }),
  newsletterAccepted: z.boolean().optional(),
}).superRefine((data, ctx) => {
  if (data.invoiceType === 'bireysel' && (!data.identityNumber || data.identityNumber.length < 11)) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: 'T.C. Kimlik No 11 haneli olmalıdır',
      path: ['identityNumber'],
    });
  }
  if (data.invoiceType === 'kurumsal') {
    if (!data.companyName) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, message: 'Şirket adı zorunludur', path: ['companyName'] });
    }
    if (!data.taxOffice) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, message: 'Vergi dairesi zorunludur', path: ['taxOffice'] });
    }
    if (!data.taxNumber) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, message: 'Vergi numarası zorunludur', path: ['taxNumber'] });
    }
  }
});

type CheckoutFormValues = z.infer<typeof checkoutSchema>;

export default function CheckoutPage() {
  const { items, getCartTotal } = useCartStore();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [iyzicoContent, setIyzicoContent] = useState<string | null>(null);
  const [paymentError, setPaymentError] = useState<string | null>(null);
  
  const [isTermsModalOpen, setIsTermsModalOpen] = useState(false);
  const [isKvkkModalOpen, setIsKvkkModalOpen] = useState(false);

  const total = getCartTotal();
  const shipping = total > 1500 || total === 0 ? 0 : 79.90;
  const grandTotal = total + shipping;

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<CheckoutFormValues>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      invoiceType: 'bireysel',
      isSameAddress: true,
    },
  });

  const invoiceType = watch('invoiceType');

  // Next.js de Iyzico form içeriğini (script) render etmek için
  useEffect(() => {
    if (iyzicoContent) {
      const scriptRegex = /<script\b[^>]*>([\s\S]*?)<\/script>/gm;
      let match;
      while ((match = scriptRegex.exec(iyzicoContent)) !== null) {
        const scriptContent = match[1];
        const scriptEl = document.createElement('script');
        scriptEl.type = 'text/javascript';
        scriptEl.text = scriptContent;
        document.body.appendChild(scriptEl);
      }
    }
  }, [iyzicoContent]);

  const onSubmit = async (data: CheckoutFormValues) => {
    setIsSubmitting(true);
    setPaymentError(null);

    try {
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          form: data,
          items: items,
          total: grandTotal,
          shippingPrice: shipping
        }),
      });

      const result = await response.json();

      if (response.ok && result.checkoutFormContent) {
        setIyzicoContent(result.checkoutFormContent);
      } else {
        setPaymentError(result.error || 'Ödeme sistemi başlatılırken bir hata oluştu.');
      }
    } catch (error) {
      setPaymentError('Sunucu bağlantı hatası.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="bg-[#FDFBF7] min-h-screen pt-12 pb-24 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-serif text-luxury-charcoal mb-4">Sepetiniz Boş</h1>
          <Link href="/products" className="text-gold-600 hover:underline">Alışverişe Başla</Link>
        </div>
      </div>
    );
  }

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
          
          {/* Sol Kolon: İletişim, Adres ve Iyzico */}
          <div className="flex-1">
            {!iyzicoContent ? (
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-8 bg-white p-6 md:p-10 rounded-2xl border border-olive-100 shadow-sm">
                
                {/* İletişim Bilgileri */}
                <div>
                  <h2 className="text-xl font-serif text-luxury-charcoal mb-6 border-b border-olive-50 pb-4">İletişim Bilgileri</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <input {...register('firstName')} type="text" placeholder="Adınız" className="w-full p-4 border border-olive-200 rounded-xl focus:ring-2 focus:ring-gold-500 outline-none" />
                      {errors.firstName && <span className="text-xs text-red-500 mt-1 block">{errors.firstName.message}</span>}
                    </div>
                    <div>
                      <input {...register('lastName')} type="text" placeholder="Soyadınız" className="w-full p-4 border border-olive-200 rounded-xl focus:ring-2 focus:ring-gold-500 outline-none" />
                      {errors.lastName && <span className="text-xs text-red-500 mt-1 block">{errors.lastName.message}</span>}
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                    <div>
                      <input {...register('email')} type="email" placeholder="E-posta Adresiniz" className="w-full p-4 border border-olive-200 rounded-xl focus:ring-2 focus:ring-gold-500 outline-none" />
                      {errors.email && <span className="text-xs text-red-500 mt-1 block">{errors.email.message}</span>}
                    </div>
                    <div>
                      <input {...register('phone')} type="tel" placeholder="Telefon Numarası (5XX...)" className="w-full p-4 border border-olive-200 rounded-xl focus:ring-2 focus:ring-gold-500 outline-none" />
                      {errors.phone && <span className="text-xs text-red-500 mt-1 block">{errors.phone.message}</span>}
                    </div>
                  </div>
                </div>

                {/* Teslimat Adresi */}
                <div>
                  <h2 className="text-xl font-serif text-luxury-charcoal mb-6 border-b border-olive-50 pb-4">Teslimat Adresi</h2>
                  
                  <div className="flex gap-6 mb-6">
                    <label className="flex items-center cursor-pointer">
                      <input type="radio" value="bireysel" {...register('invoiceType')} className="form-radio text-gold-500 focus:ring-gold-500" />
                      <span className="ml-2">Bireysel</span>
                    </label>
                    <label className="flex items-center cursor-pointer">
                      <input type="radio" value="kurumsal" {...register('invoiceType')} className="form-radio text-gold-500 focus:ring-gold-500" />
                      <span className="ml-2">Kurumsal</span>
                    </label>
                  </div>

                  {invoiceType === 'bireysel' && (
                    <div className="mb-4">
                      <input {...register('identityNumber')} type="text" placeholder="T.C. Kimlik No (Fatura kesimi için yasal zorunluluktur)" className="w-full p-4 border border-olive-200 rounded-xl focus:ring-2 focus:ring-gold-500 outline-none" />
                      {errors.identityNumber && <span className="text-xs text-red-500 mt-1 block">{errors.identityNumber.message}</span>}
                    </div>
                  )}

                  {invoiceType === 'kurumsal' && (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                      <div className="md:col-span-3">
                        <input {...register('companyName')} type="text" placeholder="Şirket Adı / Ünvanı" className="w-full p-4 border border-olive-200 rounded-xl focus:ring-2 focus:ring-gold-500 outline-none" />
                        {errors.companyName && <span className="text-xs text-red-500 mt-1 block">{errors.companyName.message}</span>}
                      </div>
                      <div className="md:col-span-1">
                        <input {...register('taxOffice')} type="text" placeholder="Vergi Dairesi" className="w-full p-4 border border-olive-200 rounded-xl focus:ring-2 focus:ring-gold-500 outline-none" />
                        {errors.taxOffice && <span className="text-xs text-red-500 mt-1 block">{errors.taxOffice.message}</span>}
                      </div>
                      <div className="md:col-span-2">
                        <input {...register('taxNumber')} type="text" placeholder="Vergi No" className="w-full p-4 border border-olive-200 rounded-xl focus:ring-2 focus:ring-gold-500 outline-none" />
                        {errors.taxNumber && <span className="text-xs text-red-500 mt-1 block">{errors.taxNumber.message}</span>}
                      </div>
                    </div>
                  )}

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <select {...register('city')} className="w-full p-4 border border-olive-200 rounded-xl focus:ring-2 focus:ring-gold-500 outline-none bg-white">
                        <option value="">İl Seçiniz</option>
                        <option value="Bursa">Bursa</option>
                        <option value="İstanbul">İstanbul</option>
                        <option value="Ankara">Ankara</option>
                        <option value="İzmir">İzmir</option>
                      </select>
                      {errors.city && <span className="text-xs text-red-500 mt-1 block">{errors.city.message}</span>}
                    </div>
                    <div>
                      <select {...register('district')} className="w-full p-4 border border-olive-200 rounded-xl focus:ring-2 focus:ring-gold-500 outline-none bg-white">
                        <option value="">İlçe Seçiniz</option>
                        <option value="Gemlik">Gemlik</option>
                        <option value="Kadıköy">Kadıköy</option>
                        <option value="Çankaya">Çankaya</option>
                      </select>
                      {errors.district && <span className="text-xs text-red-500 mt-1 block">{errors.district.message}</span>}
                    </div>
                  </div>

                  <div>
                    <textarea {...register('address')} placeholder="Açık Adres (Mahalle, sokak, no vb.)" rows={3} className="w-full p-4 border border-olive-200 rounded-xl focus:ring-2 focus:ring-gold-500 outline-none"></textarea>
                    {errors.address && <span className="text-xs text-red-500 mt-1 block">{errors.address.message}</span>}
                  </div>

                  <label className="flex items-center mt-4 cursor-pointer">
                    <input {...register('isSameAddress')} type="checkbox" className="form-checkbox h-5 w-5 rounded border-olive-300 text-gold-500 focus:ring-gold-500" />
                    <span className="ml-3 text-sm text-olive-700">Fatura adresim teslimat adresimle aynı</span>
                  </label>
                </div>

                {/* Hukuki Onaylar ve Ödeme Butonu */}
                <div className="bg-olive-50 p-6 rounded-xl border border-olive-100">
                  <div className="space-y-4 mb-6">
                    <label className="flex items-start cursor-pointer">
                      <input {...register('termsAccepted')} type="checkbox" className="form-checkbox mt-1 h-5 w-5 rounded border-olive-300 text-gold-500 focus:ring-gold-500" />
                      <div className="ml-3">
                        <span className="text-sm text-olive-800 leading-relaxed block">
                          <button type="button" onClick={(e) => { e.preventDefault(); setIsTermsModalOpen(true); }} className="text-gold-600 hover:underline font-medium">Ön Bilgilendirme Koşullarını</button> ve <button type="button" onClick={(e) => { e.preventDefault(); setIsTermsModalOpen(true); }} className="text-gold-600 hover:underline font-medium">Mesafeli Satış Sözleşmesini</button> okudum, onaylıyorum.
                        </span>
                        {errors.termsAccepted && <span className="text-xs text-red-500 mt-1 block">{errors.termsAccepted.message}</span>}
                      </div>
                    </label>
                    <label className="flex items-start cursor-pointer">
                      <input {...register('kvkkAccepted')} type="checkbox" className="form-checkbox mt-1 h-5 w-5 rounded border-olive-300 text-gold-500 focus:ring-gold-500" />
                      <div className="ml-3">
                        <span className="text-sm text-olive-800 leading-relaxed block">
                          Kişisel verilerimin <button type="button" onClick={(e) => { e.preventDefault(); setIsKvkkModalOpen(true); }} className="text-gold-600 hover:underline font-medium">KVKK kapsamında</button> işlenmesini kabul ediyorum.
                        </span>
                        {errors.kvkkAccepted && <span className="text-xs text-red-500 mt-1 block">{errors.kvkkAccepted.message}</span>}
                      </div>
                    </label>
                    <label className="flex items-start cursor-pointer pt-2 border-t border-olive-200/50">
                      <input {...register('newsletterAccepted')} type="checkbox" className="form-checkbox mt-1 h-5 w-5 rounded border-olive-300 text-gold-500 focus:ring-gold-500" />
                      <div className="ml-3">
                        <span className="text-sm text-olive-800 leading-relaxed block font-medium">Bültene abone olmak ve kampanyalardan haberdar olmak istiyorum.</span>
                      </div>
                    </label>
                  </div>

                  {paymentError && (
                    <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-center text-red-600 text-sm">
                      <AlertCircle className="w-5 h-5 mr-2 flex-shrink-0" />
                      {paymentError}
                    </div>
                  )}

                  <button 
                    type="submit" 
                    disabled={isSubmitting}
                    className="w-full bg-green-600 disabled:bg-green-400 text-white py-4 rounded-xl font-medium text-lg hover:bg-green-700 transition-colors shadow-lg shadow-green-600/30 flex items-center justify-center"
                  >
                    {isSubmitting ? (
                      <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    ) : (
                      <>Güvenli Ödeme Adımına Geç <ChevronRight className="w-5 h-5 ml-2" /></>
                    )}
                  </button>
                </div>
              </form>
            ) : (
              <div className="bg-white p-6 md:p-10 rounded-2xl border border-olive-100 shadow-sm animate-in fade-in duration-500">
                <h2 className="text-xl font-serif text-luxury-charcoal mb-6 border-b border-olive-50 pb-4 flex items-center">
                  <ShieldCheck className="w-6 h-6 mr-2 text-green-600" />
                  Kredi Kartı ile Ödeme
                </h2>
                {/* Iyzico Form Container */}
                <div id="iyzipay-checkout-form" className="responsive" dangerouslySetInnerHTML={{ __html: iyzicoContent }} />
              </div>
            )}
          </div>

          {/* Sağ Kolon: Sipariş Özeti (Sticky) */}
          <div className="w-full lg:w-96 flex-shrink-0">
            <div className="bg-white border border-olive-200 rounded-2xl p-6 sticky top-8 shadow-sm">
              <h3 className="text-xl font-serif text-luxury-charcoal mb-6 border-b border-olive-100 pb-4">Sipariş Özeti</h3>
              
              <div className="space-y-4 mb-6 max-h-[40vh] overflow-y-auto pr-2">
                {items.map((item: any) => (
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
                ))}
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

      {/* Modals */}
      {isTermsModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl w-full max-w-3xl max-h-[80vh] flex flex-col shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="p-6 border-b border-olive-100 flex justify-between items-center">
              <h2 className="text-xl font-serif text-luxury-charcoal">Ön Bilgilendirme ve Mesafeli Satış Sözleşmesi</h2>
              <button onClick={() => setIsTermsModalOpen(false)} className="text-olive-400 hover:text-luxury-charcoal transition-colors p-2 rounded-full hover:bg-olive-50">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>
            <div className="p-6 overflow-y-auto max-w-none text-olive-700 space-y-4 [&>h3]:text-xl [&>h3]:text-luxury-charcoal [&>h3]:font-serif [&>h3]:mt-6">
              <p>İşbu sözleşme, alıcı ve satıcı arasındaki mesafeli satış hükümlerini düzenler. Detaylı sözleşme metni dinamik olarak sipariş verilerine göre üretilecektir.</p>
              <h3>MADDE 1: TARAFLAR</h3>
              <p>Satıcı: Manasor Zeytincilik (ZeytinCo) <br/> Alıcı: Sipariş veren müşteri</p>
              <h3>MADDE 2: SÖZLEŞMENİN KONUSU</h3>
              <p>İşbu Sözleşme'nin konusu, Alıcı'nın Satıcı'ya ait internet sitesinden elektronik ortamda siparişini yaptığı ürünlerin satışı ve teslimi ile ilgili yasal hakların belirlenmesidir.</p>
              <p>... (Hukuki metnin tamamı buraya eklenecektir)</p>
            </div>
            <div className="p-6 border-t border-olive-100 flex justify-end">
              <button onClick={() => setIsTermsModalOpen(false)} className="bg-olive-900 text-white px-6 py-2 rounded-lg font-medium hover:bg-gold-500 transition-colors">Kapat ve Anladım</button>
            </div>
          </div>
        </div>
      )}

      {isKvkkModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[80vh] flex flex-col shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="p-6 border-b border-olive-100 flex justify-between items-center">
              <h2 className="text-xl font-serif text-luxury-charcoal">KVKK Aydınlatma Metni</h2>
              <button onClick={() => setIsKvkkModalOpen(false)} className="text-olive-400 hover:text-luxury-charcoal transition-colors p-2 rounded-full hover:bg-olive-50">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>
            <div className="p-6 overflow-y-auto max-w-none text-olive-700 space-y-4 [&>h3]:text-xl [&>h3]:text-luxury-charcoal [&>h3]:font-serif [&>h3]:mt-6">
              <p>Kişisel verileriniz, 6698 sayılı Kişisel Verilerin Korunması Kanunu ("KVKK") uyarınca veri sorumlusu sıfatıyla Manasor tarafından işlenmektedir.</p>
              <h3>Hangi Veriler İşleniyor?</h3>
              <p>Ad, soyad, adres, e-posta, iletişim numarası, fatura bilgileri.</p>
              <h3>İşleme Amacı</h3>
              <p>Sipariş süreçlerinin yürütülmesi, fatura kesimi, kargo teslimatı ve yasal yükümlülüklerin yerine getirilmesi.</p>
              <p>... (Aydınlatma metninin tamamı buraya eklenecektir)</p>
            </div>
            <div className="p-6 border-t border-olive-100 flex justify-end">
              <button onClick={() => setIsKvkkModalOpen(false)} className="bg-olive-900 text-white px-6 py-2 rounded-lg font-medium hover:bg-gold-500 transition-colors">Kapat ve Anladım</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
