import { NextResponse } from 'next/server';
import { getPayload } from 'payload';
import configPromise from '@payload-config';
import { cookies } from 'next/headers';

export async function POST(req: Request) {
  try {
    const payload = await getPayload({ config: configPromise });
    
    // Auth Check
    const cookieStore = await cookies();
    const token = cookieStore.get('payload-token')?.value;

    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { user } = await payload.auth({
      headers: req.headers,
    });

    if (!user || user.collection !== 'customers') {
      return NextResponse.json({ error: 'Unauthorized or invalid user type' }, { status: 401 });
    }

    // Body'den local sepeti al
    const body = await req.json();
    const localCart = body.cart || [];

    // Veritabanındaki mevcut sepeti al
    const dbCustomer = await payload.findByID({
      collection: 'customers',
      id: user.id,
    });

    const dbCart = dbCustomer.cart || [];

    // Birleştirme Mantığı
    // Local sepet ile DB sepetini birleştir. Aynı varyasyon varsa quantity topla (veya en güncelini al).
    // Bizim senaryoda, login anında local cart DB'ye ekleniyor.
    const mergedCart = [...dbCart];

    for (const localItem of localCart) {
      const existingItemIndex = mergedCart.findIndex(item => item.variationId === localItem.variationId);
      
      if (existingItemIndex > -1) {
        // Eğer varsa sadece sayısını güncelle (maksimum 10 falan alınabilir, şimdilik üstüne ekliyoruz veya büyük olanı alıyoruz)
        // Basitçe: Müşteri DB'de 2 adet bırakmış, localde 1 tane var. Toplam 3 olsun.
        mergedCart[existingItemIndex].quantity += localItem.quantity;
      } else {
        // Yoksa sepete ekle
        mergedCart.push(localItem);
      }
    }

    // Güncellenmiş sepeti DB'ye kaydet
    await payload.update({
      collection: 'customers',
      id: user.id,
      data: {
        cart: mergedCart.map(item => ({
          product: item.product,
          variationId: item.variationId,
          quantity: item.quantity,
          price: item.price,
          name: item.name,
          image: item.image,
          weight_kg: item.weight_kg,
        })),
      },
    });

    // Güncel (birleştirilmiş) sepeti frontend'e geri dön
    return NextResponse.json({ success: true, cart: mergedCart });

  } catch (error: any) {
    console.error('Cart sync error:', error);
    return NextResponse.json({ error: 'Internal Server Error', details: error.message }, { status: 500 });
  }
}
