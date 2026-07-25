import { prisma } from '@/lib/prisma';
import { ShieldCheck, XCircle, Users, Calendar, Bus, MapPin, CheckCircle, Info } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function VerifyJourneyPage({ params }: { params: Promise<{ journeyId: string }> }) {
  const { journeyId } = await params;

  // Search by the unique Journey ID assigned to the user
  const journey = await prisma.journey.findUnique({
    where: { journeyId: journeyId }
  });

  if (!journey) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-6 text-center">
        <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center text-red-600 mb-6 shadow-sm">
          <XCircle size={48} />
        </div>
        <h1 className="text-3xl font-black text-gray-900 tracking-tight">Invalid QR Gatepass</h1>
        <p className="text-gray-500 font-semibold mt-2 max-w-md">
          This QR code is either invalid, tampered, or does not exist in the official Mahakumbh registry. Do not permit entry.
        </p>
      </div>
    );
  }

  const isVerified = journey.journeyStatus === 'Journey Ready' || journey.journeyStatus === 'Active';

  return (
    <div className="min-h-screen bg-gray-50 pb-12 font-sans">
      {/* Verification Header */}
      <div className={`pt-12 pb-8 px-6 text-center text-white shadow-md ${isVerified ? 'bg-emerald-600' : 'bg-amber-500'}`}>
        <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center text-white mx-auto mb-4 border-2 border-white/30 backdrop-blur-sm">
          {isVerified ? <ShieldCheck size={40} /> : <Info size={40} />}
        </div>
        <h1 className="text-3xl font-black tracking-tight mb-1">
          {isVerified ? 'VERIFIED PASS' : 'PENDING CLEARANCE'}
        </h1>
        <p className="text-white/90 font-bold uppercase tracking-widest text-xs">
          Official Mahakumbh Checkpoint Portal
        </p>
      </div>

      <div className="max-w-2xl mx-auto px-4 sm:px-6 -mt-6 relative z-10">
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
          
          <div className="p-6 border-b border-gray-100 bg-gray-50/50 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-1">Journey ID</p>
              <p className="font-mono text-lg font-black text-[#005BAC]">{journey.journeyId}</p>
            </div>
            <div className="text-left md:text-right">
              <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-1">Registration No</p>
              <p className="font-mono text-lg font-black text-gray-900">{journey.registrationNumber}</p>
            </div>
          </div>

          <div className="p-6 space-y-6">
            <div>
              <h2 className="text-xl font-black text-gray-900 mb-1">{journey.journeyName}</h2>
              <p className="text-sm font-bold text-gray-500 flex items-center gap-1.5">
                <CheckCircle size={14} className="text-emerald-500" /> Authorized Registry
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-gray-50 border border-gray-100 rounded-xl">
                <div className="flex items-center gap-2 mb-2 text-gray-500">
                  <Calendar size={16} />
                  <span className="text-[10px] font-black uppercase tracking-wider">Valid Dates</span>
                </div>
                <p className="font-bold text-gray-900 text-sm">{journey.startDate} <br/><span className="text-gray-400 text-xs">to</span> {journey.endDate}</p>
              </div>

              <div className="p-4 bg-gray-50 border border-gray-100 rounded-xl">
                <div className="flex items-center gap-2 mb-2 text-gray-500">
                  <Users size={16} />
                  <span className="text-[10px] font-black uppercase tracking-wider">Group Size</span>
                </div>
                <p className="font-bold text-gray-900 text-sm">{journey.pilgrimCount} Devotees</p>
                <p className="text-xs text-gray-500 font-semibold">{journey.journeyType}</p>
              </div>
              
              <div className="p-4 bg-gray-50 border border-gray-100 rounded-xl col-span-2">
                <div className="flex items-center gap-2 mb-2 text-gray-500">
                  <Bus size={16} />
                  <span className="text-[10px] font-black uppercase tracking-wider">Vehicle Clearance</span>
                </div>
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-bold text-gray-900 text-sm uppercase">
                      {/* Note: since vehicleInfo might not be strongly typed here, doing a safe check */}
                      {/* @ts-ignore */}
                      {journey.vehicleInfo?.vehicleNumber || 'Public Transit / None'}
                    </p>
                    <p className="text-xs text-gray-500 font-semibold">
                      {/* @ts-ignore */}
                      {journey.vehicleInfo?.vehicleType || 'No Vehicle Recorded'}
                    </p>
                  </div>
                  {/* @ts-ignore */}
                  {journey.vehicleInfo?.vehicleNumber && (
                    <span className="px-3 py-1 bg-emerald-100 text-emerald-800 rounded-full text-xs font-black uppercase tracking-wider">Cleared</span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 text-center text-xs font-bold text-gray-400">
          <p>Scan handled by Mahakumbh 2027 Security Administration.</p>
          <p>Do not share this link with unauthorized personnel.</p>
        </div>
      </div>
    </div>
  );
}
