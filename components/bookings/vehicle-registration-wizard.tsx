'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldCheck, CheckCircle2, UploadCloud, FileText, Car, AlertCircle, Loader2 } from 'lucide-react';
import { cn } from '@/utils/cn';

interface VehicleRegistrationWizardProps {
  categoryLabel: string;
  categoryCode: string;
  onClose: () => void;
  onSubmit: (data: any) => void;
}

export function VehicleRegistrationWizard({ categoryLabel, categoryCode, onClose, onSubmit }: VehicleRegistrationWizardProps) {
  const [step, setStep] = useState(1);
  const [isVerifying, setIsVerifying] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'uploading' | 'success'>('idle');

  const [formData, setFormData] = useState({
    vehicleNumber: '',
    chassisNumber: '',
    engineNumber: '',
    driverName: '',
    driverMobile: '',
    drivingLicenseNumber: '',
    rcNumber: '',
  });

  const handleVerifyVahan = async () => {
    if (!formData.vehicleNumber || !formData.chassisNumber) {
      alert("Please enter Registration Number and Chassis Number.");
      return;
    }
    setIsVerifying(true);
    // Simulate RTO API Call
    setTimeout(() => {
      setIsVerifying(false);
      setStep(2);
    }, 1500);
  };

  const handleUploads = () => {
    setUploadStatus('uploading');
    // Simulate File Uploads
    setTimeout(() => {
      setUploadStatus('success');
      setTimeout(() => setStep(4), 800);
    }, 2000);
  };

  const handleFinalSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[200] flex items-center justify-center p-4">
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="bg-white rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="p-5 border-b bg-stone-50 flex items-center justify-between">
          <div>
            <h3 className="font-bold text-lg text-stone-900 flex items-center gap-2">
              <ShieldCheck className="text-blue-600" size={20} />
              Vehicle Pass Application
            </h3>
            <p className="text-xs text-stone-500 mt-1 uppercase tracking-wider font-bold">Category: {categoryLabel}</p>
          </div>
          <div className="flex gap-1">
            {[1, 2, 3, 4].map(s => (
              <div key={s} className={cn("h-1.5 w-6 rounded-full transition-colors", step >= s ? "bg-blue-600" : "bg-stone-200")} />
            ))}
          </div>
        </div>

        {/* Wizard Content */}
        <div className="p-6 overflow-y-auto flex-1">
          {/* STEP 1: RTO Verification */}
          {step === 1 && (
            <div className="space-y-5 animate-in fade-in slide-in-from-right-4">
              <div className="bg-blue-50 border border-blue-100 p-3 rounded-lg flex items-start gap-3">
                <ShieldCheck className="text-blue-600 mt-0.5 shrink-0" size={16} />
                <p className="text-xs text-blue-900 leading-relaxed">
                  Enter your vehicle details as per the Registration Certificate (RC). This will be securely verified against the central VAHAN database.
                </p>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1.5 uppercase tracking-wider">Registration Number *</label>
                  <input 
                    value={formData.vehicleNumber} 
                    onChange={e => setFormData({...formData, vehicleNumber: e.target.value.toUpperCase()})}
                    type="text" placeholder="e.g. MH-15-BD-4422" 
                    className="w-full border-2 border-stone-200 focus:border-blue-600 outline-none p-2.5 rounded-xl text-sm font-bold uppercase transition-colors" 
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-stone-700 mb-1.5 uppercase tracking-wider">Chassis Number (Last 5) *</label>
                    <input 
                      value={formData.chassisNumber} 
                      onChange={e => setFormData({...formData, chassisNumber: e.target.value.toUpperCase()})}
                      type="text" placeholder="e.g. 9F8E2" maxLength={5}
                      className="w-full border-2 border-stone-200 focus:border-blue-600 outline-none p-2.5 rounded-xl text-sm font-bold uppercase transition-colors" 
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-stone-700 mb-1.5 uppercase tracking-wider">Engine Number</label>
                    <input 
                      value={formData.engineNumber} 
                      onChange={e => setFormData({...formData, engineNumber: e.target.value.toUpperCase()})}
                      type="text" placeholder="Optional"
                      className="w-full border-2 border-stone-200 focus:border-blue-600 outline-none p-2.5 rounded-xl text-sm font-bold uppercase transition-colors" 
                    />
                  </div>
                </div>
              </div>

              <div className="pt-4 flex gap-3">
                <button type="button" onClick={onClose} className="flex-1 py-3 rounded-xl border-2 border-stone-200 text-stone-700 font-bold text-sm hover:bg-stone-50 transition-colors">Cancel</button>
                <button type="button" onClick={handleVerifyVahan} disabled={isVerifying} className="flex-1 py-3 rounded-xl bg-blue-600 text-white font-bold text-sm hover:bg-blue-700 transition-colors flex items-center justify-center">
                  {isVerifying ? <><Loader2 className="animate-spin mr-2" size={16} /> Verifying...</> : 'Verify Vehicle'}
                </button>
              </div>
            </div>
          )}

          {/* STEP 2: Driver Details */}
          {step === 2 && (
            <div className="space-y-5 animate-in fade-in slide-in-from-right-4">
              <div className="bg-emerald-50 border border-emerald-100 p-3 rounded-lg flex items-center gap-3">
                <CheckCircle2 className="text-emerald-600 shrink-0" size={20} />
                <p className="text-xs text-emerald-900 font-bold">
                  Vehicle verified successfully against VAHAN registry.
                </p>
              </div>

              <div className="space-y-4 pt-2">
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1.5 uppercase tracking-wider">Primary Driver Name *</label>
                  <input 
                    value={formData.driverName} 
                    onChange={e => setFormData({...formData, driverName: e.target.value})}
                    type="text" placeholder="Full Name as per License" 
                    className="w-full border-2 border-stone-200 focus:border-blue-600 outline-none p-2.5 rounded-xl text-sm font-bold transition-colors" 
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1.5 uppercase tracking-wider">Driving License Number *</label>
                  <input 
                    value={formData.drivingLicenseNumber} 
                    onChange={e => setFormData({...formData, drivingLicenseNumber: e.target.value.toUpperCase()})}
                    type="text" placeholder="e.g. MH-15-2010-0000000" 
                    className="w-full border-2 border-stone-200 focus:border-blue-600 outline-none p-2.5 rounded-xl text-sm font-bold uppercase transition-colors" 
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1.5 uppercase tracking-wider">Driver Mobile Number *</label>
                  <input 
                    value={formData.driverMobile} 
                    onChange={e => setFormData({...formData, driverMobile: e.target.value.replace(/\D/g, '').slice(0, 10)})}
                    type="tel" placeholder="10-digit mobile number" 
                    className="w-full border-2 border-stone-200 focus:border-blue-600 outline-none p-2.5 rounded-xl text-sm font-bold transition-colors" 
                  />
                </div>
              </div>

              <div className="pt-4 flex gap-3">
                <button type="button" onClick={() => setStep(1)} className="px-5 py-3 rounded-xl border-2 border-stone-200 text-stone-700 font-bold text-sm hover:bg-stone-50 transition-colors">Back</button>
                <button type="button" onClick={() => {
                  if(!formData.driverName || !formData.drivingLicenseNumber || formData.driverMobile.length < 10) {
                    alert("Please fill all driver details correctly.");
                    return;
                  }
                  setStep(3);
                }} className="flex-1 py-3 rounded-xl bg-blue-600 text-white font-bold text-sm hover:bg-blue-700 transition-colors">
                  Continue to Documents
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: Document Uploads */}
          {step === 3 && (
            <div className="space-y-5 animate-in fade-in slide-in-from-right-4">
               <h4 className="font-extrabold text-stone-900 text-lg">Upload Required Documents</h4>
               <p className="text-xs text-stone-500 leading-relaxed">
                 Please provide clear photos or scanned copies of the mandatory transit documents.
               </p>

               <div className="space-y-4">
                 {/* Mock Upload Box 1 */}
                 <div className="border-2 border-dashed border-stone-200 rounded-xl p-6 text-center hover:bg-stone-50 transition-colors group cursor-pointer relative overflow-hidden">
                    {uploadStatus === 'success' ? (
                      <div className="flex flex-col items-center gap-2 text-emerald-600">
                         <FileText size={32} />
                         <span className="text-xs font-bold">RC_Document.pdf Uploaded</span>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center gap-2 text-stone-400 group-hover:text-blue-600 transition-colors">
                         <UploadCloud size={32} />
                         <span className="text-xs font-bold uppercase tracking-wider">Registration Certificate (RC)</span>
                         <span className="text-[10px]">PDF, JPG or PNG (Max 5MB)</span>
                      </div>
                    )}
                 </div>

                 {/* Mock Upload Box 2 */}
                 <div className="border-2 border-dashed border-stone-200 rounded-xl p-6 text-center hover:bg-stone-50 transition-colors group cursor-pointer relative overflow-hidden">
                    {uploadStatus === 'success' ? (
                      <div className="flex flex-col items-center gap-2 text-emerald-600">
                         <FileText size={32} />
                         <span className="text-xs font-bold">DL_Front.jpg Uploaded</span>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center gap-2 text-stone-400 group-hover:text-blue-600 transition-colors">
                         <UploadCloud size={32} />
                         <span className="text-xs font-bold uppercase tracking-wider">Driving License (DL)</span>
                         <span className="text-[10px]">PDF, JPG or PNG (Max 5MB)</span>
                      </div>
                    )}
                 </div>
               </div>

               <div className="pt-4 flex gap-3">
                <button type="button" onClick={() => setStep(2)} className="px-5 py-3 rounded-xl border-2 border-stone-200 text-stone-700 font-bold text-sm hover:bg-stone-50 transition-colors" disabled={uploadStatus === 'uploading'}>Back</button>
                <button type="button" onClick={handleUploads} disabled={uploadStatus === 'uploading' || uploadStatus === 'success'} className="flex-1 py-3 rounded-xl bg-stone-900 text-white font-bold text-sm hover:bg-black transition-colors flex items-center justify-center">
                  {uploadStatus === 'uploading' ? <><Loader2 className="animate-spin mr-2" size={16} /> Securely Uploading...</> : uploadStatus === 'success' ? 'Verified & Uploaded' : 'Upload & Verify'}
                </button>
              </div>
            </div>
          )}

          {/* STEP 4: Review and Submit */}
          {step === 4 && (
            <form onSubmit={handleFinalSubmit} className="space-y-5 animate-in fade-in slide-in-from-right-4">
              <div className="bg-stone-50 border border-stone-200 rounded-xl p-5 space-y-4">
                 <div className="flex justify-between items-center pb-3 border-b border-stone-200">
                    <span className="text-xs text-stone-500 font-bold uppercase">Vehicle Number</span>
                    <span className="text-sm text-stone-900 font-extrabold">{formData.vehicleNumber}</span>
                 </div>
                 <div className="flex justify-between items-center pb-3 border-b border-stone-200">
                    <span className="text-xs text-stone-500 font-bold uppercase">Driver Name</span>
                    <span className="text-sm text-stone-900 font-bold">{formData.driverName}</span>
                 </div>
                 <div className="flex justify-between items-center">
                    <span className="text-xs text-stone-500 font-bold uppercase">Documents</span>
                    <span className="text-xs text-emerald-600 bg-emerald-50 px-2 py-1 rounded font-bold">Verified</span>
                 </div>
              </div>

              <div className="flex items-start gap-3 bg-amber-50 p-3 rounded-lg border border-amber-100">
                 <input type="checkbox" required className="mt-1" id="declaration" />
                 <label htmlFor="declaration" className="text-xs text-amber-900 leading-relaxed cursor-pointer">
                    I declare that the information provided is true and correct. I understand that false information will lead to cancellation of the vehicle transit pass and potential legal action.
                 </label>
              </div>

              <div className="pt-4 flex gap-3">
                <button type="button" onClick={() => setStep(3)} className="px-5 py-3 rounded-xl border-2 border-stone-200 text-stone-700 font-bold text-sm hover:bg-stone-50 transition-colors">Edit</button>
                <button type="submit" className="flex-1 py-3 rounded-xl bg-emerald-600 text-white font-bold text-sm hover:bg-emerald-700 transition-colors shadow-lg shadow-emerald-600/20">
                  Submit Application
                </button>
              </div>
            </form>
          )}

        </div>
      </motion.div>
    </div>
  );
}
