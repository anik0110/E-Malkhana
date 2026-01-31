import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { User } from '@/lib/models/User';
import bcrypt from 'bcryptjs';
import nodemailer from 'nodemailer';


let otpStore: Record<string, string> = {}; 


const transporter = nodemailer.createTransport({
  service: 'gmail', 
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { action, email, otp, newPassword } = body;
    await connectDB();

    if (action === 'SEND_OTP') {
      
      const user = await User.findOne({ email });
      if (!user) {
        
        return NextResponse.json({ error: 'No account found with this email ID.' }, { status: 404 });
      }

      
      const generatedOtp = Math.floor(100000 + Math.random() * 900000).toString();
      otpStore[email] = generatedOtp;

      
      try {
        await transporter.sendMail({
          from: '"e-Malkhana Security" <no-reply@emalkhana.gov.in>',
          to: email,
          subject: 'Password Reset OTP - e-Malkhana',
          html: `
            <div style="font-family: Arial, sans-serif; padding: 20px; color: #333;">
              <h2 style="color: #1e293b;">Password Reset Request</h2>
              <p>You requested to reset your password for the e-Malkhana Portal.</p>
              <p>Your Verification Code is:</p>
              <h1 style="background: #f1f5f9; padding: 10px 20px; display: inline-block; border-radius: 8px; color: #0f172a;">${generatedOtp}</h1>
              <p style="margin-top: 20px; font-size: 12px; color: #64748b;">If you did not request this, please ignore this email.</p>
            </div>
          `,
        });
        return NextResponse.json({ message: `OTP sent to ${email}` });
      } catch (emailError) {
        console.error("Email send failed:", emailError);
        return NextResponse.json({ error: 'Failed to send email. Check server logs.' }, { status: 500 });
      }
    }

    
    if (action === 'RESET_PASSWORD') {
      if (!otpStore[email] || otpStore[email] !== otp) {
        return NextResponse.json({ error: 'Invalid or expired OTP' }, { status: 400 });
      }

      const hashedPassword = await bcrypt.hash(newPassword, 10);
      await User.findOneAndUpdate({ email }, { password: hashedPassword });
      
      delete otpStore[email]; 

      return NextResponse.json({ message: 'Password updated successfully' });
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
  } catch (error) {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}