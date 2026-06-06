import type { GlobalConfig } from 'payload'

export const ProductsPage: GlobalConfig = {
  slug: 'products-page',
  label: 'Ürünlerimiz Sayfası',
  admin: {
    group: 'Site',
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'hero',
      label: 'Karşılama Ekranı (Banner)',
      type: 'group',
      fields: [
        {
          name: 'title',
          label: 'Başlık',
          type: 'text',
          required: true,
          defaultValue: 'Tüm Ürünlerimiz',
        },
        {
          name: 'subtitle',
          label: 'Alt Başlık',
          type: 'textarea',
          required: true,
          defaultValue: 'Doğadan sofranıza uzanan lezzet yolculuğu.',
        },
        {
          name: 'backgroundImage',
          label: 'Arka Plan Görseli',
          type: 'upload',
          relationTo: 'media',
        },
      ],
    },
    {
      name: 'seoDescription',
      label: 'SEO Açıklaması',
      type: 'textarea',
      admin: {
        description: 'Google aramalarında çıkacak sayfa açıklaması',
      }
    }
  ],
}
