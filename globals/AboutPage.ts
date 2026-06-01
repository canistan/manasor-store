import type { GlobalConfig } from 'payload'

export const AboutPage: GlobalConfig = {
  slug: 'about-page',
  label: 'Hakkımızda Ayarları',
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
          defaultValue: 'Bizim Hikayemiz',
        },
        {
          name: 'subtitle',
          label: 'Alt Başlık',
          type: 'text',
          required: true,
          defaultValue: 'Köklerimizden Sofranıza',
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
      name: 'story',
      label: 'Hikayemiz',
      type: 'group',
      fields: [
        {
          name: 'title',
          label: 'Ana Başlık',
          type: 'text',
          required: true,
          defaultValue: 'Gemlik\'ten Doğan Bir Tutku',
        },
        {
          name: 'subtitle',
          label: 'Alt Başlık',
          type: 'text',
          required: true,
          defaultValue: 'Toprağa ve Doğaya Saygı',
        },
        {
          name: 'content',
          label: 'İçerik Paragrafları',
          type: 'array',
          fields: [
            {
              name: 'paragraph',
              label: 'Paragraf',
              type: 'textarea',
            }
          ],
          defaultValue: [
            { paragraph: 'Manasor\'un temelleri, Türkiye\'nin en verimli zeytin havzalarından biri olan Bursa Gemlik\'te atıldı. Nesiller boyu zeytin ağaçlarının gölgesinde büyüyen bir ailenin toprağa olan derin bağlılığı, zamanla bir tutkuya ve ardından bugün sofralarınıza ulaşan bir kalite serüvenine dönüştü.' },
            { paragraph: 'Gemlik\'in kendine has mikroiklimi, denizden esen iyotlu rüzgarları ve bereketli toprakları, dünyanın en lezzetli ve ince kabuklu zeytinlerinin yetişmesi için kusursuz bir ortam sunar. Biz de bu mucizevi coğrafyanın bize sunduğu hediyeyi, en saf ve doğal haliyle sizlere ulaştırmayı kendimize görev edindik.' },
            { paragraph: 'Hasat zamanı geldiğinde, ağaçlarımıza zarar vermeden, büyük bir özenle ve geleneksel yöntemlerle zeytinlerimizi topluyoruz. Hiçbir kimyasal işleme maruz bırakmadan, sadece su ve tuz ile fermente ederek doğallığını koruyoruz. Zeytinyağlarımız ise, toplanan zeytinlerin saatler içerisinde "soğuk sıkım" yöntemiyle işlenmesiyle elde ediliyor. Böylece zeytinin içerdiği o eşsiz fenolik bileşenler, antioksidanlar ve vitaminler olduğu gibi şişeleniyor.' }
          ]
        },
        {
          name: 'quote',
          label: 'Alıntı Söz',
          type: 'textarea',
          defaultValue: '"Bizim için zeytin sadece bir ürün değil, kuşaktan kuşağa aktarılan bir yaşam biçimidir."',
        },
        {
          name: 'image',
          label: 'Hikaye Görseli',
          type: 'upload',
          relationTo: 'media',
        },
      ],
    },
    {
      name: 'valuesTitle',
      label: 'Değerlerimiz Başlığı',
      type: 'text',
      defaultValue: 'Neden Manasor?',
    },
    {
      name: 'valuesSubtitle',
      label: 'Değerlerimiz Alt Başlığı',
      type: 'text',
      defaultValue: 'Üretimin her aşamasında kaliteden ödün vermiyor, doğanın bize sunduğu saflığı sofralarınıza taşıyoruz.',
    },
    {
      name: 'values',
      label: 'Değerlerimiz',
      type: 'array',
      maxRows: 4,
      fields: [
        {
          name: 'icon',
          label: 'İkon',
          type: 'select',
          required: true,
          options: [
            { label: 'Yaprak (Doğal)', value: 'Leaf' },
            { label: 'Kalkan (Kalite)', value: 'ShieldCheck' },
            { label: 'Madalya (Ödül/Geleneksel)', value: 'Award' },
            { label: 'Kalp (Saygı/Sevgi)', value: 'Heart' },
          ],
        },
        {
          name: 'title',
          label: 'Başlık',
          type: 'text',
          required: true,
        },
        {
          name: 'description',
          label: 'Açıklama',
          type: 'textarea',
          required: true,
        },
      ],
      defaultValue: [
        { icon: 'Leaf', title: 'Yüzde Yüz Doğal', description: 'Ürünlerimizin hiçbirinde koruyucu, renklendirici veya kimyasal katkı maddesi bulunmaz. Tamamen doğal yollarla üretilir.' },
        { icon: 'ShieldCheck', title: 'Üstün Kalite', description: 'Zeytinlerimiz özenle seçilir, zeytinyağlarımız ise 0.3-0.5 arası düşük asit oranlarıyla premium kalite standartlarındadır.' },
        { icon: 'Award', title: 'Geleneksel Üretim', description: 'Atalarımızdan öğrendiğimiz geleneksel yöntemleri, modern hijyen standartlarıyla birleştirerek üretim yapıyoruz.' },
        { icon: 'Heart', title: 'Doğaya Saygı', description: 'Sürdürülebilir tarım ilkelerine uyuyor, toprağı yormadan, doğanın dengesini koruyarak hasat yapıyoruz.' }
      ]
    },
    {
      name: 'cta',
      label: 'Eyleme Çağrı (CTA)',
      type: 'group',
      fields: [
        {
          name: 'title',
          label: 'Başlık',
          type: 'text',
          defaultValue: 'Bu Lezzeti Deneyimleyin',
        },
        {
          name: 'description',
          label: 'Açıklama',
          type: 'textarea',
          defaultValue: 'Gemlik\'in eşsiz doğasından sofralarınıza uzanan bu hikayenin bir parçası olun. En taze ürünlerimizi hemen inceleyebilirsiniz.',
        },
        {
          name: 'buttonText',
          label: 'Buton Metni',
          type: 'text',
          defaultValue: 'Ürünleri İncele',
        },
        {
          name: 'buttonLink',
          label: 'Buton Linki',
          type: 'text',
          defaultValue: '/products',
        },
      ],
    },
  ],
}
