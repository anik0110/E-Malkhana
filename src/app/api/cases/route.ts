import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { Case } from '@/lib/models/Case';

export async function POST(req: Request) {
  try {
    await connectDB();
    const body = await req.json();
    
    // Auto-generate QR data for properties
    const propertiesWithQR = body.properties.map((p: any) => ({
      ...p,
      qrCodeData: JSON.stringify({ 
        crime: `${body.crimeNumber}/${body.crimeYear}`, 
        category: p.category,
        id: new Date().getTime() 
      })
    }));

    const newCase = await Case.create({ ...body, properties: propertiesWithQR });
    return NextResponse.json(newCase, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create case' }, { status: 500 });
  }
}

export async function GET(req: Request) {
  await connectDB();
  const { searchParams } = new URL(req.url);
  const query = searchParams.get('q');
  
  let filter = {};
  if (query) {
    filter = { 
      $or: [
        { crimeNumber: { $regex: query, $options: 'i' } },
        { ioName: { $regex: query, $options: 'i' } }
      ] 
    };
  }
  
  const cases = await Case.find(filter).sort({ createdAt: -1 });
  return NextResponse.json(cases);
}