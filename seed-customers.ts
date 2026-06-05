// Seed script: 100 dummy müşteri + sipariş oluşturma
// Kullanım: npx tsx seed-customers.ts

import { getPayload } from 'payload'
import config from './payload.config'

const TURKISH_FIRST_NAMES = [
  'Ahmet', 'Mehmet', 'Mustafa', 'Ali', 'Hüseyin', 'Hasan', 'İbrahim', 'Ömer', 'İsmail', 'Murat',
  'Osman', 'Yusuf', 'Ramazan', 'Halil', 'Süleyman', 'Abdullah', 'Recep', 'Fatih', 'Emre', 'Burak',
  'Ayşe', 'Fatma', 'Emine', 'Hatice', 'Zeynep', 'Elif', 'Merve', 'Büşra', 'Zehra', 'Esra',
  'Nur', 'Seda', 'Derya', 'Gül', 'Sibel', 'Deniz', 'Ece', 'Ebru', 'Gamze', 'Özlem',
  'Ceren', 'Pınar', 'Tuğba', 'Başak', 'Yasemin', 'Sevgi', 'Aslı', 'Burcu', 'Dilek', 'Selma',
  'Kerem', 'Serkan', 'Tolga', 'Onur', 'Cem', 'Barış', 'Uğur', 'Volkan', 'Erhan', 'Gökhan',
  'Selin', 'Melis', 'Cansu', 'İrem', 'Beyza', 'Damla', 'Dilara', 'Simge', 'Aleyna', 'Melisa',
  'Kaan', 'Arda', 'Berk', 'Enes', 'Furkan', 'Yiğit', 'Alp', 'Can', 'Tuna', 'Doruk',
  'Nisa', 'Defne', 'Ada', 'Nehir', 'Ecrin', 'Lina', 'Mira', 'Asya', 'Elisa', 'Azra',
  'Emir', 'Aras', 'Rüzgar', 'Çınar', 'Toprak', 'Deniz', 'Ege', 'Atlas', 'Demir', 'Baran'
]

const TURKISH_LAST_NAMES = [
  'Yılmaz', 'Kaya', 'Demir', 'Çelik', 'Şahin', 'Yıldız', 'Yıldırım', 'Öztürk', 'Aydın', 'Özdemir',
  'Arslan', 'Doğan', 'Kılıç', 'Aslan', 'Çetin', 'Kara', 'Koç', 'Kurt', 'Özkan', 'Şimşek',
  'Polat', 'Korkmaz', 'Acar', 'Güneş', 'Aktaş', 'Tekin', 'Erdem', 'Uçar', 'Tunç', 'Balcı',
  'Aksoy', 'Taş', 'Güler', 'Kaplan', 'Bulut', 'Türk', 'Pek', 'Yavuz', 'Bayrak', 'Coşkun',
  'Bozkurt', 'Erdoğan', 'Demirtaş', 'Karaca', 'Gündüz', 'Sarı', 'Ak', 'Tan', 'Oral', 'Bayar'
]

const CITIES = [
  { city: 'İstanbul', districts: ['Kadıköy', 'Beşiktaş', 'Üsküdar', 'Bakırköy', 'Beyoğlu', 'Fatih', 'Ataşehir', 'Maltepe', 'Sarıyer', 'Şişli'] },
  { city: 'Ankara', districts: ['Çankaya', 'Keçiören', 'Yenimahalle', 'Etimesgut', 'Mamak', 'Altındağ'] },
  { city: 'İzmir', districts: ['Konak', 'Bornova', 'Karşıyaka', 'Buca', 'Bayraklı', 'Çiğli'] },
  { city: 'Bursa', districts: ['Osmangazi', 'Nilüfer', 'Yıldırım', 'Gemlik', 'Mudanya', 'İnegöl'] },
  { city: 'Antalya', districts: ['Muratpaşa', 'Konyaaltı', 'Kepez', 'Alanya', 'Manavgat'] },
  { city: 'Konya', districts: ['Selçuklu', 'Meram', 'Karatay'] },
  { city: 'Adana', districts: ['Seyhan', 'Çukurova', 'Yüreğir'] },
  { city: 'Gaziantep', districts: ['Şahinbey', 'Şehitkamil'] },
  { city: 'Trabzon', districts: ['Ortahisar', 'Akçaabat', 'Yomra'] },
  { city: 'Eskişehir', districts: ['Odunpazarı', 'Tepebaşı'] },
]

