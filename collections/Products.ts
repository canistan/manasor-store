import type { CollectionConfig } from 'payload'

export const Products: CollectionConfig = {
  slug: 'products',
  labels: {
    singular: 'Ürün',
    plural: 'Ürünler',
  },
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'category', 'updatedAt'],
    description: 'Manasor ürün kataloğu',
  },
  access: {
    // Herkes ürünleri görebilir (frontend için gerekli)
    read: () => true,
    // Sadece giriş yapmış kullanıcılar ürün yönetebilir
    create: ({ req: { user } }) => !!user,
    update: ({ req: { user } }) => !!user,
    delete: ({ req: { user } }) => !!user,
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      label: 'Ürün Adı',
      required: true,
    },
    {
      name: 'slug',
      type: 'text',
      label: 'URL Slug',
      unique: true,
      required: true,
      admin: {
        description: 'URL\'de kullanılacak benzersiz tanımlayıcı (ör: soguk-sikim-zeytinyagi)',
      },
    },
    {
      name: 'shortDescription',
      type: 'textarea',
      label: 'Kısa Açıklama',
      admin: {
        description: 'Ürün kartlarında görünecek kısa açıklama',
      },
    },
    {
      name: 'description',
      type: 'textarea',
      label: 'Detaylı Açıklama',
      admin: {
        description: 'Ürün detay sayfasında görünecek uzun açıklama',
      },
    },
    {
      name: 'category',
      type: 'select',
      label: 'Kategori',
      required: true,
      options: [
        { label: 'Zeytinyağları', value: 'Zeytinyağları' },
        { label: 'Zeytinler', value: 'Zeytinler' },
        { label: 'Kişisel Bakım', value: 'Kişisel Bakım' },
        { label: 'Gurme Paketler', value: 'Gurme Paketler' },
      ],
    },
    {
      name: 'image',
      type: 'upload',
      label: 'Ürün Görseli',
      relationTo: 'media',
      required: true,
    },
    {
      name: 'variations',
      type: 'array',
      label: 'Ürün Varyasyonları',
      minRows: 1,
      admin: {
        description: 'Her ürünün en az bir varyasyonu olmalıdır',
      },
      fields: [
        {
          name: 'variantId',
          type: 'text',
          label: 'Varyasyon ID',
          required: true,
          admin: {
            description: 'Benzersiz varyasyon tanımlayıcısı (ör: soguk-sikim-1lt-cam)',
          },
        },
        {
          name: 'size',
          type: 'text',
          label: 'Boyut / Miktar',
          required: true,
          admin: {
            description: 'Örn: 1LT, 5LT, 1KG, 150g',
          },
        },
        {
          name: 'packaging',
          type: 'text',
          label: 'Ambalaj Tipi',
          required: true,
          admin: {
            description: 'Örn: Cam Şişe, Teneke Kutu, Cam Kavanoz',
          },
        },
        {
          name: 'price',
          type: 'number',
          label: 'Fiyat (TL)',
          required: true,
          min: 0,
          admin: {
            step: 0.01,
          },
        },
        {
          name: 'stock',
          type: 'number',
          label: 'Stok Adedi',
          required: true,
          min: 0,
          defaultValue: 0,
        },
        {
          name: 'weight_kg',
          type: 'number',
          label: 'Ağırlık / Desi (KG)',
          required: true,
          admin: {
            description: 'Kargo maliyet hesaplaması için zorunludur',
          },
        },
        {
          name: 'sku',
          type: 'text',
          label: 'Stok Kodu (SKU)',
          required: true,
        },
      ],
    },
    {
      name: 'featured',
      type: 'checkbox',
      label: 'Öne Çıkan Ürün',
      defaultValue: false,
      admin: {
        description: 'Ana sayfada gösterilecek ürünler için işaretleyin',
      },
    },
    {
      name: 'traceability',
      type: 'group',
      label: 'İzlenebilirlik ve Gıda Kalitesi',
      admin: {
        description: 'Zeytinyağı ve gıda ürünleri için zorunlu kalite kontrol verileri',
        position: 'sidebar',
      },
      fields: [
        {
          name: 'batch_number',
          type: 'text',
          label: 'Parti No (Batch)',
          required: true,
        },
        {
          name: 'harvest_year',
          type: 'text',
          label: 'Hasat Yılı',
          required: true,
        },
        {
          name: 'expiry_date',
          type: 'date',
          label: 'Son Kullanma Tarihi (SKT)',
          required: true,
        },
      ],
    },
  ],
}
