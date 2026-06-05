import { NextResponse } from 'next/server';
import { getPayload } from 'payload';
import configPromise from '@/payload.config';

export async function POST(request: Request) {
  try {
    const payload = await getPayload({ config: configPromise });
    
    // Iyzico Webhook genellikle x-www-form-urlencoded veya JSON formatında veri yollar.
    // İhtiyaca göre body tipini handle ediyoruz.
    const contentType = request.headers.get('content-type') || '';
    let status, paymentId, conversationId;

    if (contentType.includes('application/json')) {
      const body = await request.json();
      status = body.status;
      paymentId = body.paymentId;
      conversationId = body.conversationId;
    } else {
      const formData = await request.formData();
      status = formData.get('status');
      paymentId = formData.get('paymentId');
      conversationId = formData.get('conversationId');
    }

    if (!conversationId) {
       return NextResponse.json({ error: 'Eksik parametre (conversationId bulunamadı)' }, { status: 400 });
    }

    // Siparişi Payload'da bul
    const orderQuery = await payload.find({
      collection: 'orders',
      where: {
        orderNumber: { equals: conversationId }
      }
    });

    if (orderQuery.totalDocs === 0) {
      return NextResponse.json({ error: 'Sipariş bulunamadı' }, { status: 404 });
    }

    const order = orderQuery.docs[0];

    // Ödeme başarılı ve sipariş hala 'pending' ise Onayla
    // Bu sayede, müşteri ödeme dönüş sayfasını kapatmış olsa bile sipariş onaylanır.
    if (status === 'success') {
      if (order.status === 'pending') {
        await payload.update({
          collection: 'orders',
          id: order.id,
          data: { 
            status: 'paid',
            paymentReference: String(paymentId || '')
          }
        });
        payload.logger.info(`[Webhook] Sipariş arka planda başarıyla onaylandı: ${order.orderNumber}`);
      }
    } else {
      // Başarısız ödeme senaryosu
      if (order.status === 'pending') {
        await payload.update({
          collection: 'orders',
          id: order.id,
          data: { status: 'cancelled' }
        });
        payload.logger.warn(`[Webhook] Ödeme başarısız, sipariş iptal edildi: ${order.orderNumber}`);
      }
    }

    // İyzico'ya işlemin alındığını bildirmek için 200 dönmek zorunludur.
    return NextResponse.json({ status: 'ok' }, { status: 200 });

  } catch (err: any) {
    console.error('Iyzico Webhook Error:', err);
    return NextResponse.json({ error: 'Webhook işlenemedi' }, { status: 500 });
  }
}
