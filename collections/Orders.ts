import { CollectionConfig } from 'payload'

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
    update: ({ req: { user } }) => !!user, // Sadece admin güncelleyebilir
    delete: ({ req: { user } }) => !!user, // Sadece admin silebilir
  },
  hooks: {
    afterChange: [
      async ({ doc, previousDoc, operation, req }) => {
        if (operation === 'update') {
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
                    const newVariations = product.variations.map((v: any) => {
                      if (v.variantId === item.variationId) {
                        return { ...v, stock: Math.max(0, v.stock - item.quantity) };
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
                  req.payload.logger.error(`Stok düşme hatası (Ürün: ${item.productId}): ${err}`);
                }
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
