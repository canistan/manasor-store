import { CollectionConfig } from 'payload'

export const Subscribers: CollectionConfig = {
  slug: 'subscribers',
  labels: {
    singular: 'Abone',
    plural: 'Aboneler (E-Bülten)',
  },
  admin: {
    useAsTitle: 'email',
    defaultColumns: ['email', 'source', 'createdAt'],
    group: 'Yönetim',
  },
  access: {
    read: ({ req: { user } }) => !!user, // Sadece admin okuyabilir
    create: () => true, // Frontend üzerinden herkes abone olabilir
    update: ({ req: { user } }) => !!user,
    delete: ({ req: { user } }) => !!user,
  },
  fields: [
    {
      name: 'email',
      type: 'email',
      label: 'E-Posta Adresi',
      required: true,
      unique: true,
    },
    {
      name: 'source',
      type: 'text',
      label: 'Kayıt Kaynağı',
      defaultValue: 'Bilinmiyor',
      admin: {
        description: 'Örn: "Ödeme Sayfası (Checkout)", "Anasayfa Alt Kısım" vb.'
      }
    }
  ],
}
