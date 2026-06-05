import { getPayload } from 'payload';
import configPromise from '@payload-config';
import ProductsClient from './ProductsClient';

export const dynamic = 'force-dynamic';

export default async function ProductsPage() {
  const payload = await getPayload({ config: configPromise });

  const result = await payload.find({
    collection: 'products',
    limit: 100,
    sort: '-createdAt',
  });

  const products = result.docs.map((doc: any) => ({
    id: doc.slug,
    name: doc.name,
    shortDescription: doc.shortDescription || '',
    category: doc.category || 'Diğer',
    image: typeof doc.image === 'object' && doc.image?.url ? doc.image.url : '/images/olive_oil_bottle_1779729109843.png',
    secondaryImage: doc.secondaryImage,
    variations: (doc.variations || []).map((v: any) => ({
      id: v.variantId,
      size: v.size,
      packaging: v.packaging,
      price: v.price,
      stock: v.stock
    }))
  }));

  return <ProductsClient products={products} />;
}
