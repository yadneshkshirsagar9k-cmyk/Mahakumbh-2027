'use client';

/**
 * @file Profile Page
 * @description Renders the user profile containing details, government ID, uploads,
 * emergency contacts, and language preferences. Upgraded to use editable CitizenProfile.
 */

import { useState, useRef, useEffect } from 'react';
import { useAuthStore } from '@/store/auth-store';
import { useJourneyStore } from '@/store/journey-store';
import { User, Mail, Phone, MapPin, ShieldCheck, FileText, Globe, Upload, Activity, Briefcase, Calendar } from 'lucide-react';
import { compressImage } from '@/utils/image-compressor';
import { cn } from '@/utils/cn';
import { CollapsibleSection } from '@/components/ui/collapsible-section';
import { calculateProfileCompletion } from '@/utils/profile-completion';
import { formatAddress } from '@/types/citizen.types';
import { GOVERNMENT_PORTAL_ENABLED } from '@/config/features';

export default function ProfilePage() {
  const { user, language, setLanguage } = useAuthStore();
  const { citizenProfile, updateCitizenProfile, journey } = useJourneyStore();
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [localProfile, setLocalProfile] = useState<any>(null);
  const [langPreference, setLangPreference] = useState(language);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => {
    if (citizenProfile && !localProfile) {
      setLocalProfile(JSON.parse(JSON.stringify(citizenProfile)));
    }
  }, [citizenProfile, localProfile]);

  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  if (!mounted || !user || !citizenProfile || !localProfile) return null;

  const handleLanguageChange = (val: string) => {
    setLangPreference(val);
  };

  const handleSaveProfile = () => {
    if (!localProfile) return;
    setIsSaving(true);
    
    updateCitizenProfile(localProfile);
    setLanguage(langPreference);
    
    setTimeout(() => {
      setIsSaving(false);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 2000);
    }, 600);
  };

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      try {
        const base64 = await compressImage(e.target.files[0]);
        setLocalProfile({ ...localProfile, photo: base64 });
      } catch (err) {
        console.error("Failed to compress image", err);
      }
    }
  };

  // Profile completion calculation
  const completion = calculateProfileCompletion(citizenProfile, journey?.vehicleInfo, journey?.accommodation, !!journey);
  const completionPercent = completion.percentage;
  
  // Check for unsaved changes
  const hasChanges = JSON.stringify(localProfile) !== JSON.stringify(citizenProfile) || langPreference !== language;

  // Address helper
  const handleAddressChange = (field: string, value: string) => {
    setLocalProfile({
      ...localProfile,
      address: { ...localProfile.address, [field]: value }
    });
  };

  // Emergency contact helper
  const handleEmergencyChange = (field: string, value: string) => {
    setLocalProfile({
      ...localProfile,
      emergencyContacts: {
        ...localProfile.emergencyContacts,
        primary: { ...localProfile.emergencyContacts.primary, [field]: value }
      }
    });
  };

  // Government ID helper
  const primaryId = citizenProfile.governmentIds.length > 0 ? citizenProfile.governmentIds[0] : null;

  return (
    <div className="space-y-6 pb-24">
      {/* Header */}
      <div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <h1 className="text-xl font-extrabold text-[#111827] font-[var(--font-heading)]">
              Citizen Profile
            </h1>
          </div>
          {completionPercent < 100 && (
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-[#6B7280] hidden sm:inline">Profile Completion:</span>
              <div className="w-24 sm:w-32 h-2.5 bg-gray-200 rounded-full overflow-hidden">
                <div 
                  className={cn("h-full transition-all duration-500", completionPercent > 80 ? "bg-[#2E7D32]" : "bg-[#F59E0B]")} 
                  style={{ width: `${completionPercent}%` }}
                />
              </div>
              <span className="text-xs font-black text-[#111827]">{completionPercent}%</span>
            </div>
          )}
        </div>
        <p className="text-xs text-[#6B7280] mt-1">
          Manage your verified credentials, address verification details, and local preferences.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Avatar & Account Summary */}
        <div className="space-y-6">
          <div className="bg-white rounded-xl border border-[#E5E7EB] p-5 shadow-sm space-y-4">
            <div className="text-center space-y-3">
              <div className="relative w-20 h-20 mx-auto rounded-full bg-[#005BAC] text-white flex items-center justify-center font-extrabold text-2xl border-4 border-[#E5E7EB] shadow-inner overflow-hidden">
                {localProfile.photo ? (
                  <img src={localProfile.photo} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  localProfile.fullName.charAt(0).toUpperCase()
                )}
                
                {/* Profile Photo Indicator */}
                <div 
                  className="absolute bottom-0 right-0 w-6 h-6 rounded-full bg-[#005BAC] border-2 border-white flex items-center justify-center cursor-pointer hover:bg-[#0F4C81]"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <Upload size={10} className="text-white" />
                </div>
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  className="hidden" 
                  accept="image/*"
                  onChange={handlePhotoUpload}
                />
              </div>
              <div>
                <h3 className="text-base font-black text-[#111827] leading-tight">
                  {localProfile.fullName}
                </h3>
                <p className="text-[10px] font-bold text-[#005BAC] uppercase tracking-wider mt-0.5">
                  {localProfile.nationality}
                </p>
              </div>
            </div>

            <div className="space-y-2 pt-3 border-t border-[#E5E7EB] text-[11px] text-[#374151]">
              <div className="flex justify-between">
                <span className="font-semibold">Verification ID:</span>
                <span className="font-mono font-bold text-[#005BAC]">{user.registrationId}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-semibold">Security Clearance:</span>
                <span className="text-[#2E7D32] font-bold uppercase tracking-wider">
                  {localProfile.verification.identityVerification === 'Verified' ? 'APPROVED' : 'PENDING'}
                </span>
              </div>
            </div>
          </div>

          <CollapsibleSection title="Verification Status" icon={<ShieldCheck size={14} className="text-[#2E7D32]" />} defaultOpen={false} badge="Status">
            <div className="space-y-2.5 text-[11px]">
              {[
                { name: 'Identity Verification', status: localProfile.verification.identityVerification, color: localProfile.verification.identityVerification === 'Verified' ? 'text-[#2E7D32] bg-[#F0FDF4] border-[#DCFCE7]' : 'text-[#F59E0B] bg-[#FFFBEB] border-[#FEF3C7]' },
                { name: 'Document Verification', status: localProfile.verification.documentVerification, color: localProfile.verification.documentVerification === 'Verified' ? 'text-[#2E7D32] bg-[#F0FDF4] border-[#DCFCE7]' : 'text-[#F59E0B] bg-[#FFFBEB] border-[#FEF3C7]' },
                { name: 'Registration Status', status: localProfile.verification.registrationStatus, color: localProfile.verification.registrationStatus === 'Verified' ? 'text-[#2E7D32] bg-[#F0FDF4] border-[#DCFCE7]' : 'text-[#F59E0B] bg-[#FFFBEB] border-[#FEF3C7]' },
              ].map((item, idx) => (
                <div key={idx} className="flex justify-between items-center p-2 border border-[#E5E7EB] rounded bg-[#FAFBFC]">
                  <span className="font-semibold text-stone-600">{item.name}</span>
                  <span className={cn('px-2 py-0.5 rounded-full text-[9px] font-bold border uppercase', item.color)}>
                    {item.status}
                  </span>
                </div>
              ))}
            </div>
          </CollapsibleSection>

          <CollapsibleSection title="Pilgrimage Counters" icon={<User size={14} className="text-[#005BAC]" />} defaultOpen={false} badge="Overview">
            <div className="grid grid-cols-2 gap-2 text-center text-xs">
              <div className="p-3 border border-[#E5E7EB] bg-[#FAFBFC] rounded-lg">
                <span className="block text-lg font-black text-[#005BAC]">{journey ? 1 : 0}</span>
                <span className="text-[10px] text-stone-500 font-bold uppercase tracking-wider block mt-1">Active Tours</span>
              </div>
              <div className="p-3 border border-[#E5E7EB] bg-[#FAFBFC] rounded-lg">
                <span className="block text-lg font-black text-[#005BAC]">{journey?.pilgrimCount || 1}</span>
                <span className="text-[10px] text-stone-500 font-bold uppercase tracking-wider block mt-1">Acc. Pilgrims</span>
              </div>
              <div className="p-3 border border-[#E5E7EB] bg-[#FAFBFC] rounded-lg">
                <span className="block text-lg font-black text-[#C62828]">0</span>
                <span className="text-[10px] text-stone-500 font-bold uppercase tracking-wider block mt-1">Active Alerts</span>
              </div>
              <div className="p-3 border border-[#E5E7EB] bg-[#FAFBFC] rounded-lg">
                <span className="block text-lg font-black text-[#F59E0B]">{(journey?.snanBookings.length || 0) + (journey?.darshanBookings.length || 0)}</span>
                <span className="text-[10px] text-stone-500 font-bold uppercase tracking-wider block mt-1">Slot Permits</span>
              </div>
            </div>
          </CollapsibleSection>
        </div>

        {/* Right Column: Details Forms */}
        <div className="lg:col-span-2 space-y-8">
          {/* Personal & Contact Details Card */}
          <div className="bg-white rounded-xl border border-[#E5E7EB] p-6 shadow-sm space-y-6">
            <h3 className="text-sm font-extrabold text-[#005BAC] border-b border-[#E5E7EB] pb-3">
              Personal & Contact Details
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-[#6B7280] uppercase tracking-wide">Full Name</label>
                <div className="flex items-center gap-3 p-3 rounded-lg border border-[#E5E7EB] bg-[#FAFBFC] text-xs focus-within:border-[#005BAC] focus-within:ring-1 focus-within:ring-[#005BAC]/20 transition-all">
                  <User size={14} className="text-[#005BAC]" />
                  <input 
                    type="text" 
                    className="font-semibold text-[#111827] bg-transparent outline-none flex-1 w-full"
                    value={localProfile.fullName}
                    onChange={(e) => setLocalProfile({ ...localProfile, fullName: e.target.value })}
                    placeholder="Enter full name"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-[#6B7280] uppercase tracking-wide">Primary Mobile</label>
                <div className="flex items-center gap-3 p-3 rounded-lg border border-[#E5E7EB] bg-[#FAFBFC] text-xs focus-within:border-[#005BAC] focus-within:ring-1 focus-within:ring-[#005BAC]/20 transition-all">
                  <Phone size={14} className="text-[#005BAC]" />
                  <input 
                    type="tel" 
                    className="font-semibold text-[#111827] bg-transparent outline-none flex-1 w-full"
                    value={localProfile.primaryMobile}
                    onChange={(e) => setLocalProfile({ ...localProfile, primaryMobile: e.target.value })}
                    placeholder="Enter mobile number"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-[#6B7280] uppercase tracking-wide">Email Address</label>
                <div className="flex items-center gap-3 p-3 rounded-lg border border-[#E5E7EB] bg-[#FAFBFC] text-xs focus-within:border-[#005BAC] focus-within:ring-1 focus-within:ring-[#005BAC]/20 transition-all">
                  <Mail size={14} className="text-[#005BAC]" />
                  <input 
                    type="email" 
                    className="font-semibold text-[#111827] bg-transparent outline-none flex-1 w-full"
                    value={localProfile.email}
                    onChange={(e) => setLocalProfile({ ...localProfile, email: e.target.value })}
                    placeholder="Enter email address"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-[#6B7280] uppercase tracking-wide">Date of Birth</label>
                <div className="flex items-center gap-3 p-3 rounded-lg border border-[#E5E7EB] bg-[#FAFBFC] text-xs focus-within:border-[#005BAC] focus-within:ring-1 focus-within:ring-[#005BAC]/20 transition-all">
                  <Calendar size={14} className="text-[#005BAC]" />
                  <input 
                    type="date" 
                    className="font-semibold text-[#111827] bg-transparent outline-none flex-1 w-full uppercase"
                    value={localProfile.dateOfBirth}
                    onChange={(e) => setLocalProfile({ ...localProfile, dateOfBirth: e.target.value })}
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-[#6B7280] uppercase tracking-wide">Gender</label>
                <div className="flex items-center gap-3 p-3 rounded-lg border border-[#E5E7EB] bg-[#FAFBFC] text-xs focus-within:border-[#005BAC] focus-within:ring-1 focus-within:ring-[#005BAC]/20 transition-all">
                  <User size={14} className="text-[#005BAC]" />
                  <select 
                    className="font-semibold text-[#111827] bg-transparent outline-none flex-1 w-full"
                    value={localProfile.gender}
                    onChange={(e) => setLocalProfile({ ...localProfile, gender: e.target.value as any })}
                  >
                    <option value="">Select Gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-[#6B7280] uppercase tracking-wide">Blood Group</label>
                <div className="flex items-center gap-3 p-3 rounded-lg border border-[#E5E7EB] bg-[#FAFBFC] text-xs focus-within:border-[#005BAC] focus-within:ring-1 focus-within:ring-[#005BAC]/20 transition-all">
                  <Activity size={14} className="text-[#005BAC]" />
                  <select 
                    className="font-semibold text-[#111827] bg-transparent outline-none flex-1 w-full"
                    value={localProfile.bloodGroup}
                    onChange={(e) => setLocalProfile({ ...localProfile, bloodGroup: e.target.value })}
                  >
                    <option value="">Select Blood Group</option>
                    <option value="A+">A+</option>
                    <option value="A-">A-</option>
                    <option value="B+">B+</option>
                    <option value="B-">B-</option>
                    <option value="O+">O+</option>
                    <option value="O-">O-</option>
                    <option value="AB+">AB+</option>
                    <option value="AB-">AB-</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1.5 md:col-span-2">
                <label className="text-[10px] font-bold text-[#6B7280] uppercase tracking-wide">Emergency Contact (Primary)</label>
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center gap-3 p-3 rounded-lg border border-[#E5E7EB] bg-[#FAFBFC] text-xs focus-within:border-[#005BAC] focus-within:ring-1 focus-within:ring-[#005BAC]/20 transition-all">
                    <User size={14} className="text-[#005BAC]" />
                    <input 
                      type="text" 
                      className="font-semibold text-[#111827] bg-transparent outline-none flex-1 w-full"
                      value={localProfile.emergencyContacts.primary.name}
                      onChange={(e) => handleEmergencyChange('name', e.target.value)}
                      placeholder="Contact Name"
                    />
                  </div>
                  <div className="flex items-center gap-3 p-3 rounded-lg border border-[#E5E7EB] bg-[#FAFBFC] text-xs focus-within:border-[#005BAC] focus-within:ring-1 focus-within:ring-[#005BAC]/20 transition-all">
                    <Phone size={14} className="text-[#005BAC]" />
                    <input 
                      type="tel" 
                      className="font-semibold text-[#111827] bg-transparent outline-none flex-1 w-full"
                      value={localProfile.emergencyContacts.primary.phone}
                      onChange={(e) => handleEmergencyChange('phone', e.target.value)}
                      placeholder="Contact Number"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <CollapsibleSection title={GOVERNMENT_PORTAL_ENABLED ? "Government Identity & Address" : "Identity & Address"} icon={<ShieldCheck size={14} className="text-[#2E7D32]" />} defaultOpen={true}>
            <div className="grid grid-cols-1 gap-6 pt-2">
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-[#6B7280] uppercase tracking-wide">{GOVERNMENT_PORTAL_ENABLED ? 'Primary Government ID' : 'Primary Identity ID'}</label>
                <div className="flex items-center gap-3 p-3 rounded-lg border border-[#E5E7EB] bg-[#FAFBFC] text-xs focus-within:border-[#2E7D32] focus-within:ring-1 focus-within:ring-[#2E7D32]/20 transition-all">
                  <ShieldCheck size={14} className="text-[#2E7D32]" />
                  <select 
                    className="font-semibold text-[#111827] bg-transparent outline-none w-24"
                    value={primaryId?.type || ''}
                    onChange={(e) => {
                      const type = e.target.value as any;
                      if (!type) return;
                      const newIds = [...(localProfile.governmentIds || [])];
                      if (newIds.length === 0) {
                        newIds.push({ type, number: '', verificationStatus: 'Not Verified', verifiedBy: '', verificationMethod: '', verificationTimestamp: '', maskedDisplay: '' });
                      } else {
                        newIds[0].type = type;
                      }
                      setLocalProfile({ ...localProfile, governmentIds: newIds });
                    }}
                  >
                    <option value="">Select ID</option>
                    <option value="Aadhaar">Aadhaar</option>
                    <option value="Passport">Passport</option>
                    <option value="Driving Licence">Driving Licence</option>
                    <option value="Voter ID">Voter ID</option>
                    <option value="PAN">PAN</option>
                  </select>
                  <span className="text-[#E5E7EB]">|</span>
                  <input 
                    type="text" 
                    className="font-semibold text-[#111827] bg-transparent outline-none flex-1 w-full uppercase"
                    value={primaryId?.number || ''}
                    onChange={(e) => {
                      const newIds = [...(localProfile.governmentIds || [])];
                      if (newIds.length === 0) {
                        newIds.push({ type: 'Aadhaar', number: e.target.value, verificationStatus: 'Not Verified', verifiedBy: '', verificationMethod: '', verificationTimestamp: '', maskedDisplay: '' });
                      } else {
                        newIds[0].number = e.target.value.toUpperCase();
                        newIds[0].maskedDisplay = 'XXXX XXXX ' + e.target.value.slice(-4);
                      }
                      setLocalProfile({ ...localProfile, governmentIds: newIds });
                    }}
                    placeholder="Enter ID Number"
                  />
                  {primaryId?.verificationStatus === 'Verified' && (
                    <span className="text-[9px] text-[#2E7D32] bg-[#F0FDF4] border border-[#DCFCE7] px-1.5 py-0.5 rounded font-bold uppercase">Verified</span>
                  )}
                </div>
              </div>

              <div className="space-y-1.5 pt-2">
                <label className="text-[10px] font-bold text-[#6B7280] uppercase tracking-wide">Verification Address</label>
                <div className="space-y-4">
                  <div className="flex items-start gap-3 p-3 rounded-lg border border-[#E5E7EB] bg-[#FAFBFC] text-xs leading-relaxed focus-within:border-[#005BAC] focus-within:ring-1 focus-within:ring-[#005BAC]/20 transition-all">
                    <MapPin size={14} className="text-[#6B7280] shrink-0 mt-0.5" />
                    <input 
                      type="text" 
                      className="font-semibold text-[#111827] bg-transparent outline-none flex-1 w-full"
                      value={localProfile.address.houseFlatNumber}
                      onChange={(e) => handleAddressChange('houseFlatNumber', e.target.value)}
                      placeholder="House / Flat Number"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-start gap-3 p-3 rounded-lg border border-[#E5E7EB] bg-[#FAFBFC] text-xs focus-within:border-[#005BAC] focus-within:ring-1 focus-within:ring-[#005BAC]/20 transition-all">
                      <input 
                        type="text" 
                        className="font-semibold text-[#111827] bg-transparent outline-none flex-1 w-full"
                        value={localProfile.address.villageTownCity}
                        onChange={(e) => handleAddressChange('villageTownCity', e.target.value)}
                        placeholder="Village / Town / City"
                      />
                    </div>
                    <div className="flex items-start gap-3 p-3 rounded-lg border border-[#E5E7EB] bg-[#FAFBFC] text-xs focus-within:border-[#005BAC] focus-within:ring-1 focus-within:ring-[#005BAC]/20 transition-all">
                      <input 
                        type="text" 
                        className="font-semibold text-[#111827] bg-transparent outline-none flex-1 w-full"
                        value={localProfile.address.district}
                        onChange={(e) => handleAddressChange('district', e.target.value)}
                        placeholder="District"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-start gap-3 p-3 rounded-lg border border-[#E5E7EB] bg-[#FAFBFC] text-xs focus-within:border-[#005BAC] focus-within:ring-1 focus-within:ring-[#005BAC]/20 transition-all">
                      <input 
                        type="text" 
                        className="font-semibold text-[#111827] bg-transparent outline-none flex-1 w-full"
                        value={localProfile.address.state}
                        onChange={(e) => handleAddressChange('state', e.target.value)}
                        placeholder="State"
                      />
                    </div>
                    <div className="flex items-start gap-3 p-3 rounded-lg border border-[#E5E7EB] bg-[#FAFBFC] text-xs focus-within:border-[#005BAC] focus-within:ring-1 focus-within:ring-[#005BAC]/20 transition-all">
                      <input 
                        type="text" 
                        className="font-semibold text-[#111827] bg-transparent outline-none flex-1 w-full"
                        value={localProfile.address.pinCode}
                        onChange={(e) => handleAddressChange('pinCode', e.target.value)}
                        placeholder="PIN Code"
                      />
                    </div>
                  </div>
                  {/* Canonical Display */}
                  <div className="text-[10px] text-gray-500 italic px-2">
                    Formatted: {formatAddress(localProfile.address) || 'No address provided'}
                  </div>
                </div>
              </div>
            </div>
          </CollapsibleSection>

          <CollapsibleSection title="Uploaded Verification Documents" icon={<FileText size={14} className="text-[#005BAC]" />} defaultOpen={false} badge={`${
            [
              localProfile.photo,
              localProfile.governmentIds.length > 0 && localProfile.governmentIds[0].number,
              localProfile.signature,
            ].filter(Boolean).length
          } Files`}>
            <div className="space-y-2">
              {[
                localProfile.governmentIds.length > 0 && localProfile.governmentIds[0].number 
                  ? { name: `${localProfile.governmentIds[0].type} Card Front & Back copy`, size: '1.2 MB', date: localProfile.audit.updatedAt.split('T')[0] } 
                  : null,
                localProfile.photo 
                  ? { name: 'Selfie Verification Profile Photo', size: '640 KB', date: localProfile.audit.updatedAt.split('T')[0] } 
                  : null,
                localProfile.signature 
                  ? { name: 'Digital Signature Registration', size: '120 KB', date: localProfile.audit.updatedAt.split('T')[0] } 
                  : null,
              ].filter(Boolean).map((doc: any, idx) => (
                <div key={idx} className="flex items-center justify-between p-2.5 rounded border border-[#E5E7EB] text-xs bg-[#FAFBFC]">
                  <div className="flex items-center gap-2">
                    <FileText size={14} className="text-[#005BAC]" />
                    <span className="font-semibold text-[#374151]">{doc.name}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-[10px] font-semibold text-[#6B7280]">{doc.date}</span>
                    <span className="text-[10px] text-[#6B7280]">{doc.size}</span>
                  </div>
                </div>
              ))}
              {[localProfile.photo, localProfile.governmentIds.length > 0 && localProfile.governmentIds[0].number, localProfile.signature].filter(Boolean).length === 0 && (
                <div className="text-center p-3 text-xs text-stone-500 italic">No verification documents uploaded yet.</div>
              )}
            </div>
          </CollapsibleSection>

          {/* Journey Services & Bookings Summary */}
          {journey && (
            <CollapsibleSection 
              title="Active Journey Services" 
              icon={<MapPin size={14} className="text-[#FF9933]" />} 
              defaultOpen={true}
            >
              <div className="space-y-2">
                {journey.accommodation?.name && (
                  <div className="flex flex-col p-2.5 rounded border border-[#E5E7EB] text-xs bg-[#FAFBFC]">
                    <span className="font-bold text-[#005BAC]">Accommodation</span>
                    <span className="text-[#374151] font-semibold">{journey.accommodation.name}</span>
                    <span className="text-[10px] text-gray-500">Type: {journey.accommodation.type}</span>
                  </div>
                )}
                {journey.vehicleInfo?.vehicleType && (
                  <div className="flex flex-col p-2.5 rounded border border-[#E5E7EB] text-xs bg-[#FAFBFC]">
                    <span className="font-bold text-[#005BAC]">Vehicle Pass</span>
                    <span className="text-[#374151] font-semibold">{journey.vehicleInfo.vehicleType}</span>
                    <span className="text-[10px] text-gray-500">Pass ID: {journey.vehicleInfo.vehiclePassId}</span>
                  </div>
                )}

                {journey.snanBookings?.length > 0 && (
                  <div className="flex flex-col p-2.5 rounded border border-[#E5E7EB] text-xs bg-[#FAFBFC]">
                    <span className="font-bold text-[#005BAC]">Snan Booking</span>
                    <span className="text-[#374151] font-semibold">{journey.snanBookings.length} Slot(s)</span>
                  </div>
                )}
                {journey.darshanBookings?.length > 0 && (
                  <div className="flex flex-col p-2.5 rounded border border-[#E5E7EB] text-xs bg-[#FAFBFC]">
                    <span className="font-bold text-[#005BAC]">Darshan Pass</span>
                    <span className="text-[#374151] font-semibold">{journey.darshanBookings.length} Pass(es)</span>
                  </div>
                )}
                {(!journey.vehicleInfo?.vehicleType && !journey.accommodation?.type && !journey.snanBookings?.length && !journey.darshanBookings?.length) && (
                  <div className="text-center p-3 text-xs text-stone-500 italic">No active journey services booked yet.</div>
                )}
              </div>
            </CollapsibleSection>
          )}

          {/* Language Preference */}
          <div className="bg-white rounded-xl border border-[#E5E7EB] p-5 shadow-sm space-y-4">
            <h3 className="text-sm font-extrabold text-[#005BAC] border-b border-[#E5E7EB] pb-2">
              Portal Preferences
            </h3>

            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-2 text-xs">
                <Globe size={14} className="text-[#005BAC]" />
                <span className="font-semibold text-[#374151]">Language Preference</span>
                <select
                  value={langPreference}
                  onChange={(e) => handleLanguageChange(e.target.value)}
                  className="px-2 py-1 rounded border border-[#E5E7EB] bg-white outline-none text-[#111827]"
                >
                  <option value="English">English</option>
                  <option value="Hindi">हिन्दी (Hindi)</option>
                  <option value="Marathi">मराठी (Marathi)</option>
                </select>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Floating Save Bar */}
      <div 
        className={`fixed bottom-0 left-0 right-0 lg:left-[280px] bg-white border-t border-[#E5E7EB] p-4 px-6 lg:px-8 shadow-[0_-10px_15px_-3px_rgba(0,0,0,0.05)] z-40 flex justify-between items-center transition-transform duration-300 ${
          hasChanges || saveSuccess || isSaving ? 'translate-y-0' : 'translate-y-full'
        }`}
      >
        <div>
          <p className="text-sm font-bold text-[#111827]">
            {saveSuccess ? 'Profile Updated' : 'Unsaved Changes'}
          </p>
          <p className="text-xs text-[#6B7280]">
            {saveSuccess ? 'Your details have been saved securely.' : 'Please save your profile changes before leaving.'}
          </p>
        </div>
        <button
          onClick={handleSaveProfile}
          disabled={isSaving || saveSuccess || (!hasChanges && !isSaving && !saveSuccess)}
          className={`px-6 py-2.5 text-xs font-bold uppercase tracking-wider rounded-lg transition-all flex items-center gap-2 ${
            saveSuccess 
              ? 'bg-[#F0FDF4] text-[#2E7D32] border border-[#DCFCE7]' 
              : 'bg-[#005BAC] hover:bg-[#0F4C81] text-white border-none shadow-sm'
          }`}
        >
          {saveSuccess ? (
            <>
              <ShieldCheck size={16} />
              <span>Saved Successfully</span>
            </>
          ) : isSaving ? (
            <>
              <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
              <span>Saving...</span>
            </>
          ) : (
            'Save Changes'
          )}
        </button>
      </div>
    </div>
  );
}
