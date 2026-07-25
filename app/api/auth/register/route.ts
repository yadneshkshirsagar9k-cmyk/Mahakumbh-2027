import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { 
      fullName, 
      mobile, 
      alternateMobile, 
      email, 
      password, 
      category, 
      state, 
      district,
      address,
      aadhaar,
      gender,
      dob,
      emergencyContact 
    } = body;

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

    // Create user and linked citizen profile in database
    const user = await prisma.user.create({
      data: {
        userId,
        fullName,
        mobile: mobile.trim(),
        alternateMobile: alternateMobile ? alternateMobile.trim() : null,
        email: email ? email.trim() : '',
        password, // In production, hash this with bcrypt or similar
        category: category || 'individual',
        state: state || '',
        district: district || '',
        citizenProfile: {
          create: {
            citizenId: 'CID-MHK-' + Math.floor(100000 + Math.random() * 900000).toString(),
            photo: '',
            fullName,
            gender: gender || '',
            dateOfBirth: dob || '',
            primaryMobile: mobile.trim(),
            alternateMobile: alternateMobile ? alternateMobile.trim() : null,
            email: email ? email.trim() : '',
            address: {
              houseFlatNumber: '',
              buildingSociety: '',
              streetRoad: address || '',
              areaLocality: '',
              villageTownCity: district || '',
              talukaTehsil: '',
              district: district || '',
              state: state || '',
              country: category === 'foreign' ? 'Foreign' : 'India',
              pinCode: '',
            },
            nationality: category === 'foreign' ? 'Foreign National' : 'Indian Citizen',
            preferredLanguage: 'English',
            bloodGroup: '',
            occupation: 'Other',
            occupationOther: '',
            governmentIds: aadhaar ? [
              {
                type: 'Aadhaar',
                number: aadhaar.trim(),
                verificationStatus: 'Not Verified',
                verifiedBy: '',
                verificationMethod: '',
                verificationTimestamp: '',
                maskedDisplay: 'XXXX-XXXX-' + aadhaar.trim().slice(-4),
              }
            ] : [],
            emergencyContacts: {
              primary: {
                name: 'Primary Contact',
                relationship: 'Family',
                phone: emergencyContact || '',
                notes: '',
              },
              secondary: { name: '', relationship: '', phone: '', notes: '' },
              doctor: { name: '', relationship: '', phone: '', notes: '' },
              localContact: { name: '', relationship: '', phone: '', notes: '' },
            },
            signature: '',
            verification: {
              registrationStatus: 'Journey Registered',
              identityVerification: 'Pending',
              documentVerification: 'Pending',
              journeyApproval: 'Pending',
              currentStage: 'Self Registration',
            },
            audit: {
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
              createdBy: 'Self Registration',
              updatedBy: 'Self Registration',
            }
          }
        }
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