const STREETS = [
  'Atatürk Cad.', 'Cumhuriyet Bulvarı', 'İstiklal Sok.', 'Zeytin Dalı Mah.',
  'Çiçek Sok.', 'Güneş Mah.', 'Bahçe Sok.', 'Yıldız Cad.',
  'Barış Mah.', 'Özgürlük Bulvarı', 'Lale Sok.', 'Gül Mah.',
]

const PRODUCTS = [
  { name: 'Erken Hasat Soğuk Sıkım Natürel Sızma Zeytinyağı', size: '500ml', packaging: 'Cam Şişe', price: 450 },
  { name: 'Erken Hasat Soğuk Sıkım Natürel Sızma Zeytinyağı', size: '1LT', packaging: 'Cam Şişe', price: 850 },
  { name: 'Erken Hasat Soğuk Sıkım Natürel Sızma Zeytinyağı', size: '5LT', packaging: 'Teneke Kutu', price: 3500 },
  { name: 'Gemlik Lüks Siyah Zeytin (XL Boy)', size: '1Kg', packaging: 'Vakum', price: 320 },
  { name: 'Gemlik Lüks Siyah Zeytin (XL Boy)', size: '2Kg', packaging: 'Vakum', price: 590 },
  { name: 'Edremit Çizik Yeşil Zeytin', size: '1Kg', packaging: 'Kavanoz', price: 290 },
  { name: 'Doğal Zeytin Sabunu', size: '150g', packaging: 'Kağıt Ambalaj', price: 85 },
  { name: 'Gurme Tadım Paketi', size: 'Mix', packaging: 'Hediye Kutu', price: 1200 },
]

const ORDER_STATUSES = ['pending', 'paid', 'shipped', 'delivered', 'cancelled'] as const

function rand<T>(arr: readonly T[]): T { return arr[Math.floor(Math.random() * arr.length)] }
function randInt(min: number, max: number): number { return Math.floor(Math.random() * (max - min + 1)) + min }
function generateTC(): string {
  let digits = ''
  for (let i = 0; i < 11; i++) digits += i === 0 ? randInt(1, 9) : randInt(0, 9)
  return digits
}
function generatePhone(): string {
  const prefix = rand(['530', '531', '532', '533', '534', '535', '536', '537', '538', '539',
    '540', '541', '542', '543', '544', '545', '546', '547', '548', '549',
    '550', '551', '552', '553', '554', '555', '556', '557', '558', '559'])
  return `+90${prefix}${randInt(1000000, 9999999)}`
}
function randomDate(start: Date, end: Date): Date {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()))
}

