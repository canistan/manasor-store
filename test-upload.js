const { put } = require('@vercel/blob');
require('dotenv').config({ path: '.env.local' });

async function upload() {
  try {
    const blob = await put('test.txt', 'Hello World', {
      access: 'public',
      token: process.env.BLOB_READ_WRITE_TOKEN,
    });
    console.log('Success:', blob.url);
  } catch (error) {
    console.error('Error:', error);
  }
}
upload();
