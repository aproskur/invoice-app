import { NextRequest, NextResponse } from 'next/server';
import path from 'path';
import fs from 'fs/promises';
import sharp from 'sharp';

export const config = {
  api: {
    bodyParser: false,
  },
};

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get('photo') as File;

    if (!file || !file.name || !file.type.startsWith('image/')) {
      return NextResponse.json({ error: 'Invalid file type' }, { status: 400 });
    }

    if (file.size > 100 * 1024) {
      return NextResponse.json({ error: 'File too large (max 100KB)' }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());

    // Resize to 128x128 with cover fit and compress
    const resizedBuffer = await sharp(buffer)
      .resize(128, 128, { fit: 'cover' })
      .jpeg({ quality: 80 }) // reduce size
      .toBuffer();

    const fileName = `photo-${Date.now()}.jpg`;
    const uploadDir = path.join(process.cwd(), 'public', 'uploads');

    await fs.mkdir(uploadDir, { recursive: true }); // Ensure folder exists
    await fs.writeFile(path.join(uploadDir, fileName), resizedBuffer);

    const photoUrl = `/uploads/${fileName}`;
    return NextResponse.json({ photoUrl });
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 });
  }
}