async function seed() {
  console.log('🌱 Seed başlatılıyor...')
  
  const payload = await getPayload({ config })
  
  // Mevcut ürünleri çek (varsa ID'lerini kullanalım)
  const existingProducts = await payload.find({ collection: 'products', limit: 100 })
  
  const customerIds: number[] = []
  
  console.log('👤 100 müşteri oluşturuluyor...')
  
  for (let i = 0; i < 100; i++) {
    const firstName = rand(TURKISH_FIRST_NAMES)
    const lastName = rand(TURKISH_LAST_NAMES)
    const cityData = rand(CITIES)
    const district = rand(cityData.districts)
    const street = rand(STREETS)
    const buildingNo = randInt(1, 120)
    const apartmentNo = randInt(1, 25)
    const phone = generatePhone()
    const tc = generateTC()
    
    // İkinci bir adres için farklı şehir
    const cityData2 = rand(CITIES)
    const district2 = rand(cityData2.districts)
    const street2 = rand(STREETS)
    
    try {
      const customer = await payload.create({
        collection: 'customers',
        data: {
          email: `${firstName.toLowerCase().replace(/[çğıöşü]/g, (c: string) => ({ç:'c',ğ:'g',ı:'i',ö:'o',ş:'s',ü:'u'}[c]||c))}${lastName.toLowerCase().replace(/[çğıöşü]/g, (c: string) => ({ç:'c',ğ:'g',ı:'i',ö:'o',ş:'s',ü:'u'}[c]||c))}${randInt(1, 999)}@${rand(['gmail.com', 'hotmail.com', 'outlook.com', 'yahoo.com', 'yandex.com'])}`,
          password: 'Test1234!',
          name: `${firstName} ${lastName}`,
          phone_number: phone,
          billing_address: {
            address: `${street} No:${buildingNo} Daire:${apartmentNo}`,
            city: cityData.city,
            district: district,
            tax_office: rand(['Üsküdar', 'Beyoğlu', 'Kadıköy', 'Nilüfer', 'Konak', 'Çankaya', 'Muratpaşa', '']),
            tax_number: tc,
          },
          shipping_address: {
            address: `${street} No:${buildingNo} Daire:${apartmentNo}`,
            city: cityData.city,
            district: district,
          },
          addresses: [
            {
              title: 'Ev',
              firstName,
              lastName,
              phone,
              city: cityData.city,
              district,
              address: `${street} No:${buildingNo} Daire:${apartmentNo}`,
              invoiceType: 'bireysel' as const,
              identityNumber: tc,
            },
            {
              title: 'İş',
              firstName,
              lastName,
              phone,
              city: cityData2.city,
              district: district2,
              address: `${street2} No:${randInt(1, 80)} Kat:${randInt(1, 10)}`,
              invoiceType: rand(['bireysel', 'kurumsal']) as 'bireysel' | 'kurumsal',
              identityNumber: tc,
              companyName: rand(['', '', `${lastName} Ticaret A.Ş.`, `${firstName} Ltd. Şti.`, `${lastName} Gıda San.`]),
              taxOffice: rand(['Üsküdar', 'Beyoğlu', 'Kadıköy', 'Nilüfer', 'Konak']),
              taxNumber: rand(['', generateTC()]),
            },
          ],
        },
        disableVerificationEmail: true,
      })
      
      customerIds.push(customer.id as number)
      
      if ((i + 1) % 10 === 0) console.log(`  ✅ ${i + 1}/100 müşteri oluşturuldu`)
    } catch (err: any) {
      console.error(`  ❌ Müşteri ${i + 1} oluşturulamadı:`, err.message)
    }
  }
  
  console.log(`\n📦 Siparişler oluşturuluyor (her müşteriye 1-5 arası)...`)
  
  let orderCount = 0
  const startDate = new Date('2025-01-01')
  const endDate = new Date()
  
  for (const customerId of customerIds) {
    const numOrders = randInt(1, 5)
    
    for (let j = 0; j < numOrders; j++) {
      // 1-4 arası ürün seç
      const numItems = randInt(1, 4)
      const selectedProducts: typeof PRODUCTS[number][] = []
      for (let k = 0; k < numItems; k++) {
        selectedProducts.push(rand(PRODUCTS))
      }
      
      const items = selectedProducts.map(p => ({
        productId: existingProducts.docs.length > 0 ? (rand(existingProducts.docs) as any).id?.toString() : '',
        name: p.name,
        variationId: `v-${randInt(1000, 9999)}`,
        size: p.size,
        packaging: p.packaging,
        price: p.price,
        quantity: randInt(1, 3),
      }))
      
      const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0)
      const shippingPrice = subtotal >= 1000 ? 0 : rand([49.90, 59.90, 69.90])
      const totalPrice = subtotal + shippingPrice
      
      // Müşteri bilgilerini çek
      let cust: any
      try {
        cust = await payload.findByID({ collection: 'customers', id: customerId })
      } catch { continue }
      
      const nameParts = (cust.name || 'Test User').split(' ')
      const fName = nameParts[0]
      const lName = nameParts.slice(1).join(' ') || 'Bilinmiyor'
      const cityData = rand(CITIES)
      
      const orderDate = randomDate(startDate, endDate)
      const status = rand(ORDER_STATUSES)
      
      try {
        await payload.create({
          collection: 'orders',
          data: {
            customer: customerId,
            orderNumber: `MANASOR-${orderDate.getTime()}-${randInt(1000, 9999)}`,
            status,
            paymentReference: status !== 'pending' ? `pi_${randInt(100000000, 999999999)}` : '',
            totalPrice,
            shippingPrice,
            firstName: fName,
            lastName: lName,
            email: cust.email,
            phone: cust.phone_number || generatePhone(),
            invoiceType: 'bireysel',
            identityNumber: cust.billing_address?.tax_number || generateTC(),
            city: cust.shipping_address?.city || cityData.city,
            district: cust.shipping_address?.district || rand(cityData.districts),
            address: cust.shipping_address?.address || `${rand(STREETS)} No:${randInt(1, 100)}`,
            items,
          },
          // @ts-ignore - Override createdAt for realistic date spread
        })
        orderCount++
      } catch (err: any) {
        console.error(`  ❌ Sipariş oluşturulamadı:`, err.message)
      }
    }
    
    if (orderCount % 25 === 0 && orderCount > 0) console.log(`  📦 ${orderCount} sipariş oluşturuldu...`)
  }
  
  console.log(`\n🎉 Seed tamamlandı!`)
  console.log(`   👤 ${customerIds.length} müşteri`)
  console.log(`   📦 ${orderCount} sipariş`)
  
  process.exit(0)
}

seed().catch((err) => {
  console.error('Seed hatası:', err)
  process.exit(1)
})
