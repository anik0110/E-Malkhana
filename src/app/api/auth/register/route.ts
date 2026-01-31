import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { User } from '@/lib/models/User';
import bcrypt from 'bcryptjs';

export async function POST(req: Request) {
  try {
    const { name, email, password } = await req.json();
    
    // 1. Strict Email Regex
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: 'Invalid email format' }, { status: 400 });
    }

    await connectDB();

    // 2. Uniqueness Check
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json({ error: 'User already exists with this email' }, { status: 400 });
    }

    // 3. Create User
    const hashedPassword = await bcrypt.hash(password, 10);
    const randomNum = Math.floor(1000 + Math.random() * 9000);
    const badgeId = `IO-${randomNum}`;

    await User.create({
      name, email, password: hashedPassword, badgeId, role: 'officer'
    });

    return NextResponse.json({ message: 'User created', badgeId }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}