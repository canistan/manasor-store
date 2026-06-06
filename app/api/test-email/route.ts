import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import { forgotPasswordTemplate, welcomeEmailTemplate, orderSuccessTemplate, orderShippedTemplate, rmaApprovedTemplate, rmaRejectedTemplate, rateUsTemplate, adminLowStockTemplate, adminNewOrderTemplate } from '@/lib/email-templates';

export async function GET() {
  try {
    // 1. Geçici bir Ethereal hesabı oluştur (Sadece bu test için)
    const testAccount = await nodemailer.createTestAccount();

    // 2. Nodemailer transporter oluştur
    const transporter = nodemailer.createTransport({
      host: testAccount.smtp.host,
      port: testAccount.smtp.port,
      secure: testAccount.smtp.secure,
      auth: {
        user: testAccount.user,
        pass: testAccount.pass,
      },
    });

    // 3. Mailleri Gönder
    const [welcomeInfo, forgotInfo, orderInfo, shippedInfo, rmaApprovedInfo, rmaRejectedInfo, rateUsInfo, adminLowStockInfo, adminNewOrderInfo] = await Promise.all([
      transporter.sendMail({
        from: '"Manasor Destek" <info@manasor.com>',
        to: 'test_kullanicisi@gmail.com',
        subject: 'Manasor\'a Hoş Geldiniz!',
        html: welcomeEmailTemplate('Ahmet Yılmaz'),
      }),
      transporter.sendMail({
        from: '"Manasor Destek" <info@manasor.com>',
        to: 'test_kullanicisi@gmail.com',
        subject: 'Şifre Sıfırlama İsteği',
        html: forgotPasswordTemplate('MOCK_RESET_TOKEN_12345', 'Ahmet Yılmaz'),
      }),
      transporter.sendMail({
        from: '"Manasor Sipariş" <info@manasor.com>',
        to: 'test_kullanicisi@gmail.com',
        subject: 'Siparişiniz Alındı!',
        html: orderSuccessTemplate('ORD-9999', 1450.50, 'Ahmet Yılmaz'),
      }),
      transporter.sendMail({
        from: '"Manasor Sipariş" <info@manasor.com>',
        to: 'test_kullanicisi@gmail.com',
        subject: 'Siparişiniz Kargoya Verildi!',
        html: orderShippedTemplate('ORD-9999', '123456789', 'https://kargo.com/takip/123', 'Ahmet Yılmaz'),
      }),
      transporter.sendMail({
        from: '"Manasor Destek" <info@manasor.com>',
        to: 'test_kullanicisi@gmail.com',
        subject: 'İade/Değişim Onaylandı',
        html: rmaApprovedTemplate('ORD-9999', 'Ürün iadesi kabul edilmiştir, ücret iadeniz bankanıza iletilmiştir.', 'Ahmet Yılmaz'),
      }),
      transporter.sendMail({
        from: '"Manasor Destek" <info@manasor.com>',
        to: 'test_kullanicisi@gmail.com',
        subject: 'İade/Değişim Reddedildi',
        html: rmaRejectedTemplate('ORD-9999', 'Ürün kullanılmış olduğundan iade alınamamaktadır.', 'Ahmet Yılmaz'),
      }),
      transporter.sendMail({
        from: '"Manasor Müşteri Hizmetleri" <info@manasor.com>',
        to: 'test_kullanicisi@gmail.com',
        subject: 'Bizi Değerlendirin',
        html: rateUsTemplate('ORD-9999', 'Ahmet Yılmaz'),
      }),
      transporter.sendMail({
        from: '"Sistem" <info@manasor.com>',
        to: 'admin@manasor.com',
        subject: 'Kritik Stok Uyarısı',
        html: adminLowStockTemplate('Zeytinyağı', '1 Litre', 2),
      }),
      transporter.sendMail({
        from: '"Sistem" <info@manasor.com>',
        to: 'admin@manasor.com',
        subject: 'Yeni Sipariş Alındı',
        html: adminNewOrderTemplate('ORD-9999', 1450.50, 'Ahmet Yılmaz'),
      })
    ]);

    // 4. Önizleme Linklerini Al
    const urls = [
      { name: '1. Hoşgeldin (Kayıt) E-postası', url: nodemailer.getTestMessageUrl(welcomeInfo) },
      { name: '2. Şifremi Unuttum E-postası', url: nodemailer.getTestMessageUrl(forgotInfo) },
      { name: '3. Sipariş Onay (Müşteri)', url: nodemailer.getTestMessageUrl(orderInfo) },
      { name: '4. Sipariş Kargolandı', url: nodemailer.getTestMessageUrl(shippedInfo) },
      { name: '5. İade/Hasar Onaylandı', url: nodemailer.getTestMessageUrl(rmaApprovedInfo) },
      { name: '6. İade/Hasar Reddedildi', url: nodemailer.getTestMessageUrl(rmaRejectedInfo) },
      { name: '7. Sipariş Teslim Edildi (Değerlendirin)', url: nodemailer.getTestMessageUrl(rateUsInfo) },
      { name: '8. Yeni Sipariş Geldi (Yönetici)', url: nodemailer.getTestMessageUrl(adminNewOrderInfo) },
      { name: '9. Kritik Stok Uyarısı (Yönetici)', url: nodemailer.getTestMessageUrl(adminLowStockInfo) }
    ];

    // 5. Linkleri Ekrana Bas
    const htmlResponse = `
      <div style="font-family: sans-serif; max-w-2xl mx-auto p-10 mt-10 border rounded-xl bg-[#fbfaf8]">
        <h1 style="color: #1a1a1a; font-family: serif; border-bottom: 2px solid #e1d5c9; padding-bottom: 10px;">E-Posta Tasarım Önizlemeleri</h1>
        <p style="color: #666; font-size: 16px;">Tasarımını görmek istediğiniz e-postanın yanındaki linke tıklayın. Doğrudan tarayıcıda açılacaktır:</p>
        <ul style="list-style: none; padding: 0; margin-top: 30px;">
          ${urls.map(item => `
            <li style="margin-bottom: 20px; padding: 15px; background: white; border-radius: 8px; box-shadow: 0 2px 5px rgba(0,0,0,0.05);">
              <strong style="color: #2F4F4F; font-size: 18px; display: block; margin-bottom: 5px;">${item.name}</strong>
              <a href="${item.url}" target="_blank" style="color: #d4af37; font-weight: bold; text-decoration: none; font-size: 16px;">Tasarımı Görüntüle &rarr;</a>
            </li>
          `).join('')}
        </ul>
      </div>
    `;

    return new NextResponse(htmlResponse, {
      headers: { 'Content-Type': 'text/html; charset=utf-8' },
    });
  } catch (error) {
    return NextResponse.json({ error: 'Mail test servisi hatası', details: error }, { status: 500 });
  }
}
