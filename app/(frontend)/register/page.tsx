"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Mail, Lock, User as UserIcon, Apple, ArrowRight } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useCartStore } from '@/store/useCartStore';

export default function RegisterPage() {
  const router = useRouter();
  const { items, setCart } = useCartStore();
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Already logged in check
    fetch('/api/customers/me')
      .then(res => res.json())
      .then(data => {
        if (data && data.user) {
          router.push('/dashboard');
        }
      })
      .catch(() => {});
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    
    try {
      // 1. Kayıt İşlemi
      const res = await fetch('/api/customers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: `${firstName} ${lastName}`.trim(),
          email,
          password,
          role: 'customer'
        })
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.errors?.[0]?.message || data.message || 'Kayıt işlemi başarısız oldu. E-posta adresi kullanımda olabilir.');
      }

      // 2. Otomatik Giriş İşlemi
      const loginRes = await fetch('/api/customers/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      if (loginRes.ok) {
        // Sepet Birleştirme (Kasa Uyumu)
        try {
          const syncRes = await fetch('/api/customers/cart/sync', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ cart: items })
          });
          if (syncRes.ok) {
            const syncData = await syncRes.json();
            if (syncData.cart) {
              setCart(syncData.cart);
            }
          }
        } catch (syncErr) {
          console.error('Sepet birleştirme hatası:', syncErr);
        }

        router.push('/dashboard');
        router.refresh();
      } else {
        // Eğer giriş başarısız olursa, manuel giriş için yönlendir
        router.push('/login?registered=true');
      }

    } catch (err: any) {
      setError(err.message || 'Bir hata oluştu. Lütfen tekrar deneyin.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSocialLogin = (provider: string) => {
    alert(`${provider} ile kayıt altyapısı hazırlanıyor. İlerleyen aşamalarda API anahtarları eklendiğinde aktif olacaktır.`);
  };

  return (
    <div className="min-h-screen bg-cream flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-serif text-luxury-charcoal">
          Aramıza Katılın
        </h2>
        <p className="mt-2 text-center text-sm text-olive-600">
          Zaten bir hesabınız var mı?{' '}
          <Link href="/login" className="font-medium text-gold-600 hover:text-gold-500 transition-colors">
            Giriş Yapın
          </Link>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-2xl sm:px-10 border border-olive-100">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-olive-900 mb-1">
                  Adınız
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <UserIcon className="h-5 w-5 text-olive-400" />
                  </div>
                  <input
                    type="text"
                    required
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    className="block w-full pl-10 pr-3 py-3 border border-olive-200 rounded-xl focus:ring-gold-500 focus:border-gold-500 text-olive-900 bg-white placeholder-olive-300 transition-colors"
                    placeholder="Ad"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-olive-900 mb-1">
                  Soyadınız
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <UserIcon className="h-5 w-5 text-olive-400" />
                  </div>
                  <input
                    type="text"
                    required
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    className="block w-full pl-10 pr-3 py-3 border border-olive-200 rounded-xl focus:ring-gold-500 focus:border-gold-500 text-olive-900 bg-white placeholder-olive-300 transition-colors"
                    placeholder="Soyad"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-olive-900 mb-1">
                E-posta Adresi
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-olive-400" />
                </div>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="block w-full pl-10 pr-3 py-3 border border-olive-200 rounded-xl focus:ring-gold-500 focus:border-gold-500 text-olive-900 bg-white placeholder-olive-300 transition-colors"
                  placeholder="ornek@eposta.com"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-olive-900 mb-1">
                Şifre Belirleyin
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-olive-400" />
                </div>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full pl-10 pr-3 py-3 border border-olive-200 rounded-xl focus:ring-gold-500 focus:border-gold-500 text-olive-900 bg-white placeholder-olive-300 transition-colors"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <div className="flex items-start">
              <div className="flex items-center h-5">
                <input
                  id="terms"
                  name="terms"
                  type="checkbox"
                  required
                  className="h-4 w-4 text-gold-500 focus:ring-gold-500 border-olive-300 rounded"
                />
              </div>
              <div className="ml-3 text-sm">
                <label htmlFor="terms" className="text-olive-700">
                  <a href="#" className="text-gold-600 hover:text-gold-500 underline">Üyelik Sözleşmesi</a>'ni ve <a href="#" className="text-gold-600 hover:text-gold-500 underline">Aydınlatma Metni</a>'ni okudum, onaylıyorum.
                </label>
              </div>
            </div>

            {error && (
              <div className="text-red-500 text-sm text-center bg-red-50 py-2 rounded-lg border border-red-100">
                {error}
              </div>
            )}

            <div>
              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-xl shadow-md text-sm font-medium text-white bg-olive-900 hover:bg-gold-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gold-500 transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <>
                    Hesap Oluştur <ArrowRight className="ml-2 w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </form>

          <div className="mt-8">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-olive-100" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-olive-500">Hızlı Kayıt Seçenekleri</span>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-3 gap-3">
              <button
                onClick={() => handleSocialLogin('Google')}
                className="w-full inline-flex justify-center py-2.5 px-4 border border-olive-200 rounded-xl shadow-sm bg-white text-sm font-medium text-olive-700 hover:bg-olive-50 transition-colors"
              >
                <span className="sr-only">Google ile Kayıt Ol</span>
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
              </button>
              <button
                onClick={() => handleSocialLogin('Apple')}
                className="w-full inline-flex justify-center py-2.5 px-4 border border-olive-200 rounded-xl shadow-sm bg-white text-sm font-medium text-olive-700 hover:bg-olive-50 transition-colors"
              >
                <span className="sr-only">Apple ile Kayıt Ol</span>
                <Apple className="w-5 h-5" />
              </button>
              <button
                onClick={() => handleSocialLogin('Facebook')}
                className="w-full inline-flex justify-center py-2.5 px-4 border border-olive-200 rounded-xl shadow-sm bg-white text-sm font-medium text-olive-700 hover:bg-olive-50 transition-colors"
              >
                <span className="sr-only">Facebook ile Kayıt Ol</span>
                <svg className="w-5 h-5" fill="#1877F2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.469h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.469h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
              </button>
            </div>
            <p className="mt-4 text-xs text-center text-olive-400">
              * Sosyal hesapla giriş özellikleri API entegrasyonu sağlandıktan sonra aktif olacaktır.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
