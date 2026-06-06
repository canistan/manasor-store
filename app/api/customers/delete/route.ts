import { NextResponse } from 'next/server';
import { getPayload } from 'payload';
import configPromise from '@payload-config';
import { cookies } from 'next/headers';
import crypto from 'crypto';

export async function POST(req: Request) {
  try {
    const payload = await getPayload({ config: configPromise });
    
    // Auth Check
    const cookieStore = await cookies();
    const token = cookieStore.get('payload-token')?.value;

    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { user } = await payload.auth({
      headers: req.headers,
    });

    if (!user || user.collection !== 'customers') {
      return NextResponse.json({ error: 'Unauthorized or invalid user type' }, { status: 401 });
    }

    const originalEmail = user.email;
    const ipAddress = req.headers.get('x-forwarded-for') || req.headers.get('remote-addr') || 'unknown';

    // Randomize password so they can't login
    const randomPassword = crypto.randomUUID() + crypto.randomUUID();

    // Anonymize the customer record
    await payload.update({
      collection: 'customers',
      id: user.id,
      data: {
        email: `anon-${user.id}@deleted.local`,
        password: randomPassword, // Payload hashes this automatically
        name: 'Anonim Kullanıcı',
        phone_number: '',
        billing_address: undefined, // Clear group
        shipping_address: undefined, // Clear group
        addresses: [], // Clear array
        accountStatus: 'anonymized',
        anonymizedAt: new Date().toISOString(),
      },
    });

    // Create Audit Log
    try {
      await payload.create({
        collection: 'audit_logs',
        data: {
          action: `Hesap silme talebi alındı ve müşteri verileri anonimleştirildi. (Eski e-posta: ${originalEmail})`,
          performedBy: originalEmail,
          collectionName: 'customers',
          documentId: user.id.toString(),
          details: {
            reason: 'Kullanıcı isteğiyle KVKK silme',
            previousEmail: originalEmail,
          },
          ipAddress: ipAddress,
        },
      });
    } catch (auditError) {
      console.error('Audit log creation failed:', auditError);
      // Don't fail the deletion if audit log fails
    }

    return NextResponse.json({ success: true, message: 'Account anonymized successfully' });

  } catch (error: any) {
    console.error('Account deletion error:', error);
    return NextResponse.json({ error: 'Internal Server Error', details: error.message }, { status: 500 });
  }
}
