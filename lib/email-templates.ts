export const baseEmailLayout = (content: string) => `
<!DOCTYPE html>
<html lang="tr">
<head>
  <meta charset="UTF-8">
  <style>
    body {
      font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
      background-color: #faf9f6;
      color: #1a1a1a;
      margin: 0;
      padding: 0;
    }
    .container {
      max-width: 600px;
      margin: 40px auto;
      background-color: #ffffff;
      border: 1px solid #eaeaea;
      border-radius: 8px;
      overflow: hidden;
    }
    .header {
      background-color: #556B2F;
      padding: 30px;
      text-align: center;
      color: white;
    }
    .header h1 {
      margin: 0;
      font-size: 28px;
      letter-spacing: 2px;
    }
    .content {
      padding: 30px;
      line-height: 1.6;
      font-size: 16px;
    }
    .footer {
      background-color: #f9f6f0;
      padding: 20px;
      text-align: center;
      font-size: 12px;
      color: #666;
      border-top: 1px solid #eaeaea;
    }
    .btn {
      display: inline-block;
      padding: 12px 24px;
      background-color: #D4AF37;
      color: #1a1a1a;
      text-decoration: none;
      font-weight: bold;
      border-radius: 4px;
      margin-top: 20px;
      text-align: center;
    }
    .btn:hover {
      background-color: #B8972D;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>MANASOR</h1>
    </div>
    <div class="content">
      ${content}
    </div>
    <div class="footer">
      © ${new Date().getFullYear()} Manasor. Tüm hakları saklıdır.<br>
      Umurbey Mahallesi, Manasor Store
    </div>
  </div>
</body>
</html>
`

export const forgotPasswordTemplate = (resetURL: string, userName: string = 'Değerli Müşterimiz') => {
  return baseEmailLayout(`
    <h2>Şifre Sıfırlama Talebi</h2>
    <p>Merhaba ${userName},</p>
    <p>Manasor hesabınız için bir şifre sıfırlama talebinde bulundunuz. Aşağıdaki butona tıklayarak yeni şifrenizi belirleyebilirsiniz:</p>
    <div style="text-align: center;">
      <a href="${resetURL}" class="btn">Şifremi Sıfırla</a>
    </div>
    <p style="margin-top: 30px; font-size: 14px; color: #666;">
      Eğer bu talebi siz yapmadıysanız, lütfen bu e-postayı dikkate almayınız. Şifreniz güvendedir.
    </p>
  `)
}

export const welcomeEmailTemplate = (userName: string = 'Değerli Müşterimiz') => {
  return baseEmailLayout(`
    <h2>Aramıza Hoş Geldiniz!</h2>
    <p>Merhaba ${userName},</p>
    <p>Manasor dünyasına adım attığınız için çok mutluyuz. Artık binlerce kaliteli ürüne avantajlı fiyatlarla ulaşabilir, siparişlerinizi güvenle takip edebilirsiniz.</p>
    <p>Keyifli alışverişler dileriz.</p>
  `)
}

export const orderSuccessTemplate = (orderId: string, totalAmount: number, userName: string = 'Değerli Müşterimiz') => {
  return baseEmailLayout(`
    <h2>Siparişiniz Başarıyla Alındı!</h2>
    <p>Merhaba ${userName},</p>
    <p>Bizi tercih ettiğiniz için teşekkür ederiz. <strong>#${orderId}</strong> numaralı siparişiniz başarıyla alınmıştır.</p>
    <p><strong>Sipariş Tutarı:</strong> ${totalAmount} ₺</p>
    <div style="text-align: center;">
      <a href="${process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000'}/dashboard" class="btn">Siparişlerimi Gör</a>
    </div>
  `)
}
