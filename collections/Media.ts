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
    disableLocalStorage: true,
    mimeTypes: ['image/*', 'application/pdf'],
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
