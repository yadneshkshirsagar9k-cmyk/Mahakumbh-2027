/**
 * @file Feedback portal data constants
 * @description Stores structured datasets for quick action cards, categories list, and FAQs.
 */

import { FeedbackCategory } from '@/types/feedback.types';

// ============================================================
// QUICK ACTION CARDS (Section 2)
// ============================================================

export interface QuickActionCard {
  id: string;
  title: string;
  description: string;
  category: FeedbackCategory;
  icon: string; // lucide icon name
}

export const QUICK_ACTION_CARDS_DATA: QuickActionCard[] = [
  {
    id: 'qac-1',
    title: 'Share Feedback',
    description: 'Share your overall experience regarding the pilgrimage arrangements.',
    category: 'general',
    icon: 'MessageSquare'
  },
  {
    id: 'qac-2',
    title: 'Report an Issue',
    description: 'Instantly notify administrators of active queue bottlenecks or roadblocks.',
    category: 'others',
    icon: 'AlertTriangle'
  },
  {
    id: 'qac-3',
    title: 'Submit Suggestion',
    description: 'Propose ideas to optimize transit loops, safety grids, or camp operations.',
    category: 'suggestions',
    icon: 'Sparkles'
  },
  {
    id: 'qac-4',
    title: 'Appreciate Volunteers',
    description: 'Express gratitude and nominate outstanding volunteer staff members.',
    category: 'general',
    icon: 'Heart'
  },
  {
    id: 'qac-5',
    title: 'Report Cleanliness',
    description: 'Flag litter accumulation, blocked toilets, or ghat debris issues.',
    category: 'cleanliness',
    icon: 'Trash2'
  },
  {
    id: 'qac-6',
    title: 'Report Crowd Surge',
    description: 'Report uncomfortable densities in sector holds or entry corridors.',
    category: 'crowd_management',
    icon: 'Users'
  },
  {
    id: 'qac-7',
    title: 'Infrastructure Issues',
    description: 'Report broken steps, faulty lights, or water tap leakage.',
    category: 'facilities',
    icon: 'Building'
  },
  {
    id: 'qac-8',
    title: 'Emergency Feedback',
    description: 'Report urgent safety concerns directly to the grievance coordinator.',
    category: 'police',
    icon: 'ShieldAlert'
  }
];

// ============================================================
// FEEDBACK CATEGORIES (Section 4)
// ============================================================

export interface CategoryCard {
  value: FeedbackCategory;
  label: string;
  description: string;
  icon: string;
}

export const FEEDBACK_CATEGORIES_DATA: CategoryCard[] = [
  { value: 'general', label: 'General Feedback', description: 'Overall thoughts regarding the Simhastha arrangements.', icon: 'MessageCircle' },
  { value: 'facilities', label: 'Facilities & Utilities', description: 'Drinking water, electricity, lockers, and restrooms.', icon: 'Building' },
  { value: 'cleanliness', label: 'Sanitation & Cleanliness', description: 'Trash disposal, ghat hygiene, and camp sanitization.', icon: 'Trash2' },
  { value: 'crowd_management', label: 'Crowd Management', description: 'Queue layouts, barricading, and transit flow speed.', icon: 'Users' },
  { value: 'medical', label: 'Medical Services', description: 'First-aid posts, ambulances, and vaccination booths.', icon: 'HeartPulse' },
  { value: 'police', label: 'Police & Security', description: 'Patrol presence, checkposts safety, and helpfulness.', icon: 'Shield' },
  { value: 'accommodation', label: 'Accommodations', description: 'Municipal camps dorms, Dharamshalas, and Swiss tents.', icon: 'Home' },
  { value: 'transportation', label: 'Transportation & Shuttles', description: 'State transport buses, E-rickshaws, and route signs.', icon: 'Bus' },

  { value: 'website', label: 'Official Portal Website', description: 'Ease of use, loading speeds, and accessibility.', icon: 'Laptop' },
  { value: 'mobile_app', label: 'Smart Companion App', description: 'Navigator tracking, offline modes, and QR tags.', icon: 'Smartphone' },
  { value: 'suggestions', label: 'Future Improvements', description: 'Ideas to improve the next Mahakumbh sequence.', icon: 'Sparkles' },
  { value: 'others', label: 'Other Concerns', description: 'Any issues not fitting current categories list.', icon: 'Info' }
];

// ============================================================
// FAQ BOOKLET (Section 7)
// ============================================================

export interface FAQItem {
  question: string;
  answer: string;
}

export const FAQ_DATA: FAQItem[] = [
  {
    question: 'How is feedback reviewed?',
    answer: 'All submitted feedback is routed directly to the Simhastha Joint Control Office in Nashik. Category managers classify submissions and assign actionable tasks to local municipal squads.'
  },
  {
    question: 'How long does a grievance response take?',
    answer: 'Standard feedback is acknowledged instantly. Grievances and infrastructural complaints (e.g., broken steps, sanitation delays) are analyzed and aimed for resolution within 4 to 8 hours during active peak bathing periods.'
  },
  {
    question: 'Can I edit my feedback later?',
    answer: 'Once a feedback ticket is registered, it locks into the central auditing ledger to prevent tempering. You can submit additional tracking updates using your designated Tracking ID code.'
  },
  {
    question: 'Who reviews administrative complaints?',
    answer: 'Complaints targeting safety guards or volunteers are reviewed directly by the District Magistrate Grievances Board and local Police Division commanders.'
  },
  {
    question: 'Can I upload supporting documents?',
    answer: 'Yes. The feedback form allows attaching image files (JPEG, PNG) of localized problems (e.g. leaking taps) or PDF/Word document clearances up to 4MB.'
  }
];
