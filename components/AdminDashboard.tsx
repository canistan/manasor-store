import React from 'react';
import { getPayload } from 'payload';
import configPromise from '@payload-config';
import Link from 'next/link';
import { ShoppingBag, AlertTriangle, CheckCircle, Clock, Truck, Archive, ArrowRight } from 'lucide-react';

export default async function AdminDashboard() {
  const payload = await getPayload({ config: configPromise });

  const [
    pendingData,
    paidData,
    shippedData,
    deliveredData,
    issuesData,
    completedData
  ] = await Promise.all([
    payload.count({ collection: 'orders', where: { status: { equals: 'pending' } } }),
    payload.count({ collection: 'orders', where: { status: { equals: 'paid' } } }),
    payload.count({ collection: 'orders', where: { status: { equals: 'shipped' } } }),
    payload.count({ collection: 'orders', where: { status: { equals: 'delivered' } } }),
    payload.count({ collection: 'orders', where: { status: { in: ['return_requested', 'cancel_requested'] } } }),
    payload.count({ collection: 'orders', where: { status: { in: ['returned', 'cancelled'] } } })
  ]);

  const containerStyle: React.CSSProperties = { padding: '40px', maxWidth: '1200px', margin: '0 auto', fontFamily: 'system-ui, sans-serif' };
  const cardGridStyle: React.CSSProperties = { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '24px', marginBottom: '48px' };
  const cardStyle = (bgColor: string, borderColor: string): React.CSSProperties => ({
    display: 'block', backgroundColor: bgColor, border: `1px solid ${borderColor}`, borderRadius: '16px', padding: '24px', textDecoration: 'none', position: 'relative', overflow: 'hidden'
  });
  const iconBoxStyle = (bgColor: string, color: string): React.CSSProperties => ({
    display: 'inline-flex', padding: '12px', backgroundColor: bgColor, color: color, borderRadius: '12px', marginBottom: '16px'
  });
  const valueStyle = (color: string): React.CSSProperties => ({
    fontSize: '32px', fontWeight: 'bold', color: color, margin: '0'
  });
  const labelStyle = (color: string): React.CSSProperties => ({
    fontSize: '14px', fontWeight: 600, color: color, margin: '0 0 4px 0'
  });

  return (
    <div style={containerStyle}>
      <div style={{ marginBottom: '32px' }}>
        <h1 style={{ fontSize: '32px', fontWeight: 'bold', margin: '0 0 8px 0', color: '#111827' }}>Manasor Yönetim Paneli</h1>
        <p style={{ margin: '0', color: '#6b7280' }}>Sipariş akışınızı ve iadelerinizi tek bir ekrandan yönetin.</p>
      </div>

      <div>
        <h2 style={{ fontSize: '20px', fontWeight: 600, color: '#1f2937', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <ShoppingBag size={20} /> Aktif Siparişler & Bekleyen İşlemler
        </h2>
        
        <div style={cardGridStyle}>
          {/* İPTAL/İADE (ACİL) */}
          <Link href="/admin/collections/orders?where[or][0][status][equals]=return_requested&where[or][1][status][equals]=cancel_requested" style={cardStyle('#fef2f2', '#fecaca')}>
            <div style={iconBoxStyle('#fee2e2', '#dc2626')}><AlertTriangle size={24} /></div>
            <div>
              <p style={labelStyle('#dc2626')}>Acil: İptal/İade Talebi</p>
              <h3 style={valueStyle('#7f1d1d')}>{issuesData.totalDocs}</h3>
            </div>
          </Link>

          {/* HAZIRLANACAKLAR (ÖDENDİ) */}
          <Link href="/admin/collections/orders?where[status][equals]=paid" style={cardStyle('#eff6ff', '#bfdbfe')}>
            <div style={iconBoxStyle('#dbeafe', '#2563eb')}><ShoppingBag size={24} /></div>
            <div>
              <p style={labelStyle('#2563eb')}>Hazırlanacaklar (Ödendi)</p>
              <h3 style={valueStyle('#1e3a8a')}>{paidData.totalDocs}</h3>
            </div>
          </Link>

          {/* KARGOLANANLAR */}
          <Link href="/admin/collections/orders?where[status][equals]=shipped" style={cardStyle('#faf5ff', '#e9d5ff')}>
            <div style={iconBoxStyle('#f3e8ff', '#9333ea')}><Truck size={24} /></div>
            <div>
              <p style={labelStyle('#9333ea')}>Kargodakiler</p>
              <h3 style={valueStyle('#581c87')}>{shippedData.totalDocs}</h3>
            </div>
          </Link>

          {/* BEKLEYEN */}
          <Link href="/admin/collections/orders?where[status][equals]=pending" style={cardStyle('#fffbeb', '#fde68a')}>
            <div style={iconBoxStyle('#fef3c7', '#d97706')}><Clock size={24} /></div>
            <div>
              <p style={labelStyle('#d97706')}>Ödeme Bekleyenler</p>
              <h3 style={valueStyle('#78350f')}>{pendingData.totalDocs}</h3>
            </div>
          </Link>
        </div>
      </div>

      <div>
        <h2 style={{ fontSize: '20px', fontWeight: 600, color: '#1f2937', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Archive size={20} /> Arşiv & Tamamlanan İşlemler
        </h2>

        <div style={cardGridStyle}>
          {/* TESLİM EDİLDİ */}
          <Link href="/admin/collections/orders?where[status][equals]=delivered" style={cardStyle('#ecfdf5', '#a7f3d0')}>
            <div style={iconBoxStyle('#d1fae5', '#059669')}><CheckCircle size={24} /></div>
            <div>
              <p style={labelStyle('#059669')}>Teslim Edilenler</p>
              <h3 style={valueStyle('#064e3b')}>{deliveredData.totalDocs}</h3>
            </div>
          </Link>

          {/* İPTAL/İADE ONAYLANDI */}
          <Link href="/admin/collections/orders?where[or][0][status][equals]=returned&where[or][1][status][equals]=cancelled" style={cardStyle('#f9fafb', '#e5e7eb')}>
            <div style={iconBoxStyle('#f3f4f6', '#4b5563')}><Archive size={24} /></div>
            <div>
              <p style={labelStyle('#4b5563')}>Tamamlanmış İade/İptaller</p>
              <h3 style={valueStyle('#111827')}>{completedData.totalDocs}</h3>
            </div>
          </Link>

          {/* TÜM SİPARİŞLER */}
          <Link href="/admin/collections/orders" style={{...cardStyle('#f1f5f9', '#cbd5e1'), gridColumn: 'span 2'}}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '100%' }}>
              <div>
                <p style={{...labelStyle('#475569'), fontSize: '16px'}}>Tüm Siparişler Tablosu</p>
                <span style={{ color: '#64748b', fontSize: '14px' }}>Gelişmiş filtreleme ve arama için listeye gidin</span>
              </div>
              <ArrowRight size={24} color="#64748b" />
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}
