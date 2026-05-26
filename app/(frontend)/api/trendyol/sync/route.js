import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    // 1. Trendyol'dan gelen webhook payload'ını al
    const payload = await request.json();
    
    // 2. Güvenlik doğrulaması (Opsiyonel ama tavsiye edilir)
    // Örn: Header'dan gelen signature kontrolü yapılabilir.
    const authHeader = request.headers.get('authorization');
    
    // TODO: Gelen event tipine göre işlem yap
    /*
      Örnek Payload Formatı:
      {
        "merchantId": 123456,
        "eventType": "StockUpdate", // veya "ProductUpdate", "PriceUpdate" vs.
        "timestamp": 1630000000000,
        "payload": {
          "barcode": "8691234567890",
          "quantity": 15,
          "salePrice": 249.90
        }
      }
    */

    console.log('Trendyol Webhook Alındı:', payload.eventType);

    if (payload.eventType === 'StockUpdate') {
      // TODO: Kendi veritabanımızdaki stok miktarını güncelle
      console.log(`${payload.payload.barcode} barkodlu ürünün stoğu güncelleniyor:`, payload.payload.quantity);
    } 
    else if (payload.eventType === 'PriceUpdate') {
      // TODO: Kendi veritabanımızdaki fiyatı güncelle
      console.log(`${payload.payload.barcode} barkodlu ürünün fiyatı güncelleniyor:`, payload.payload.salePrice);
    }

    // Webhook'u başarıyla aldığımızı Trendyol'a bildiriyoruz (200 OK)
    return NextResponse.json({ success: true, message: 'Webhook başarıyla işlendi.' }, { status: 200 });

  } catch (error) {
    console.error('Trendyol webhook hatası:', error);
    // Hata durumunda Trendyol tekrar deneyebilir
    return NextResponse.json(
      { success: false, message: 'Webhook işlenirken bir hata oluştu.' },
      { status: 500 }
    );
  }
}
