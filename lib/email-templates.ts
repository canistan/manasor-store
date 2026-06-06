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

export const adminNewOrderTemplate = (orderId: string, totalAmount: number, customerName: string) => {
  return baseEmailLayout(`
    <h2>Yeni Bir Sipariş Alındı! 🎉</h2>
    <p>Sisteme yeni bir sipariş düştü. Sipariş detaylarını yönetici panelinden inceleyebilirsiniz.</p>
    <ul>
      <li><strong>Sipariş No:</strong> #${orderId}</li>
      <li><strong>Müşteri:</strong> ${customerName}</li>
      <li><strong>Tutar:</strong> ${totalAmount} ₺</li>
    </ul>
    <div style="text-align: center;">
      <a href="${process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000'}/admin/collections/orders" class="btn">Panele Git</a>
    </div>
  `)
}

export const adminLowStockTemplate = (productName: string, variantName: string, remainingStock: number) => {
  return baseEmailLayout(`
    <h2>⚠️ Kritik Stok Uyarısı</h2>
    <p>Bir ürünün stoğu kritik seviyeye (${remainingStock} adet) düştü. Lütfen stokları kontrol edin.</p>
    <ul>
      <li><strong>Ürün Adı:</strong> ${productName}</li>
      <li><strong>Varyasyon:</strong> ${variantName || 'Standart'}</li>
      <li><strong>Kalan Stok:</strong> <span style="color: red; font-weight: bold;">${remainingStock}</span></li>
    </ul>
    <div style="text-align: center;">
      <a href="${process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000'}/admin/collections/products" class="btn">Ürünleri Kontrol Et</a>
    </div>
  `)
}

export const orderShippedTemplate = (orderId: string, trackingNumber: string, trackingUrl: string, customerName: string = 'Değerli Müşterimiz') => {
  return baseEmailLayout(`
    <h2>Siparişiniz Kargoya Verildi! 📦</h2>
    <p>Merhaba ${customerName},</p>
    <p><strong>#${orderId}</strong> numaralı siparişiniz yola çıktı. Ürünlerinize en kısa sürede kavuşmanızı diliyoruz.</p>
    <p><strong>Kargo Takip Numaranız:</strong> ${trackingNumber}</p>
    <div style="text-align: center;">
      <a href="${trackingUrl}" class="btn">Kargomu Takip Et</a>
    </div>
  `)
}

export const rmaApprovedTemplate = (orderId: string, adminNote: string, customerName: string = 'Değerli Müşterimiz') => {
  return baseEmailLayout(`
    <h2>İade/Değişim Talebiniz Onaylandı ✅</h2>
    <p>Merhaba ${customerName},</p>
    <p><strong>#${orderId}</strong> numaralı siparişinize ait iade/hasar bildiriminiz ekibimiz tarafından incelenmiş ve <strong>onaylanmıştır</strong>.</p>
    ${adminNote ? `<p><strong>Yönetici Notu:</strong> ${adminNote}</p>` : ''}
    <p>Sürecin devamı için müşteri hizmetlerimiz veya sistem üzerinden bilgilendirilmeye devam edeceksiniz.</p>
  `)
}

export const rmaRejectedTemplate = (orderId: string, adminNote: string, customerName: string = 'Değerli Müşterimiz') => {
  return baseEmailLayout(`
    <h2>İade/Değişim Talebiniz Hakkında ❌</h2>
    <p>Merhaba ${customerName},</p>
    <p><strong>#${orderId}</strong> numaralı siparişinize ait iade/hasar bildiriminiz ekibimiz tarafından incelenmiş, ancak maalesef <strong>reddedilmiştir</strong>.</p>
    ${adminNote ? `<p><strong>Açıklama:</strong> ${adminNote}</p>` : ''}
    <p>Detaylı bilgi için iletişim sayfamızdan bize ulaşabilirsiniz.</p>
  `)
}

export const rateUsTemplate = (orderId: string, customerName: string = 'Değerli Müşterimiz') => {
  return baseEmailLayout(`
    <h2>Siparişiniz Teslim Edildi! Bizi Değerlendirin ⭐️</h2>
    <p>Merhaba ${customerName},</p>
    <p><strong>#${orderId}</strong> numaralı siparişinizin başarıyla teslim edildiğini gördük. Manasor ürünlerini tercih ettiğiniz için teşekkür ederiz.</p>
    <p>Deneyiminizi bizimle paylaşarak kendimizi geliştirmemize yardımcı olabilir veya diğer müşterilerimize rehber olabilirsiniz.</p>
    <div style="text-align: center;">
      <a href="${process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000'}/dashboard" class="btn">Siparişimi Değerlendir</a>
    </div>
  `)
}
