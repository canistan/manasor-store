"use client";

import { useState } from 'react';
import Link from 'next/link';
import { Mail, ArrowRight, CheckCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setSuccess(false);
    
    try {
      const res = await fetch('/api/customers/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Şifre sıfırlama talebi başarısız oldu. Lütfen tekrar deneyin.');
      }

      setSuccess(true);
    } catch (err: any) {
      setError(err.message || 'Bir hata oluştu.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-cream flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-serif text-luxury-charcoal">
          Şifremi Unuttum
        </h2>
        <p className="mt-2 text-center text-sm text-olive-600">
          Şifrenizi mi unuttunuz? E-posta adresinizi girin, size sıfırlama bağlantısı gönderelim.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-2xl sm:px-10 border border-olive-100">
          {success ? (
            <div className="text-center animate-in fade-in duration-500">
              <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
              <h3 className="text-xl font-serif text-luxury-charcoal mb-2">E-posta Gönderildi!</h3>
              <p className="text-olive-600 text-sm mb-6">
                <strong>{email}</strong> adresine şifre sıfırlama bağlantısı içeren bir e-posta gönderdik. Lütfen gelen kutunuzu (ve spam klasörünü) kontrol edin.
              </p>
              <Link 
                href="/login"
                className="w-full flex justify-center py-3 px-4 border border-olive-200 rounded-xl shadow-sm text-sm font-medium text-olive-900 bg-olive-50 hover:bg-olive-100 focus:outline-none transition-colors"
              >
                Giriş Sayfasına Dön
              </Link>
            </div>
          ) : (
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
                      Sıfırlama Bağlantısı Gönder <ArrowRight className="ml-2 w-4 h-4" />
                    </>
                  )}
                </button>
              </div>
              
              <div className="text-center mt-4">
                <Link href="/login" className="text-sm font-medium text-gold-600 hover:text-gold-500 transition-colors">
                  Giriş Sayfasına Dön
                </Link>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
