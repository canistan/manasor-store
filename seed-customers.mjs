// Seed script: 100 dummy müşteri + sipariş oluşturma (REST API ile)
// Kullanım: node seed-customers.mjs
// Önkoşul: npm run dev çalışıyor olmalı

const BASE_URL = 'http://localhost:3000'

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
  'Emir', 'Aras', 'Rüzgar', 'Çınar', 'Toprak', 'Ege', 'Atlas', 'Demir', 'Baran', 'Umut'
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
  { city: 'Ankara', districts: ['Çankaya', 'Keçiören', 'Yenimahalle', 'Etimesgut', 'Mamak'] },
  { city: 'İzmir', districts: ['Konak', 'Bornova', 'Karşıyaka', 'Buca', 'Bayraklı'] },
  { city: 'Bursa', districts: ['Osmangazi', 'Nilüfer', 'Yıldırım', 'Gemlik', 'Mudanya'] },
  { city: 'Antalya', districts: ['Muratpaşa', 'Konyaaltı', 'Kepez', 'Alanya'] },
  { city: 'Konya', districts: ['Selçuklu', 'Meram', 'Karatay'] },
  { city: 'Adana', districts: ['Seyhan', 'Çukurova', 'Yüreğir'] },
  { city: 'Gaziantep', districts: ['Şahinbey', 'Şehitkamil'] },
  { city: 'Trabzon', districts: ['Ortahisar', 'Akçaabat'] },
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

const ORDER_STATUSES = ['pending', 'paid', 'shipped', 'delivered', 'cancelled']

function rand(arr) { return arr[Math.floor(Math.random() * arr.length)] }
function randInt(min, max) { return Math.floor(Math.random() * (max - min + 1)) + min }
function generateTC() {
  let d = ''
  for (let i = 0; i < 11; i++) d += i === 0 ? randInt(1, 9) : randInt(0, 9)
  return d
}
function generatePhone() {
  const prefix = rand(['530','531','532','533','534','535','536','537','538','539','540','541','542','543','544','545','546','547','548','549','550','551','552','553','554','555'])
  return `+90${prefix}${randInt(1000000, 9999999)}`
}
function turkishToAscii(str) {
  return str.replace(/[çğıöşüÇĞİÖŞÜ]/g, c => ({ç:'c',ğ:'g',ı:'i',ö:'o',ş:'s',ü:'u',Ç:'C',Ğ:'G',İ:'I',Ö:'O',Ş:'S',Ü:'U'}[c]||c))
}

