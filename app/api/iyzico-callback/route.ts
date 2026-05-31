import { NextResponse } from 'next/server';
import Iyzipay from 'iyzipay';
import { getPayload } from 'payload';
import configPromise from '@/payload.config';

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
      return NextResponse.redirect(new URL('/checkout?error=no_token', request.url), 303);
    }

    // MOCK IYZICO CALLBACK HANDLING
    if (token.startsWith('MOCK_TOKEN_')) {
      // Başarılı bir ödeme simülasyonu
      const fakePaymentId = `PAY_${Date.now()}`;
      return NextResponse.redirect(new URL(`/success?orderId=${fakePaymentId}`, request.url), 303);
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
      // Ödeme başarılı!
      try {
        const payload = await getPayload({ config: configPromise });
        const basketId = result.basketId; // Payload order ID
        const paymentId = result.paymentId;

        // Siparişi bul ve güncelle
        const order = await payload.findByID({
          collection: 'orders',
          id: basketId
        });

        if (order) {
          await payload.update({
            collection: 'orders',
            id: basketId,
            data: {
              status: 'paid',
              paymentReference: paymentId
            }
          });

          // Müşteri Kaydı (User tablosuna ekle/güncelle)
          const { docs: existingUsers } = await payload.find({
            collection: 'users',
            where: {
              email: { equals: order.email }
            }
          });

          if (existingUsers.length === 0) {
            // Yeni müşteri oluştur (Parola zorunlu olduğu için rastgele oluşturuyoruz)
            const randomPassword = Math.random().toString(36).slice(-10) + 'A1!';
            await payload.create({
              collection: 'users',
              data: {
                email: order.email,
                password: randomPassword,
                name: `${order.firstName} ${order.lastName}`,
                role: 'customer',
                phone_number: order.phone,
                billing_address: {
                  address: order.address,
                  city: order.city,
                  district: order.district,
                  tax_office: order.taxOffice || '',
                  tax_number: order.taxNumber || ''
                },
                shipping_address: {
                  address: order.address,
                  city: order.city,
                  district: order.district
                }
              } as any
            });
          }
        }
      } catch (dbError) {
        console.error("Payload Update Error:", dbError);
        // Ödeme başarılı olduğu için sipariş hatası alsak bile success'e yönlendirmek en doğrusu,
        // gerçeğe alınırken burada bir alert/webhook tetiklenebilir.
      }

      return NextResponse.redirect(new URL(`/success?orderId=${result.paymentId}`, request.url), 303);
    } else {
      // Ödeme başarısız
      return NextResponse.redirect(new URL(`/checkout?error=${encodeURIComponent(result.errorMessage || 'Ödeme reddedildi')}`, request.url), 303);
    }

  } catch (error) {
    console.error('Iyzico Callback Error:', error);
    return NextResponse.redirect(new URL('/checkout?error=server_error', request.url), 303);
  }
}
