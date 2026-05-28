import { NextResponse } from 'next/server';
import Iyzipay from 'iyzipay';

// Iyzico Sandbox Config
const iyzipay = new Iyzipay({
  apiKey: process.env.IYZIPAY_API_KEY || 'sandbox-dummy-api-key',
  secretKey: process.env.IYZIPAY_SECRET_KEY || 'sandbox-dummy-secret-key',
  uri: 'https://sandbox-api.iyzipay.com'
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { form, items, total, shippingPrice } = body;

    // 1. MOCK STOK KONTROLÜ
    // Gerçekte Payload CMS'den güncel stok ve fiyat çekilmelidir.
    if (!items || items.length === 0) {
      return NextResponse.json({ error: 'Sepetiniz boş' }, { status: 400 });
    }

    const price = total.toFixed(2);
    
    // 2. IYZICO REQUEST HAZIRLIĞI
    const buyerInfo = {
      id: "BY789", // Geçici User ID
      name: form.firstName,
      surname: form.lastName,
      gsmNumber: form.phone,
      email: form.email,
      identityNumber: form.identityNumber || "11111111111", // Iyzico için zorunlu (Bireysel)
      lastLoginDate: "2023-10-10 10:10:10",
      registrationDate: "2023-10-10 10:10:10",
      registrationAddress: form.address,
      ip: "85.34.78.112", // Gerçekte headers üzerinden alınmalı
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

    const basketItems = items.map((item: any) => ({
      id: item.variationId,
      name: item.name,
      category1: "Gıda",
      category2: "Organik",
      itemType: Iyzipay.BASKET_ITEM_TYPE.PHYSICAL,
      price: (item.price * item.quantity).toFixed(2)
    }));

    if (shippingPrice > 0) {
      basketItems.push({
        id: "KARGO",
        name: "Kargo Ücreti",
        category1: "Hizmet",
        itemType: Iyzipay.BASKET_ITEM_TYPE.PHYSICAL,
        price: shippingPrice.toFixed(2)
      });
    }

    const requestData = {
      locale: Iyzipay.LOCALE.TR,
      conversationId: `MANASOR-${Date.now()}`,
      price: price,
      paidPrice: price,
      currency: Iyzipay.CURRENCY.TRY,
      basketId: `B-${Date.now()}`,
      paymentGroup: Iyzipay.PAYMENT_GROUP.PRODUCT,
      callbackUrl: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/checkout/success`,
      enabledInstallments: [2, 3, 6, 9],
      buyer: buyerInfo,
      shippingAddress: shippingAddress,
      billingAddress: billingAddress,
      basketItems: basketItems
    };

    // Callback sarmalayıcı (Iyzipay SDK'sı Promise dönmez)
    return new Promise<NextResponse>((resolve) => {
      iyzipay.checkoutFormInitialize.create(requestData as any, function (err: any, result: any) {
        if (err || result.status === 'failure') {
          console.error("Iyzico Error:", err || result);
          resolve(NextResponse.json({ error: result?.errorMessage || 'Ödeme altyapısına bağlanılamadı. Lütfen geçerli Iyzico anahtarlarını girdiğinizden emin olun.' }, { status: 400 }));
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
    return NextResponse.json({ error: 'Sunucu hatası oluştu.' }, { status: 500 });
  }
}
