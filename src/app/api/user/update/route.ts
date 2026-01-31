import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { connectDB } from '@/lib/db';
import { User } from '@/lib/models/User';

export async function PATCH(req: Request) {
  try {
    const session: any = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { image } = await req.json();

    await connectDB();
    
    
    const updatedUser = await User.findByIdAndUpdate(
      session.user.id, 
      { image: image }, 
      { new: true }
    );

    return NextResponse.json({ message: 'Profile updated', user: updatedUser });
  } catch (error) {
    return NextResponse.json({ error: 'Update failed' }, { status: 500 });
  }
}