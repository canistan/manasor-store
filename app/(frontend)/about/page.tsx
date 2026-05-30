import Image from "next/image";
import Link from "next/link";
import { Leaf, Award, Heart, ShieldCheck } from "lucide-react";

export const metadata = {
  title: "Hakkımızda | Manasor",
  description: "Bursa Gemlik'ten sofralarınıza uzanan doğal zeytin ve zeytinyağı hikayemiz.",
};

export default function AboutPage() {
  return (
    <div className="flex flex-col min-h-screen bg-[#FDFBF7] pt-24">
      {/* 1. HERO ALANI */}
      <section className="relative w-full h-[60vh] min-h-[400px] flex items-center justify-center text-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image
            src="https://images.unsplash.com/photo-1591122523233-22037c1dec9f?q=80&w=2000&auto=format&fit=crop"
            alt="Gemlik Zeytin Bahçeleri"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-luxury-black/60"></div>
        </div>
        
        <div className="relative z-10 max-w-4xl mx-auto px-4 flex flex-col items-center animate-fade-in-up">
          <span className="text-gold-400 font-medium tracking-widest-plus uppercase text-sm md:text-base mb-4 drop-shadow-md">
            Köklerimizden Sofranıza
          </span>
          <h1 className="text-4xl md:text-6xl font-serif text-white mb-6 leading-tight drop-shadow-lg">
            Bizim Hikayemiz
          </h1>
          <div className="w-24 h-1 bg-gold-500 mx-auto rounded-full"></div>
        </div>
      </section>

      {/* 2. HİKAYEMİZ - METİN & GÖRSEL */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row items-center gap-16">
            <div className="lg:w-1/2 relative">
              <div className="relative aspect-[4/5] w-full rounded-2xl overflow-hidden shadow-2xl">
                <Image
                  src="https://images.unsplash.com/photo-1501959915551-4e8d30928317?q=80&w=1000&auto=format&fit=crop"
                  alt="Zeytin Hasadı"
                  fill
                  className="object-cover hover:scale-105 transition-transform duration-1000"
                />
              </div>
              {/* Süsleme Kutusu */}
              <div className="absolute -bottom-8 -right-8 w-48 h-48 bg-olive-100 rounded-2xl -z-10 hidden md:block"></div>
              <div className="absolute -top-8 -left-8 w-32 h-32 border-2 border-gold-300 rounded-2xl -z-10 hidden md:block"></div>
            </div>
            
            <div className="lg:w-1/2 space-y-6">
              <h2 className="text-3xl md:text-4xl font-serif text-luxury-charcoal">Gemlik'ten Doğan Bir Tutku</h2>
              <h3 className="text-xl text-gold-600 font-medium">Toprağa ve Doğaya Saygı</h3>
              
              <div className="space-y-4 text-olive-700 leading-relaxed font-light">
                <p>
                  Manasor'un temelleri, Türkiye'nin en verimli zeytin havzalarından biri olan <strong>Bursa Gemlik</strong>'te atıldı. Nesiller boyu zeytin ağaçlarının gölgesinde büyüyen bir ailenin toprağa olan derin bağlılığı, zamanla bir tutkuya ve ardından bugün sofralarınıza ulaşan bir kalite serüvenine dönüştü.
                </p>
                <p>
                  Gemlik'in kendine has mikroiklimi, denizden esen iyotlu rüzgarları ve bereketli toprakları, dünyanın en lezzetli ve ince kabuklu zeytinlerinin yetişmesi için kusursuz bir ortam sunar. Biz de bu mucizevi coğrafyanın bize sunduğu hediyeyi, en saf ve doğal haliyle sizlere ulaştırmayı kendimize görev edindik.
                </p>
                <p>
                  Hasat zamanı geldiğinde, ağaçlarımıza zarar vermeden, büyük bir özenle ve geleneksel yöntemlerle zeytinlerimizi topluyoruz. Hiçbir kimyasal işleme maruz bırakmadan, sadece su ve tuz ile fermente ederek doğallığını koruyoruz. Zeytinyağlarımız ise, toplanan zeytinlerin saatler içerisinde "soğuk sıkım" yöntemiyle işlenmesiyle elde ediliyor. Böylece zeytinin içerdiği o eşsiz fenolik bileşenler, antioksidanlar ve vitaminler olduğu gibi şişeleniyor.
                </p>
              </div>
              
              <div className="pt-6 border-t border-olive-100">
                <p className="font-serif text-xl text-luxury-charcoal italic">
                  "Bizim için zeytin sadece bir ürün değil, kuşaktan kuşağa aktarılan bir yaşam biçimidir."
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. DEĞERLERİMİZ / ÖZELLİKLER */}
      <section className="py-20 bg-olive-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-serif mb-4">Neden Manasor?</h2>
            <div className="w-16 h-1 bg-gold-500 mx-auto rounded-full"></div>
            <p className="mt-6 text-olive-300 max-w-2xl mx-auto">
              Üretimin her aşamasında kaliteden ödün vermiyor, doğanın bize sunduğu saflığı sofralarınıza taşıyoruz.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="bg-olive-800/50 p-8 rounded-2xl border border-olive-700 hover:bg-olive-800 transition-colors group">
              <div className="w-14 h-14 bg-gold-500/10 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Leaf className="text-gold-400 w-7 h-7" />
              </div>
              <h3 className="text-xl font-semibold mb-3 tracking-wide">Yüzde Yüz Doğal</h3>
              <p className="text-olive-300 text-sm leading-relaxed">
                Ürünlerimizin hiçbirinde koruyucu, renklendirici veya kimyasal katkı maddesi bulunmaz. Tamamen doğal yollarla üretilir.
              </p>
            </div>
            
            <div className="bg-olive-800/50 p-8 rounded-2xl border border-olive-700 hover:bg-olive-800 transition-colors group">
              <div className="w-14 h-14 bg-gold-500/10 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <ShieldCheck className="text-gold-400 w-7 h-7" />
              </div>
              <h3 className="text-xl font-semibold mb-3 tracking-wide">Üstün Kalite</h3>
              <p className="text-olive-300 text-sm leading-relaxed">
                Zeytinlerimiz özenle seçilir, zeytinyağlarımız ise 0.3-0.5 arası düşük asit oranlarıyla premium kalite standartlarındadır.
              </p>
            </div>
            
            <div className="bg-olive-800/50 p-8 rounded-2xl border border-olive-700 hover:bg-olive-800 transition-colors group">
              <div className="w-14 h-14 bg-gold-500/10 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Award className="text-gold-400 w-7 h-7" />
              </div>
              <h3 className="text-xl font-semibold mb-3 tracking-wide">Geleneksel Üretim</h3>
              <p className="text-olive-300 text-sm leading-relaxed">
                Atalarımızdan öğrendiğimiz geleneksel yöntemleri, modern hijyen standartlarıyla birleştirerek üretim yapıyoruz.
              </p>
            </div>
            
            <div className="bg-olive-800/50 p-8 rounded-2xl border border-olive-700 hover:bg-olive-800 transition-colors group">
              <div className="w-14 h-14 bg-gold-500/10 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Heart className="text-gold-400 w-7 h-7" />
              </div>
              <h3 className="text-xl font-semibold mb-3 tracking-wide">Doğaya Saygı</h3>
              <p className="text-olive-300 text-sm leading-relaxed">
                Sürdürülebilir tarım ilkelerine uyuyor, toprağı yormadan, doğanın dengesini koruyarak hasat yapıyoruz.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. CTA ALANI */}
      <section className="py-24 bg-cream relative overflow-hidden">
        {/* Dekoratif yaprak veya zeytin motifi (background) */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-gold-500/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-olive-900/5 rounded-full blur-3xl"></div>
        
        <div className="max-w-4xl mx-auto px-4 text-center relative z-10">
          <h2 className="text-3xl md:text-5xl font-serif text-luxury-charcoal mb-6">Bu Lezzeti Deneyimleyin</h2>
          <p className="text-lg text-olive-600 mb-10 max-w-2xl mx-auto font-light">
            Gemlik'in eşsiz doğasından sofralarınıza uzanan bu hikayenin bir parçası olun. En taze ürünlerimizi hemen inceleyebilirsiniz.
          </p>
          <Link 
            href="/products" 
            className="inline-block bg-gold-500 hover:bg-gold-600 text-white font-medium px-12 py-4 uppercase tracking-widest transition-all duration-300 rounded-full hover:scale-105 shadow-xl hover:shadow-gold-500/20"
          >
            Ürünleri İncele
          </Link>
        </div>
      </section>

    </div>
  );
}
