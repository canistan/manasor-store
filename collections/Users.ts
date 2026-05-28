import type { CollectionConfig } from 'payload'

export const Users: CollectionConfig = {
  slug: 'users',
  auth: true,
  admin: {
    useAsTitle: 'email',
    description: 'Manasor yönetici kullanıcıları',
  },
  access: {
    // Sadece giriş yapmış kullanıcılar admin paneline erişebilir
    read: ({ req: { user } }) => !!user,
    create: ({ req: { user } }) => !!user,
    update: ({ req: { user } }) => !!user,
    delete: ({ req: { user } }) => !!user,
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      label: 'Ad Soyad',
    },
    {
      name: 'role',
      type: 'select',
      label: 'Rol',
      defaultValue: 'customer',
      required: true,
      options: [
        { label: 'Yönetici (Admin)', value: 'admin' },
        { label: 'Müşteri (Customer)', value: 'customer' },
      ],
    },
    {
      name: 'phone_number',
      type: 'text',
      label: 'Telefon Numarası',
    },
    {
      name: 'billing_address',
      type: 'group',
      label: 'Fatura Adresi',
      fields: [
        { name: 'address', type: 'textarea', label: 'Açık Adres' },
        { type: 'row', fields: [ { name: 'city', type: 'text', label: 'İl' }, { name: 'district', type: 'text', label: 'İlçe' } ] },
        { name: 'tax_office', type: 'text', label: 'Vergi Dairesi (Kurumsal)' },
        { name: 'tax_number', type: 'text', label: 'Vergi/TC Kimlik No' },
      ],
    },
    {
      name: 'shipping_address',
      type: 'group',
      label: 'Teslimat Adresi',
      fields: [
        { name: 'address', type: 'textarea', label: 'Açık Adres' },
        { type: 'row', fields: [ { name: 'city', type: 'text', label: 'İl' }, { name: 'district', type: 'text', label: 'İlçe' } ] },
      ],
    },
  ],
}
