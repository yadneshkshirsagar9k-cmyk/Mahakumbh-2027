/**
 * @file Registration Config
 * @description Centralized configuration definition for Mahakumbh registration types.
 * Driven layout that avoids large switch-case UI structures.
 */

export interface FormFieldConfig {
  name: string;
  label: string;
  type: 'text' | 'tel' | 'email' | 'password' | 'select' | 'date' | 'file';
  placeholder?: string;
  required: boolean;
  options?: string[];
  validation: {
    min?: number;
    max?: number;
    regex?: RegExp;
    message?: string;
  };
}

export interface RegistrationCategoryConfig {
  id: string;
  title: string;
  subtitle: string;
  fields: FormFieldConfig[];
}

export const REGISTRATION_CONFIGS: Record<string, RegistrationCategoryConfig> = {
  individual: {
    id: 'individual',
    title: 'Individual Pilgrim Registration',
    subtitle: 'Register as a single citizen for general darshan and route passes.',
    fields: [
      {
        name: 'fullName',
        label: 'Full Name',
        type: 'text',
        placeholder: 'Enter your full name',
        required: true,
        validation: { min: 2, message: 'Name must be at least 2 characters' }
      },
      {
        name: 'mobile',
        label: 'Mobile Number',
        type: 'tel',
        placeholder: '10-digit mobile number',
        required: true,
        validation: { regex: /^[6-9]\d{9}$/, message: 'Enter a valid Indian mobile number' }
      },
      {
        name: 'email',
        label: 'Email Address',
        type: 'email',
        placeholder: 'name@example.com',
        required: true,
        validation: { message: 'Enter a valid email address' }
      },
      {
        name: 'state',
        label: 'State / UT',
        type: 'select',
        required: true,
        options: [
          'Maharashtra', 'Delhi', 'Uttar Pradesh', 'Gujarat', 'Madhya Pradesh', 
          'Karnataka', 'Tamil Nadu', 'Rajasthan', 'West Bengal', 'Other'
        ],
        validation: {}
      },
      {
        name: 'district',
        label: 'District',
        type: 'text',
        placeholder: 'Enter your district',
        required: true,
        validation: { min: 2 }
      },
      {
        name: 'address',
        label: 'Full Address',
        type: 'text',
        placeholder: 'Enter residential address',
        required: true,
        validation: { min: 10, message: 'Address must be descriptive' }
      },
      {
        name: 'aadhaar',
        label: 'Aadhaar Card Number',
        type: 'text',
        placeholder: '12-digit Aadhaar number',
        required: true,
        validation: { regex: /^\d{12}$/, message: 'Aadhaar must be exactly 12 digits' }
      },
      {
        name: 'gender',
        label: 'Gender',
        type: 'select',
        required: true,
        options: ['Male', 'Female', 'Other'],
        validation: {}
      },
      {
        name: 'dob',
        label: 'Date of Birth',
        type: 'date',
        required: true,
        validation: {}
      },
      {
        name: 'emergencyContact',
        label: 'Emergency Mobile No.',
        type: 'tel',
        placeholder: 'Emergency contact number',
        required: true,
        validation: { regex: /^[6-9]\d{9}$/, message: 'Enter a valid 10-digit number' }
      },
      {
        name: 'password',
        label: 'Create Password',
        type: 'password',
        placeholder: 'Create password',
        required: true,
        validation: { min: 8 }
      }
    ]
  },
  family: {
    id: 'family',
    title: 'Family Pilgrim Registration',
    subtitle: 'Register family groups with a single head representative.',
    fields: [
      {
        name: 'fullName',
        label: 'Family Head Full Name',
        type: 'text',
        placeholder: 'Enter name of family head',
        required: true,
        validation: { min: 2 }
      },
      {
        name: 'mobile',
        label: 'Primary Mobile Number',
        type: 'tel',
        placeholder: 'Primary contact mobile',
        required: true,
        validation: { regex: /^[6-9]\d{9}$/ }
      },
      {
        name: 'email',
        label: 'Family Head Email Address',
        type: 'email',
        placeholder: 'name@example.com',
        required: true,
        validation: {}
      },
      {
        name: 'state',
        label: 'State / UT',
        type: 'select',
        required: true,
        options: ['Maharashtra', 'Delhi', 'Uttar Pradesh', 'Gujarat', 'Madhya Pradesh', 'Other'],
        validation: {}
      },
      {
        name: 'district',
        label: 'District',
        type: 'text',
        placeholder: 'Enter district',
        required: true,
        validation: {}
      },
      {
        name: 'address',
        label: 'Full Address',
        type: 'text',
        placeholder: 'Enter family address',
        required: true,
        validation: {}
      },
      {
        name: 'aadhaar',
        label: 'Family Head Aadhaar No.',
        type: 'text',
        placeholder: '12-digit Aadhaar',
        required: true,
        validation: { regex: /^\d{12}$/ }
      },
      {
        name: 'gender',
        label: 'Gender',
        type: 'select',
        required: true,
        options: ['Male', 'Female', 'Other'],
        validation: {}
      },
      {
        name: 'dob',
        label: 'Date of Birth',
        type: 'date',
        required: true,
        validation: {}
      },
      {
        name: 'emergencyContact',
        label: 'Emergency Mobile No.',
        type: 'tel',
        placeholder: 'Emergency contact',
        required: true,
        validation: { regex: /^[6-9]\d{9}$/ }
      },
      {
        name: 'familySize',
        label: 'Total Family Size',
        type: 'select',
        required: true,
        options: ['2 Members', '3 Members', '4 Members', '5 Members', '6+ Members'],
        validation: {}
      },
      {
        name: 'password',
        label: 'Create Password',
        type: 'password',
        placeholder: 'Create password',
        required: true,
        validation: { min: 8 }
      }
    ]
  },
  tour_operator: {
    id: 'tour_operator',
    title: 'Tour Operator Registration',
    subtitle: 'Register commercial/chartered tours planning routes and slot entries.',
    fields: [
      {
        name: 'companyName',
        label: 'Company / Agency Name',
        type: 'text',
        placeholder: 'Official company name',
        required: true,
        validation: { min: 3 }
      },
      {
        name: 'gstNumber',
        label: 'GST Identification No. (GSTIN)',
        type: 'text',
        placeholder: 'e.g. 27AAAAA0000A1Z5',
        required: true,
        validation: { regex: /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/, message: 'Enter a valid GST number' }
      },
      {
        name: 'registrationLicense',
        label: 'Tourism Registry License No.',
        type: 'text',
        placeholder: 'Official license license number',
        required: true,
        validation: { min: 4 }
      },
      {
        name: 'operatorId',
        label: 'Desired Operator ID',
        type: 'text',
        placeholder: 'e.g. TO-MUMBAI-01',
        required: true,
        validation: { min: 4 }
      },
      {
        name: 'fullName', // map Contact Person to fullName
        label: 'Contact Person Name',
        type: 'text',
        placeholder: 'Lead coordinator name',
        required: true,
        validation: { min: 2 }
      },
      {
        name: 'email',
        label: 'Office Email Address',
        type: 'email',
        placeholder: 'office@company.com',
        required: true,
        validation: {}
      },
      {
        name: 'mobile',
        label: 'Mobile Number',
        type: 'tel',
        placeholder: 'Coordinator mobile number',
        required: true,
        validation: { regex: /^[6-9]\d{9}$/ }
      },
      {
        name: 'address',
        label: 'Office Address',
        type: 'text',
        placeholder: 'Registered business address',
        required: true,
        validation: {}
      },
      {
        name: 'state',
        label: 'State',
        type: 'select',
        required: true,
        options: ['Maharashtra', 'Delhi', 'Gujarat', 'Karnataka', 'Other'],
        validation: {}
      },
      {
        name: 'district',
        label: 'District',
        type: 'text',
        placeholder: 'Business district',
        required: true,
        validation: {}
      },
      {
        name: 'expectedPilgrims',
        label: 'Expected Total Pilgrims',
        type: 'select',
        required: true,
        options: ['15-50 Pilgrims', '50-200 Pilgrims', '200-500 Pilgrims', '500+ Pilgrims'],
        validation: {}
      },
      {
        name: 'password',
        label: 'Create Password',
        type: 'password',
        placeholder: 'Create password',
        required: true,
        validation: { min: 8 }
      }
    ]
  },
  nri: {
    id: 'nri',
    title: 'NRI Pilgrim Registration',
    subtitle: 'For Indian citizens residing overseas traveling with visa validations.',
    fields: [
      {
        name: 'fullName',
        label: 'Full Name',
        type: 'text',
        placeholder: 'Name as in passport',
        required: true,
        validation: { min: 2 }
      },
      {
        name: 'passportNumber',
        label: 'Passport Number',
        type: 'text',
        placeholder: 'Passport ID',
        required: true,
        validation: { min: 6, message: 'Enter a valid passport number' }
      },
      {
        name: 'country',
        label: 'Country of Residence',
        type: 'text',
        placeholder: 'Country currently residing',
        required: true,
        validation: {}
      },
      {
        name: 'indianContact',
        label: 'Indian Reference Contact No.',
        type: 'tel',
        placeholder: 'Indian relative or hotel contact',
        required: true,
        validation: { regex: /^[6-9]\d{9}$/ }
      },
      {
        name: 'visaType',
        label: 'Visa Category',
        type: 'select',
        required: true,
        options: ['Tourist Visa', 'OCI Card', 'PIO Card', 'Business Visa', 'Other'],
        validation: {}
      },
      {
        name: 'arrivalDate',
        label: 'Expected Arrival Date',
        type: 'date',
        required: true,
        validation: {}
      },
      {
        name: 'mobile',
        label: 'Primary Mobile No.',
        type: 'tel',
        placeholder: 'Overseas contact number',
        required: true,
        validation: {}
      },
      {
        name: 'email',
        label: 'Email Address',
        type: 'email',
        placeholder: 'email@domain.com',
        required: true,
        validation: {}
      },
      {
        name: 'passportUpload',
        label: 'Passport Copy (PDF/JPEG)',
        type: 'file',
        required: true,
        validation: {}
      },
      {
        name: 'password',
        label: 'Create Password',
        type: 'password',
        placeholder: 'Create password',
        required: true,
        validation: { min: 8 }
      }
    ]
  },
  foreign: {
    id: 'foreign',
    title: 'Foreign National Registration',
    subtitle: 'Required clearance profiles for non-Indian passports entering the Simhastha.',
    fields: [
      {
        name: 'fullName',
        label: 'Full Name',
        type: 'text',
        placeholder: 'Full name as in passport',
        required: true,
        validation: {}
      },
      {
        name: 'passportNumber',
        label: 'Passport Number',
        type: 'text',
        placeholder: 'Passport identity code',
        required: true,
        validation: { min: 6 }
      },
      {
        name: 'nationality',
        label: 'Country of Citizenship',
        type: 'text',
        placeholder: 'e.g. United Kingdom',
        required: true,
        validation: {}
      },
      {
        name: 'visaNumber',
        label: 'Visa Registration Number',
        type: 'text',
        placeholder: 'eVisa / Embassy Visa ID',
        required: true,
        validation: { min: 5 }
      },
      {
        name: 'arrivalAirport',
        label: 'Port of Entry (Airport)',
        type: 'text',
        placeholder: 'e.g. Mumbai (BOM) Airport',
        required: true,
        validation: {}
      },
      {
        name: 'hotel',
        label: 'Indian Stay Details / Hotel Address',
        type: 'text',
        placeholder: 'Hotel or Ashram stay details',
        required: true,
        validation: {}
      },
      {
        name: 'emergencyContact',
        label: 'Emergency Indian Contact',
        type: 'tel',
        placeholder: 'Guide or coordinator contact',
        required: true,
        validation: {}
      },
      {
        name: 'passportUpload',
        label: 'Upload Passport Front Page',
        type: 'file',
        required: true,
        validation: {}
      },
      {
        name: 'email',
        label: 'Active Email Address',
        type: 'email',
        placeholder: 'email@domain.com',
        required: true,
        validation: {}
      },
      {
        name: 'password',
        label: 'Create Password',
        type: 'password',
        placeholder: 'Create password',
        required: true,
        validation: { min: 8 }
      }
    ]
  }
};
