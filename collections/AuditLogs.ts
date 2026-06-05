import { CollectionConfig } from 'payload'

export const AuditLogs: CollectionConfig = {
  slug: 'audit_logs',
  labels: {
    singular: 'Denetim İzi (Log)',
    plural: 'Denetim İzleri',
  },
  admin: {
    useAsTitle: 'action',
    defaultColumns: ['action', 'performedBy', 'collectionName', 'createdAt'],
    group: 'Yönetim',
    description: 'Sistemdeki kritik işlemlerin silinemez kayıtları.',
  },
  access: {
    // Sadece admin koleksiyonundan gelenler okuyabilir
    read: ({ req: { user } }) => {
      if (!user) return false;
      return user.collection === 'users'; 
    },
    // Sadece sistem (hook) create edebilir
    create: () => false, 
    // Asla değiştirilemez ve silinemez (Immutable)
    update: () => false,
    delete: () => false,
  },
  fields: [
    {
      name: 'action',
      type: 'text',
      label: 'İşlem Özeti',
      required: true,
      admin: { readOnly: true },
    },
    {
      name: 'performedBy',
      type: 'text',
      label: 'İşlemi Yapan (E-posta)',
      required: true,
      admin: { readOnly: true },
    },
    {
      name: 'collectionName',
      type: 'text',
      label: 'Etkilenen Tablo',
      required: true,
      admin: { readOnly: true },
    },
    {
      name: 'documentId',
      type: 'text',
      label: 'Kayıt ID',
      required: true,
      admin: { readOnly: true },
    },
    {
      name: 'details',
      type: 'json',
      label: 'Değişim Detayları (JSON)',
      admin: { readOnly: true },
    },
    {
      name: 'ipAddress',
      type: 'text',
      label: 'IP Adresi',
      admin: { readOnly: true },
    },
  ],
}
