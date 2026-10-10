export interface IdCardParticipantData {
  id: string;
  registrationId: string;
  fullName: string;
  photoUrl?: string;
  role?: string;
  performanceCategory?: string;
  eventName?: string;
  eventDate?: string;
  venueName?: string;
  verificationUrl?: string;
}

export const DEMO_ID_CARD_DATA: IdCardParticipantData = {
  id: 'demo-001',
  registrationId: 'DBT2026-001',
  fullName: 'Aarya Sharma',
  photoUrl: '/images/competition/poetry-performance.jpg',
  role: 'PERFORMER PARTICIPANT',
  performanceCategory: 'Poetry',
  eventName: 'DOBATOO GRAND LAUNCH',
  eventDate: '16 October 2026',
  venueName: 'The Gardens, Pani Pokhari',
  verificationUrl: 'https://dobatoo.com/verify?id=DBT2026-001',
};

/**
 * Normalizes any admin registration / poetry participant record into ID card data.
 */
export function normalizeToIdCardData(reg: any): IdCardParticipantData {
  if (!reg) return DEMO_ID_CARD_DATA;

  // Derive registration ID
  const registrationId = reg.registrationId || reg.id || 'DBT2026-001';

  // Derive category/performance
  let category = 'Poetry';
  if (reg.performance?.performanceType) {
    category = reg.performance.performanceType.replace(/_/g, ' ');
  } else if (reg.performanceType) {
    category = reg.performanceType.replace(/_/g, ' ');
  } else if (reg.poetryParticipant?.performanceType) {
    category = reg.poetryParticipant.performanceType.replace(/_/g, ' ');
  } else if (reg.participationType === 'ATTEND_ONLY') {
    category = 'Audience';
  }

  // Capitalize nicely (e.g. "Poetry", "Music", "Spoken Word")
  const formattedCategory = category
    .toLowerCase()
    .split(' ')
    .map((w: string) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');

  // Base URL
  const origin = typeof window !== 'undefined' ? window.location.origin : 'https://dobatoo.com';
  const verificationUrl = `${origin}/verify?id=${encodeURIComponent(registrationId)}`;

  // Robust photoUrl extraction across diverse API responses & property names
  let photo =
    reg.photoUrl ||
    reg.photo ||
    reg.avatarUrl ||
    reg.imageUrl ||
    (reg.registration ? reg.registration.photoUrl || reg.registration.photo || reg.registration.imageUrl : undefined) ||
    undefined;

  if (photo && typeof photo === 'string') {
    photo = photo.trim();
    if (!photo) {
      photo = undefined;
    } else if (
      !photo.startsWith('http://') &&
      !photo.startsWith('https://') &&
      !photo.startsWith('data:') &&
      !photo.startsWith('blob:') &&
      !photo.startsWith('/')
    ) {
      photo = `/${photo}`;
    }
  } else {
    photo = undefined;
  }

  return {
    id: reg.id || registrationId,
    registrationId: registrationId.toUpperCase(),
    fullName: reg.fullName || reg.participantName || reg.name || 'Participant',
    photoUrl: photo,
    role: reg.participationType === 'ATTEND_ONLY' ? 'AUDIENCE PARTICIPANT' : 'PERFORMER PARTICIPANT',
    performanceCategory: formattedCategory || 'Poetry',
    eventName: 'DOBATOO GRAND LAUNCH',
    eventDate: '16 October 2026',
    venueName: 'The Gardens, Pani Pokhari',
    verificationUrl,
  };
}
