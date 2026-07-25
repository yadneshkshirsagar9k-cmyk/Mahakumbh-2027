import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { identifier, password } = body;

    if (!identifier || !password) {
      return NextResponse.json(
        { error: 'Missing identifier or password' },
        { status: 400 }
      );
    }

    const trimmedIdentifier = identifier.trim();

    // Find user by mobile, email, or userId
    const user = await prisma.user.findFirst({
      where: {
        OR: [
          { mobile: trimmedIdentifier },
          { email: trimmedIdentifier },
          { userId: trimmedIdentifier }
        ]
      }
    });

    if (!user) {
      return NextResponse.json(
        { error: 'No account found with this identifier. Please register first.' },
        { status: 404 }
      );
    }

    // Check password
    if (user.password !== password) {
      return NextResponse.json(
        { error: 'Incorrect password. Please try again.' },
        { status: 401 }
      );
    }

    return NextResponse.json({
      success: true,
      user: {
        id: user.userId,
        name: user.fullName,
        phone: user.mobile,
        email: user.email,
        role: user.category === 'operator' ? 'operator' : 'pilgrim',
        registrationType: user.category.charAt(0).toUpperCase() + user.category.slice(1),
        registrationId: 'MK-' + Math.floor(100000 + Math.random() * 900000), // Random placeholder or database registration ID
      }
    });
  } catch (error: any) {
    console.error('Login API error:', error);
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 });
  }
}
