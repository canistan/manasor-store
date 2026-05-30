"use client";

import { useState } from 'react';
import Link from 'next/link';
import { Mail, Lock, Chrome, Apple, Facebook, ArrowRight } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    
    // Gerçek Payload CMS Auth API bağlantısı yapılacak
    // await fetch('/api/users/login', ...)
    
    setTimeout(() => {
      setIsLoading(false);
      // Başarılı giriş senaryosunda dashboard'a yönlendireceğiz
      // router.push('/dashboard');
    }, 1000);
  };

  const handleSocialLogin = (provider: string) => {
    alert(`${provider} ile giriş altyapısı hazırlanıyor. İlerleyen aşamalarda API anahtarları eklendiğinde aktif olacaktır.`);
  };

  return (
    <div className="min-h-screen bg-cream flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-serif text-luxury-charcoal">
          Hesabınıza Giriş Yapın
        </h2>
        <p className="mt-2 text-center text-sm text-olive-600">
          Ya da{' '}
          <Link href="/register" className="font-medium text-gold-600 hover:text-gold-500 transition-colors">
            yeni bir hesap oluşturun
          </Link>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-2xl sm:px-10 border border-olive-100">
          <form className="space-y-6" onSubmit={handleSubmit}>
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
                Şifre
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

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 text-gold-500 focus:ring-gold-500 border-olive-300 rounded"
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-olive-700">
                  Beni Hatırla
                </label>
              </div>

              <div className="text-sm">
                <a href="#" className="font-medium text-gold-600 hover:text-gold-500 transition-colors">
                  Şifremi Unuttum?
                </a>
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
                    Giriş Yap <ArrowRight className="ml-2 w-4 h-4" />
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
                <span className="px-2 bg-white text-olive-500">Hızlı Giriş Seçenekleri</span>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-3 gap-3">
              <button
                onClick={() => handleSocialLogin('Google')}
                className="w-full inline-flex justify-center py-2.5 px-4 border border-olive-200 rounded-xl shadow-sm bg-white text-sm font-medium text-olive-700 hover:bg-olive-50 transition-colors"
              >
                <span className="sr-only">Google ile Giriş</span>
                <Chrome className="w-5 h-5" />
              </button>
              <button
                onClick={() => handleSocialLogin('Apple')}
                className="w-full inline-flex justify-center py-2.5 px-4 border border-olive-200 rounded-xl shadow-sm bg-white text-sm font-medium text-olive-700 hover:bg-olive-50 transition-colors"
              >
                <span className="sr-only">Apple ile Giriş</span>
                <Apple className="w-5 h-5" />
              </button>
              <button
                onClick={() => handleSocialLogin('Facebook')}
                className="w-full inline-flex justify-center py-2.5 px-4 border border-olive-200 rounded-xl shadow-sm bg-white text-sm font-medium text-olive-700 hover:bg-olive-50 transition-colors"
              >
                <span className="sr-only">Facebook ile Giriş</span>
                <Facebook className="w-5 h-5" />
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
