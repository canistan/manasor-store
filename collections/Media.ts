import type { CollectionConfig } from 'payload'

export const Media: CollectionConfig = {
  slug: 'media',
  labels: {
    singular: 'Medya',
    plural: 'Medya Dosyaları',
  },
  admin: {
    description: 'Ürün görselleri ve diğer medya dosyaları',
    group: 'Yönetim',
  },
  access: {
    // Herkes görselleri görebilir (frontend için gerekli)
    read: () => true,
    // Sadece giriş yapmış kullanıcılar yükleyebilir
    create: ({ req: { user } }) => !!user,
    update: ({ req: { user } }) => !!user,
    delete: ({ req: { user } }) => !!user,
  },
  upload: {
    staticDir: 'public/media',
    staticURL: '/media',
    mimeTypes: ['image/*', 'application/pdf'],
    formatOptions: {
      format: 'webp',
      options: { quality: 85 }
    },
    imageSizes: [
      {
        name: 'thumbnail',
        width: 400,
        height: 400,
        position: 'centre',
        formatOptions: { format: 'webp', options: { quality: 80 } },
      },
      {
        name: 'card',
        width: 768,
        height: 1024,
        position: 'centre',
        formatOptions: { format: 'webp', options: { quality: 80 } },
      },
      {
        name: 'hero',
        width: 1920,
        height: 1080,
        position: 'centre',
        formatOptions: { format: 'webp', options: { quality: 80 } },
      },
    ],
  },
  fields: [
    {
      name: 'alt',
      type: 'text',
      label: 'Alt Metin (SEO)',
      required: true,
    },
  ],
}
