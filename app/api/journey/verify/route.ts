import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Missing document id query parameter' }, { status: 400 });
    }

    const trimmedId = id.trim();

    // Query Journey collection to check if the document number matches any pass or registration
    const journey = await prisma.journey.findFirst({
      where: {
        OR: [
          { permitNumber: trimmedId },
          { vehiclePassId: trimmedId },
          { emergencySheetId: trimmedId },
          { registrationNumber: trimmedId }
        ]
      }
    });

    if (!journey) {
      return NextResponse.json({
        success: true,
        valid: false,
        error: 'This document number is not recognized in the official database registry.'
      }, { status: 200 });
    }

    // Determine validity based on journey status
    const isRevoked = journey.journeyStatus === 'Revoked' || journey.journeyStatus === 'Cancelled';
    const isActive = journey.journeyStatus !== 'Draft';

    if (isRevoked) {
      return NextResponse.json({
        success: true,
        valid: false,
        error: 'This pass has been administratively revoked or cancelled.'
      }, { status: 200 });
    }

    return NextResponse.json({
      success: true,
      valid: isActive,
      status: journey.journeyStatus,
      journey
    }, { status: 200 });
  } catch (error: any) {
    console.error('Verify document API error:', error);
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 });
  }
}
