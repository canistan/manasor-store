import React from 'react';
import Link from 'next/link';
import { ChevronDown } from 'lucide-react';

export const metadata = {
  title: 'Sıkça Sorulan Sorular | Manasor',
  description: 'ZeytinCo ve ürünlerimiz hakkında merak ettikleriniz.',
};

const faqs = [
  {
    question: "Siparişler ne zaman kargolanır?",
    answer: "Saat 14:00'a kadar verilen siparişler, stok durumuna bağlı olarak genellikle aynı gün kargoya verilir. Hafta sonu ve resmi tatillerde verilen siparişler ilk iş günü işleme alınır."
  },
  {
    question: "Kargo ücreti ne kadar? Bedava kargo limitiniz var mı?",
    answer: "Standart kargo ücretimiz 79.90 TL'dir. 1500 TL ve üzeri siparişlerinizde kargo ücretsizdir (bedava kargo kampanyası)."
  },
  {
    question: "Ürünlerinizi nerede üretiyorsunuz?",
    answer: "Tüm zeytin ve zeytinyağı ürünlerimiz Bursa'nın Gemlik ilçesinde, kendi tesislerimizde, geleneksel ve doğal yöntemlere sadık kalınarak üretilmektedir."
  },
  {
    question: "Soğuk sıkım zeytinyağınızın asit oranı nedir?",
    answer: "Erken hasat soğuk sıkım natürel sızma zeytinyağlarımızın asit oranı maksimum %0.3 ile %0.5 arasında değişmektedir. Oldukça düşük asit oranına sahip premium yağlardır."
  },
  {
    question: "İade politikanız nedir?",
    answer: "Gıda ürünü oldukları için hijyen kuralları gereği, yalnızca ambalajı veya vakumu açılmamış ürünleri 14 gün içerisinde iade edebilirsiniz. Hasarlı teslimatlarda ise tutanak tutturarak ücretsiz değişim/iade sağlayabilirsiniz."
  },
  {
    question: "Üye olmadan alışveriş yapabilir miyim?",
    answer: "Evet, sistemimizde üyelik zorunluluğu yoktur. Hızlı ve güvenli bir şekilde misafir olarak alışverişinizi tamamlayabilirsiniz. İsterseniz bültenimize abone olarak kampanyalardan haberdar olabilirsiniz."
  }
];

export default function FaqPage() {
  return (
    <div className="bg-[#FDFBF7] min-h-screen pt-24 pb-24">
      {/* Header */}
      <div className="bg-olive-900 py-16 mb-12">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-serif text-gold-400 mb-4">Sıkça Sorulan Sorular</h1>
          <p className="text-olive-100">Merak ettiğiniz her şeyin cevabı burada.</p>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="space-y-6">
          {faqs.map((faq, index) => (
            <details key={index} className="group bg-white rounded-2xl shadow-sm border border-olive-100 p-6 [&_summary::-webkit-details-marker]:hidden">
              <summary className="flex items-center justify-between cursor-pointer list-none">
                <h3 className="text-lg font-medium text-luxury-charcoal pr-4">{faq.question}</h3>
                <span className="transition group-open:rotate-180 flex-shrink-0 text-gold-500">
                  <ChevronDown className="w-5 h-5" />
                </span>
              </summary>
              <div className="text-olive-700 font-light leading-relaxed mt-4 pt-4 border-t border-olive-50">
                {faq.answer}
              </div>
            </details>
          ))}
        </div>

        <div className="mt-16 text-center bg-white p-8 rounded-2xl shadow-sm border border-olive-100">
          <h3 className="text-2xl font-serif text-luxury-charcoal mb-4">Başka bir sorunuz mu var?</h3>
          <p className="text-olive-600 mb-6">Aradığınız cevabı bulamadıysanız müşteri hizmetlerimize her zaman ulaşabilirsiniz.</p>
          <Link href="/contact" className="inline-block bg-olive-900 hover:bg-gold-500 text-white font-medium px-8 py-3 rounded-lg transition-colors">
            Bize Ulaşın
          </Link>
        </div>
      </div>
    </div>
  );
}
