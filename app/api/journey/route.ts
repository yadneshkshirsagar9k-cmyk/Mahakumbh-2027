import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { userId, journey } = body;

    if (!userId || !journey) {
      return NextResponse.json({ error: 'Missing userId or journey data' }, { status: 400 });
    }

    // Find the user record in database
    const user = await prisma.user.findUnique({
      where: { userId }
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found in database' }, { status: 404 });
    }

    // Map accommodation details ensuring all required schema properties exist
    const accommodation = journey.accommodation ? {
      applicationId: journey.accommodation.applicationId || '',
      serviceType: journey.accommodation.serviceType || 'Accommodation',
      status: journey.accommodation.status || 'Not Started',
      referenceNumber: journey.accommodation.referenceNumber || '',
      applicationDate: journey.accommodation.applicationDate || '',
      lastUpdated: journey.accommodation.lastUpdated || '',
      currentStage: journey.accommodation.currentStage || 'Not Started',
      camp: journey.accommodation.camp || '',
      type: journey.accommodation.type || '',
      name: journey.accommodation.name || '',
      address: journey.accommodation.address || '',
      sector: journey.accommodation.sector || '',
      zone: journey.accommodation.zone || '',
      contactNumber: journey.accommodation.contactNumber || '',
      checkIn: journey.accommodation.checkIn || '',
      checkOut: journey.accommodation.checkOut || '',
      audit: {
        createdAt: journey.accommodation.audit?.createdAt || new Date().toISOString(),
        updatedAt: journey.accommodation.audit?.updatedAt || new Date().toISOString(),
        createdBy: journey.accommodation.audit?.createdBy || 'System',
        updatedBy: journey.accommodation.audit?.updatedBy || 'System',
      }
    } : null;

    // Map vehicle details ensuring all required schema properties exist
    const vehicleInfo = journey.vehicleInfo ? {
      applicationId: journey.vehicleInfo.applicationId || '',
      serviceType: journey.vehicleInfo.serviceType || 'Vehicle',
      status: journey.vehicleInfo.status || 'Not Started',
      referenceNumber: journey.vehicleInfo.referenceNumber || '',
      applicationDate: journey.vehicleInfo.applicationDate || '',
      lastUpdated: journey.vehicleInfo.lastUpdated || '',
      currentStage: journey.vehicleInfo.currentStage || 'Not Started',
      vehicleType: journey.vehicleInfo.vehicleType || '',
      vehicleNumber: journey.vehicleInfo.vehicleNumber || '',
      driverName: journey.vehicleInfo.driverName || '',
      driverMobile: journey.vehicleInfo.driverMobile || '',
      fuelType: journey.vehicleInfo.fuelType || 'Petrol',
      fasTagId: journey.vehicleInfo.fasTagId || '',
      vehiclePassId: journey.vehicleInfo.vehiclePassId || '',
      audit: {
        createdAt: journey.vehicleInfo.audit?.createdAt || new Date().toISOString(),
        updatedAt: journey.vehicleInfo.audit?.updatedAt || new Date().toISOString(),
        createdBy: journey.vehicleInfo.audit?.createdBy || 'System',
        updatedBy: journey.vehicleInfo.audit?.updatedBy || 'System',
      }
    } : null;

    // Map pilgrim list ensuring all required nested sub-models map correctly
    const pilgrims = journey.pilgrims ? journey.pilgrims.map((p: any) => ({
      pilgrimCategory: p.pilgrimCategory || 'General',
      groupInformation: p.groupInformation || '',
      pilgrimId: p.pilgrimId || '',
      photo: p.photo || '',
      fullName: p.fullName || '',
      relationship: p.relationship || 'Self',
      dateOfBirth: p.dateOfBirth || '',
      gender: p.gender || '',
      bloodGroup: p.bloodGroup || 'O+ Positive',
      governmentId: {
        type: p.governmentId?.type || 'Aadhaar',
        number: p.governmentId?.number || '',
        verificationStatus: p.governmentId?.verificationStatus || 'Not Verified',
        verifiedBy: p.governmentId?.verifiedBy || '',
        verificationMethod: p.governmentId?.verificationMethod || '',
        verificationTimestamp: p.governmentId?.verificationTimestamp || '',
        maskedDisplay: p.governmentId?.maskedDisplay || '',
      },
      medical: {
        chronicDiseases: p.medical?.chronicDiseases || [],
        disabilities: p.medical?.disabilities || [],
        specialAssistanceRequired: !!p.medical?.specialAssistanceRequired,
        diabetes: !!p.medical?.diabetes,
        heartDisease: !!p.medical?.heartDisease,
        hypertension: !!p.medical?.hypertension,
        asthma: !!p.medical?.asthma,
        epilepsy: !!p.medical?.epilepsy,
        physicalDisability: !!p.medical?.physicalDisability,
        visualImpairment: !!p.medical?.visualImpairment,
        hearingImpairment: !!p.medical?.hearingImpairment,
        wheelchairRequired: !!p.medical?.wheelchairRequired,
        pregnant: !!p.medical?.pregnant,
        regularMedication: !!p.medical?.regularMedication,
        medicationDetails: p.medical?.medicationDetails || '',
        knownAllergies: p.medical?.knownAllergies || '',
        doctorName: p.medical?.doctorName || '',
        doctorContact: p.medical?.doctorContact || '',
        otherNotes: p.medical?.otherNotes || '',
      },
      mobile: p.mobile || '',
      emergencyContact: {
        name: p.emergencyContact?.name || '',
        relationship: p.emergencyContact?.relationship || '',
        phone: p.emergencyContact?.phone || '',
        notes: p.emergencyContact?.notes || '',
      },
      address: {
        houseFlatNumber: p.address?.houseFlatNumber || '',
        buildingSociety: p.address?.buildingSociety || '',
        streetRoad: p.address?.streetRoad || '',
        areaLocality: p.address?.areaLocality || '',
        villageTownCity: p.address?.villageTownCity || '',
        talukaTehsil: p.address?.talukaTehsil || '',
        district: p.address?.district || '',
        state: p.address?.state || '',
        country: p.address?.country || '',
        pinCode: p.address?.pinCode || '',
      },
      preferredLanguage: p.preferredLanguage || 'English',
      nationality: p.nationality || 'Indian',
      audit: {
        createdAt: p.audit?.createdAt || new Date().toISOString(),
        updatedAt: p.audit?.updatedAt || new Date().toISOString(),
        createdBy: p.audit?.createdBy || 'System',
        updatedBy: p.audit?.updatedBy || 'System',
      }
    })) : [];

    const snanBookings = journey.snanBookings ? journey.snanBookings.map((b: any) => ({
      ghatName: b.ghatName,
      date: b.date,
      timeSlot: b.timeSlot,
      bookingCode: b.bookingCode,
      isValid: b.isValid !== false,
      invalidMsg: b.invalidMsg || null,
    })) : [];

    const darshanBookings = journey.darshanBookings ? journey.darshanBookings.map((b: any) => ({
      templeName: b.templeName,
      date: b.date,
      timeSlot: b.timeSlot,
      bookingCode: b.bookingCode,
      isValid: b.isValid !== false,
      invalidMsg: b.invalidMsg || null,
    })) : [];

    const journeyMetadata = {
      exitZone: journey.journeyMetadata?.exitZone || '',
      category: journey.journeyMetadata?.category || journey.journeyType || 'Individual',
      purpose: journey.journeyMetadata?.purpose || [],
      arrivalStation: journey.journeyMetadata?.arrivalStation || journey.arrivalPoint || '',
      departurePoint: journey.journeyMetadata?.departurePoint || '',
      sector: journey.journeyMetadata?.sector || '',
      zone: journey.journeyMetadata?.zone || '',
      route: journey.journeyMetadata?.route || '',
      batch: journey.journeyMetadata?.batch || '',
      expectedArrivalDate: journey.journeyMetadata?.expectedArrivalDate || journey.startDate || '',
      expectedArrivalTime: journey.journeyMetadata?.expectedArrivalTime || '',
      expectedDepartureDate: journey.journeyMetadata?.expectedDepartureDate || journey.endDate || '',
      expectedDepartureTime: journey.journeyMetadata?.expectedDepartureTime || '',
    };

    const timelineEvents = journey.timelineEvents ? journey.timelineEvents.map((t: any) => ({
      eventId: t.eventId,
      timestamp: t.timestamp,
      eventType: t.eventType,
      relatedAssetId: t.relatedAssetId || null,
      status: t.status,
      audit: {
        createdAt: t.audit?.createdAt || new Date().toISOString(),
        updatedAt: t.audit?.updatedAt || new Date().toISOString(),
        createdBy: t.audit?.createdBy || 'System',
        updatedBy: t.audit?.updatedBy || 'System',
      }
    })) : [];

    // Check if journey exists in database to update, or create a new one
    const existingJourney = await prisma.journey.findFirst({
      where: { journeyId: journey.id || journey.journeyId }
    });

    let resultJourney;
    if (existingJourney) {
      resultJourney = await prisma.journey.update({
        where: { id: existingJourney.id },
        data: {
          registrationNumber: journey.registrationNumber || existingJourney.registrationNumber,
          permitNumber: journey.permitNumber || existingJourney.permitNumber,
          vehiclePassId: journey.vehiclePassId || existingJourney.vehiclePassId,
          emergencySheetId: journey.emergencySheetId || existingJourney.emergencySheetId,
          qrCode: journey.qrCode || existingJourney.qrCode,
          registrationTimestamp: journey.registrationTimestamp || existingJourney.registrationTimestamp,
          journeyName: journey.journeyName || existingJourney.journeyName,
          journeyType: journey.journeyType || existingJourney.journeyType,
          journeyStatus: journey.journeyStatus || existingJourney.journeyStatus,
          startDate: journey.startDate || existingJourney.startDate,
          endDate: journey.endDate || existingJourney.endDate,
          arrivalMode: journey.arrivalMode || existingJourney.arrivalMode,
          arrivalPoint: journey.arrivalPoint || existingJourney.arrivalPoint,
          accommodation,
          vehicleInfo,
          primaryRegistrantId: journey.primaryRegistrantId || existingJourney.primaryRegistrantId,
          emergencyContacts: journey.emergencyContacts || existingJourney.emergencyContacts,
          pilgrimCount: journey.pilgrimCount || existingJourney.pilgrimCount,
          pilgrims,
          selectedGhats: journey.selectedGhats || existingJourney.selectedGhats,
          selectedTemples: journey.selectedTemples || existingJourney.selectedTemples,
          snanBookings,
          darshanBookings,
          journeyPlannerData: journey.journeyPlannerData ? JSON.parse(JSON.stringify(journey.journeyPlannerData)) : null,
          journeyProgress: journey.journeyProgress || existingJourney.journeyProgress,
          journeyMetadata,
          timelineEvents,
        }
      });
    } else {
      resultJourney = await prisma.journey.create({
        data: {
          journeyId: journey.id || journey.journeyId || `JNY-${Math.floor(100000 + Math.random() * 900000)}`,
          registrationNumber: journey.registrationNumber || 'MK-' + Math.floor(100000 + Math.random() * 900000),
          permitNumber: journey.permitNumber || '',
          vehiclePassId: journey.vehiclePassId || '',
          emergencySheetId: journey.emergencySheetId || '',
          qrCode: journey.qrCode || '',
          registrationTimestamp: journey.registrationTimestamp || new Date().toISOString(),
          journeyName: journey.journeyName || `${user.fullName}'s Journey`,
          journeyType: journey.journeyType || 'Individual',
          journeyStatus: journey.journeyStatus || 'Journey Registered',
          startDate: journey.startDate || '',
          endDate: journey.endDate || '',
          arrivalMode: journey.arrivalMode || '',
          arrivalPoint: journey.arrivalPoint || '',
          accommodation,
          vehicleInfo,
          primaryRegistrantId: journey.primaryRegistrantId || '',
          emergencyContacts: journey.emergencyContacts || '',
          pilgrimCount: journey.pilgrimCount || 1,
          pilgrims,
          selectedGhats: journey.selectedGhats || [],
          selectedTemples: journey.selectedTemples || [],
          snanBookings,
          darshanBookings,
          journeyPlannerData: journey.journeyPlannerData ? JSON.parse(JSON.stringify(journey.journeyPlannerData)) : null,
          journeyProgress: journey.journeyProgress || 0,
          journeyMetadata,
          timelineEvents,
          userId: user.id,
        }
      });
    }

    return NextResponse.json({ success: true, journey: resultJourney });
  } catch (error: any) {
    console.error('Save journey API error:', error);
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 });
  }
}
