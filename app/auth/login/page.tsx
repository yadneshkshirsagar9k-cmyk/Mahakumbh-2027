'use client';

/**
 * @file Registration & Login Page
 * @description Official Nashik Mahakumbh Registration and Login Portal.
 * Redesigned using a dynamic configuration-driven registration layout
 * and dynamic login configurations.
 */

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Eye,
  EyeOff,
  Phone,
  Lock,
  User,
  Mail,
  MapPin,
  ChevronDown,
  AlertCircle,
  CheckCircle2,
  Globe,
  ShieldCheck,
  Plus,
  Trash2,
  Upload,
  RefreshCw,
} from 'lucide-react';
import { Navbar } from '@/components/layout/navbar';
import { Footer } from '@/components/layout/footer';
import { useAuthStore } from '@/store/auth-store';
import { cn } from '@/utils/cn';
import { REGISTRATION_CONFIGS } from '@/config/registration-config';
import { AuthService } from '@/services/auth.service';

// ============================================================
// CONSTANTS & TRANSLATIONS
// ============================================================

const FORM_TRANSLATIONS: Record<string, Record<string, string>> = {
  en: {
    'individual': 'Individual Pilgrim',
    'family': 'Family Group',
    'tour_operator': 'Tour Operator / Travels',
    'nri': 'Non-Resident Indian (NRI)',
    'foreign': 'Foreign National',
    'reg_category': 'Pilgrim Registration Category',
    'fullName': 'Full Name',
    'Family Head Full Name': 'Family Head Full Name',
    'mobile': 'Mobile Number',
    'Primary Mobile Number': 'Primary Mobile Number',
    'email': 'Email Address',
    'Family Head Email Address': 'Family Head Email Address',
    'state': 'State / UT',
    'district': 'District',
    'address': 'Full Address',
    'aadhaar': 'Aadhaar Card Number',
    'gender': 'Gender',
    'dob': 'Date of Birth',
    'emergencyContact': 'Emergency Mobile No.',
    'password': 'Create Password',
    'Select State / UT': 'Select State / UT',
    'Select Gender': 'Select Gender',
    'Male': 'Male',
    'Female': 'Female',
    'Other': 'Other',
    'nriMobile': 'NRI Mobile Number',
    'passportNumber': 'Passport Number ID',
    'Passport Copy PDF/JPG': 'Passport Copy PDF/JPG',
    'countryOfResidence': 'Country Of Residence',
    'operatorName': 'Operator/Agency Name',
    'operatorId': 'Operator Registration ID',
    'licenseNumber': 'License/Registration Number',
    'login_category': 'Login Category',
    'login_mobile': 'Mobile Number',
    'login_nri_id': 'Mobile or Passport Number',
    'login_passport': 'Passport Number',
    'login_op_id': 'Operator Registration ID',
    'login_password': 'Password',
    'login_captcha': 'Security Captcha',
    'placeholder_mobile': 'Enter 10-digit Mobile No.',
    'placeholder_nri': 'Enter mobile or passport number',
    'placeholder_passport': 'Passport Number ID',
    'placeholder_op': 'Enter operator registry ID',
    'placeholder_password': 'Enter Password',
    'placeholder_captcha': 'Enter Code',
    'btn_signin': 'Sign In',
    'btn_signingin': 'Signing In...',
    'forgot_password': 'Forgot Password?',
    'Individual Pilgrim Registration': 'Individual Pilgrim Registration',
    'Register as a single citizen for general darshan and route passes.': 'Register as a single citizen for general darshan and route passes.',
    'Family Pilgrim Registration': 'Family Pilgrim Registration',
    'Register family groups with a single head representative.': 'Register family groups with a single head representative.',
    'Tour Operator Registration': 'Tour Operator Registration',
    'Register as a licensed operator for group booking passes.': 'Register as a licensed operator for group booking passes.',
    'NRI Pilgrim Registration': 'NRI Pilgrim Registration',
    'Register as an NRI for priority clearance and VIP routes.': 'Register as an NRI for priority clearance and VIP routes.',
    'Foreign National Registration': 'Foreign National Registration',
    'Register as a foreign national with passport validation.': 'Register as a foreign national with passport validation.',
  },
  hi: {
    'individual': 'व्यक्तिगत तीर्थयात्री',
    'family': 'पारिवारिक समूह',
    'tour_operator': 'टूर ऑपरेटर / ट्रैवल्स',
    'nri': 'प्रवासी भारतीय (NRI)',
    'foreign': 'विदेशी नागरिक',
    'reg_category': 'तीर्थयात्री पंजीकरण श्रेणी',
    'fullName': 'पूरा नाम',
    'Family Head Full Name': 'परिवार के मुखिया का पूरा नाम',
    'mobile': 'मोबाइल नंबर',
    'Primary Mobile Number': 'प्राथमिक मोबाइल नंबर',
    'email': 'ईमेल पता',
    'Family Head Email Address': 'परिवार के मुखिया का ईमेल पता',
    'state': 'राज्य / केंद्र शासित प्रदेश',
    'district': 'जिला',
    'address': 'पूरा पता',
    'aadhaar': 'आधार कार्ड नंबर',
    'gender': 'लिंग',
    'dob': 'जन्म तिथि',
    'emergencyContact': 'आपातकालीन मोबाइल नंबर',
    'password': 'पासवर्ड बनाएं',
    'Select State / UT': 'राज्य / केंद्र शासित प्रदेश चुनें',
    'Select Gender': 'लिंग चुनें',
    'Male': 'पुरुष',
    'Female': 'महिला',
    'Other': 'अन्य',
    'nriMobile': 'एनआरआई मोबाइल नंबर',
    'passportNumber': 'पासपोर्ट नंबर आईडी',
    'Passport Copy PDF/JPG': 'पासपोर्ट प्रति पीडीएफ/जेपीजी',
    'countryOfResidence': 'निवास का देश',
    'operatorName': 'ऑपरेटर/एजेंसी का नाम',
    'operatorId': 'ऑपरेटर पंजीकरण आईडी',
    'licenseNumber': 'लाइसेंस/पंजीकरण संख्या',
    'login_category': 'लॉगिन श्रेणी',
    'login_mobile': 'मोबाइल नंबर',
    'login_nri_id': 'मोबाइल या पासपोर्ट नंबर',
    'login_passport': 'पासपोर्ट नंबर',
    'login_op_id': 'ऑपरेटर पंजीकरण आईडी',
    'login_password': 'पासवर्ड',
    'login_captcha': 'सुरक्षा कैप्चा',
    'placeholder_mobile': '10-अंकीय मोबाइल नंबर दर्ज करें',
    'placeholder_nri': 'मोबाइल या पासपोर्ट नंबर दर्ज करें',
    'placeholder_passport': 'पासपोर्ट नंबर आईडी',
    'placeholder_op': 'ऑपरेटर रजिस्ट्री आईडी दर्ज करें',
    'placeholder_password': 'पासवर्ड दर्ज करें',
    'placeholder_captcha': 'कोड दर्ज करें',
    'btn_signin': 'साइन इन करें',
    'btn_signingin': 'साइन इन हो रहा है...',
    'forgot_password': 'पासवर्ड भूल गए?',
    'Individual Pilgrim Registration': 'व्यक्तिगत तीर्थयात्री पंजीकरण',
    'Register as a single citizen for general darshan and route passes.': 'सामान्य दर्शन और मार्ग पास के लिए एक नागरिक के रूप में पंजीकरण करें।',
    'Family Pilgrim Registration': 'पारिवारिक तीर्थयात्री पंजीकरण',
    'Register family groups with a single head representative.': 'एक ही मुखिया प्रतिनिधि के साथ पारिवारिक समूहों को पंजीकृत करें।',
    'Tour Operator Registration': 'टूर ऑपरेटर पंजीकरण',
    'Register as a licensed operator for group booking passes.': 'समूह बुकिंग पास के लिए एक लाइसेंस प्राप्त ऑपरेटर के रूप में पंजीकरण करें।',
    'NRI Pilgrim Registration': 'एनआरआई तीर्थयात्री पंजीकरण',
    'Register as an NRI for priority clearance and VIP routes.': 'प्राथमिकता मंजूरी और वीआईपी मार्गों के लिए एनआरआई के रूप में पंजीकरण करें।',
    'Foreign National Registration': 'विदेशी नागरिक पंजीकरण',
    'Register as a foreign national with passport validation.': 'पासपोर्ट सत्यापन के साथ विदेशी नागरिक के रूप में पंजीकरण करें।',
  },
  mr: {
    'individual': 'वैयक्तिक यात्रेकरू',
    'family': 'कौटुंबिक गट',
    'tour_operator': 'टूर ऑपरेटर / ट्रॅव्हल्स',
    'nri': 'अनिवासी भारतीय (NRI)',
    'foreign': 'परदेशी नागरिक',
    'reg_category': 'यात्रेकरू नोंदणी प्रवर्ग',
    'fullName': 'पूर्ण नाव',
    'Family Head Full Name': 'कुटुंब प्रमुखाचे पूर्ण नाव',
    'mobile': 'मोबाईल नंबर',
    'Primary Mobile Number': 'प्राथमिक मोबाईल नंबर',
    'email': 'ईमेल पत्ता',
    'Family Head Email Address': 'कुटुंब प्रमुखाचा ईमेल पत्ता',
    'state': 'राज्य / केंद्रशासित प्रदेश',
    'district': 'जिल्हा',
    'address': 'पूर्ण पत्ता',
    'aadhaar': 'आधार कार्ड नंबर',
    'gender': 'लिंग',
    'dob': 'जन्म तारीख',
    'emergencyContact': 'आणीबाणी मोबाईल नंबर',
    'password': 'पासवर्ड तयार करा',
    'Select State / UT': 'राज्य / केंद्रशासित प्रदेश निवडा',
    'Select Gender': 'लिंग निवडा',
    'Male': 'पुरुष',
    'Female': 'महिला',
    'Other': 'इतर',
    'nriMobile': 'एनआरआय मोबाईल नंबर',
    'passportNumber': 'पासपोर्ट नंबर आयडी',
    'Passport Copy PDF/JPG': 'पासपोर्ट प्रत पीडीएफ/जेपीजी',
    'countryOfResidence': 'रहिवासी देश',
    'operatorName': 'ऑपरेटर/एजन्सीचे नाव',
    'operatorId': 'ऑपरेटर नोंदणी आयडी',
    'licenseNumber': 'परवाना/नोंदणी क्रमांक',
    'login_category': 'लॉगिन प्रवर्ग',
    'login_mobile': 'मोबाईल नंबर',
    'login_nri_id': 'मोबाईल किंवा पासपोर्ट क्रमांक',
    'login_passport': 'पासपोर्ट क्रमांक',
    'login_op_id': 'ऑपरेटर नोंदणी आयडी',
    'login_password': 'पासवर्ड',
    'login_captcha': 'सुरक्षा कॅप्चा',
    'placeholder_mobile': '१०-अंकी मोबाईल नंबर प्रविष्ट करा',
    'placeholder_nri': 'मोबाईल किंवा पासपोर्ट क्रमांक प्रविष्ट करा',
    'placeholder_passport': 'पासपोर्ट नंबर आयडी',
    'placeholder_op': 'ऑपरेटर नोंदणी आयडी प्रविष्ट करा',
    'placeholder_password': 'पासवर्ड प्रविष्ट करा',
    'placeholder_captcha': 'कोड प्रविष्ट करा',
    'btn_signin': 'लॉगिन करा',
    'btn_signingin': 'लॉगिन होत आहे...',
    'forgot_password': 'पासवर्ड विसरलात?',
    'Individual Pilgrim Registration': 'वैयक्तिक यात्रेकरू नोंदणी',
    'Register as a single citizen for general darshan and route passes.': 'सामान्य दर्शन आणि मार्ग पाससाठी वैयक्तिक नागरिक म्हणून नोंदणी करा.',
    'Family Pilgrim Registration': 'कौटुंबिक यात्रेकरू नोंदणी',
    'Register family groups with a single head representative.': 'कुटुंब प्रमुखासह कुटुंबाची नोंदणी करा.',
    'Tour Operator Registration': 'टूर ऑपरेटर नोंदणी',
    'Register as a licensed operator for group booking passes.': 'समूह पाससाठी नोंदणीकृत ऑपरेटर म्हणून नोंदणी करा.',
    'NRI Pilgrim Registration': 'अनिवासी भारतीय नोंदणी',
    'Register as an NRI for priority clearance and VIP routes.': 'अनिवासी भारतीयांसाठी विशेष मार्ग पास नोंदणी.',
    'Foreign National Registration': 'परदेशी नागरिक नोंदणी',
    'Register as a foreign national with passport validation.': 'पासपोर्ट पडताळणीसह परदेशी नागरिकांची नोंदणी.',
  }
};

