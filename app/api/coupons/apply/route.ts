import { NextResponse } from 'next/server';
import { getPayload } from 'payload';
import configPromise from '@/payload.config';

export async function POST(request: Request) {
  try {
    const { code, cartTotal } = await request.json();

    if (!code) {
      return NextResponse.json({ error: 'Kupon kodu gereklidir.' }, { status: 400 });
    }

    const payload = await getPayload({ config: configPromise });
    
    // Kuponu veritabanında bul (büyük harfe çevirerek ara)
    const coupons = await payload.find({
      collection: 'coupons',
      where: { code: { equals: code.toUpperCase().trim() } },
      limit: 1,
    });

    if (coupons.docs.length === 0) {
      return NextResponse.json({ error: 'Geçersiz kupon kodu.' }, { status: 400 });
    }

    const coupon = coupons.docs[0];

    // Aktiflik kontrolü
    if (!coupon.active) {
      return NextResponse.json({ error: 'Bu kupon kodu artık aktif değil.' }, { status: 400 });
    }

    // Tarih kontrolü
    const now = new Date();
    if (coupon.validFrom && new Date(coupon.validFrom) > now) {
      return NextResponse.json({ error: 'Bu kupon henüz aktif değil.' }, { status: 400 });
    }
    if (coupon.validUntil && new Date(coupon.validUntil) < now) {
      return NextResponse.json({ error: 'Bu kuponun süresi dolmuş.' }, { status: 400 });
    }

    // Limit kontrolü
    if (coupon.maxUses && typeof coupon.usedCount === 'number' && coupon.usedCount >= coupon.maxUses) {
      return NextResponse.json({ error: 'Bu kupon kullanım limitine ulaşmış.' }, { status: 400 });
    }

    // Minimum sepet tutarı kontrolü
    if (coupon.minCartAmount && cartTotal < coupon.minCartAmount) {
      return NextResponse.json({ 
        error: `Bu kuponu kullanabilmek için sepet tutarınız en az ${coupon.minCartAmount} TL olmalıdır.` 
      }, { status: 400 });
    }

    // Başarılı
    return NextResponse.json({
      success: true,
      coupon: {
        code: coupon.code,
        discountType: coupon.discountType,
        discountValue: coupon.discountValue,
      }
    });

  } catch (error: any) {
    console.error('Coupon API Error:', error);
    return NextResponse.json({ error: 'Kupon doğrulanırken bir hata oluştu.' }, { status: 500 });
  }
}
