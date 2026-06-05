import { CollectionConfig } from 'payload'

export const Coupons: CollectionConfig = {
  slug: 'coupons',
  labels: {
    singular: 'Kupon',
    plural: 'Kuponlar',
  },
  admin: {
    useAsTitle: 'code',
    group: 'Yönetim',
    defaultColumns: ['code', 'discountType', 'discountValue', 'active', 'usedCount', 'maxUses'],
  },
  access: {
    read: () => true, // API'den sorgulamak için
    create: ({ req: { user } }) => !!user && user.collection === 'users',
    update: ({ req: { user } }) => !!user && user.collection === 'users',
    delete: ({ req: { user } }) => !!user && user.collection === 'users',
  },
  fields: [
    {
      name: 'code',
      type: 'text',
      label: 'Kupon Kodu',
      required: true,
      unique: true,
      admin: {
        description: 'Müşterinin sepet/ödeme adımında gireceği kod (Örn: YAZ50, HOSGELDIN10). Büyük harf önerilir.',
      },
      hooks: {
        beforeChange: [
          ({ value }) => {
            if (typeof value === 'string') {
              return value.toUpperCase().trim();
            }
            return value;
          }
        ]
      }
    },
    {
      name: 'active',
      type: 'checkbox',
      label: 'Aktif Mi?',
      defaultValue: true,
    },
    {
      type: 'row',
      fields: [
        {
          name: 'discountType',
          type: 'select',
          label: 'İndirim Tipi',
          options: [
            { label: 'Yüzde (%)', value: 'percentage' },
            { label: 'Sabit Tutar (TL)', value: 'fixed_amount' },
            { label: 'Ücretsiz Kargo', value: 'free_shipping' }
          ],
          required: true,
          defaultValue: 'percentage',
        },
        {
          name: 'discountValue',
          type: 'number',
          label: 'İndirim Değeri',
          required: true,
          admin: {
            description: 'Yüzde veya TL cinsi indirim miktarı (Ücretsiz Kargo için 0 girebilirsiniz).',
            condition: (data) => data.discountType !== 'free_shipping',
          }
        },
      ]
    },
    {
      name: 'minCartAmount',
      type: 'number',
      label: 'Minimum Sepet Tutarı (TL)',
      defaultValue: 0,
      admin: {
        description: 'Bu kuponun kullanılabilmesi için sepet tutarının bu limitin üzerinde olması gerekir.',
      }
    },
    {
      type: 'row',
      fields: [
        {
          name: 'maxUses',
          type: 'number',
          label: 'Maksimum Kullanım Limiti',
          admin: {
            description: 'Bu kupon toplamda kaç kez kullanılabilir? (Boş bırakılırsa sınırsız)',
          }
        },
        {
          name: 'usedCount',
          type: 'number',
          label: 'Kullanılma Sayısı',
          defaultValue: 0,
          admin: {
            readOnly: true,
            description: 'Bu kupon bugüne kadar kaç kez kullanıldı (Otomatik artar).',
          }
        },
      ]
    },
    {
      type: 'row',
      fields: [
        {
          name: 'validFrom',
          type: 'date',
          label: 'Geçerlilik Başlangıcı',
          admin: {
            description: 'Kuponun ne zamandan itibaren kullanılabileceği.',
            date: { pickerAppearance: 'dayAndTime' }
          }
        },
        {
          name: 'validUntil',
          type: 'date',
          label: 'Geçerlilik Bitişi',
          admin: {
            description: 'Kuponun hangi tarihte sona ereceği.',
            date: { pickerAppearance: 'dayAndTime' }
          }
        },
      ]
    }
  ]
}
