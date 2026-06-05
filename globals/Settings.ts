import { GlobalConfig } from 'payload'

export const Settings: GlobalConfig = {
  slug: 'settings',
  label: 'Site Ayarları',
  admin: {
    group: 'Yönetim',
  },
  access: {
    read: () => true,
    update: ({ req: { user } }) => !!user && user.collection === 'users',
  },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Kargo Ayarları',
          fields: [
            {
              name: 'freeShippingThreshold',
              type: 'number',
              label: 'Ücretsiz Kargo Alt Limiti (TL)',
              defaultValue: 1500,
              required: true,
              admin: {
                description: 'Sepet tutarı bu limitin üzerindeyse kargo ücretsiz olur.'
              }
            },
            {
              name: 'shippingRules',
              type: 'array',
              label: 'Desi / Kargo Baremleri',
              minRows: 1,
              defaultValue: [
                { minWeight: 0, maxWeight: 5, price: 79.90 },
                { minWeight: 5, maxWeight: 15, price: 119.90 },
                { minWeight: 15, maxWeight: 999, price: 159.90 }
              ],
              admin: {
                description: 'Sepetteki ürünlerin toplam ağırlığına göre uygulanacak kargo ücretleri.'
              },
              fields: [
                {
                  type: 'row',
                  fields: [
                    { name: 'minWeight', type: 'number', label: 'Min Ağırlık (KG)', required: true },
                    { name: 'maxWeight', type: 'number', label: 'Max Ağırlık (KG)', required: true },
                    { name: 'price', type: 'number', label: 'Kargo Ücreti (TL)', required: true },
                  ]
                }
              ]
            }
          ]
        }
      ]
    }
  ]
}