const LANGUAGES = [
  { code: 'en', label: 'English' },
  { code: 'hi', label: 'हिन्दी' },
  { code: 'mr', label: 'मराठी' },
] as const;

const LOGIN_TYPES = [
  { value: 'indian', label: 'Indian Citizen' },
  { value: 'nri', label: 'NRI Pilgrim' },
  { value: 'foreign', label: 'Foreign National' },
  { value: 'operator', label: 'Tour Operator' },
] as const;

// Helper component for fields wrapping
interface FormFieldProps {
  id: string;
  label: string;
  error?: string;
  required?: boolean;
  children: React.ReactNode;
}

function FormField({ id, label, error, required, children }: FormFieldProps) {
  return (
    <div className="space-y-1.5">
      <label htmlFor={id} className="block text-xs font-semibold text-[#363636] tracking-wide">
        {label}
        {required && <span className="text-red-600 ml-0.5">*</span>}
      </label>
      {children}
      {error && (
        <p id={`${id}-error`} role="alert" className="flex items-center gap-1 text-[11px] text-red-600 font-medium">
          <AlertCircle size={11} className="shrink-0" />
          {error}
        </p>
      )}
    </div>
  );
}

const inputClass = (hasError?: boolean) =>
  cn(
    'w-full px-3 py-2.5 text-sm rounded border outline-none transition-all duration-150',
    'bg-white text-[#1A1A1A] placeholder:text-[#B0B0B0]',
    'focus:ring-2 focus:ring-[#022B5D]/20 focus:border-[#022B5D]',
    hasError
      ? 'border-red-400 focus:ring-red-100 focus:border-red-500'
      : 'border-[#DFDFDF] hover:border-[#B0B0B0]'
  );

