'use client'

import React from 'react'

const statusConfig: Record<string, { label: string, style: React.CSSProperties }> = {
  pending: { label: 'Beklemede (Ödeme Alınmadı)', style: { backgroundColor: '#fef3c7', color: '#92400e', border: '1px solid #fde68a' } },
  paid: { label: 'Ödendi (Hazırlanıyor)', style: { backgroundColor: '#dbeafe', color: '#1e40af', border: '1px solid #bfdbfe' } },
  shipped: { label: 'Kargolandı', style: { backgroundColor: '#f3e8ff', color: '#6b21a8', border: '1px solid #e9d5ff' } },
  delivered: { label: 'Teslim Edildi', style: { backgroundColor: '#d1fae5', color: '#065f46', border: '1px solid #a7f3d0' } },
  cancel_requested: { label: 'İptal Talep Edildi', style: { backgroundColor: '#fee2e2', color: '#b91c1c', border: '1px solid #fecaca', fontWeight: 'bold' } },
  cancelled: { label: 'İptal Edildi', style: { backgroundColor: '#f3f4f6', color: '#1f2937', border: '1px solid #e5e7eb' } },
  return_requested: { label: 'İade Talep Edildi', style: { backgroundColor: '#fee2e2', color: '#b91c1c', border: '1px solid #fecaca', fontWeight: 'bold' } },
  returned: { label: 'İade Edildi', style: { backgroundColor: '#f3f4f6', color: '#1f2937', border: '1px solid #e5e7eb' } },
}

export default function OrderStatusCell({ cellData }: any) {
  const status = cellData as string
  const config = statusConfig[status] || { label: status, style: { backgroundColor: '#f1f5f9', color: '#1e293b', border: '1px solid #e2e8f0' } }

  return (
    <span style={{
      display: 'inline-flex',
      alignItems: 'center',
      padding: '2px 10px',
      borderRadius: '9999px',
      fontSize: '0.75rem',
      fontWeight: config.style.fontWeight || 500,
      backgroundColor: config.style.backgroundColor,
      color: config.style.color,
      border: config.style.border,
      whiteSpace: 'nowrap'
    }}>
      {config.label}
    </span>
  )
}
