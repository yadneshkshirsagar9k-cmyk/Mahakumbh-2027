import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { fullName, mobile, alternateMobile, email, password, category, state, district } = body;

    if (!mobile || !password || !fullName) {
      return NextResponse.json(
        { error: 'Missing required fields (fullName, mobile, password)' },
        { status: 400 }
      );
    }

    // Check if user already exists
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [
          { mobile: mobile.trim() },
          { email: email ? email.trim() : undefined }
        ].filter(Boolean) as any
      }
    });

    if (existingUser) {
      return NextResponse.json(
        { error: 'An account is already registered with this mobile number or email.' },
        { status: 400 }
      );
    }

    // Generate unique user ID (e.g. USR-2027-123456)
    const userId = 'USR-2027-' + Math.floor(100000 + Math.random() * 900000).toString();

    // Create user in database
    const user = await prisma.user.create({
      data: {
        userId,
        fullName,
        mobile: mobile.trim(),
        alternateMobile: alternateMobile ? alternateMobile.trim() : null,
        email: email ? email.trim() : '',
        password, // In production, hash this with bcrypt or similar
        category: category || 'indian',
        state: state || '',
        district: district || '',
      }
    });

    return NextResponse.json({
      success: true,
      message: 'User registered successfully',
      userId: user.userId,
    });
  } catch (error: any) {
    console.error('Registration API error:', error);
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 });
  }
}