// ============================================================
// DYNAMIC REGISTRATION FORM
// ============================================================

function RegistrationForm({ language }: { language: 'en' | 'hi' | 'mr' }) {
  const [category, setCategory] = useState<string>('individual');
  const [showPassword, setShowPassword] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const router = useRouter();
  const { setIsAuthenticated, setUser } = useAuthStore();

  const config = REGISTRATION_CONFIGS[category] || REGISTRATION_CONFIGS.individual;

  const labelT = (text: string) => {
    return FORM_TRANSLATIONS[language]?.[text] || text;
  };

  // Build schema dynamically based on active configuration
  const buildSchema = () => {
    const shape: Record<string, any> = {};
    config.fields.forEach((field) => {
      let validator = z.string();
      if (field.required) {
        validator = validator.min(1, `${field.label} is required`);
      } else {
        validator = validator.optional() as any;
      }

      if (field.type === 'email' && field.required) {
        validator = z.string().email('Enter a valid email address');
      }

      if (field.validation?.regex) {
        validator = validator.regex(field.validation.regex, field.validation.message || 'Invalid format') as any;
      }

      if (field.validation?.min && field.required) {
        validator = validator.min(field.validation.min, field.validation.message || `${field.label} is too short`) as any;
      }

      shape[field.name] = validator;
    });

    // Add support for family members if family is chosen
    if (category === 'family') {
      shape.members = z.array(
        z.object({
          name: z.string().min(1, 'Member name is required'),
          age: z.string().min(1, 'Age is required'),
          gender: z.string().min(1, 'Gender is required'),
          relationship: z.string().min(1, 'Relationship is required'),
          aadhaar: z.string().regex(/^\d{12}$/, 'Aadhaar must be exactly 12 digits'),
        })
      );
    }

    return z.object(shape);
  };

  const currentSchema = buildSchema();
  type DynamicFormData = any;

  const {
    register,
    handleSubmit,
    control,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<DynamicFormData>({
    resolver: zodResolver(currentSchema),
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'members',
  });

  const watchPassword = watch('password');

  const getPasswordStrength = (pwd: string) => {
    if (!pwd) return { score: 0, label: '', color: '' };
    let score = 0;
    if (pwd.length >= 8) score++;
    if (/[A-Z]/.test(pwd)) score++;
    if (/[0-9]/.test(pwd)) score++;
    if (/[^a-zA-Z0-9]/.test(pwd)) score++;
    if (score <= 2) return { score, label: 'Weak', color: 'bg-red-400' };
    if (score === 3) return { score, label: 'Fair', color: 'bg-amber-400' };
    return { score, label: 'Strong', color: 'bg-emerald-500' };
  };

  const strength = getPasswordStrength(watchPassword || '');
  const [globalError, setGlobalError] = useState<string | null>(null);

  const onSubmit = async (data: DynamicFormData) => {
    try {
      setGlobalError(null);
      await AuthService.register({
        ...data,
        category,
      });
      setSubmitted(true);
    } catch (err: any) {
      console.error(err);
      setGlobalError(err.message || 'Registration failed. Please try again.');
    }
  };

  if (submitted) {
    return (
      <div className="flex flex-col items-center justify-center h-full py-16 gap-4 text-center">
        <div className="w-14 h-14 rounded-full bg-emerald-50 border border-emerald-200 flex items-center justify-center">
          <CheckCircle2 size={28} className="text-emerald-500 animate-bounce" />
        </div>
        <h3 className="text-base font-bold text-[#022B5D]">Registration Successful!</h3>
        <p className="text-xs text-[#6E6E6E] max-w-sm leading-relaxed">
          Your pilgrim profile has been created successfully. Please use the login form to sign in.
        </p>
      </div>
    );
  }

  return (
    <form key={category} onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
      {/* Category Dropdown */}
      <FormField id="category-selector" label={labelT('reg_category')} required>
        <div className="relative">
          <select
            id="category-selector"
            value={category}
            onChange={(e) => {
              setCategory(e.target.value);
            }}
            className={cn(inputClass(false), 'appearance-none pr-8 font-semibold text-[#022B5D] bg-white outline-none')}
          >
            <option value="individual">{labelT('individual')}</option>
            <option value="family">{labelT('family')}</option>
            <option value="tour_operator">{labelT('tour_operator')}</option>
            <option value="nri">{labelT('nri')}</option>
            <option value="foreign">{labelT('foreign')}</option>
          </select>
          <ChevronDown size={14} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#B0B0B0] pointer-events-none" />
        </div>
      </FormField>

      <div className="border-t border-[#EFEFEF] pt-2">
        <h4 className="text-xs font-bold text-[#F26F21]">{labelT(config.title)}</h4>
        <p className="text-[10px] text-[#8A8A8A] mt-0.5">{labelT(config.subtitle)}</p>
      </div>

      {/* Dynamic Fields Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
        {config.fields.map((field) => {
          const errorMsg = errors[field.name]?.message as string | undefined;

          if (field.type === 'select') {
            return (
              <FormField key={field.name} id={`reg-${field.name}`} label={labelT(field.label)} error={errorMsg} required={field.required}>
                <div className="relative">
                  <select
                    id={`reg-${field.name}`}
                    className={cn(inputClass(!!errorMsg), 'appearance-none pr-8 bg-white outline-none')}
                    {...register(field.name)}
                  >
                    <option value="">{labelT('Select ' + field.label)}</option>
                    {field.options?.map((opt) => (
                      <option key={opt} value={opt}>{labelT(opt)}</option>
                    ))}
                  </select>
                  <ChevronDown size={14} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#B0B0B0] pointer-events-none" />
                </div>
              </FormField>
            );
          }

          if (field.type === 'file') {
            return (
              <FormField key={field.name} id={`reg-${field.name}`} label={labelT(field.label)} error={errorMsg} required={field.required}>
                <div className="relative border border-dashed border-[#DFDFDF] hover:border-[#022B5D] rounded p-3 text-center cursor-pointer transition-colors">
                  <input
                    id={`reg-${field.name}`}
                    type="file"
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    onChange={(e) => {
                      if (e.target.files && e.target.files.length > 0) {
                        setValue(field.name, e.target.files[0].name);
                      }
                    }}
                  />
                  <div className="flex flex-col items-center gap-1">
                    <Upload size={16} className="text-[#F26F21]" />
                    <span className="text-[11px] font-semibold text-[#525252]">
                      {watch(field.name) || labelT('Passport Copy PDF/JPG')}
                    </span>
                  </div>
                </div>
              </FormField>
            );
          }

          if (field.type === 'password') {
            return (
              <div key={field.name} className="col-span-1 md:col-span-2">
                <FormField id={`reg-${field.name}`} label={labelT(field.label)} error={errorMsg} required={field.required}>
                  <div className="relative">
                    <Lock size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#B0B0B0]" />
                    <input
                      id={`reg-${field.name}`}
                      type={showPassword ? 'text' : 'password'}
                      placeholder={labelT(field.placeholder || '')}
                      className={cn(inputClass(!!errorMsg), 'pl-9 pr-9')}
                      {...register(field.name)}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#B0B0B0]"
                    >
                      {showPassword ? <EyeOff size={14} /> : <Eye size={14} />}
                    </button>
                  </div>
                  {watchPassword && (
                    <div className="mt-1.5 space-y-1">
                      <div className="flex gap-1">
                        {[1, 2, 3, 4, 5].map((i) => (
                          <div
                            key={i}
                            className={cn(
                              'h-0.5 flex-1 rounded-full transition-all duration-300',
                              i <= strength.score ? strength.color : 'bg-[#EFEFEF]'
                            )}
                          />
                        ))}
                      </div>
                      <p className="text-[10px] text-[#6E6E6E]">
                        Strength: <span className="font-semibold">{strength.label}</span>
                      </p>
                    </div>
                  )}
                </FormField>
              </div>
            );
          }

          return (
            <FormField key={field.name} id={`reg-${field.name}`} label={labelT(field.label)} error={errorMsg} required={field.required}>
              <div className="relative">
                <input
                  id={`reg-${field.name}`}
                  type={field.type}
                  placeholder={labelT(field.placeholder || '')}
                  className={inputClass(!!errorMsg)}
                  {...register(field.name)}
                />
              </div>
            </FormField>
          );
        })}
      </div>

      {/* Dynamic Family Members Section */}
      {category === 'family' && (
        <div className="border border-[#DFDFDF] rounded-lg p-4 space-y-3 bg-[#FFFDF5]/40 mt-3 col-span-1 md:col-span-2">
          <div className="flex items-center justify-between border-b border-[#EFEFEF] pb-2">
            <h5 className="text-xs font-bold text-[#022B5D]">Additional Family Members</h5>
            <button
              type="button"
              onClick={() => append({ name: '', age: '', gender: 'Male', relationship: 'Spouse', aadhaar: '' })}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded bg-[#022B5D] hover:bg-[#011732] text-white text-[11px] font-bold transition-all"
            >
              <Plus size={12} />
              Add Member
            </button>
          </div>

          {fields.length === 0 ? (
            <p className="text-[11px] text-[#8A8A8A] text-center py-4">No family members added. Tap button above to add.</p>
          ) : (
            <div className="space-y-3">
              {fields.map((fieldItem, idx) => (
                <div key={fieldItem.id} className="relative p-3 border border-[#EFEFEF] rounded bg-white space-y-2.5">
                  <button
                    type="button"
                    onClick={() => remove(idx)}
                    className="absolute top-2 right-2 p-1 text-[#8A8A8A] hover:text-red-500 transition-colors"
                  >
                    <Trash2 size={13} />
                  </button>
                  <p className="text-[10px] font-bold text-[#F26F21]">Member #{idx + 1}</p>
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      placeholder="Name"
                      className={cn(inputClass(!!(errors.members as any)?.[idx]?.name), 'py-1.5 text-xs')}
                      {...register(`members.${idx}.name` as const)}
                    />
                    <input
                      placeholder="Age"
                      type="number"
                      className={cn(inputClass(!!(errors.members as any)?.[idx]?.age), 'py-1.5 text-xs')}
                      {...register(`members.${idx}.age` as const)}
                    />
                    <select
                      className={cn(inputClass(!!(errors.members as any)?.[idx]?.gender), 'py-1.5 text-xs')}
                      {...register(`members.${idx}.gender` as const)}
                    >
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                    <input
                      placeholder="Relationship"
                      className={cn(inputClass(!!(errors.members as any)?.[idx]?.relationship), 'py-1.5 text-xs')}
                      {...register(`members.${idx}.relationship` as const)}
                    />
                    <input
                      placeholder="Aadhaar No."
                      maxLength={12}
                      className={cn(inputClass(!!(errors.members as any)?.[idx]?.aadhaar), 'py-1.5 text-xs col-span-2')}
                      {...register(`members.${idx}.aadhaar` as const)}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {globalError && (
        <div className="p-3 bg-red-50 border border-red-200 rounded flex items-start gap-2 text-red-700 text-sm">
          <AlertCircle size={16} className="shrink-0 mt-0.5" />
          <p>{globalError}</p>
        </div>
      )}

      {/* Submit Button */}
      <button
        type="submit"
        disabled={isSubmitting}
        className={cn(
          'w-full py-3 rounded text-sm font-bold uppercase tracking-wider text-white transition-all duration-200 mt-2',
          'bg-[#022B5D] hover:bg-[#011732] active:scale-[0.99]',
          'disabled:opacity-60 disabled:cursor-not-allowed'
        )}
      >
        {isSubmitting ? 'Registering...' : 'Register / Create Identity'}
      </button>
    </form>
  );
}

// ============================================================
// DYNAMIC LOGIN FORM
// ============================================================

function LoginForm({ language }: { language: 'en' | 'hi' | 'mr' }) {
  const [authMode, setAuthMode] = useState<'citizen' | 'government'>('citizen');
  const [loginType, setLoginType] = useState<'indian' | 'nri' | 'foreign' | 'operator'>('indian');
  const [showPassword, setShowPassword] = useState(false);
  const [captchaValue, setCaptchaValue] = useState('------');
  const [submitted, setSubmitted] = useState(false);
  const router = useRouter();
  const { setIsAuthenticated, setUser } = useAuthStore();

  useEffect(() => {
    setCaptchaValue(Math.floor(100000 + Math.random() * 900000).toString());
  }, []);

  const buildLoginSchema = () => {
    const shape: Record<string, any> = {
      password: z.string().min(1, 'Password is required'),
      captcha: z.string().min(1, 'Captcha verification is required'),
    };

    if (authMode === 'government') {
      shape.employeeId = z.string().min(4, 'Enter Employee ID');
      shape.role = z.string().min(1, 'Select Role Badge');
    } else {
      if (loginType === 'indian') {
        shape.mobile = z
          .string()
          .length(10, 'Mobile number must be exactly 10 digits')
          .regex(/^[6-9]\d{9}$/, 'Enter a valid Indian mobile number');
      } else if (loginType === 'nri') {
        shape.identifier = z.string().min(6, 'Enter passport or mobile number');
      } else if (loginType === 'foreign') {
        shape.passportNumber = z.string().min(6, 'Enter valid passport number');
      } else if (loginType === 'operator') {
        shape.operatorId = z.string().min(4, 'Enter operator registration ID');
      }
    }

    return z.object(shape);
  };

  const loginSchema = buildLoginSchema();
  type LoginFormData = any;

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    if (data.captcha.trim() !== captchaValue) {
      setError('captcha', { message: 'Incorrect captcha. Please try again.' });
      return;
    }

    try {
      if (authMode === 'government') {
        // Mock government login session
        setIsAuthenticated(true);
        setUser({ 
          id: data.employeeId || 'gov-123', 
          name: 'Gov Official', 
          role: data.role,
          phone: '',
          email: '',
          registrationType: 'employee',
          registrationId: data.employeeId || 'gov-123'
        });
        setSubmitted(true);
        
        let dest = '/government/dashboard';
        if (data.role === 'ICCC Officer') dest = '/government/iccc';
        else if (data.role === 'Police Officer') dest = '/government/workspaces/police';
        else if (data.role === 'Health Officer') dest = '/government/workspaces/health';
        else if (data.role === 'Volunteer Coordinator') dest = '/government/workspaces/volunteer';
        else if (data.role === 'Citizen Services Officer') dest = '/government/administration';
        
        setTimeout(() => router.push(dest), 1200);
      } else {
        const session = await AuthService.login({
          ...data,
          type: loginType,
        });
        setIsAuthenticated(true);
        setUser(session.user);
        setSubmitted(true);
        setTimeout(() => router.push('/account/dashboard'), 1200);
      }
    } catch (err: any) {
      setError('password', { message: err.message || 'Authentication failed' });
    }
  };

  const reloadCaptcha = () => {
    setCaptchaValue(Math.floor(100000 + Math.random() * 900000).toString());
  };

  const labelT = (text: string) => {
    return FORM_TRANSLATIONS[language]?.[text] || text;
  };

  if (submitted) {
    return (
      <div className="flex flex-col items-center justify-center h-full py-16 gap-4 text-center">
        <div className="w-14 h-14 rounded-full bg-emerald-50 border border-emerald-200 flex items-center justify-center">
          <CheckCircle2 size={28} className="text-emerald-500 animate-bounce" />
        </div>
        <h3 className="text-base font-bold text-[#022B5D]">Login Successful!</h3>
        <p className="text-xs text-[#6E6E6E]">Redirecting to your dashboard...</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Dual Access Toggle */}
      <div className="flex bg-[#F5F7FA] p-1 rounded-lg border border-[#DFDFDF] mb-4">
        <button
          onClick={() => setAuthMode('citizen')}
          className={cn('flex-1 py-2 text-sm font-bold rounded-md transition-all', authMode === 'citizen' ? 'bg-[#F26F21] text-white shadow' : 'text-[#525252] hover:text-[#022B5D]')}
        >
          Citizen Login
        </button>
        <button
          onClick={() => setAuthMode('government')}
          className={cn('flex-1 py-2 text-sm font-bold rounded-md transition-all', authMode === 'government' ? 'bg-[#022B5D] text-white shadow' : 'text-[#525252] hover:text-[#022B5D]')}
        >
          Government Login
        </button>
      </div>

      <form key={authMode + loginType} onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
        {authMode === 'citizen' && (
          <>
            <div>
              <p className="text-xs font-semibold text-[#363636] mb-2">{labelT('login_category')} <span className="text-red-600">*</span></p>
              <div className="grid grid-cols-2 gap-1 bg-[#F5F7FA] p-1 rounded border border-[#DFDFDF] text-xs font-semibold">
                {[
                  { value: 'indian', labelKey: 'login_mobile' },
                  { value: 'nri', labelKey: 'login_nri_id' },
                  { value: 'foreign', labelKey: 'login_passport' },
                  { value: 'operator', labelKey: 'login_op_id' },
                ].map((t) => (
                  <button
                    key={t.value}
                    type="button"
                    onClick={() => {
                      setLoginType(t.value as any);
                      reloadCaptcha();
                    }}
                    className={cn(
                      'py-2 px-2.5 text-center transition-all duration-150 rounded select-none cursor-pointer',
                      loginType === t.value
                        ? 'bg-[#F26F21] text-white shadow-sm'
                        : 'bg-transparent text-[#525252] hover:text-[#022B5D]'
                    )}
                  >
                    {labelT(t.labelKey)}
                  </button>
                ))}
              </div>
            </div>

            {loginType === 'indian' && (
              <FormField id="login-mobile" label={labelT('login_mobile')} error={errors.mobile?.message as string} required>
                <div className="relative">
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 flex items-center gap-1 pointer-events-none">
                    <span className="text-sm">🇮🇳</span>
                    <span className="text-[11px] font-bold text-[#525252]">+91</span>
                  </div>
                  <input
                    id="login-mobile"
                    type="tel"
                    placeholder={labelT('placeholder_mobile')}
                    maxLength={10}
                    className={cn(inputClass(!!errors.mobile), 'pl-14')}
                    {...register('mobile')}
                  />
                </div>
              </FormField>
            )}

            {loginType === 'nri' && (
              <FormField id="login-nri-id" label={labelT('login_nri_id')} error={errors.identifier?.message as string} required>
                <div className="relative">
                  <User size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#B0B0B0]" />
                  <input
                    id="login-nri-id"
                    type="text"
                    placeholder={labelT('placeholder_nri')}
                    className={cn(inputClass(!!errors.identifier), 'pl-9')}
                    {...register('identifier')}
                  />
                </div>
              </FormField>
            )}

            {loginType === 'foreign' && (
              <FormField id="login-passport" label={labelT('login_passport')} error={errors.passportNumber?.message as string} required>
                <div className="relative">
                  <User size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#B0B0B0]" />
                  <input
                    id="login-passport"
                    type="text"
                    placeholder={labelT('placeholder_passport')}
                    className={cn(inputClass(!!errors.passportNumber), 'pl-9')}
                    {...register('passportNumber')}
                  />
                </div>
              </FormField>
            )}

            {loginType === 'operator' && (
              <FormField id="login-op-id" label={labelT('login_op_id')} error={errors.operatorId?.message as string} required>
                <div className="relative">
                  <User size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#B0B0B0]" />
                  <input
                    id="login-op-id"
                    type="text"
                    placeholder={labelT('placeholder_op')}
                    className={cn(inputClass(!!errors.operatorId), 'pl-9')}
                    {...register('operatorId')}
                  />
                </div>
              </FormField>
            )}
          </>
        )}

        {authMode === 'government' && (
          <>
            <FormField id="login-emp-id" label="Government Employee ID" error={errors.employeeId?.message as string} required>
              <div className="relative">
                <User size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#B0B0B0]" />
                <input
                  id="login-emp-id"
                  type="text"
                  placeholder="EMP-XXXX"
                  className={cn(inputClass(!!errors.employeeId), 'pl-9')}
                  {...register('employeeId')}
                />
              </div>
            </FormField>
            <FormField id="login-role" label="Role Badge" error={errors.role?.message as string} required>
              <div className="relative">
                <select
                  id="login-role"
                  className={cn(inputClass(!!errors.role), 'appearance-none pr-8 bg-white')}
                  {...register('role')}
                >
                  <option value="">Select Official Role</option>
                  <option value="Super Administrator">Super Administrator</option>
                  <option value="ICCC Officer">ICCC Officer</option>
                  <option value="Police Officer">Police Officer</option>
                  <option value="Health Officer">Health Officer</option>
                  <option value="Volunteer Coordinator">Volunteer Coordinator</option>
                  <option value="Citizen Services Officer">Citizen Services Officer</option>
                </select>
                <ChevronDown size={14} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#B0B0B0] pointer-events-none" />
              </div>
            </FormField>
          </>
        )}

        {/* Password */}
        <FormField id="login-password" label={labelT('login_password')} error={errors.password?.message as string} required>
          <div className="relative">
            <Lock size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#B0B0B0]" />
            <input
              id="login-password"
              type={showPassword ? 'text' : 'password'}
              placeholder={labelT('placeholder_password')}
              className={cn(inputClass(!!errors.password), 'pl-9 pr-9')}
              {...register('password')}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#B0B0B0] hover:text-[#525252]"
            >
              {showPassword ? <EyeOff size={14} /> : <Eye size={14} />}
            </button>
          </div>
        </FormField>

        {/* CAPTCHA */}
        <FormField id="login-captcha" label={labelT('login_captcha')} error={errors.captcha?.message as string} required>
          <div className="flex items-center gap-2">
            <div
              className="flex-shrink-0 px-4 py-2.5 rounded border border-[#DFDFDF] bg-[#F7F7F7] font-mono font-bold text-[#022B5D] text-sm tracking-[0.25em] select-none flex items-center gap-1.5"
              style={{
                backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 2px, rgba(26,58,107,0.03) 2px, rgba(26,58,107,0.03) 4px)',
              }}
            >
              <span>{captchaValue}</span>
              <button type="button" onClick={reloadCaptcha} className="text-[#8A8A8A] hover:text-[#F26F21] ml-1">
                <RefreshCw size={12} className="hover:rotate-180 transition-all duration-300" />
              </button>
            </div>
            <input
              id="login-captcha"
              type="text"
              placeholder={labelT('placeholder_captcha')}
              maxLength={6}
              className={cn(inputClass(!!errors.captcha), 'flex-1')}
              {...register('captcha')}
            />
          </div>
        </FormField>

        {/* Submit */}
        <div className="flex items-center justify-between pt-1">
          <button
            type="submit"
            disabled={isSubmitting}
            className={cn(
              'px-8 py-3 rounded text-sm font-bold uppercase tracking-wider text-white transition-all duration-200 select-none cursor-pointer',
              authMode === 'government' ? 'bg-[#022B5D] hover:bg-[#011732]' : 'bg-[#F26F21] hover:bg-[#D85D14]',
              'active:scale-[0.99] disabled:opacity-60 disabled:cursor-not-allowed'
            )}
          >
            {isSubmitting ? labelT('btn_signingin') : labelT('btn_signin')}
          </button>

          <Link
            href="/forgot-password"
            className="text-xs font-semibold text-[#022B5D] hover:text-[#F26F21] transition-colors duration-150 underline-offset-2 hover:underline"
          >
            {labelT('forgot_password')}
          </Link>
        </div>
      </form>
    </div>
  );
}

// ============================================================
// MAIN PAGE
// ============================================================

export default function AuthPage() {
  const [language, setLanguage] = useState<'en' | 'hi' | 'mr'>('en');

  const CONTENT = {
    en: {
      heroBadge: 'Government of Maharashtra',
      heroTitle: 'Nashik Mahakumbh 2027',
      heroSubtitle: 'Official Simhastha Pilgrim Registration & Login Portal',
      heroNote: 'Managed by Government of Maharashtra • Smart Crowd Management System',
      regTitle: 'Register for Nashik Mahakumbh',
      regSubtitle: 'Create your official Mahakumbh pilgrim identity to access all services.',
      loginTitle: 'Login to Your Account',
      loginSubtitle: 'If you are already a registered pilgrim, sign in here.',
    },
    hi: {
      heroBadge: 'महाराष्ट्र सरकार',
      heroTitle: 'नाशिक महाकुंभ 2027',
      heroSubtitle: 'आधिकारिक सिंहस्थ तीर्थयात्री पंजीकरण एवं लॉगिन पोर्टल',
      heroNote: 'महाराष्ट्र सरकार द्वारा प्रबंधित • स्मार्ट भीड़ प्रबंधन प्रणाली',
      regTitle: 'नाशिक महाकुंभ के लिए पंजीकरण करें',
      regSubtitle: 'सभी सेवाओं तक पहुंचने के लिए अपनी आधिकारिक महाकुंभ तीर्थयात्री पहचान बनाएं।',
      loginTitle: 'अपने खाते में लॉगिन करें',
      loginSubtitle: 'यदि आप पहले से पंजीकृत तीर्थयात्री हैं, तो यहाँ साइन इन करें।',
    },
    mr: {
      heroBadge: 'महाराष्ट्र शासन',
      heroTitle: 'नाशिक महाकुंभ 2027',
      heroSubtitle: 'अधिकृत सिंहस्थ यात्रेकरू नोंदणी आणि लॉगिन पोर्टल',
      heroNote: 'महाराष्ट्र शासनाद्वारे व्यवस्थापित • स्मार्ट गर्दी व्यवस्थापन प्रणाली',
      regTitle: 'नाशिक महाकुंभसाठी नोंदणी करा',
      regSubtitle: 'सर्व सेवांचा लाभ घेण्यासाठी आपली अधिकृत महाकुंभ यात्रेकरू ओळख तयार करा।',
      loginTitle: 'आपल्या खात्यात लॉगिन करा',
      loginSubtitle: 'जर आपण आधीच नोंदणीकृत यात्रेकरू असाल तर येथे साइन इन करा.',
    },
  };

  const T = CONTENT[language];

  return (
    <div className="min-h-screen flex flex-col bg-[#F5F7FA]">
      <Navbar />

      <main className="flex-grow pt-[80px]">
        {/* ===== GOVERNMENT HERO BANNER ===== */}
        <div className="relative bg-[#022B5D] overflow-hidden">
          <div
            className="absolute inset-0 opacity-[0.06]"
            style={{
              backgroundImage: 'repeating-linear-gradient(135deg, #fff 0, #fff 1px, transparent 0, transparent 50%)',
              backgroundSize: '20px 20px',
            }}
            aria-hidden="true"
          />
          <div className="h-1 bg-[#F26F21] w-full" />

          <div className="relative max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-10">
            <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
              <div className="flex items-center gap-5">
                <div className="w-16 h-16 rounded-full border-2 border-[#F26F21]/60 bg-[#F26F21]/10 flex items-center justify-center shrink-0">
                  <span className="text-3xl" role="img" aria-label="Om symbol">🕉️</span>
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold text-[#F26F21] uppercase tracking-[0.2em]">
                      {T.heroBadge}
                    </span>
                    <div className="h-px w-8 bg-[#F26F21]/40" />
                    <span className="text-[10px] font-bold text-[#F26F21]/70 uppercase tracking-wider">
                      Simhastha 2027
                    </span>
                  </div>
                  <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-wide font-[var(--font-heading)]">
                    {T.heroTitle}
                  </h1>
                  <p className="text-sm text-white/70 font-medium">{T.heroSubtitle}</p>
                  <p className="text-[11px] text-white/45 mt-1">{T.heroNote}</p>
                </div>
              </div>

              {/* Language Selector */}
              <div className="flex flex-col items-start lg:items-end gap-1.5 shrink-0">
                <div className="flex items-center gap-1.5">
                  <Globe size={13} className="text-white/50" />
                  <span className="text-[11px] text-white/50 font-semibold uppercase tracking-wider">Select Language</span>
                </div>
                <div className="flex rounded overflow-hidden border border-white/20 text-xs font-bold">
                  {LANGUAGES.map((lang) => (
                    <button
                      key={lang.code}
                      onClick={() => setLanguage(lang.code as typeof language)}
                      className={cn(
                        'px-3.5 py-2 transition-all duration-150',
                        language === lang.code
                          ? 'bg-[#F26F21] text-white'
                          : 'bg-white/10 text-white/70 hover:bg-white/20'
                      )}
                    >
                      {lang.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
          <div className="h-px bg-white/10 w-full" />
        </div>

        {/* ===== TRUST BADGES STRIP ===== */}
        <div className="bg-[#FFFEF8] border-b border-[#EFEFEF]">
          <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 py-2.5 flex flex-wrap items-center justify-center gap-x-6 gap-y-1.5">
            {[
              { icon: '🏛️', text: 'Official Government Portal' },
              { icon: '🔒', text: 'SSL Secured & Encrypted' },
              { icon: '📋', text: 'NIC Certified Platform' },
              { icon: '✅', text: 'WCAG 2.1 Accessible' },
            ].map((badge) => (
              <div key={badge.text} className="flex items-center gap-1.5 text-[11px] text-[#525252] font-medium">
                <span>{badge.icon}</span>
                <span>{badge.text}</span>
              </div>
            ))}
          </div>
        </div>

        {/* ===== MAIN FORM AREA ===== */}
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8 items-start">
            {/* REGISTRATION */}
            <div id="registration-section" className="bg-white rounded-xl border border-[#DFDFDF] shadow-sm overflow-hidden">
              <div className="bg-[#022B5D] px-6 py-4 flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-white/15 flex items-center justify-center">
                  <User size={16} className="text-white" />
                </div>
                <div>
                  <h2 className="text-base font-bold text-white font-[var(--font-heading)]">{T.regTitle}</h2>
                  <p className="text-[11px] text-white/65 mt-0.5">{T.regSubtitle}</p>
                </div>
              </div>
              <div className="p-6">
                <RegistrationForm language={language} />
              </div>
            </div>

            {/* LOGIN */}
            <div className="bg-white rounded-xl border border-[#DFDFDF] shadow-sm overflow-hidden">
              <div className="bg-[#F26F21] px-6 py-4 flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                  <ShieldCheck size={16} className="text-white" />
                </div>
                <div>
                  <h2 className="text-base font-bold text-white font-[var(--font-heading)]">{T.loginTitle}</h2>
                  <p className="text-[11px] text-white/80 mt-0.5">{T.loginSubtitle}</p>
                </div>
              </div>
              <div className="p-6">
                <LoginForm language={language} />
              </div>
              <div className="px-6 pb-6 pt-0">
                <div className="bg-[#F5F7FA] rounded-lg border border-[#EFEFEF] p-4 space-y-2">
                  <p className="text-[11px] font-bold text-[#363636] uppercase tracking-wider">Helpline Numbers</p>
                  <div className="grid grid-cols-2 gap-2 text-[11px] text-[#525252]">
                    <div>
                      <span className="font-semibold block text-[#022B5D]">Pilgrim Helpline</span>
                      <span>1800-266-0000</span>
                    </div>
                    <div>
                      <span className="font-semibold block text-[#022B5D]">Technical Support</span>
                      <span>+91-253-2578500</span>
                    </div>
                    <div>
                      <span className="font-semibold block text-[#022B5D]">Emergency</span>
                      <span>112</span>
                    </div>
                    <div>
                      <span className="font-semibold block text-[#022B5D]">WhatsApp Help</span>
                      <span>+91-9876543210</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8 text-center space-y-1">
            <p className="text-[11px] text-[#8A8A8A] leading-relaxed max-w-2xl mx-auto">
              This is an official portal of the <strong>Government of Maharashtra</strong>. Unauthorized use of this
              system is prohibited. All activities are logged and monitored.
              By registering, you agree to the{' '}
              <Link href="#" className="text-[#022B5D] underline hover:text-[#F26F21]">Terms & Conditions</Link>
              {' '}and{' '}
              <Link href="#" className="text-[#022B5D] underline hover:text-[#F26F21]">Privacy Policy</Link>.
            </p>
            <p className="text-[10px] text-[#B0B0B0]">
              © 2027 Government of Maharashtra. Nashik Mahakumbh Smart Crowd Management Portal. Powered by NIC Maharashtra.
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
