import type { GlobalConfig } from 'payload'

export const TrackingPage: GlobalConfig = {
  slug: 'tracking-page',
  label: 'Kargo Takip Sayfası',
  admin: {
    group: 'Site',
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'title',
      label: 'Başlık',
      type: 'text',
      required: true,
      defaultValue: 'Kargom Nerede?',
    },
    {
      name: 'description',
      label: 'Açıklama Metni',
      type: 'textarea',
      required: true,
      defaultValue: 'Sipariş numaranız ve e-posta adresiniz ile kargonuzun durumunu anlık olarak takip edebilirsiniz.',
    },
    {
      name: 'bannerImage',
      label: 'Banner Görseli (Opsiyonel)',
      type: 'upload',
      relationTo: 'media',
    },
  ],
}