async function getAdminToken() {
  const res = await fetch(`${BASE_URL}/api/users/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'admin@manasor.com', password: 'manasoradmin123' })
  })
  const data = await res.json()
  if (!data.token) throw new Error('Admin girişi başarısız! Lütfen admin@manasor.com / admin123 hesabını kontrol edin. Yanıt: ' + JSON.stringify(data))
  return data.token
}

async function seed() {
  console.log('🌱 Seed başlatılıyor...')
  
  // 1. Admin token al
  let token
  try {
    token = await getAdminToken()
    console.log('🔑 Admin token alındı.')
  } catch (err) {
    console.error('❌ Admin girişi başarısız:', err.message)
    console.log('\n💡 İpucu: Admin panelinden admin@manasor.com / admin123 hesabı oluşturun.')
    process.exit(1)
  }
  
  const headers = {
    'Content-Type': 'application/json',
    'Authorization': `JWT ${token}`
  }

  // 2. Mevcut ürünleri çek
  let productIds = []
  try {
    const prodRes = await fetch(`${BASE_URL}/api/products?limit=100`, { headers })
    const prodData = await prodRes.json()
    productIds = (prodData.docs || []).map(p => p.id.toString())
    console.log(`📦 ${productIds.length} mevcut ürün bulundu.`)
  } catch { /* boş */ }

  const customerIds = []
  const usedEmails = new Set()
  
  console.log('\n👤 100 müşteri oluşturuluyor...')
  
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
    
    // Unique email oluştur
    let email
    do {
      email = `${turkishToAscii(firstName).toLowerCase()}${turkishToAscii(lastName).toLowerCase()}${randInt(1, 9999)}@${rand(['gmail.com', 'hotmail.com', 'outlook.com', 'yahoo.com', 'yandex.com'])}`
    } while (usedEmails.has(email))
    usedEmails.add(email)
    
    const cityData2 = rand(CITIES)
    const district2 = rand(cityData2.districts)
    const street2 = rand(STREETS)
    
    try {
      const res = await fetch(`${BASE_URL}/api/customers`, {
        method: 'POST',
        headers,
        body: JSON.stringify({
          email,
          password: 'Test1234!',
          name: `${firstName} ${lastName}`,
          phone_number: phone,
          billing_address: {
            address: `${street} No:${buildingNo} Daire:${apartmentNo}`,
            city: cityData.city,
            district,
            tax_office: rand(['Üsküdar', 'Beyoğlu', 'Kadıköy', 'Nilüfer', 'Konak', 'Çankaya', '']),
            tax_number: tc,
          },
          shipping_address: {
            address: `${street} No:${buildingNo} Daire:${apartmentNo}`,
            city: cityData.city,
            district,
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
              invoiceType: 'bireysel',
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
              invoiceType: rand(['bireysel', 'kurumsal']),
              identityNumber: tc,
              companyName: rand(['', '', `${lastName} Ticaret A.Ş.`, `${firstName} Ltd. Şti.`]),
              taxOffice: rand(['Üsküdar', 'Beyoğlu', 'Kadıköy', 'Nilüfer', 'Konak']),
              taxNumber: rand(['', generateTC()]),
            },
          ],
        })
      })
      
      const data = await res.json()
      if (data.doc?.id) {
        customerIds.push({ id: data.doc.id, name: `${firstName} ${lastName}`, email, phone, tc, cityData, district, street, buildingNo })
        if ((i + 1) % 10 === 0) console.log(`  ✅ ${i + 1}/100 müşteri oluşturuldu`)
      } else {
        console.error(`  ❌ Müşteri ${i + 1} (${email}):`, data.errors?.[0]?.message || 'Bilinmeyen hata')
      }
    } catch (err) {
      console.error(`  ❌ Müşteri ${i + 1} istek hatası:`, err.message)
    }
  }
  
  console.log(`\n📦 Siparişler oluşturuluyor (her müşteriye 1-5 arası)...`)
  
  let orderCount = 0
  
  for (const cust of customerIds) {
    const numOrders = randInt(1, 5)
    
    for (let j = 0; j < numOrders; j++) {
      const numItems = randInt(1, 4)
      const selectedProducts = []
      for (let k = 0; k < numItems; k++) selectedProducts.push(rand(PRODUCTS))
      
      const items = selectedProducts.map(p => ({
        productId: productIds.length > 0 ? rand(productIds) : '',
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
      
      const nameParts = cust.name.split(' ')
      const status = rand(ORDER_STATUSES)
      
      try {
        const res = await fetch(`${BASE_URL}/api/orders`, {
          method: 'POST',
          headers,
          body: JSON.stringify({
            customer: cust.id,
            orderNumber: `MANASOR-${Date.now()}-${randInt(10000, 99999)}`,
            status,
            paymentReference: status !== 'pending' ? `pi_${randInt(100000000, 999999999)}` : '',
            totalPrice,
            shippingPrice,
            firstName: nameParts[0],
            lastName: nameParts.slice(1).join(' ') || 'Bilinmiyor',
            email: cust.email,
            phone: cust.phone,
            invoiceType: 'bireysel',
            identityNumber: cust.tc,
            city: cust.cityData.city,
            district: cust.district,
            address: `${cust.street} No:${cust.buildingNo}`,
            items,
          })
        })
        
        const data = await res.json()
        if (data.doc?.id) {
          orderCount++
        } else {
          console.error(`  ❌ Sipariş hatası:`, data.errors?.[0]?.message || JSON.stringify(data).substring(0, 100))
        }
      } catch (err) {
        console.error(`  ❌ Sipariş istek hatası:`, err.message)
      }
    }
    
    if (orderCount % 50 === 0 && orderCount > 0) console.log(`  📦 ${orderCount} sipariş oluşturuldu...`)
  }
  
  console.log(`\n🎉 Seed tamamlandı!`)
  console.log(`   👤 ${customerIds.length} müşteri`)
  console.log(`   📦 ${orderCount} sipariş`)
}

seed().catch(err => {
  console.error('Seed hatası:', err)
  process.exit(1)
})
