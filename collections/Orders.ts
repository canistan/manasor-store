import { CollectionConfig } from 'payload'
import { adminNewOrderTemplate, adminLowStockTemplate } from '../lib/email-templates'

export const Orders: CollectionConfig = {
  slug: 'orders',
  labels: {
    singular: 'Sipariş',
    plural: 'Siparişler',
  },
  admin: {
    useAsTitle: 'orderNumber',
    defaultColumns: ['orderNumber', 'customerName', 'totalPrice', 'status', 'createdAt'],
    group: 'Kullanıcı Bilgi Deposu',
  },
  access: {
    read: () => true,
    create: () => true, // Frontend API üzerinden oluşturulabilmesi için
    update: ({ req: { user } }) => !!user && user.collection === 'users', 
    delete: ({ req: { user } }) => !!user && user.collection === 'users', 
  },
  hooks: {
    afterChange: [
      async ({ doc, previousDoc, operation, req }) => {
        if (operation === 'update') {
          // AUDIT LOG
          if (doc.status !== previousDoc?.status) {
            try {
               await req.payload.create({
                 collection: 'audit_logs',
                 data: {
                   action: `Sipariş durumu güncellendi: ${previousDoc?.status} -> ${doc.status}`,
                   performedBy: req.user ? req.user.email : 'Sistem/Webhook',
                   collectionName: 'orders',
                   documentId: doc.id.toString(),
                   details: { prev: previousDoc?.status, new: doc.status },
                   ipAddress: req.headers && typeof req.headers.get === 'function' ? req.headers.get('x-forwarded-for') || 'unknown' : 'system'
                 }
               });
            } catch (err) { console.error('AuditLog error:', err); }
          }

          // Stok Düşüm (Rezervasyon) - Sipariş onaylandığında
          if (doc.status === 'paid' && previousDoc?.status !== 'paid') {
            if (doc.items && Array.isArray(doc.items)) {
              for (const item of doc.items) {
                if (!item.productId || !item.variationId) continue;
                try {
                  const product = await req.payload.findByID({
                    collection: 'products',
                    id: item.productId,
                  });
                  if (product && product.variations) {
                    let lowStockVariant: any = null;
                    const newVariations = product.variations.map((v: any) => {
                      if (v.variantId === item.variationId) {
                        const remaining = Math.max(0, v.stock - item.quantity);
                        if (remaining <= 5) {
                          lowStockVariant = { name: v.size || v.weight_kg + 'kg', remaining };
                        }
                        return { ...v, stock: remaining };
                      }
                      return v;
                    });
                    
                    await req.payload.update({
                      collection: 'products',
                      id: product.id,
                      data: { variations: newVariations },
                    });

                    // Eğer kritik stok varsa adminlere bildir
                    if (lowStockVariant) {
                      try {
                        const admins = await req.payload.find({ collection: 'users', limit: 100 });
                        for (const admin of admins.docs) {
                          await req.payload.sendEmail({
                            to: admin.email,
                            subject: '⚠️ Kritik Stok Uyarısı - Manasor',
                            html: adminLowStockTemplate(product.name, lowStockVariant.name, lowStockVariant.remaining)
                          }).catch(e => console.error("Admin low stock email error:", e));
                        }
                      } catch (err) {
                        console.error('Kritik stok admin email hatası:', err);
                      }
                    }
                  }
                } catch (err) {
                  req.payload.logger.error(`Stok düşme hatası (Ürün: ${item.productId}): ${err}`);
                }
              }
            }

            // Yeni Sipariş Yönetici Bildirimi (Sadece ödendi statüsüne geçtiğinde)
            try {
              const customerName = doc.customer?.name || (doc.firstName ? `${doc.firstName} ${doc.lastName}` : 'Misafir Müşteri');
              const admins = await req.payload.find({ collection: 'users', limit: 100 });
              for (const admin of admins.docs) {
                await req.payload.sendEmail({
                  to: admin.email,
                  subject: `🎉 Yeni Sipariş (#${doc.orderNumber}) - Manasor`,
                  html: adminNewOrderTemplate(doc.orderNumber, doc.totalPrice, customerName)
                }).catch(e => console.error("Admin new order email error:", e));
              }
            } catch (err) {
              console.error('Yeni sipariş admin email hatası:', err);
            }

            // Kupon Kullanım Sayısını (usedCount) Artırma
            if (doc.couponCode) {
              try {
                const coupons = await req.payload.find({
                  collection: 'coupons',
                  where: { code: { equals: doc.couponCode } },
                  limit: 1
                });
                if (coupons.docs.length > 0) {
                  const coupon = coupons.docs[0];
                  await req.payload.update({
                    collection: 'coupons',
                    id: coupon.id,
                    data: { usedCount: (coupon.usedCount || 0) + 1 }
                  });
                }
              } catch (err) {
                req.payload.logger.error(`Kupon usedCount artırma hatası: ${err}`);
              }
            }
          }
          // Stok İade (Restock) - Ödenmiş sipariş iptal edilirse
          if (doc.status === 'cancelled' && previousDoc?.status === 'paid') {
            if (doc.items && Array.isArray(doc.items)) {
              for (const item of doc.items) {
                if (!item.productId || !item.variationId) continue;
                try {
                  const product = await req.payload.findByID({
                    collection: 'products',
                    id: item.productId,
                  });
                  if (product && product.variations) {
                    const newVariations = product.variations.map((v: any) => {
                      if (v.variantId === item.variationId) {
                        return { ...v, stock: v.stock + item.quantity };
                      }
                      return v;
                    });
                    await req.payload.update({
                      collection: 'products',
                      id: product.id,
                      data: { variations: newVariations },
                    });
                  }
                } catch (err) {
                  req.payload.logger.error(`Stok iade hatası (Ürün: ${item.productId}): ${err}`);
                }
              }
            }
          }
          
          // Kargo Takip Numarası Eklendiğinde Otomatik Mail Tetikleyici (Simülasyon)
          if (doc.trackingNumber && doc.trackingNumber !== previousDoc?.trackingNumber) {
            req.payload.logger.info(`[MAIL SİMÜLASYONU] ${doc.email} adresine "Siparişiniz Kargoya Verildi" maili gönderildi. Takip No: ${doc.trackingNumber}`);
            
            // Eğer sipariş durumu henüz 'shipped' yapılmadıysa otomatik yapalım
            if (doc.status !== 'shipped' && doc.status !== 'delivered') {
               try {
                 await req.payload.update({
                   collection: 'orders',
                   id: doc.id,
                   data: { status: 'shipped' }
                 });
               } catch (err) {
                 req.payload.logger.error(`Sipariş durumu shipped yapılamadı: ${err}`);
               }
            }
          }
        }
      }
    ]
  },
  fields: [
    {
      name: 'customer',
      type: 'relationship',
      relationTo: 'customers',
      label: 'Müşteri (Kayıtlı Üye)',
      admin: {
        position: 'sidebar',
      }
    },
    {
      name: 'orderNumber',
      type: 'text',
      label: 'Sipariş Numarası (Iyzico vs.)',
      required: true,
      unique: true,
      admin: {
        readOnly: true,
      }
    },
    {
      name: 'status',
      type: 'select',
      label: 'Sipariş Durumu',
      defaultValue: 'pending',
      options: [
        { label: 'Beklemede (Ödeme Alınmadı)', value: 'pending' },
        { label: 'Ödendi (Hazırlanıyor)', value: 'paid' },
        { label: 'Kargolandı', value: 'shipped' },
        { label: 'Teslim Edildi', value: 'delivered' },
        { label: 'İptal / İade', value: 'cancelled' },
      ],
      required: true,
    },
    {
      name: 'paymentReference',
      type: 'text',
      label: 'Iyzico Payment ID',
    },
    {
      name: 'idempotencyKey',
      type: 'text',
      label: 'Idempotency Key (Çift Çekim Koruması)',
      unique: true,
      admin: {
        readOnly: true,
        position: 'sidebar',
      }
    },
    {
      name: 'ipAddress',
      type: 'text',
      label: 'IP Adresi',
      admin: {
        readOnly: true,
        position: 'sidebar',
      }
    },
    {
      name: 'termsVersion',
      type: 'text',
      label: 'Onaylanan Sözleşme Versiyonu',
      admin: {
        readOnly: true,
        position: 'sidebar',
      }
    },
    {
      name: 'totalPrice',
      type: 'number',
      label: 'Toplam Tutar (TRY)',
      required: true,
    },
    {
      name: 'shippingPrice',
      type: 'number',
      label: 'Kargo Ücreti (TRY)',
      defaultValue: 0,
    },
    {
      name: 'couponCode',
      type: 'text',
      label: 'Kullanılan Kupon Kodu',
      admin: { position: 'sidebar' }
    },
    {
      name: 'discountAmount',
      type: 'number',
      label: 'İndirim Tutarı (TRY)',
      defaultValue: 0,
      admin: { position: 'sidebar' }
    },
    {
      name: 'shippingCompany',
      type: 'text',
      label: 'Kargo Firması',
      admin: { position: 'sidebar' }
    },
    {
      name: 'trackingNumber',
      type: 'text',
      label: 'Kargo Takip Numarası',
      admin: { position: 'sidebar' }
    },
    {
      name: 'trackingUrl',
      type: 'text',
      label: 'Kargo Takip Linki',
      admin: { position: 'sidebar' }
    },
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Müşteri Bilgileri',
          fields: [
            {
              type: 'row',
              fields: [
                { name: 'firstName', type: 'text', label: 'Ad', required: true },
                { name: 'lastName', type: 'text', label: 'Soyad', required: true },
              ]
            },
            {
              type: 'row',
              fields: [
                { name: 'email', type: 'email', label: 'E-Posta', required: true },
                { name: 'phone', type: 'text', label: 'Telefon', required: true },
              ]
            },
            {
              name: 'invoiceType',
              type: 'select',
              label: 'Fatura Tipi',
              options: [
                { label: 'Bireysel', value: 'bireysel' },
                { label: 'Kurumsal', value: 'kurumsal' },
              ],
              defaultValue: 'bireysel',
            },
            { name: 'identityNumber', type: 'text', label: 'T.C. Kimlik No' },
            { name: 'companyName', type: 'text', label: 'Şirket Adı' },
            { name: 'taxOffice', type: 'text', label: 'Vergi Dairesi' },
            { name: 'taxNumber', type: 'text', label: 'Vergi No' },
          ]
        },
        {
          label: 'Adres Bilgileri',
          fields: [
            { name: 'city', type: 'text', label: 'İl', required: true },
            { name: 'district', type: 'text', label: 'İlçe', required: true },
            { name: 'address', type: 'textarea', label: 'Açık Adres', required: true },
          ]
        },
        {
          label: 'Sipariş Kalemleri (Ürünler)',
          fields: [
            {
              name: 'items',
              type: 'array',
              label: 'Ürünler',
              fields: [
                { name: 'productId', type: 'text', label: 'Ürün ID' },
                { name: 'name', type: 'text', label: 'Ürün Adı', required: true },
                { name: 'variationId', type: 'text', label: 'Varyasyon ID' },
                { name: 'size', type: 'text', label: 'Boyut/Gramaj' },
                { name: 'packaging', type: 'text', label: 'Ambalaj' },
                { name: 'price', type: 'number', label: 'Birim Fiyat', required: true },
                { name: 'quantity', type: 'number', label: 'Adet', required: true },
              ],
            }
          ]
        }
      ]
    }
  ],
}
