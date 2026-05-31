import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import { forgotPasswordTemplate, welcomeEmailTemplate, orderSuccessTemplate } from '@/lib/email-templates';

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
    const [welcomeInfo, forgotInfo, orderInfo] = await Promise.all([
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
        html: forgotPasswordTemplate('MOCK_RESET_TOKEN_12345'),
      }),
      transporter.sendMail({
        from: '"Manasor Sipariş" <info@manasor.com>',
        to: 'test_kullanicisi@gmail.com',
        subject: 'Siparişiniz Alındı!',
        html: orderSuccessTemplate('ORD-9999', 1450.50, 'Ahmet Yılmaz'),
      })
    ]);

    // 4. Önizleme Linklerini Al
    const welcomeUrl = nodemailer.getTestMessageUrl(welcomeInfo);
    const forgotUrl = nodemailer.getTestMessageUrl(forgotInfo);
    const orderUrl = nodemailer.getTestMessageUrl(orderInfo);

    // 5. Linkleri Ekrana Bas
    const htmlResponse = `
      <div style="font-family: sans-serif; max-w-2xl mx-auto p-10 mt-10 border rounded-xl bg-[#fbfaf8]">
        <h1 style="color: #1a1a1a; font-family: serif; border-bottom: 2px solid #e1d5c9; padding-bottom: 10px;">E-Posta Tasarım Önizlemeleri</h1>
        <p style="color: #666; font-size: 16px;">Tasarımını görmek istediğiniz e-postanın yanındaki linke tıklayın. Doğrudan tarayıcıda açılacaktır:</p>
        
        <ul style="list-style: none; padding: 0; margin-top: 30px;">
          <li style="margin-bottom: 20px; padding: 15px; background: white; border-radius: 8px; box-shadow: 0 2px 5px rgba(0,0,0,0.05);">
            <strong style="color: #2F4F4F; font-size: 18px; display: block; margin-bottom: 5px;">1. Hoşgeldin (Kayıt) E-postası</strong>
            <a href="${welcomeUrl}" target="_blank" style="color: #d4af37; font-weight: bold; text-decoration: none; font-size: 16px;">Tasarımı Görüntüle &rarr;</a>
          </li>
          
          <li style="margin-bottom: 20px; padding: 15px; background: white; border-radius: 8px; box-shadow: 0 2px 5px rgba(0,0,0,0.05);">
            <strong style="color: #2F4F4F; font-size: 18px; display: block; margin-bottom: 5px;">2. Şifremi Unuttum E-postası</strong>
            <a href="${forgotUrl}" target="_blank" style="color: #d4af37; font-weight: bold; text-decoration: none; font-size: 16px;">Tasarımı Görüntüle &rarr;</a>
          </li>

          <li style="margin-bottom: 20px; padding: 15px; background: white; border-radius: 8px; box-shadow: 0 2px 5px rgba(0,0,0,0.05);">
            <strong style="color: #2F4F4F; font-size: 18px; display: block; margin-bottom: 5px;">3. Sipariş Onay E-postası</strong>
            <a href="${orderUrl}" target="_blank" style="color: #d4af37; font-weight: bold; text-decoration: none; font-size: 16px;">Tasarımı Görüntüle &rarr;</a>
          </li>
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
