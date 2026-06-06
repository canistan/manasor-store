import type { CollectionConfig } from 'payload'
import path from 'path'

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
    staticDir: path.resolve(process.cwd(), 'public/media'),
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
