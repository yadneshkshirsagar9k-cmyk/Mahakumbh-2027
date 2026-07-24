'use client';

/**
 * @file Manage Pilgrims Page
 * @description Accompanying pilgrims list table integrated with the unified Journey Registration store.
 * Upgraded to use full PilgrimProfile data model.
 */

import { useState } from 'react';
import { useAuthStore } from '@/store/auth-store';
import { useJourneyStore } from '@/store/journey-store';
import { createDefaultPilgrimProfile, type PilgrimProfile } from '@/types/citizen.types';
import { generatePilgrimId } from '@/utils/registration-ids';
import { calculateAge, validatePhone, validateAadhaar, validatePassport } from '@/utils/validation';
import { Users, Search, Trash2, Plus, Info, Upload, Edit } from 'lucide-react';
import { cn } from '@/utils/cn';
import { compressImageToDataUrl } from '@/utils/image-compression';

export default function ManagePilgrimsPage() {
  const { user } = useAuthStore();
  const { journey, addPilgrim, removePilgrim } = useJourneyStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Form State
  const [formData, setFormData] = useState<PilgrimProfile>(createDefaultPilgrimProfile(''));

  if (!user) return null;

  if (!journey) {
    return (
      <div className="bg-white border border-[#E5E7EB] rounded-xl p-8 shadow-sm text-center space-y-4">
        <Info size={28} className="mx-auto text-amber-500" />
        <h2 className="text-lg font-bold text-[#111827]">No Registered Journey Found</h2>
        <p className="text-xs text-[#6B7280]">Please register your Mahakumbh Journey first before managing pilgrims.</p>
      </div>
    );
  }

  const openForm = (pilgrimToEdit?: PilgrimProfile) => {
    if (pilgrimToEdit) {
      setFormData({ ...pilgrimToEdit });
      setEditingId(pilgrimToEdit.pilgrimId);
    } else {
      setFormData(createDefaultPilgrimProfile(''));
      setEditingId(null);
    }
    setIsAdding(true);
  };

  const handleAddPilgrimSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.fullName || !formData.dateOfBirth || !formData.mobile || !formData.governmentId.number) {
      alert('Please fill out all mandatory fields.');
      return;
    }
    
    // Validations
    if (!validatePhone(formData.mobile).valid) {
      alert(validatePhone(formData.mobile).message);
      return;
    }
    
    if (formData.governmentId.type === 'Aadhaar' && !validateAadhaar(formData.governmentId.number).valid) {
      alert(validateAadhaar(formData.governmentId.number).message);
      return;
    }
    
    if (formData.nationality === 'Foreign National' && formData.governmentId.type !== 'Passport') {
      alert('Passport is mandatory for Foreign Nationals.');
      return;
    }

    if (formData.governmentId.type === 'Passport' && !validatePassport(formData.governmentId.number).valid) {
      alert(validatePassport(formData.governmentId.number).message);
      return;
    }

    if (editingId) {
      // It's an update, handled directly in the store through updatePilgrim, 
      // but here we only have add/remove, so we'll remove old and add new,
      // or we can implement updatePilgrim in store. We added updatePilgrim in journey-store.
      useJourneyStore.getState().updatePilgrim(editingId, formData);
    } else {
      // It's a new pilgrim
      const newId = generatePilgrimId();
      addPilgrim({ ...formData, pilgrimId: newId });
    }

    setIsAdding(false);
  };

  const handleDeletePilgrim = (pid: string, pName: string) => {
    if (confirm(`Are you sure you want to remove ${pName} from this journey?`)) {
      removePilgrim(pid);
    }
  };

  const filteredMembers = journey.pilgrims.filter((m) =>
    m.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    m.governmentId.maskedDisplay.toLowerCase().includes(searchQuery.toLowerCase()) ||
    m.pilgrimId.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6 text-left">
      {/* Title */}
      <div>
        <h1 className="text-xl font-extrabold text-[#111827] font-[var(--font-heading)]">
          Manage Pilgrims / Accompanying Tourist
        </h1>
        <p className="text-xs text-[#6B7280]">
          Review, query, register, or remove pilgrim members attached to this active journey.
        </p>
      </div>

      {isAdding ? (
        <form
          onSubmit={handleAddPilgrimSubmit}
          className="bg-white border border-[#E5E7EB] rounded-xl p-5 shadow-sm space-y-4"
        >
          <h3 className="text-sm font-extrabold text-[#111827] border-b border-[#E5E7EB] pb-2">
            {editingId ? 'Edit Pilgrim Details' : 'Register Accompanying Pilgrim'}
          </h3>
          
          <div className="flex flex-col sm:flex-row gap-4 items-start">
            {/* Mock Photo Uploader */}
            <div className="w-24 h-24 border-2 border-dashed border-[#E5E7EB] bg-white rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-[#005BAC] relative shrink-0">
              {formData.photo ? (
                <img
                  src={formData.photo}
                  alt="Pilgrim preview"
                  className="w-full h-full object-cover rounded-lg"
                />
              ) : (
                <>
                  <Upload size={20} className="text-[#6B7280] mb-1" />
                  <span className="text-[8px] text-[#6B7280] font-bold uppercase text-center px-1">Upload Photo</span>
                </>
              )}
              <input
                type="file"
                accept="image/*"
                onChange={async (e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    try {
                      const compressedUrl = await compressImageToDataUrl(file);
                      setFormData(prev => ({ ...prev, photo: compressedUrl }));
                    } catch (err) {
                      console.error('Failed to compress photo', err);
                    }
                  }
                }}
                className="absolute inset-0 opacity-0 cursor-pointer"
              />
            </div>

            <div className="flex-grow grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-xs w-full">
              <div className="space-y-1">
                <label className="font-bold text-[#374151] block">Full Name *</label>
                <input
                  type="text"
                  placeholder="e.g. Ramesh Patil"
                  value={formData.fullName}
                  onChange={(e) => setFormData(prev => ({ ...prev, fullName: e.target.value }))}
                  className="w-full p-2.5 border border-[#E5E7EB] rounded text-[#111827] bg-white outline-none"
                  required
                />
              </div>
              <div className="space-y-1">
                <label className="font-bold text-[#374151] block">Relationship *</label>
                <select
                  value={formData.relationship}
                  onChange={(e) => setFormData(prev => ({ ...prev, relationship: e.target.value as any }))}
                  className="w-full p-2.5 border border-[#E5E7EB] rounded text-[#111827] bg-white outline-none"
                >
                  <option value="Self">Self</option>
                  <option value="Spouse">Spouse</option>
                  <option value="Father">Father</option>
                  <option value="Mother">Mother</option>
                  <option value="Son">Son</option>
                  <option value="Daughter">Daughter</option>
                  <option value="Brother">Brother</option>
                  <option value="Sister">Sister</option>
                  <option value="Relative">Relative</option>
                  <option value="Friend">Friend</option>
                  <option value="Group Member">Group Member</option>
                </select>
              </div>
              <div className="space-y-1">
                <label className="font-bold text-[#374151] block">Date of Birth *</label>
                <input
                  type="date"
                  value={formData.dateOfBirth}
                  onChange={(e) => setFormData(prev => ({ ...prev, dateOfBirth: e.target.value }))}
                  className="w-full p-2.5 border border-[#E5E7EB] rounded text-[#111827] bg-white outline-none"
                  required
                />
              </div>
              <div className="space-y-1">
                <label className="font-bold text-[#374151] block">Gender *</label>
                <select
                  value={formData.gender}
                  onChange={(e) => setFormData(prev => ({ ...prev, gender: e.target.value as any }))}
                  className="w-full p-2.5 border border-[#E5E7EB] rounded text-[#111827] bg-white outline-none font-semibold"
                >
                  <option value="">Select Gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div className="space-y-1">
                <label className="font-bold text-[#374151] block">Nationality</label>
                <select
                  value={formData.nationality}
                  onChange={(e) => setFormData(prev => ({ ...prev, nationality: e.target.value as any }))}
                  className="w-full p-2.5 border border-[#E5E7EB] rounded text-[#111827] bg-white outline-none font-semibold"
                >
                  <option value="Indian Citizen">Indian Citizen</option>
                  <option value="Foreign National">Foreign National</option>
                </select>
              </div>
              <div className="space-y-1 flex gap-2 items-end">
                <div className="w-1/3 space-y-1">
                  <label className="font-bold text-[#374151] block">ID Type *</label>
                  <select
                    value={formData.governmentId.type}
                    onChange={(e) => setFormData(prev => ({ ...prev, governmentId: { ...prev.governmentId, type: e.target.value as any } }))}
                    className="w-full p-2.5 border border-[#E5E7EB] rounded text-[#111827] bg-white outline-none"
                  >
                    <option value="Aadhaar">Aadhaar</option>
                    <option value="Passport">Passport</option>
                    <option value="Driving Licence">DL</option>
                    <option value="Voter ID">Voter ID</option>
                  </select>
                </div>
                <div className="w-2/3 space-y-1">
                  <label className="font-bold text-[#374151] block">ID Number *</label>
                  <input
                    type="text"
                    value={formData.governmentId.number}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      governmentId: { 
                        ...prev.governmentId, 
                        number: e.target.value.toUpperCase(),
                        maskedDisplay: 'XXXX XXXX ' + e.target.value.slice(-4)
                      }
                    }))}
                    className="w-full p-2.5 border border-[#E5E7EB] rounded text-[#111827] bg-white outline-none"
                    required
                  />
                </div>
              </div>
              <div className="space-y-1">
                <label className="font-bold text-[#374151] block">Mobile Number *</label>
                <input
                  type="tel"
                  placeholder="Mobile"
                  value={formData.mobile}
                  onChange={(e) => setFormData(prev => ({ ...prev, mobile: e.target.value }))}
                  className="w-full p-2.5 border border-[#E5E7EB] rounded text-[#111827] bg-white outline-none"
                  required
                />
              </div>
              <div className="space-y-1">
                <label className="font-bold text-[#374151] block">Emergency Contact Name</label>
                <input
                  type="text"
                  placeholder="Emergency Contact Name"
                  value={formData.emergencyContact.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, emergencyContact: { ...prev.emergencyContact, name: e.target.value } }))}
                  className="w-full p-2.5 border border-[#E5E7EB] rounded text-[#111827] bg-white outline-none"
                />
              </div>
              <div className="space-y-1">
                <label className="font-bold text-[#374151] block">Emergency Contact Number</label>
                <input
                  type="tel"
                  placeholder="Emergency Contact Number"
                  value={formData.emergencyContact.phone}
                  onChange={(e) => setFormData(prev => ({ ...prev, emergencyContact: { ...prev.emergencyContact, phone: e.target.value } }))}
                  className="w-full p-2.5 border border-[#E5E7EB] rounded text-[#111827] bg-white outline-none"
                />
              </div>
              <div className="space-y-1">
                <label className="font-bold text-[#374151] block">Village / Town / City</label>
                <input
                  type="text"
                  value={formData.address.villageTownCity}
                  onChange={(e) => setFormData(prev => ({ ...prev, address: { ...prev.address, villageTownCity: e.target.value } }))}
                  className="w-full p-2.5 border border-[#E5E7EB] rounded text-[#111827] bg-white outline-none"
                />
              </div>
              <div className="space-y-1">
                <label className="font-bold text-[#374151] block">State *</label>
                <input
                  type="text"
                  value={formData.address.state}
                  onChange={(e) => setFormData(prev => ({ ...prev, address: { ...prev.address, state: e.target.value } }))}
                  className="w-full p-2.5 border border-[#E5E7EB] rounded text-[#111827] bg-white outline-none"
                  required
                />
              </div>
              <div className="space-y-1">
                <label className="font-bold text-[#374151] block">Blood Group *</label>
                <select
                  value={formData.bloodGroup}
                  onChange={(e) => setFormData(prev => ({ ...prev, bloodGroup: e.target.value }))}
                  className="w-full p-2.5 border border-[#E5E7EB] rounded text-[#111827] bg-white outline-none font-semibold"
                >
                  <option value="">Select</option>
                  <option value="A+ Positive">A+ Positive</option>
                  <option value="B+ Positive">B+ Positive</option>
                  <option value="O+ Positive">O+ Positive</option>
                  <option value="AB+ Positive">AB+ Positive</option>
                  <option value="A- Negative">A- Negative</option>
                  <option value="B- Negative">B- Negative</option>
                  <option value="O- Negative">O- Negative</option>
                </select>
              </div>
            </div>
          </div>

          {/* Medical Flags */}
          <div className="space-y-2 pt-3 border-t border-[#E5E7EB]">
            <span className="text-[10px] font-black uppercase text-[#111827] tracking-wider block">Medical & Assistance Flags</span>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
              {[
                { label: 'Diabetes', key: 'diabetes' },
                { label: 'Heart Disease', key: 'heartDisease' },
                { label: 'Hypertension', key: 'hypertension' },
                { label: 'Asthma', key: 'asthma' },
                { label: 'Epilepsy', key: 'epilepsy' },
                { label: 'Disabled (Divyang)', key: 'physicalDisability' },
                { label: 'Visual Impair.', key: 'visualImpairment' },
                { label: 'Hearing Impair.', key: 'hearingImpairment' },
                { label: 'Wheelchair Req.', key: 'wheelchairRequired' },
                { label: 'Pregnant', key: 'pregnant' },
              ].map((flag) => {
                const isActive = formData.medical[flag.key as keyof typeof formData.medical] as boolean;
                
                return (
                  <label
                    key={flag.key}
                    className={cn(
                      'p-2.5 border rounded-lg flex items-center gap-1.5 cursor-pointer font-bold transition-all text-[9.5px]',
                      isActive
                        ? 'border-red-500 bg-red-50 text-red-800'
                        : 'border-[#E5E7EB] bg-white text-[#374151]'
                    )}
                  >
                    <input
                      type="checkbox"
                      checked={isActive}
                      onChange={(e) => setFormData(prev => ({ 
                        ...prev, 
                        medical: { ...prev.medical, [flag.key]: e.target.checked }
                      }))}
                      className="w-3.5 h-3.5 accent-red-650 shrink-0"
                    />
                    <span>{flag.label}</span>
                  </label>
                );
              })}
            </div>
          </div>

          <div className="flex gap-2 justify-end pt-3 border-t border-[#E5E7EB]">
            <button
              type="button"
              onClick={() => setIsAdding(false)}
              className="px-4 py-2 border border-[#E5E7EB] text-[#374151] rounded font-bold uppercase text-[10px] bg-transparent cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-[#005BAC] hover:bg-[#0F4C81] text-white rounded font-bold uppercase text-[10px] border-none outline-none cursor-pointer"
            >
              {editingId ? 'Save Changes' : 'Save Pilgrim'}
            </button>
          </div>
        </form>
      ) : (
        <div className="bg-white border border-[#E5E7EB] rounded-xl p-5 shadow-sm space-y-4">
          {/* Controls */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <button
              onClick={() => openForm()}
              className="px-4 py-2 bg-[#005BAC] hover:bg-[#0F4C81] text-white text-xs font-bold uppercase tracking-wider rounded flex items-center gap-1 shrink-0 select-none cursor-pointer border-none outline-none"
            >
              <Plus size={14} />
              <span>Add Pilgrim</span>
            </button>

            {/* Search bar */}
            <div className="flex items-center gap-2 max-w-sm w-full">
              <input
                type="text"
                placeholder="Search Accompanying Pilgrims"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-grow p-2 border border-[#E5E7EB] rounded text-xs text-[#111827] bg-white outline-none"
              />
              <button className="px-4 py-2 bg-[#005BAC] hover:bg-[#0F4C81] text-white text-xs font-bold uppercase tracking-wider rounded flex items-center gap-1.5 shrink-0 select-none border-none outline-none">
                <Search size={12} />
                <span>Search</span>
              </button>
            </div>
          </div>

          {/* Alert Banner */}
          <div className="p-3 bg-red-50 border-l-4 border-red-600 text-[11px] text-red-800 font-bold italic flex gap-2 items-center">
            <Info size={14} className="shrink-0" />
            <span>Note : Pilgrims added here are synchronized in real-time under Journey ID: <strong className="font-mono">{journey.id}</strong>.</span>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-[#E5E7EB] bg-[#005BAC] text-white">
                  <th className="p-3 font-bold text-[11px]">Pilgrim ID</th>
                  <th className="p-3 font-bold text-[11px]">Name</th>
                  <th className="p-3 font-bold text-[11px]">Relation</th>
                  <th className="p-3 font-bold text-[11px]">Age</th>
                  <th className="p-3 font-bold text-[11px]">Gov ID</th>
                  <th className="p-3 font-bold text-[11px]">Mobile</th>
                  <th className="p-3 font-bold text-[11px]">Emergency Contact</th>
                  <th className="p-3 font-bold text-[11px] text-center">Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredMembers.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="p-8 text-center text-stone-400 font-semibold leading-relaxed">
                      No Pilgrims registered yet.<br />
                      <span className="text-[10px] text-stone-400/80 font-medium font-sans">Add pilgrims travelling with you.</span>
                    </td>
                  </tr>
                ) : (
                  filteredMembers.map((m, idx) => (
                    <tr
                      key={m.pilgrimId}
                      className="border-b border-[#E5E7EB] hover:bg-[#FAFBFC] transition-all animate-fadeIn"
                    >
                      <td className="p-3 font-bold text-[#374151] font-mono">{m.pilgrimId}</td>
                      <td className="p-3 font-semibold text-[#111827] flex items-center gap-2">
                        {m.photo && (
                          <img
                            src={m.photo}
                            alt="Pilgrim avatar"
                            className="w-6 h-6 rounded-full object-cover border border-[#E5E7EB]"
                          />
                        )}
                        <span>{m.fullName}</span>
                      </td>
                      <td className="p-3 text-[#374151]">{m.relationship}</td>
                      <td className="p-3 text-[#374151]">{m.dateOfBirth ? calculateAge(m.dateOfBirth) : '-'} yrs</td>
                      <td className="p-3 font-mono text-[#374151]">{m.governmentId.maskedDisplay}</td>
                      <td className="p-3 font-semibold text-[#374151]">{m.mobile}</td>
                      <td className="p-3 font-semibold text-[#374151]">{m.emergencyContact.phone || 'N/A'}</td>
                      <td className="p-3 text-center flex justify-center gap-1">
                        <button
                          onClick={() => openForm(m)}
                          className="p-1.5 hover:bg-[#E5E7EB] text-[#374151] rounded transition-all border-none bg-transparent cursor-pointer"
                          title="Edit Pilgrim"
                        >
                          <Edit size={14} />
                        </button>
                        <button
                          onClick={() => handleDeletePilgrim(m.pilgrimId, m.fullName)}
                          className="p-1.5 hover:bg-red-50 text-red-600 rounded transition-all border-none bg-transparent cursor-pointer"
                          title="Delete/Remove Pilgrim"
                        >
                          <Trash2 size={14} />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
