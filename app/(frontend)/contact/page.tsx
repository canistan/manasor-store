import Image from "next/image";
import { MapPin, Phone, Mail, Clock } from "lucide-react";

export const metadata = {
  title: "İletişim | Manasor",
  description: "ZeytinCo / Manasor ile iletişime geçin. Soru, görüş ve önerileriniz için buradayız.",
};

export default function ContactPage() {
  return (
    <div className="flex flex-col min-h-screen bg-[#FDFBF7] pt-24">
      {/* HERO ALANI */}
      <section className="relative w-full h-[50vh] min-h-[300px] flex items-center justify-center text-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image
            src="https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?q=80&w=2000&auto=format&fit=crop"
            alt="ZeytinCo İletişim"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-luxury-black/60"></div>
        </div>
        
        <div className="relative z-10 max-w-4xl mx-auto px-4 flex flex-col items-center animate-fade-in-up">
          <span className="text-gold-400 font-medium tracking-widest-plus uppercase text-sm md:text-base mb-4 drop-shadow-md">
            Soru ve Önerileriniz İçin
          </span>
          <h1 className="text-4xl md:text-6xl font-serif text-white mb-6 leading-tight drop-shadow-lg">
            İletişime Geçin
          </h1>
          <div className="w-24 h-1 bg-gold-500 mx-auto rounded-full"></div>
        </div>
      </section>

      {/* İLETİŞİM İÇERİĞİ */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row gap-16">
            
            {/* Sol Kolon - İletişim Bilgileri */}
            <div className="lg:w-5/12 space-y-12">
              <div>
                <h2 className="text-3xl font-serif text-luxury-charcoal mb-4">Size Nasıl Yardımcı Olabiliriz?</h2>
                <p className="text-olive-700 font-light leading-relaxed">
                  Ürünlerimiz, siparişleriniz veya markamız hakkında merak ettiğiniz her türlü soru için bize ulaşabilirsiniz. Müşteri temsilcilerimiz en kısa sürede size geri dönüş yapacaktır.
                </p>
              </div>

              <div className="space-y-8">
                <div className="flex items-start space-x-6 group">
                  <div className="w-14 h-14 bg-olive-100 rounded-full flex items-center justify-center flex-shrink-0 group-hover:bg-gold-500 transition-colors duration-300">
                    <MapPin className="text-olive-900 group-hover:text-white transition-colors duration-300 w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-luxury-charcoal mb-1">Adres</h3>
                    <p className="text-olive-700 font-light">
                      Umurbey Mahallesi, Zeytin Dalı Sokak No:12<br />
                      Gemlik / Bursa
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-6 group">
                  <div className="w-14 h-14 bg-olive-100 rounded-full flex items-center justify-center flex-shrink-0 group-hover:bg-gold-500 transition-colors duration-300">
                    <Phone className="text-olive-900 group-hover:text-white transition-colors duration-300 w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-luxury-charcoal mb-1">Telefon</h3>
                    <p className="text-olive-700 font-light">
                      +90 (224) 513 00 00
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-6 group">
                  <div className="w-14 h-14 bg-olive-100 rounded-full flex items-center justify-center flex-shrink-0 group-hover:bg-gold-500 transition-colors duration-300">
                    <Mail className="text-olive-900 group-hover:text-white transition-colors duration-300 w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-luxury-charcoal mb-1">E-posta</h3>
                    <p className="text-olive-700 font-light">
                      info@manasor.com
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-6 group">
                  <div className="w-14 h-14 bg-olive-100 rounded-full flex items-center justify-center flex-shrink-0 group-hover:bg-gold-500 transition-colors duration-300">
                    <Clock className="text-olive-900 group-hover:text-white transition-colors duration-300 w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-luxury-charcoal mb-1">Çalışma Saatleri</h3>
                    <p className="text-olive-700 font-light">
                      Pazartesi - Cuma: 09:00 - 18:00<br />
                      Cumartesi: 10:00 - 15:00
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Sağ Kolon - İletişim Formu */}
            <div className="lg:w-7/12">
              <div className="bg-white p-8 md:p-12 rounded-2xl shadow-xl border border-olive-50">
                <h3 className="text-2xl font-serif text-luxury-charcoal mb-8">Bize Mesaj Gönderin</h3>
                
                <form className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label htmlFor="name" className="block text-sm font-medium text-olive-900">
                        Adınız Soyadınız
                      </label>
                      <input 
                        type="text" 
                        id="name" 
                        className="w-full px-4 py-3 rounded-lg border border-olive-200 focus:border-gold-500 focus:ring-2 focus:ring-gold-500/20 transition-all outline-none bg-cream/50"
                        placeholder="Örn: Ahmet Yılmaz"
                      />
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="email" className="block text-sm font-medium text-olive-900">
                        E-posta Adresiniz
                      </label>
                      <input 
                        type="email" 
                        id="email" 
                        className="w-full px-4 py-3 rounded-lg border border-olive-200 focus:border-gold-500 focus:ring-2 focus:ring-gold-500/20 transition-all outline-none bg-cream/50"
                        placeholder="Örn: ahmet@ornek.com"
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <label htmlFor="subject" className="block text-sm font-medium text-olive-900">
                      Konu
                    </label>
                    <input 
                      type="text" 
                      id="subject" 
                      className="w-full px-4 py-3 rounded-lg border border-olive-200 focus:border-gold-500 focus:ring-2 focus:ring-gold-500/20 transition-all outline-none bg-cream/50"
                      placeholder="Mesajınızın konusu"
                    />
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="message" className="block text-sm font-medium text-olive-900">
                      Mesajınız
                    </label>
                    <textarea 
                      id="message" 
                      rows={5}
                      className="w-full px-4 py-3 rounded-lg border border-olive-200 focus:border-gold-500 focus:ring-2 focus:ring-gold-500/20 transition-all outline-none bg-cream/50 resize-none"
                      placeholder="Size nasıl yardımcı olabiliriz?"
                    ></textarea>
                  </div>

                  <button 
                    type="button" 
                    className="w-full bg-olive-900 hover:bg-gold-500 text-white font-medium py-4 rounded-lg uppercase tracking-wider transition-colors duration-300"
                  >
                    Mesajı Gönder
                  </button>
                </form>
              </div>
            </div>

          </div>
        </div>
      </section>

    </div>
  );
}
