import type { GlobalConfig } from 'payload'

export const HomePage: GlobalConfig = {
  slug: 'home-page',
  label: 'Anasayfa Ayarları',
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'hero',
      label: 'Karşılama Ekranı (Hero)',
      type: 'group',
      fields: [
        {
          name: 'title',
          label: 'Başlık',
          type: 'text',
          required: true,
          defaultValue: 'Ege\'nin İncisi Gemlik\'ten Sofralarınıza',
        },
        {
          name: 'subtitle',
          label: 'Alt Başlık',
          type: 'textarea',
          required: true,
          defaultValue: 'Geleneksel yöntemlerle hasat edilen, doğanın en saf armağanı premium zeytin ve zeytinyağları.',
        },
        {
          name: 'backgroundImage',
          label: 'Arka Plan Görseli',
          type: 'upload',
          relationTo: 'media',
        },
        {
          name: 'buttonText',
          label: 'Buton Metni',
          type: 'text',
          defaultValue: 'Koleksiyonu Keşfet',
        },
        {
          name: 'buttonLink',
          label: 'Buton Linki',
          type: 'text',
          defaultValue: '/products',
        },
      ],
    },
    {
      name: 'featuredProducts',
      label: 'Öne Çıkan Ürünler',
      type: 'relationship',
      relationTo: 'products',
      hasMany: true,
      maxDepth: 1,
    },
    {
      name: 'testimonials',
      label: 'Müşteri Yorumları',
      type: 'array',
      fields: [
        {
          name: 'quote',
          label: 'Yorum',
          type: 'textarea',
          required: true,
        },
        {
          name: 'author',
          label: 'Müşteri Adı',
          type: 'text',
          required: true,
        },
        {
          name: 'role',
          label: 'Unvan veya Meslek',
          type: 'text',
        },
        {
          name: 'image',
          label: 'Müşteri Fotoğrafı (Opsiyonel)',
          type: 'upload',
          relationTo: 'media',
        },
      ],
    },
    {
      name: 'newsletter',
      label: 'Bülten Alanı',
      type: 'group',
      fields: [
        {
          name: 'title',
          label: 'Bülten Başlığı',
          type: 'text',
          defaultValue: 'Manasor Ailesine Katılın',
        },
        {
          name: 'subtitle',
          label: 'Bülten Açıklaması',
          type: 'textarea',
          defaultValue: 'Yeni hasat ürünlerimizden ve özel kampanyalarımızdan ilk sizin haberiniz olsun.',
        },
      ],
    },
  ],
}
