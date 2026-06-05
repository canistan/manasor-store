import { NextResponse } from 'next/server';
import { getPayload } from 'payload';
import configPromise from '@/payload.config';

export async function POST(request: Request) {
  try {
    const { orderNumber, email } = await request.json();

    if (!orderNumber || !email) {
      return NextResponse.json({ error: 'Lütfen sipariş no ve e-posta adresinizi girin.' }, { status: 400 });
    }

    const payload = await getPayload({ config: configPromise });
    
    // Hem Sipariş No hem de E-posta eşleşmek zorunda (Güvenlik)
    const orderQuery = await payload.find({
      collection: 'orders',
      where: {
        and: [
          { orderNumber: { equals: orderNumber.trim() } },
          { email: { equals: email.trim().toLowerCase() } } // email lower veya match edebilir, formattigine dikkat
        ]
      },
      limit: 1
    });

    if (orderQuery.totalDocs === 0) {
      // Bilerek detay vermiyoruz "Sipariş no mu yanlış, mail mi yanlış" demek güvenlik açığıdır.
      return NextResponse.json({ error: 'Bu bilgilere ait sipariş bulunamadı.' }, { status: 404 });
    }

    const order = orderQuery.docs[0];

    // Kritik verileri filtreleyerek sadece gösterilmesi gerekenleri (DTO) dönüyoruz.
    const safeData = {
      orderNumber: order.orderNumber,
      status: order.status,
      totalPrice: order.totalPrice,
      createdAt: order.createdAt,
      shippingCompany: order.shippingCompany || null,
      trackingNumber: order.trackingNumber || null,
      trackingUrl: order.trackingUrl || null,
      firstName: order.firstName,
      items: order.items?.map((item: any) => ({
        name: item.name,
        size: item.size,
        packaging: item.packaging,
        quantity: item.quantity
      }))
    };

    return NextResponse.json({ success: true, data: safeData }, { status: 200 });

  } catch (error) {
    console.error('Track API error:', error);
    return NextResponse.json({ error: 'Sistem hatası oluştu. Lütfen daha sonra tekrar deneyin.' }, { status: 500 });
  }
}
