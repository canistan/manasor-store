import type { CollectionConfig } from 'payload'
import { rmaApprovedTemplate, rmaRejectedTemplate } from '../lib/email-templates'

export const RmaRequests: CollectionConfig = {
  slug: 'rma_requests',
  labels: {
    singular: 'İade/Hasar Talebi',
    plural: 'İade ve Hasar Talepleri',
  },
  admin: {
    useAsTitle: 'id',
    defaultColumns: ['order', 'customer', 'request_type', 'admin_status', 'createdAt'],
    description: 'Kargoda hasar gören veya yanlış giden ürünlerin takibi',
    group: 'Kullanıcı Bilgi Deposu',
  },
  access: {
    // Müşteriler sadece kendi taleplerini görebilir
    read: ({ req: { user } }) => {
      if (!user) return false
      if (user.role === 'admin') return true
      return {
        customer: {
          equals: user.id,
        },
      }
    },
    create: ({ req: { user } }) => !!user, // Müşteriler talep oluşturabilir
    update: ({ req: { user } }) => user?.role === 'admin', // Sadece admin güncelleyebilir (onay/red)
    delete: ({ req: { user } }) => user?.role === 'admin',
  },
  hooks: {
    afterChange: [
      async ({ doc, previousDoc, operation, req }) => {
        if (operation === 'update' && doc.admin_status !== previousDoc?.admin_status) {
          try {
            // Fetch the customer to get the email
            const customer = await req.payload.findByID({
              collection: 'customers',
              id: typeof doc.customer === 'object' ? doc.customer.id : doc.customer,
            });

            // Fetch the order to get the order number
            const order = await req.payload.findByID({
              collection: 'orders',
              id: typeof doc.order === 'object' ? doc.order.id : doc.order,
            });

            const customerName = customer.name || customer.email;
            const orderNumber = order.orderNumber;
            const adminNote = doc.admin_notes || '';

            if (doc.admin_status === 'approved_refund') {
              await req.payload.sendEmail({
                to: customer.email,
                subject: `İade/Değişim Talebiniz Onaylandı (#${orderNumber})`,
                html: rmaApprovedTemplate(orderNumber, adminNote, customerName)
              });
            } else if (doc.admin_status === 'rejected') {
              await req.payload.sendEmail({
                to: customer.email,
                subject: `İade/Değişim Talebiniz Reddedildi (#${orderNumber})`,
                html: rmaRejectedTemplate(orderNumber, adminNote, customerName)
              });
            }
          } catch (err) {
            req.payload.logger.error(`RMA status email failed to send: ${err}`);
          }
        }
      }
    ]
  },
  fields: [
    {
      name: 'order',
      type: 'relationship',
      relationTo: 'orders',
      label: 'İlgili Sipariş',
      required: true,
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'customer',
      type: 'relationship',
      relationTo: 'customers',
      label: 'Müşteri',
      required: true,
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'request_type',
      type: 'select',
      label: 'Talep Tipi',
      required: true,
      options: [
        { label: 'Kargoda Hasar (Kırık/Patlak)', value: 'damaged_in_transit' },
        { label: 'Yanlış Ürün Gönderimi', value: 'wrong_item' },
      ],
    },
    {
      name: 'damage_photos',
      type: 'upload',
      relationTo: 'media',
      label: 'Görsel Kanıt (Hasar Fotoğrafı veya Tutanak)',
      hasMany: true, // Birden fazla görsel yüklenebilir
      admin: {
        description: 'Lütfen kargo tespit tutanağını veya hasarlı ürün görselini yükleyin.',
      },
    },
    {
      name: 'customer_note',
      type: 'textarea',
      label: 'Müşteri Açıklaması',
    },
    {
      name: 'admin_status',
      type: 'select',
      label: 'Yönetici Onay Durumu',
      defaultValue: 'pending_review',
      options: [
        { label: 'İncelemede', value: 'pending_review' },
        { label: 'İade/Değişim Onaylandı', value: 'approved_refund' },
        { label: 'Reddedildi', value: 'rejected' },
      ],
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'admin_notes',
      type: 'textarea',
      label: 'Yönetici Notu (Müşteriye iletilebilir)',
      admin: {
        position: 'sidebar',
        description: 'Red nedeni veya onay detayı için kullanılır',
      },
    },
  ],
}
