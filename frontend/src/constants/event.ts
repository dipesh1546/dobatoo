export interface EventHighlight {
  id: string;
  icon: string;
  title: string;
  subtitle: string;
  description: string;
}

export interface PrizeItem {
  rank: '1ST PRIZE' | '2ND PRIZE' | '3RD PRIZE';
  amount?: string;
  badge: string;
  trophy?: boolean;
  tshirt: boolean;
  access: string;
  isFeatured?: boolean;
}

export interface TimelineStep {
  label: string;
  title: string;
  description: string;
}

export interface FeaturePoint {
  title: string;
  description: string;
  iconName: string;
}

export interface FAQItemData {
  id: string;
  question: string;
  answer: string;
}

export const EVENT_HIGHLIGHTS: EventHighlight[] = [
  {
    id: 'poetry',
    icon: 'Feather',
    title: 'Poetry & Performances',
    subtitle: 'Finding the Right Person',
    description: 'Express your feelings on finding someone who understands you, connects with you, and shares meaningful companionship.',
  },
  {
    id: 'music',
    icon: 'Music',
    title: 'Live Acoustic & Music',
    subtitle: 'Acoustic Vibrations',
    description: 'Experience soul-stirring live acoustic performances designed around intimacy and deep connections.',
  },
  {
    id: 'connections',
    icon: 'Heart',
    title: 'Meaningful Connections',
    subtitle: 'Curated Icebreakers',
    description: 'Engage in curated speed mixers and natural icebreakers to meet people on similar paths.',
  },
  {
    id: 'prizes',
    icon: 'Trophy',
    title: 'Competition Prizes',
    subtitle: 'NPR 3,500 Total Pool',
    description: 'Win cash prizes (1st Prize: NPR 2,500 | 2nd Prize: NPR 1,000), official Dobatoo trophies, custom merchandise, and free platform access.',
  },
];

export const EVENT_TIMELINE: TimelineStep[] = [
  {
    label: 'Phase 1',
    title: 'Poetry & Story Telling',
    description: 'Opening performances recitals on the journey of finding the right person.',
  },
  {
    label: 'Phase 2',
    title: 'Music Experience',
    description: 'Live musical performances and acoustic sessions setting an energetic, authentic vibe.',
  },
  {
    label: 'Phase 3',
    title: 'Dobatoo Platform Launch',
    description: 'Official reveal of the Dobatoo platform, vision, and upcoming community features.',
  },
  {
    label: 'Phase 4',
    title: 'Curated Connections',
    description: 'Interactive social mixer allowing guests from different paths to converse and connect.',
  },
];

export const PRIZES: PrizeItem[] = [
  {
    rank: '1ST PRIZE',
    amount: 'NPR 2,500',
    badge: 'Champion',
    trophy: true,
    tshirt: true,
    access: 'Lifetime Free Dobatoo Access',
    isFeatured: true,
  },
  {
    rank: '2ND PRIZE',
    amount: 'NPR 1,000',
    badge: 'Runner Up',
    trophy: true,
    tshirt: true,
    access: '6 Months Free Dobatoo Access',
    isFeatured: false,
  },
  {
    rank: '3RD PRIZE',
    badge: '3rd Place',
    trophy: true,
    tshirt: true,
    access: '3 Months Free Dobatoo Access',
    isFeatured: false,
  },
];

export const WHY_DOBATO_POINTS: FeaturePoint[] = [
  {
    title: 'Finding the Right Person',
    description: 'Meet people with intention, shared energy, and true understanding rather than mindless swiping.',
    iconName: 'Sparkles',
  },
  {
    title: 'New Stories',
    description: 'Every person has a unique journey worth discovering and sharing.',
    iconName: 'BookOpen',
  },
  {
    title: 'Shared Paths',
    description: 'Find companions who match your goals, energy, and values.',
    iconName: 'Compass',
  },
  {
    title: 'Real Possibilities',
    description: 'Turn digital conversations into real, lasting connections.',
    iconName: 'Flame',
  },
];

export const WHAT_IS_DOBATO_CARDS = [
  {
    id: 'discover',
    title: 'DISCOVER',
    description: 'Meet people beyond your usual circle.',
    iconName: 'Compass',
  },
  {
    id: 'connect',
    title: 'CONNECT',
    description: 'Find someone who truly understands you.',
    iconName: 'Zap',
  },
  {
    id: 'meet',
    title: 'MEET',
    description: 'Turn two paths into one connection.',
    iconName: 'HeartHandshake',
  },
];

export const EVENT_EXPERIENCE_STEPS = [
  {
    step: '01',
    title: 'ARRIVE',
    description: 'Come together.',
  },
  {
    step: '02',
    title: 'EXPRESS',
    description: 'Share your story.',
  },
  {
    step: '03',
    title: 'LISTEN',
    description: 'Experience poetry, story telling and music.',
  },
  {
    step: '04',
    title: 'CONNECT',
    description: 'Meet new people.',
  },
  {
    step: '05',
    title: 'CELEBRATE',
    description: 'Welcome Dobatoo.',
  },
];

export const EVENT_FAQ: FAQItemData[] = [
  {
    id: 'faq-1',
    question: 'Is registration free?',
    answer: 'Yes. Registration for the Dobatoo launch event is completely free.',
  },
  {
    id: 'faq-2',
    question: 'What is the theme of the performances?',
    answer: 'The central theme is "Finding the Right Person" — expressing the journey of meeting someone who understands you and shares meaningful companionship.',
  },
  {
    id: 'faq-3',
    question: 'Do I need to perform to attend?',
    answer: 'No. You can register to attend only and enjoy the music, poetry, and social mixer.',
  },
  {
    id: 'faq-4',
    question: 'What types of performances are allowed?',
    answer: 'Participants can perform Poetry, Story Telling, Music, or Other artistic expressions.',
  },
  {
    id: 'faq-5',
    question: 'What are the prizes for performers?',
    answer: '1st Prize wins NPR 2,500 cash, Dobatoo trophy & merch. 2nd Prize wins NPR 1,000 cash, trophy & merch. 3rd Prize wins 3 months free access, trophy & merch.',
  },
  {
    id: 'faq-6',
    question: 'Is Dobatoo a dating platform?',
    answer: 'Yes. Dobatoo is created as a Nepali platform for discovering people and building meaningful connections.',
  },
  {
    id: 'faq-venue',
    question: 'Where is the event venue?',
    answer: 'The Dobatoo Grand Launch is hosted at The Gardens, Panipokhari, Kathmandu, Nepal.',
  },
  {
    id: 'faq-duration',
    question: 'How long can each participant perform?',
    answer: 'Each participant will have a maximum of 5 minutes to perform (5 Minutes per Participant).',
  },
  {
    id: 'faq-age-limit',
    question: 'Is there an age limit to participate or perform?',
    answer: 'No. There is no age limit. Participants of all ages are welcome to perform and attend.',
  },
  {
    id: 'faq-7',
    question: 'Where did you find out about this event?',
    answer: 'You can select whether you found us via Instagram, TikTok, Friends, or Others during registration.',
  },
];
