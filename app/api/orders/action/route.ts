import { NextResponse } from 'next/server';
import { getPayload } from 'payload';
import configPromise from '@/payload.config';
import { cookies } from 'next/headers';


export async function POST(req: Request) {
  try {
    const payload = await getPayload({ config: configPromise });
    
    // Auth Check
    const cookieStore = await cookies();
    const token = cookieStore.get('payload-token')?.value;
    
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const { user } = await payload.auth({ headers: req.headers });
    if (!user || !user.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { orderId, action } = await req.json();

    if (!orderId || !action) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Verify order belongs to the user
    const orderRes = await payload.find({
      collection: 'orders',
      where: {
        id: { equals: orderId },
        'email': { equals: user.email }
      },
      limit: 1,
    });

    if (orderRes.docs.length === 0) {
      return NextResponse.json({ error: 'Order not found or access denied' }, { status: 404 });
    }

    const order = orderRes.docs[0];
    let newStatus = '';

    if (action === 'cancel') {
      if (order.status !== 'pending' && order.status !== 'paid') {
        return NextResponse.json({ error: 'Bu sipariş artık iptal edilemez.' }, { status: 400 });
      }
      newStatus = 'cancel_requested';
    } else if (action === 'return') {
      if (order.status !== 'delivered') {
        return NextResponse.json({ error: 'Sadece teslim edilmiş siparişler iade edilebilir.' }, { status: 400 });
      }
      newStatus = 'return_requested';
    } else {
      return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    }

    // Update order status
    await payload.update({
      collection: 'orders',
      id: orderId,
      data: {
        status: newStatus,
      },
    });

    // Optionally: Send email to Admin about the request (simulated)
    payload.logger.info(`Yeni talep: Sipariş #${order.orderNumber} için ${action} talebi oluşturuldu.`);

    return NextResponse.json({ success: true, message: 'Talebiniz başarıyla alındı.' });

  } catch (error: any) {
    console.error('Order action error:', error);
    return NextResponse.json({ error: 'Sunucu hatası: ' + error.message }, { status: 500 });
  }
}
