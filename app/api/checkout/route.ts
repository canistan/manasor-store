import { NextResponse } from 'next/server';
import Iyzipay from 'iyzipay';
import { getPayload } from 'payload';
import configPromise from '@/payload.config';
import crypto from 'crypto';

export async function POST(request: Request) {
  try {
    // Iyzico Sandbox Config
    const iyzipay = new Iyzipay({
      apiKey: process.env.IYZICO_API_KEY || 'sandbox-p19v0k7nO8hQIfF4rQ4yGfSihR2Kqj0T',
      secretKey: process.env.IYZICO_SECRET_KEY || 'sandbox-7m7312Z2dD1zL1G4D9aY1l2vH3wE7O8t',
      uri: 'https://sandbox-api.iyzipay.com'
    });

    const body = await request.json();
    const { form, items, shippingPrice: clientShippingPrice, userId, couponCode } = body;

    if (!items || items.length === 0) {
      return NextResponse.json({ error: 'Sepetiniz boş' }, { status: 400 });
    }

    const payload = await getPayload({ config: configPromise });

    // 1. SUNUCU TARAFLI FİYAT VE STOK KONTROLÜ (GÜVENLİK)
    let serverCalculatedTotal = 0;
    const validatedItems = [];

    for (const item of items) {
      const product = await payload.findByID({ collection: 'products', id: item.id || item.productId });
      if (!product) {
        return NextResponse.json({ error: `${item.name} adlı ürün sistemde bulunamadı.` }, { status: 400 });
      }

      const variant = product.variations?.find((v: any) => v.variantId === item.variationId);
      if (!variant) {
        return NextResponse.json({ error: `${product.name} için seçilen gramaj/varyasyon bulunamadı.` }, { status: 400 });
      }

      if (variant.stock < item.quantity) {
        return NextResponse.json({ error: `Maalesef ${product.name} için yeterli stok yok. (Kalan stok: ${variant.stock})` }, { status: 400 });
      }

      serverCalculatedTotal += variant.price * item.quantity;
      validatedItems.push({
        productId: product.id,
        name: product.name,
        variationId: variant.variantId,
        size: variant.size,
        packaging: variant.packaging,
        price: variant.price, // Veritabanından gelen ONAYLI fiyat
        quantity: item.quantity
      });
    }

    // Kargo hesaplaması (Henüz indirim uygulanmadan önceki brüt tutar ile doğrulanabilir, şu an frontend'in gönderdiğine güveniyoruz ama ek kontrol eklenebilir)
    let serverShippingPrice = Number(clientShippingPrice) || 0;
    
    // KUPON KONTROLÜ VE İNDİRİM UYGULANMASI
    let discountAmount = 0;
    let appliedCouponCode = '';

    if (couponCode) {
      const coupons = await payload.find({
        collection: 'coupons',
        where: { code: { equals: couponCode.toUpperCase().trim() } },
        limit: 1,
      });

      if (coupons.docs.length > 0) {
        const coupon = coupons.docs[0];
        const now = new Date();
        const isValidDate = (!coupon.validFrom || new Date(coupon.validFrom) <= now) && (!coupon.validUntil || new Date(coupon.validUntil) >= now);
        const isValidLimit = !coupon.maxUses || (coupon.usedCount || 0) < coupon.maxUses;
        const isValidAmount = !coupon.minCartAmount || serverCalculatedTotal >= coupon.minCartAmount;

        if (coupon.active && isValidDate && isValidLimit && isValidAmount) {
          appliedCouponCode = coupon.code;
          if (coupon.discountType === 'percentage') {
            discountAmount = serverCalculatedTotal * (coupon.discountValue / 100);
          } else if (coupon.discountType === 'fixed_amount') {
            discountAmount = coupon.discountValue;
          } else if (coupon.discountType === 'free_shipping') {
            serverShippingPrice = 0; // Kargo bedava
          }
        }
      }
    }

    // Toplam tutar (İndirimden sonra)
    const discountedTotal = Math.max(0, serverCalculatedTotal - discountAmount);
    const finalPrice = (discountedTotal + serverShippingPrice).toFixed(2);

    // 2. IDEMPOTENCY VE YASAL KANIT TESPİTİ
    const ipAddress = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || '127.0.0.1';
    
    // Müşterinin double-click yapmasını önlemek için benzersiz anahtar
    const idempotencyStr = `${form.email}-${JSON.stringify(validatedItems)}`;
    const idempotencyKey = crypto.createHash('sha256').update(idempotencyStr).digest('hex').substring(0, 16) + '-' + Date.now();
    const termsVersion = 'v1.0'; // KVKK ve Mesafeli Satış metin versiyonu

    // 3. PAYLOAD CMS SİPARİŞ OLUŞTURMA (PENDING)
    const newOrder = await payload.create({
      collection: 'orders',
      data: {
        customer: userId || undefined,
        orderNumber: `MANASOR-${Date.now()}`,
        status: 'pending',
        totalPrice: Number(finalPrice),
        shippingPrice: serverShippingPrice,
        firstName: form.firstName,
        lastName: form.lastName,
        email: form.email,
        phone: form.phone,
        invoiceType: form.invoiceType as any,
        identityNumber: form.identityNumber,
        companyName: form.companyName,
        taxOffice: form.taxOffice,
        taxNumber: form.taxNumber,
        city: form.city,
        district: form.district,
        address: form.address,
        idempotencyKey: idempotencyKey,
        ipAddress: ipAddress,
        termsVersion: termsVersion,
        items: validatedItems,
        couponCode: appliedCouponCode || undefined,
        discountAmount: discountAmount || 0,
      }
    });

    if (form.newsletterAccepted) {
      try {
        await payload.create({
          collection: 'subscribers',
          data: { email: form.email, source: 'Checkout Sayfası' }
        });
      } catch (err) {}
    }

    // 3.5 KULLANICI ADRESİNİ OTOMATİK KAYDETME
    const { saveAddress } = body;
    if (userId && saveAddress) {
      try {
        const user = await payload.findByID({ collection: 'customers', id: userId });
        if (user) {
          const currentAddresses = user.addresses || [];
          const newAddress = {
            id: Math.random().toString(36).substring(7),
            title: 'Yeni Adres',
            firstName: form.firstName,
            lastName: form.lastName,
            phone: form.phone,
            city: form.city,
            district: form.district,
            address: form.address,
            invoiceType: form.invoiceType as 'bireysel' | 'kurumsal',
            identityNumber: form.identityNumber,
            companyName: form.companyName,
            taxOffice: form.taxOffice,
            taxNumber: form.taxNumber
          };
          
          await payload.update({
            collection: 'customers',
            id: userId,
            data: { addresses: [...currentAddresses, newAddress] }
          });
        }
      } catch (err) {
        console.error('Müşteri adresi kaydedilemedi:', err);
      }
    }

    // 4. IYZICO REQUEST HAZIRLIĞI
    const buyerInfo = {
      id: userId || "BY789", 
      name: form.firstName,
      surname: form.lastName,
      gsmNumber: form.phone,
      email: form.email,
      identityNumber: form.identityNumber || "11111111111",
      lastLoginDate: "2023-10-10 10:10:10",
      registrationDate: "2023-10-10 10:10:10",
      registrationAddress: form.address,
      ip: ipAddress, 
      city: form.city,
      country: "Turkey",
      zipCode: "34732"
    };

    const shippingAddress = {
      contactName: `${form.firstName} ${form.lastName}`,
      city: form.city,
      country: "Turkey",
      address: form.address,
      zipCode: "34732"
    };

    const billingAddress = {
      contactName: form.invoiceType === 'kurumsal' ? form.companyName : `${form.firstName} ${form.lastName}`,
      city: form.city,
      country: "Turkey",
      address: form.address,
      zipCode: "34732"
    };

    const basketItems = validatedItems.map((item: any) => ({
      id: item.variationId || item.productId || 'ITEM-1',
      name: item.name,
      category1: "Gıda",
      category2: "Organik",
      itemType: Iyzipay.BASKET_ITEM_TYPE.PHYSICAL,
      price: (item.price * item.quantity).toFixed(2)
    }));

    if (discountAmount > 0) {
      basketItems.push({
        id: "KUPON",
        name: `İndirim Kuponu (${appliedCouponCode})`,
        category1: "İndirim",
        category2: "Kupon",
        itemType: Iyzipay.BASKET_ITEM_TYPE.PHYSICAL,
        price: `-${discountAmount.toFixed(2)}` // Iyzico eksi değeri desteklemezse sorun olabilir.
      });
      // NOT: Iyzico eksi tutarlı basket item desteklemediğinden genel tutardan (price) düşmek daha güvenlidir. 
      // Ancak bazı durumlarda basketItems toplamı price ile eşleşmek zorundadır.
      // Eşleşmeyi sağlamak için indirim tutarını orantısal olarak sepetteki ürünlerden düşmek en güvenlisidir.
    }

    if (serverShippingPrice > 0) {
      basketItems.push({
        id: "KARGO",
        name: "Kargo Ücreti",
        category1: "Hizmet",
        category2: "Teslimat",
        itemType: Iyzipay.BASKET_ITEM_TYPE.PHYSICAL,
        price: serverShippingPrice.toFixed(2)
      });
    }

    // Iyzico için sepet item toplamı ile price eşit olmalıdır. İndirimi oranlamak gerekiyor.
    if (discountAmount > 0) {
      // Önce sepetten KUPON satırını çıkar (hata vermesin diye)
      const kuponIndex = basketItems.findIndex((item: any) => item.id === "KUPON");
      if(kuponIndex > -1) basketItems.splice(kuponIndex, 1);
      
      let remainingDiscount = discountAmount;
      for (let i = 0; i < basketItems.length; i++) {
        if (basketItems[i].id === "KARGO") continue; // Kargodan düşme
        
        let itemPrice = parseFloat(basketItems[i].price);
        if (itemPrice > remainingDiscount) {
          basketItems[i].price = (itemPrice - remainingDiscount).toFixed(2);
          remainingDiscount = 0;
          break;
        } else {
          // Eğer indirim üründen daha büyükse ürünü ücretsiz yap (en fazla 0.01 kalmalı iyzico kuralları gereği ama 0 da olabilir)
          // Iyzico 0 fiyatlı ürüne hata verebilir, o yüzden 0.01 yapıp kalanı devam ettir
          basketItems[i].price = "0.01";
          remainingDiscount -= (itemPrice - 0.01);
        }
      }
    }

    const requestData = {
      locale: Iyzipay.LOCALE.TR,
      conversationId: newOrder.orderNumber,
      price: finalPrice,
      paidPrice: finalPrice,
      currency: Iyzipay.CURRENCY.TRY,
      basketId: newOrder.id.toString(),
      paymentGroup: Iyzipay.PAYMENT_GROUP.PRODUCT,
      callbackUrl: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/api/iyzico-callback`,
      enabledInstallments: [2, 3, 6, 9],
      buyer: buyerInfo,
      shippingAddress: shippingAddress,
      billingAddress: billingAddress,
      basketItems: basketItems
    };

    // MOCK IYZICO MODE FOR DUMMY KEYS
    if (process.env.IYZICO_API_KEY === 'sandbox-p19v0k7nO8hQIfF4rQ4yGfSihR2Kqj0T' || !process.env.IYZICO_API_KEY) {
      const mockToken = `MOCK_TOKEN_${newOrder.id.toString()}`;
      const mockHtml = `
        <div style="font-family: sans-serif; padding: 20px; border: 1px solid #e2e8f0; border-radius: 12px; background: #f8fafc; text-align: center;">
          <h3 style="color: #0f172a; margin-top: 0;">Iyzico Test Ödeme Ekranı (Mock)</h3>
          <p style="color: #64748b; font-size: 14px;">Geçerli bir Iyzico API anahtarı girilmediği için test ekranı gösterilmektedir.</p>
          <p style="font-size: 18px; font-weight: bold; color: #10b981;">Ödenecek Tutar: ${finalPrice} TL</p>
          <form method="POST" action="${requestData.callbackUrl}">
            <input type="hidden" name="token" value="${mockToken}" />
            <button type="submit" style="background: #10b981; color: white; border: none; padding: 12px 24px; border-radius: 8px; font-size: 16px; font-weight: bold; cursor: pointer; margin-top: 10px;">Test Ödemesini Tamamla (Başarılı)</button>
          </form>
        </div>
      `;
      return NextResponse.json({
        status: 'success',
        token: mockToken,
        checkoutFormContent: mockHtml
      });
    }

    return new Promise<NextResponse>((resolve) => {
      iyzipay.checkoutFormInitialize.create(requestData as any, function (err: any, result: any) {
        if (err || result.status === 'failure') {
          console.error("Iyzico Error:", err || result);
          resolve(NextResponse.json({ error: result?.errorMessage || 'Ödeme altyapısına bağlanılamadı.' }, { status: 400 }));
        } else {
          resolve(NextResponse.json({ 
            token: result.token,
            checkoutFormContent: result.checkoutFormContent 
          }));
        }
      });
    });

  } catch (error: any) {
    console.error("Checkout API Error:", error);
    return NextResponse.json({ error: `Sunucu hatası: ${error.message || 'Bilinmiyor'}` }, { status: 400 });
  }
}
