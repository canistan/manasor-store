import React from 'react';

export const metadata = {
  title: 'KVKK Aydınlatma Metni | Manasor',
  description: 'Manasor Zeytincilik Kişisel Verilerin Korunması Kanunu Aydınlatma Metni.',
};

export default function KvkkPage() {
  return (
    <div className="bg-[#FDFBF7] min-h-screen pt-24 pb-24">
      {/* Header */}
      <div className="bg-olive-900 py-16 mb-12">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-serif text-gold-400 mb-4">KVKK Aydınlatma Metni</h1>
          <p className="text-olive-100">Kişisel Verilerin Korunması Kanunu Kapsamında Bilgilendirme</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white p-8 md:p-12 rounded-2xl shadow-sm border border-olive-100 prose prose-olive max-w-none">
          <p>
            Manasor Zeytincilik olarak kişisel verilerinizin güvenliği hususuna azami hassasiyet göstermekteyiz. Bu bilinçle, Şirket olarak ürün ve hizmetlerimizden faydalanan kişiler dâhil, Şirket ile ilişkili tüm şahıslara ait her türlü kişisel verilerin 6698 sayılı Kişisel Verilerin Korunması Kanunu ("KVKK")'na, bağlı mevzuatına ve Kişisel Verileri Koruma Kurulu kararlarına uygun olarak işlenerek, muhafaza edilmesine büyük önem atfetmekteyiz.
          </p>

          <h3>1. Veri Sorumlusunun Kimliği</h3>
          <p>
            KVKK uyarınca, "Manasor Zeytincilik" ("Şirket") veri sorumlusu sıfatıyla kişisel verilerinizi aşağıda açıklanan amaçlar dâhilinde; hukuka ve dürüstlük kurallarına uygun olarak işleyebilecek, kaydedebilecek, muhafaza edebilecek, sınıflandırabilecek ve mevzuatın izin verdiği hallerde üçüncü kişilere aktarabilecektir.
          </p>

          <h3>2. Kişisel Verilerin İşlenme Amacı</h3>
          <p>Toplanan kişisel verileriniz, şirketimiz tarafından sunulan ürün ve hizmetlerden sizleri faydalandırmak için gerekli çalışmaların iş birimlerimiz tarafından yapılması, siparişlerinizin teslimatı, fatura işlemlerinin gerçekleştirilmesi, yasal yükümlülüklerimizin yerine getirilmesi ve (onay vermeniz halinde) pazarlama ve kampanya faaliyetlerinin yürütülmesi amaçlarıyla işlenmektedir.</p>

          <h3>3. Kişisel Verilerin Aktarılması</h3>
          <p>
            Kişisel verileriniz; Şirketimizin sunduğu ürün ve hizmetlerin ulaştırılması amacıyla lojistik ve kargo şirketleriyle, finansal işlemlerin yürütülmesi amacıyla BDDK lisanslı güvenli ödeme kuruluşlarıyla (Iyzico) ve hukuki yükümlülüklerimizi yerine getirmek amacıyla yetkili kamu kurumlarıyla mevzuata uygun şekilde paylaşılabilmektedir.
          </p>

          <h3>4. Kişisel Veri Toplamanın Yöntemi ve Hukuki Sebebi</h3>
          <p>
            Kişisel verileriniz, web sitemiz üzerinden elektronik formlar, iletişim veya sipariş ekranları vasıtasıyla toplanmaktadır. Bu veriler, KVKK'nın 5. maddesinde belirtilen "sözleşmenin kurulması veya ifasıyla doğrudan doğruya ilgili olması kaydıyla sözleşmenin taraflarına ait kişisel verilerin işlenmesinin gerekli olması", "veri sorumlusunun hukuki yükümlülüğünü yerine getirebilmesi için zorunlu olması" ve ilgili kişinin açık rızası hukuki sebeplerine dayalı olarak toplanmaktadır.
          </p>

          <h3>5. İlgili Kişinin Hakları</h3>
          <p>
            KVKK'nın 11. maddesi uyarınca; kişisel verilerinizin işlenip işlenmediğini öğrenme, işlenmişse bilgi talep etme, işlenme amacını ve bunların amacına uygun kullanılıp kullanılmadığını öğrenme, yurt içinde veya yurt dışında kişisel verilerin aktarıldığı üçüncü kişileri bilme, eksik veya yanlış işlenmişse düzeltilmesini isteme haklarına sahipsiniz. Haklarınızı kullanmak için <strong>info@manasor.com</strong> adresi üzerinden bizimle iletişime geçebilirsiniz.
          </p>
        </div>
      </div>
    </div>
  );
}
