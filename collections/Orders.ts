import type { CollectionConfig } from 'payload'

export const Orders: CollectionConfig = {
  slug: 'orders',
  labels: {
    singular: 'Sipariş',
    plural: 'Siparişler',
  },
  admin: {
    useAsTitle: 'id',
    defaultColumns: ['id', 'customer', 'status', 'total_amount', 'createdAt'],
    description: 'Müşteri siparişleri ve Iyzico ödeme takibi',
  },
  access: {
    // Müşteriler sadece kendi siparişlerini görebilir, adminler hepsini
    read: ({ req: { user } }) => {
      if (!user) return false
      if (user.role === 'admin') return true
      return {
        customer: {
          equals: user.id,
        },
      }
    },
    create: () => true, // Frontend'den sipariş oluşturulabilmesi için (genellikle Local API üzerinden bypass edilir ama şimdilik true diyebiliriz)
    update: ({ req: { user } }) => user?.role === 'admin',
    delete: ({ req: { user } }) => user?.role === 'admin',
  },
  fields: [
    {
      name: 'customer',
      type: 'relationship',
      relationTo: 'users',
      label: 'Müşteri',
      required: true,
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'status',
      type: 'select',
      label: 'Sipariş Durumu',
      defaultValue: 'pending',
      required: true,
      options: [
        { label: 'Beklemede', value: 'pending' },
        { label: 'Hazırlanıyor', value: 'processing' },
        { label: 'Kargoda', value: 'shipped' },
        { label: 'Teslim Edildi', value: 'delivered' },
        { label: 'İptal', value: 'cancelled' },
      ],
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'shipping_info',
      type: 'group',
      label: 'Kargo ve Teslimat Bilgileri',
      fields: [
        {
          name: 'address',
          type: 'textarea',
          label: 'Açık Adres',
          required: true,
        },
        {
          type: 'row',
          fields: [
            {
              name: 'city',
              type: 'text',
              label: 'İl',
              required: true,
            },
            {
              name: 'district',
              type: 'text',
              label: 'İlçe',
              required: true,
            },
          ]
        },
        {
          name: 'tracking_number',
          type: 'text',
          label: 'Kargo Takip No',
        },
      ],
    },
    {
      name: 'payment_info',
      type: 'group',
      label: 'Ödeme Bilgileri (Iyzico)',
      fields: [
        {
          name: 'iyzico_payment_id',
          type: 'text',
          label: 'Iyzico Ödeme ID',
        },
        {
          name: 'total_amount',
          type: 'number',
          label: 'Toplam Tutar (TL)',
          required: true,
        },
        {
          name: 'payment_status',
          type: 'select',
          label: 'Ödeme Durumu',
          options: [
            { label: 'Başarılı', value: 'success' },
            { label: 'Başarısız', value: 'failed' },
          ],
        },
      ],
    },
    {
      name: 'items',
      type: 'array',
      label: 'Sipariş Kalemleri',
      required: true,
      minRows: 1,
      fields: [
        {
          name: 'product',
          type: 'relationship',
          relationTo: 'products',
          label: 'Ürün',
          required: true,
        },
        {
          name: 'variant_id',
          type: 'text',
          label: 'Varyant ID',
          required: true,
        },
        {
          name: 'quantity',
          type: 'number',
          label: 'Adet',
          required: true,
          min: 1,
        },
        {
          name: 'price',
          type: 'number',
          label: 'Birim Fiyat (Snapshot)',
          required: true,
          admin: {
            description: 'Sipariş anındaki fiyat',
          },
        },
      ],
    },
  ],
}
