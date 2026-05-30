import { NextResponse } from 'next/server';
import Iyzipay from 'iyzipay';

const iyzipay = new Iyzipay({
  apiKey: process.env.IYZICO_API_KEY || 'sandbox-p19v0k7nO8hQIfF4rQ4yGfSihR2Kqj0T',
  secretKey: process.env.IYZICO_SECRET_KEY || 'sandbox-7m7312Z2dD1zL1G4D9aY1l2vH3wE7O8t',
  uri: 'https://sandbox-api.iyzipay.com'
});

export async function POST(request: Request) {
  try {
    // Iyzico form data olarak token gönderir
    const formData = await request.formData();
    const token = formData.get('token') as string;

    if (!token) {
      return NextResponse.redirect(new URL('/checkout?error=no_token', request.url));
    }

    // MOCK IYZICO CALLBACK HANDLING
    if (token.startsWith('MOCK_TOKEN_')) {
      // Başarılı bir ödeme simülasyonu
      const fakePaymentId = `PAY_${Date.now()}`;
      return NextResponse.redirect(new URL(`/success?orderId=${fakePaymentId}`, request.url));
    }

    // Token ile gerçek Iyzico sunucusundan işlem sonucunu sorgula
    const result: any = await new Promise((resolve) => {
      iyzipay.checkoutForm.retrieve({
        locale: Iyzipay.LOCALE.TR,
        conversationId: `MANASOR-RET-${Date.now()}`,
        token: token
      }, (err: any, res: any) => {
        resolve(err || res);
      });
    });

    if (result.status === 'success' && result.paymentStatus === 'SUCCESS') {
      // Ödeme başarılı! Siparişi veritabanına kaydetme (Payload CMS vb.) işlemi burada yapılmalı.
      // Şimdilik doğrudan success sayfasına yönlendiriyoruz.
      return NextResponse.redirect(new URL(`/success?orderId=${result.paymentId}`, request.url));
    } else {
      // Ödeme başarısız
      return NextResponse.redirect(new URL(`/checkout?error=${encodeURIComponent(result.errorMessage || 'Ödeme reddedildi')}`, request.url));
    }

  } catch (error) {
    console.error('Iyzico Callback Error:', error);
    return NextResponse.redirect(new URL('/checkout?error=server_error', request.url));
  }
}
