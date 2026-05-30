import React from 'react';

export const metadata = {
  title: 'Teslimat ve İade | Manasor',
  description: 'Manasor Zeytincilik teslimat süreçleri ve iade koşulları.',
};

export default function ShippingPage() {
  return (
    <div className="bg-[#FDFBF7] min-h-screen pt-24 pb-24">
      {/* Header */}
      <div className="bg-olive-900 py-16 mb-12">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-serif text-gold-400 mb-4">Teslimat ve İade</h1>
          <p className="text-olive-100">Kargo Süreçleri ve İade Politikamız</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white p-8 md:p-12 rounded-2xl shadow-sm border border-olive-100 text-olive-700 space-y-4 [&>h2]:text-2xl [&>h2]:text-luxury-charcoal [&>h2]:font-serif [&>h2]:mt-8 [&>h3]:text-xl [&>h3]:text-luxury-charcoal [&>h3]:font-serif [&>h3]:mt-8 [&>ul]:list-disc [&>ul]:pl-5 [&>ol]:list-decimal [&>ol]:pl-5">
          <h2>Teslimat Şartları</h2>
          
          <h3>Kargo Ücreti ve Gönderim</h3>
          <p>
            Siparişleriniz, anlaşmalı olduğumuz kargo firması aracılığıyla adresinize teslim edilmektedir. Belirli bir tutarın üzerindeki siparişlerinizde (Örn: 1500 TL ve üzeri) kargo ücreti <strong>bedava</strong> olup, bu tutarın altındaki siparişlerinizde sabit kargo ücreti yansıtılır.
          </p>

          <h3>Sipariş Hazırlık ve Teslimat Süresi</h3>
          <ul>
            <li>Saat 14:00'a kadar verilen siparişleriniz stok durumuna göre genellikle <strong>aynı gün</strong> kargoya verilir.</li>
            <li>Hafta sonu (Cumartesi saat 12:00'den sonra ve Pazar günü) ile resmî tatillerde verilen siparişler, takip eden ilk iş günü işleme alınır.</li>
            <li>Kargoya verilen ürünlerin adresinize ulaşma süresi, bulunduğunuz ile ve ilçeye bağlı olarak ortalama <strong>1-3 iş günü</strong> sürmektedir.</li>
          </ul>

          <hr className="my-8 border-olive-100" />

          <h2>İade ve Değişim Koşulları</h2>

          <h3>Cayma Hakkı</h3>
          <p>
            Gıda ürünleri doğası gereği hassas ürünlerdir. Ancak, satın almış olduğunuz ürünün ambalajı açılmamış, bozulmamış ve tekrar satılabilirliği bozulmamış ise, teslim aldığınız tarihten itibaren <strong>14 gün</strong> içerisinde iade edebilirsiniz.
          </p>
          <p>
            <strong>Dikkat:</strong> Sağlık ve hijyen açısından ambalajı veya vakumu açılmış, kullanılmış veya tadılmış zeytin ve zeytinyağı ürünlerinde iade/değişim kabul edilmemektedir (kusurlu veya hatalı üretim durumu hariç).
          </p>

          <h3>Kırık veya Hasarlı Teslimat</h3>
          <p>
            Tüm ürünlerimiz (özellikle cam şişeler) kargoda zarar görmemesi için özel hava yastıklı ambalajlarla korunmaktadır. Ancak yine de kargodan kaynaklı bir hasar/kırık durumu söz konusu olursa:
          </p>
          <ol>
            <li>Kargo görevlisi yanınızdayken paketi açıp kontrol ediniz.</li>
            <li>Herhangi bir hasar, akma veya kırılma varsa kargo görevlisine <strong>"Hasar Tespit Tutanağı"</strong> tutturunuz.</li>
            <li>Hasarlı ürünlerin fotoğrafını çekip tutanak ile birlikte <strong>info@manasor.com</strong> veya müşteri hizmetleri numaramıza iletiniz.</li>
            <li>Bu prosedürü uyguladığınızda yenisi derhal size <strong>ücretsiz</strong> olarak gönderilecektir.</li>
          </ol>

          <h3>İade Süreci</h3>
          <p>
            İade talebiniz için öncelikle bizimle iletişime geçiniz. İade onayınız verildikten sonra, size bildireceğimiz anlaşmalı kargo kodu ile ürünleri <strong>karşı ödemeli</strong> (ücretsiz) olarak tarafımıza gönderebilirsiniz. Ürün tarafımıza ulaşıp kontrol edildikten sonra ödemeniz 3-7 iş günü içerisinde kredi kartınıza/hesabınıza iade edilecektir.
          </p>
        </div>
      </div>
    </div>
  );
}
