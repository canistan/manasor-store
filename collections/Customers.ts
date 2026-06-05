import type { CollectionConfig } from 'payload'
import { forgotPasswordTemplate, welcomeEmailTemplate } from '../lib/email-templates'

export const Customers: CollectionConfig = {
  slug: 'customers',
  labels: {
    singular: 'Müşteri',
    plural: 'Müşteriler',
  },
  auth: {
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
    description: 'E-Ticaret müşterileri ve kişi kartları',
    group: 'Kullanıcı Bilgi Deposu',
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
    read: ({ req: { user }, id }) => {
      if (!user) return false;
      if (user.collection === 'users') return true; // Admins can read all
      return user.id === id; // Customers can read themselves
    },
    create: () => true, // Ziyaretçilerin kayıt olabilmesi için açık
    update: ({ req: { user }, id }) => {
      if (!user) return false;
      if (user.collection === 'users') return true; // Admins can update all
      return user.id === id; // Customers can update themselves
    },
    delete: ({ req: { user }, id }) => {
      if (!user) return false;
      if (user.collection === 'users') return true; // Admins can delete
      return user.id === id; // Customers can delete themselves
    },
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      label: 'Ad Soyad',
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
    {
      name: 'addresses',
      type: 'array',
      label: 'Kayıtlı Adresler',
      fields: [
        { name: 'title', type: 'text', label: 'Adres Başlığı (Örn: Ev, İş)', required: true },
        { name: 'firstName', type: 'text', label: 'Ad', required: true },
        { name: 'lastName', type: 'text', label: 'Soyad', required: true },
        { name: 'phone', type: 'text', label: 'Telefon', required: true },
        { name: 'city', type: 'text', label: 'İl', required: true },
        { name: 'district', type: 'text', label: 'İlçe', required: true },
        { name: 'address', type: 'textarea', label: 'Açık Adres', required: true },
        {
          name: 'invoiceType',
          type: 'select',
          label: 'Fatura Tipi',
          defaultValue: 'bireysel',
          options: [
            { label: 'Bireysel', value: 'bireysel' },
            { label: 'Kurumsal', value: 'kurumsal' },
          ],
        },
        { name: 'identityNumber', type: 'text', label: 'TC Kimlik No' },
        { name: 'companyName', type: 'text', label: 'Firma Adı' },
        { name: 'taxOffice', type: 'text', label: 'Vergi Dairesi' },
        { name: 'taxNumber', type: 'text', label: 'Vergi Numarası' },
      ],
    },
    {
      name: 'orders',
      type: 'join',
      collection: 'orders',
      on: 'customer',
      label: 'Müşterinin Siparişleri',
    },
  ],
}
