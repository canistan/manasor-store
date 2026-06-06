import { NextResponse } from 'next/server';
import { getPayload } from 'payload';
import configPromise from '@payload-config';
import fs from 'fs';
import path from 'path';

export const dynamic = 'force-dynamic';

export async function GET() {
  const payload = await getPayload({ config: configPromise });
  const results = [];
  
  const updates = [
    { id: 7, file: 'public/images/olive_oil_bottle_1779729109843.png' }, 
    { id: 8, file: 'public/images/black_olives_jar_1779729123320.png' }, 
    { id: 9, file: 'public/images/category-olives.jpg' }, 
    { id: 10, file: 'public/images/olive_soap_1779729135941.png' }, 
    { id: 11, file: 'public/images/hero_banner_1779729149147.png' }, 
  ];

  for (const update of updates) {
    try {
      const filePath = path.resolve(process.cwd(), update.file);
      if (!fs.existsSync(filePath)) {
        results.push(`File not found: ${filePath}`);
        continue;
      }

      const fileData = fs.readFileSync(filePath);
      const filename = path.basename(filePath);
      const mimeType = filename.endsWith('.png') ? 'image/png' : 'image/jpeg';
      const size = fs.statSync(filePath).size;

      const media = await payload.create({
        collection: 'media',
        data: { alt: filename },
        file: {
          data: fileData,
          mimetype: mimeType,
          name: filename,
          size: size,
        },
      });

      await payload.update({
        collection: 'products',
        id: update.id,
        data: {
          image: media.id,
        },
      });
      results.push(`Updated product ${update.id}`);
    } catch (e: any) {
      results.push(`Error updating ${update.id}: ${e.message}`);
    }
  }
  
  return NextResponse.json({ success: true, results });
}
