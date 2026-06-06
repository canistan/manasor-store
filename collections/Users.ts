import type { CollectionConfig } from 'payload'
import { forgotPasswordTemplate, welcomeEmailTemplate } from '../lib/email-templates'

export const Users: CollectionConfig = {
  slug: 'users', 
  labels: {
    singular: 'Yönetici',
    plural: 'Yöneticiler',
  },
  auth: {
    maxLoginAttempts: 5,
    lockTime: 900000, // 15 dakika (milisaniye)
    forgotPassword: {
      generateEmailHTML: (args) => {
        const token = args?.token;
        const user = args?.user;
        // @ts-ignore
        const userName = user?.name || user?.email || 'Değerli Müşterimiz'
        const resetURL = `${process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000'}/reset-password?token=${token}`
        return forgotPasswordTemplate(resetURL, userName)
      },
      generateEmailSubject: () => 'Manasor - Şifre Sıfırlama Talebi',
    },
  },
  admin: {
    useAsTitle: 'email',
    description: 'Manasor yönetici kullanıcıları',
    group: 'Yönetim',
  },
  hooks: {
    afterChange: [
      async ({ doc, req, operation }) => {
        if (operation === 'create' && req.payload) {
          try {
            await req.payload.sendEmail({
              to: doc.email,
              subject: 'Manasor\'a Hoş Geldiniz!',
              html: welcomeEmailTemplate(doc.name || doc.email),
            })
          } catch (error) {
            console.error('Welcome email failed to send:', error)
          }
        }
        return doc
      },
    ],
  },
  access: {
    // Sadece admin (users) koleksiyonundakiler paneli görebilir
    read: ({ req: { user } }) => !!user && user.collection === 'users',
    // Ziyaretçiler Users değil Customers tablosuna kaydolmalı, burayı kilitliyoruz.
    create: ({ req: { user } }) => !!user && user.collection === 'users' && user.role === 'admin', 
    update: ({ req: { user }, id }) => !!user && user.collection === 'users' && (user.role === 'admin' || user.id === id),
    delete: ({ req: { user } }) => !!user && user.collection === 'users' && user.role === 'admin',
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
      defaultValue: 'admin',
      required: true,
      options: [
        { label: 'Yönetici (Süper Admin)', value: 'admin' },
        { label: 'İçerik Editörü', value: 'editor' },
        { label: 'Sipariş Operatörü', value: 'operator' },
        { label: 'Eski Müşteri (Silinecek)', value: 'customer' },
      ],
    },
  ],
}
