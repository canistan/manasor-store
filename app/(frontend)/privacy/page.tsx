import React from 'react';

export const metadata = {
  title: 'Gizlilik Politikası | Manasor',
  description: 'Manasor Zeytincilik gizlilik ve veri koruma politikası.',
};

export default function PrivacyPage() {
  return (
    <div className="bg-[#FDFBF7] min-h-screen pt-24 pb-24">
      {/* Header */}
      <div className="bg-olive-900 py-16 mb-12">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-serif text-gold-400 mb-4">Gizlilik Politikası</h1>
          <p className="text-olive-100">Son Güncelleme: 1 Ocak 2026</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white p-8 md:p-12 rounded-2xl shadow-sm border border-olive-100 prose prose-olive max-w-none">
          <h3>1. Giriş</h3>
          <p>
            Manasor Zeytincilik ("Biz" veya "Şirket") olarak, müşterilerimizin ve sitemizi ziyaret eden kullanıcıların gizliliğine ve kişisel verilerinin korunmasına büyük önem veriyoruz. Bu Gizlilik Politikası, web sitemizi kullanırken topladığımız verileri nasıl işlediğimizi açıklamaktadır.
          </p>

          <h3>2. Hangi Verileri Topluyoruz?</h3>
          <p>Sitemizi kullanırken sizden aşağıdaki verileri toplayabiliriz:</p>
          <ul>
            <li><strong>Kişisel Tanımlayıcı Bilgiler:</strong> Ad, soyad, e-posta adresi, telefon numarası, teslimat ve fatura adresi.</li>
            <li><strong>Ödeme Bilgileri:</strong> Güvenli ödeme altyapısı (Iyzico) üzerinden alınan ödeme verileri (Kredi kartı bilgileriniz sunucularımızda saklanmaz).</li>
            <li><strong>Teknik Veriler:</strong> IP adresi, tarayıcı tipi, işletim sistemi ve site içi gezinme bilgileri (çerezler vasıtasıyla).</li>
          </ul>

          <h3>3. Verileri Nasıl Kullanıyoruz?</h3>
          <p>Topladığımız verileri aşağıdaki amaçlar doğrultusunda kullanmaktayız:</p>
          <ul>
            <li>Siparişlerinizi almak, işlemek ve tarafınıza teslim etmek.</li>
            <li>Ödeme işlemlerini güvenli bir şekilde gerçekleştirmek.</li>
            <li>Müşteri hizmetleri sağlamak ve sorularınıza yanıt vermek.</li>
            <li>(Onay vermişseniz) E-bülten ve kampanyalarımız hakkında sizi bilgilendirmek.</li>
            <li>Web sitemizin performansını artırmak ve kullanıcı deneyimini iyileştirmek.</li>
          </ul>

          <h3>4. Çerezler (Cookies)</h3>
          <p>
            Web sitemiz, deneyiminizi geliştirmek için çerezleri kullanır. Çerezler, cihazınıza yerleştirilen küçük metin dosyalarıdır. Tarayıcı ayarlarınızdan çerezleri dilediğiniz zaman kapatabilirsiniz, ancak bu durum sitenin bazı özelliklerinin tam çalışmamasına neden olabilir.
          </p>

          <h3>5. Verilerin Paylaşımı</h3>
          <p>
            Kişisel verileriniz, hukuki zorunluluklar haricinde üçüncü şahıslarla paylaşılmaz. Ancak teslimatın yapılabilmesi için kargo firmalarıyla ve güvenli ödemenin gerçekleşmesi için yetkili ödeme kuruluşlarıyla (örn. Iyzico) adınız, adresiniz ve işlem bilgileriniz paylaşılmaktadır.
          </p>

          <h3>6. İletişim</h3>
          <p>
            Gizlilik Politikamız veya kişisel verilerinizin işlenmesiyle ilgili herhangi bir sorunuz varsa, bizimle iletişime geçebilirsiniz:
          </p>
          <p>
            <strong>E-posta:</strong> info@manasor.com<br />
            <strong>Telefon:</strong> +90 (224) 513 00 00
          </p>
        </div>
      </div>
    </div>
  );
}
