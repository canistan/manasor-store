import React from 'react';

export const metadata = {
  title: 'Mesafeli Satış Sözleşmesi | Manasor',
  description: 'Manasor Zeytincilik Mesafeli Satış Sözleşmesi detayları.',
};

export default function TermsPage() {
  return (
    <div className="bg-[#FDFBF7] min-h-screen pt-24 pb-24">
      {/* Header */}
      <div className="bg-olive-900 py-16 mb-12">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-serif text-gold-400 mb-4">Mesafeli Satış Sözleşmesi</h1>
          <p className="text-olive-100">Son Güncelleme: 1 Ocak 2026</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white p-8 md:p-12 rounded-2xl shadow-sm border border-olive-100 text-olive-700 space-y-4 [&>h2]:text-2xl [&>h2]:text-luxury-charcoal [&>h2]:font-serif [&>h2]:mt-8 [&>h3]:text-xl [&>h3]:text-luxury-charcoal [&>h3]:font-serif [&>h3]:mt-8 [&>ul]:list-disc [&>ul]:pl-5 [&>ol]:list-decimal [&>ol]:pl-5">
          <h3>MADDE 1 – TARAFLAR</h3>
          <p>
            <strong>1.1. SATICI BİLGİLERİ</strong><br />
            Ünvanı: Manasor Zeytincilik (ZeytinCo)<br />
            Adresi: Umurbey Mahallesi, Zeytin Dalı Sokak No:12 Gemlik / Bursa<br />
            Telefon: +90 (224) 513 00 00<br />
            E-posta: info@manasor.com
          </p>

          <p>
            <strong>1.2. ALICI BİLGİLERİ</strong><br />
            Alıcı, www.manasor.com internet sitesine üye olan veya üye olmadan misafir olarak sipariş veren kişidir. Alıcının sipariş verirken kullandığı adres ve iletişim bilgileri esas alınır.
          </p>

          <h3>MADDE 2 – SÖZLEŞMENİN KONUSU</h3>
          <p>
            İşbu sözleşmenin konusu, ALICI'nın SATICI'ya ait www.manasor.com internet sitesinden elektronik ortamda siparişini yaptığı, sözleşmede özellikleri ve satış fiyatı belirtilen ürünün satışı ve teslimi ile ilgili olarak 6502 sayılı Tüketicinin Korunması Hakkında Kanun ve Mesafeli Sözleşmeler Yönetmeliği hükümleri gereğince tarafların hak ve yükümlülüklerinin belirlenmesidir.
          </p>

          <h3>MADDE 3 – SÖZLEŞME KONUSU ÜRÜN BİLGİLERİ</h3>
          <p>
            Ürünlerin cinsi ve türü, miktarı, marka/modeli, rengi ve tüm vergiler dâhil satış bedeli www.manasor.com adlı internet sitesindeki ürün tanıtım sayfasında yer alan bilgilerde ve işbu sözleşmenin ayrılmaz parçası sayılan faturada belirtildiği gibidir.
          </p>

          <h3>MADDE 4 – GENEL HÜKÜMLER</h3>
          <ul>
            <li>ALICI, internet sitesinde sözleşme konusu ürünün temel nitelikleri, tüm vergiler dahil satış fiyatı ve ödeme şekli ile teslimata ilişkin ön bilgileri okuyup bilgi sahibi olduğunu ve elektronik ortamda gerekli teyidi verdiğini beyan eder.</li>
            <li>Sözleşme konusu ürün, yasal 30 günlük süreyi aşmamak koşulu ile her bir ürün için ALICI'nın yerleşim yerinin uzaklığına bağlı olarak internet sitesinde belirtilen süre zarfında ALICI veya gösterdiği adresteki kişi/kuruluşa teslim edilir.</li>
            <li>SATICI, sözleşme konusu ürünün sağlam, eksiksiz, siparişte belirtilen niteliklere uygun ve varsa garanti belgeleri ve kullanım kılavuzları ile teslim edilmesinden sorumludur.</li>
          </ul>

          <h3>MADDE 5 – CAYMA HAKKI</h3>
          <p>
            ALICI, sözleşme konusu ürünün kendisine veya gösterdiği adresteki kişi/kuruluşa tesliminden itibaren 14 (ondört) gün içinde hiçbir hukuki ve cezai sorumluluk üstlenmeksizin ve hiçbir gerekçe göstermeksizin malı reddederek sözleşmeden cayma hakkına sahiptir. Gıda ürünlerinde ambalajı açılmış, bozulmuş veya tüketilmiş ürünlerde iade kabul edilmemektedir.
          </p>

          <h3>MADDE 6 – UYUŞMAZLIKLARIN ÇÖZÜMÜ</h3>
          <p>
            İşbu sözleşmenin uygulanmasında, Gümrük ve Ticaret Bakanlığınca ilan edilen değere kadar Alıcının mal veya hizmeti satın aldığı ve ikametgahının bulunduğu yerdeki Tüketici Hakem Heyetleri ile Tüketici Mahkemeleri yetkilidir.
          </p>
        </div>
      </div>
    </div>
  );
}
