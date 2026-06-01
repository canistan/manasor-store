import type { GlobalConfig } from 'payload'

export const ContactPage: GlobalConfig = {
  slug: 'contact-page',
  label: 'İletişim Ayarları',
  admin: {
    group: 'Site',
  },
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
          defaultValue: 'İletişime Geçin',
        },
        {
          name: 'subtitle',
          label: 'Alt Başlık',
          type: 'text',
          required: true,
          defaultValue: 'Soru ve Önerileriniz İçin',
        },
        {
          name: 'backgroundImage',
          label: 'Arka Plan Görseli',
          type: 'upload',
          relationTo: 'media',
        },
      ],
    },
    {
      name: 'contactInfo',
      label: 'İletişim Bilgileri',
      type: 'group',
      fields: [
        {
          name: 'title',
          label: 'Başlık',
          type: 'text',
          defaultValue: 'Size Nasıl Yardımcı Olabiliriz?',
        },
        {
          name: 'description',
          label: 'Açıklama',
          type: 'textarea',
          defaultValue: 'Ürünlerimiz, siparişleriniz veya markamız hakkında merak ettiğiniz her türlü soru için bize ulaşabilirsiniz. Müşteri temsilcilerimiz en kısa sürede size geri dönüş yapacaktır.',
        },
        {
          name: 'address',
          label: 'Açık Adres',
          type: 'textarea',
          defaultValue: 'Umurbey Mahallesi, Zeytin Dalı Sokak No:12\nGemlik / Bursa',
        },
        {
          name: 'phone',
          label: 'Telefon Numarası',
          type: 'text',
          defaultValue: '+90 (224) 513 00 00',
        },
        {
          name: 'email',
          label: 'E-posta Adresi',
          type: 'text',
          defaultValue: 'info@manasor.com',
        },
      ],
    },
    {
      name: 'formInfo',
      label: 'İletişim Formu Ayarları',
      type: 'group',
      fields: [
        {
          name: 'title',
          label: 'Form Başlığı',
          type: 'text',
          defaultValue: 'Bize Mesaj Gönderin',
        },
        {
          name: 'buttonText',
          label: 'Gönder Butonu Metni',
          type: 'text',
          defaultValue: 'Mesajı Gönder',
        },
      ],
    },
  ],
}
