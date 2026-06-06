import React from 'react'
import { getPayload } from 'payload'
import configPromise from '@payload-config'
import Link from 'next/link'
import styles from './Dashboard.module.css'

function getStatusLabel(status: string) {
  const map: Record<string, string> = {
    pending: 'Beklemede',
    paid: 'Ödendi',
    shipped: 'Kargolandı',
    delivered: 'Teslim Edildi',
    cancel_requested: 'İptal İsteniyor',
    return_requested: 'İade İsteniyor',
    cancelled: 'İptal/İade',
  }
  return map[status] || status
}

export default async function Dashboard() {
  const payload = await getPayload({ config: configPromise })

  // Fetch recent active orders
  const ordersReq = await payload.find({
    collection: 'orders',
    where: {
      status: {
        in: ['pending', 'paid', 'cancel_requested', 'return_requested'],
      },
    },
    sort: '-createdAt',
    limit: 5,
  })

  // Fetch pending RMAs
  const rmasReq = await payload.find({
    collection: 'rma_requests',
    where: {
      admin_status: {
        equals: 'pending_review',
      },
    },
    sort: '-createdAt',
    limit: 5,
  })

  // Count pending orders
  const pendingOrders = await payload.find({
    collection: 'orders',
    where: { status: { equals: 'pending' } },
    limit: 1,
  })

  // Count paid (ready to ship) orders
  const paidOrders = await payload.find({
    collection: 'orders',
    where: { status: { equals: 'paid' } },
    limit: 1,
  })

  return (
    <div className={styles.dashboard}>
      <header className={styles.header}>
        <h1>Yönetim Kokpiti</h1>
        <p>Manasor e-ticaret sitenizin güncel özeti.</p>
      </header>

      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <h3>Bekleyen (Ödemesi Alınmamış) Sipariş</h3>
          <p className={styles.value}>{pendingOrders.totalDocs}</p>
        </div>
        <div className={styles.statCard}>
          <h3>Hazırlanacak (Ödendi) Sipariş</h3>
          <p className={styles.value}>{paidOrders.totalDocs}</p>
        </div>
        <div className={styles.statCard}>
          <h3>İnceleme Bekleyen İade/Hasar</h3>
          <p className={styles.value}>{rmasReq.totalDocs}</p>
        </div>
      </div>

      <div className={styles.tablesGrid}>
        <div className={styles.tableSection}>
          <h2>Aksiyon Bekleyen Siparişler</h2>
          {ordersReq.docs.length > 0 ? (
            <table className={styles.table}>
              <thead>
                <tr>
                  <th className={styles.th}>Sipariş No</th>
                  <th className={styles.th}>Müşteri</th>
                  <th className={styles.th}>Tutar</th>
                  <th className={styles.th}>Durum</th>
                  <th className={styles.th}>Tarih</th>
                </tr>
              </thead>
              <tbody>
                {ordersReq.docs.map((order: any) => (
                  <tr key={order.id}>
                    <td className={styles.td}>
                      <Link href={`/admin/collections/orders/${order.id}`} className={styles.tdLink}>
                        #{order.orderNumber}
                      </Link>
                    </td>
                    <td className={styles.td}>{order.firstName} {order.lastName}</td>
                    <td className={styles.td}>{order.totalPrice} ₺</td>
                    <td className={styles.td}>
                      <span className={`${styles.badge} ${styles[order.status] || ''}`}>
                        {getStatusLabel(order.status)}
                      </span>
                    </td>
                    <td className={styles.td}>{new Date(order.createdAt).toLocaleDateString('tr-TR')}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p style={{ padding: '1.5rem', margin: 0, color: '#666' }}>Şu an aksiyon bekleyen aktif sipariş bulunmuyor.</p>
          )}
        </div>

        <div className={styles.tableSection}>
          <h2>Hızlı Erişim</h2>
          <div className={styles.quickLinks}>
            <Link href="/admin/collections/products/create" className={styles.quickLink}>
              + Yeni Ürün Ekle
            </Link>
            <Link href="/admin/collections/orders" className={styles.quickLink}>
              📦 Tüm Siparişler
            </Link>
            <Link href="/admin/collections/rma_requests" className={styles.quickLink}>
              🔄 İade ve Hasar Talepleri
            </Link>
            <Link href="/admin/globals/home-page" className={styles.quickLink}>
              🏠 Ana Sayfa Vitrinini Düzenle
            </Link>
            <a href="/" target="_blank" rel="noopener noreferrer" className={styles.quickLink}>
              🌍 Siteye Git (Yeni Sekme)
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
