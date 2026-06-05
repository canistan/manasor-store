import { NextResponse } from 'next/server';
import { getPayload } from 'payload';
import configPromise from '@/payload.config';

export async function GET() {
  try {
    const payload = await getPayload({ config: configPromise });
    const settings = await payload.findGlobal({ slug: 'settings' });

    return NextResponse.json({
      freeShippingThreshold: settings.freeShippingThreshold || 1500,
      shippingRules: settings.shippingRules || [
        { minWeight: 0, maxWeight: 5, price: 79.90 },
        { minWeight: 5, maxWeight: 15, price: 119.90 },
        { minWeight: 15, maxWeight: 999, price: 159.90 }
      ]
    });
  } catch (error) {
    console.error('Settings API Error:', error);
    // Hata durumunda default değerler dönsün ki site çökmesin
    return NextResponse.json({
      freeShippingThreshold: 1500,
      shippingRules: [
        { minWeight: 0, maxWeight: 5, price: 79.90 },
        { minWeight: 5, maxWeight: 15, price: 119.90 },
        { minWeight: 15, maxWeight: 999, price: 159.90 }
      ]
    });
  }
}
