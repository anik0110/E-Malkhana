import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { Case } from '@/lib/models/Case';

export async function GET() {
  await connectDB();
  const totalCases = await Case.countDocuments({});
  const disposedCases = await Case.countDocuments({ status: 'Disposed' });
  const pendingCases = await Case.countDocuments({ status: 'Active' });

  return NextResponse.json({ totalCases, disposedCases, pendingCases });
}