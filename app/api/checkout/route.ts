import { NextResponse } from 'next/server';
import Iyzipay from 'iyzipay';
import { getPayload } from 'payload';
import configPromise from '@/payload.config';

// Iyzico Sandbox Config
const iyzipay = new Iyzipay({
  apiKey: process.env.IYZICO_API_KEY || 'sandbox-p19v0k7nO8hQIfF4rQ4yGfSihR2Kqj0T',
  secretKey: process.env.IYZICO_SECRET_KEY || 'sandbox-7m7312Z2dD1zL1G4D9aY1l2vH3wE7O8t',
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
    
    // 2. PAYLOAD CMS SİPARİŞ OLUŞTURMA (PENDING)
    const payload = await getPayload({ config: configPromise });
    
    const newOrder = await payload.create({
      collection: 'orders',
      data: {
        orderNumber: `MANASOR-${Date.now()}`,
        status: 'pending',
        totalPrice: Number(price),
        shippingPrice: Number(shippingPrice),
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
        items: items.map((item: any) => ({
          productId: item.id || '',
          name: item.name,
          variationId: item.variationId || '',
          size: item.size || '',
          price: item.price,
          quantity: item.quantity
        }))
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

    // 3. IYZICO REQUEST HAZIRLIĞI
    const buyerInfo = {
      id: "BY789", 
      name: form.firstName,
      surname: form.lastName,
      gsmNumber: form.phone,
      email: form.email,
      identityNumber: form.identityNumber || "11111111111",
      lastLoginDate: "2023-10-10 10:10:10",
      registrationDate: "2023-10-10 10:10:10",
      registrationAddress: form.address,
      ip: "85.34.78.112", 
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
      id: item.variationId || item.variantId || item.id || 'ITEM-1',
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
      conversationId: newOrder.orderNumber,
      price: price,
      paidPrice: price,
      currency: Iyzipay.CURRENCY.TRY,
      basketId: newOrder.id.toString(),
      paymentGroup: Iyzipay.PAYMENT_GROUP.PRODUCT,
      callbackUrl: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3001'}/api/iyzico-callback`,
      enabledInstallments: [2, 3, 6, 9],
      buyer: buyerInfo,
      shippingAddress: shippingAddress,
      billingAddress: billingAddress,
      basketItems: basketItems
    };

    // MOCK IYZICO MODE FOR DUMMY KEYS
    if (process.env.IYZICO_API_KEY === 'sandbox-p19v0k7nO8hQIfF4rQ4yGfSihR2Kqj0T' || !process.env.IYZICO_API_KEY) {
      const mockToken = `MOCK_TOKEN_${Date.now()}`;
      const mockHtml = `
        <div style="font-family: sans-serif; padding: 20px; border: 1px solid #e2e8f0; border-radius: 12px; background: #f8fafc; text-align: center;">
          <h3 style="color: #0f172a; margin-top: 0;">Iyzico Test Ödeme Ekranı (Mock)</h3>
          <p style="color: #64748b; font-size: 14px;">Geçerli bir Iyzico API anahtarı girilmediği için test ekranı gösterilmektedir.</p>
          <p style="font-size: 18px; font-weight: bold; color: #10b981;">Ödenecek Tutar: ${price} TL</p>
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
