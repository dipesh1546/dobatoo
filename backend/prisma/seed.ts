import { PrismaClient, CompetitionStatus, Role } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting Dobatoo Production Clean & Seed...');

  // ============================================================
  // 1. CLEAR ALL TRANSACTIONAL & TEST DATA
  // ============================================================
  console.log('🧹 Purging test submissions, registrations, and scores...');

  await prisma.judgeScore.deleteMany({});
  await prisma.poetryJudgeAssignment.deleteMany({});
  await prisma.poetryWinner.deleteMany({});
  await prisma.poetryParticipant.deleteMany({});
  await prisma.registration.deleteMany({});
  await prisma.judge.deleteMany({});
  await prisma.contactSubmission.deleteMany({});
  await prisma.adminAuditLog.deleteMany({});

  console.log('✅ All test registrations, participants, judges, scores, and logs cleared.');

  // ============================================================
  // 2. OFFICIAL EVENT
  // ============================================================
  const eventSlug = 'dobato-grand-launch';
  // 16 October 2026 — Asia/Kathmandu
  const eventDate = new Date('2026-10-16T00:00:00+05:45');

  const event = await prisma.event.upsert({
    where: { slug: eventSlug },
    update: {
      title: 'DOBATOO GRAND LAUNCH',
      description:
        'An open mic evening of poetry, music, storytelling, and celebrating meaningful connection.',
      slogan: 'Two Paths. One Connection.',
      secondarySlogan: 'Where Paths Cross, Stories Begin.',
      poetryTheme: 'Searching / Finding the Right Person',
      eventDate,
      timezone: 'Asia/Kathmandu',
      location: 'Kathmandu, Nepal',
      registrationFee: 0,
      isRegistrationOpen: true,
      isActive: true,
    },
    create: {
      title: 'DOBATOO GRAND LAUNCH',
      slug: eventSlug,
      description:
        'An open mic evening of poetry, music, storytelling, and celebrating meaningful connection.',
      slogan: 'Two Paths. One Connection.',
      secondarySlogan: 'Where Paths Cross, Stories Begin.',
      poetryTheme: 'Searching / Finding the Right Person',
      eventDate,
      timezone: 'Asia/Kathmandu',
      location: 'Kathmandu, Nepal',
      registrationFee: 0,
      isRegistrationOpen: true,
      isActive: true,
    },
  });

  console.log(`✅ Event configured: "${event.title}" (${event.slug})`);

  // ============================================================
  // 3. EVENT HIGHLIGHTS
  // ============================================================
  await prisma.highlight.deleteMany({ where: { eventId: event.id } });

  const highlightsData = [
    {
      title: 'POETRY',
      description:
        'Express your emotions through words on the official theme: "Searching / Finding the Right Person (जहाँ दुई बाटो भेटिन्छन्)".',
      iconKey: 'poetry',
      displayOrder: 1,
    },
    {
      title: 'MUSIC',
      description:
        'Live acoustic melodies and musical performances celebrating connection and emotion.',
      iconKey: 'music',
      displayOrder: 2,
    },
    {
      title: 'STORYTELLING',
      description:
        'Personal stories of journeys, intersecting lives, and serendipitous moments.',
      iconKey: 'heart',
      displayOrder: 3,
    },
    {
      title: 'PRIZES',
      description:
        'Exciting awards, cash prizes, official Dobatoo merchandise, and platform privileges.',
      iconKey: 'trophy',
      displayOrder: 4,
    },
  ];

  for (const highlight of highlightsData) {
    await prisma.highlight.create({
      data: {
        eventId: event.id,
        ...highlight,
      },
    });
  }

  console.log(`✅ Seeded ${highlightsData.length} event highlights.`);

  // ============================================================
  // 4. OFFICIAL PRIZES
  // ============================================================
  await prisma.prize.deleteMany({ where: { eventId: event.id } });

  const prizesData = [
    {
      position: 1,
      title: 'First Prize',
      cashAmount: 2500,
      currency: 'NPR',
      benefits: [
        'Lifetime Free Dobatoo Access',
        'Official Dobatoo T-shirt',
        'Winner Trophy & Certificate',
      ],
      displayOrder: 1,
    },
    {
      position: 2,
      title: 'Second Prize',
      cashAmount: 1000,
      currency: 'NPR',
      benefits: [
        '6 Months Free Dobatoo Access',
        'Official Dobatoo T-shirt',
        'Runner-up Trophy & Certificate',
      ],
      displayOrder: 2,
    },
    {
      position: 3,
      title: 'Third Prize',
      cashAmount: null,
      currency: 'NPR',
      benefits: [
        '3 Months Free Dobatoo Access',
        'Official Dobatoo T-shirt',
        'Certificate of Recognition',
      ],
      displayOrder: 3,
    },
  ];

  for (const prize of prizesData) {
    await prisma.prize.create({
      data: {
        eventId: event.id,
        ...prize,
      },
    });
  }

  console.log(`✅ Seeded ${prizesData.length} prizes.`);

  // ============================================================
  // 5. POETRY COMPETITION (THEME: Searching / Finding the Right Person)
  // ============================================================
  const existingCompetition = await prisma.poetryCompetition.findFirst({
    where: { eventId: event.id },
  });

  let competition;
  if (existingCompetition) {
    competition = await prisma.poetryCompetition.update({
      where: { id: existingCompetition.id },
      data: {
        title: 'Dobatoo Poetry Competition',
        theme: 'Searching / Finding the Right Person',
        description:
          'The Dobatoo Poetry Competition invites poets and performers to interpret the concept of searching and finding the right person — जहाँ दुई बाटो भेटिन्छन्।',
        isOpen: true,
        status: CompetitionStatus.OPEN,
      },
    });
  } else {
    competition = await prisma.poetryCompetition.create({
      data: {
        eventId: event.id,
        title: 'Dobatoo Poetry Competition',
        theme: 'Searching / Finding the Right Person',
        description:
          'The Dobatoo Poetry Competition invites poets and performers to interpret the concept of searching and finding the right person — जहाँ दुई बाटो भेटिन्छन्।',
        isOpen: true,
        status: CompetitionStatus.OPEN,
      },
    });
  }

  console.log(`✅ Poetry competition configured with fixed theme: "${competition.theme}"`);

  // ============================================================
  // 6. POETRY GUIDELINES
  // ============================================================
  await prisma.poetryGuideline.deleteMany({
    where: { competitionId: competition.id },
  });

  const guidelinesData = [
    {
      title: 'Originality',
      description:
        'All poems and performances must be original works created by the participant.',
      displayOrder: 1,
    },
    {
      title: 'Theme Alignment',
      description:
        'Performances must reflect the official theme: "Searching / Finding the Right Person — Dobatoo".',
      displayOrder: 2,
    },
    {
      title: 'Time Limit',
      description:
        'Each open mic performance is limited to a maximum of 4 minutes on stage.',
      displayOrder: 3,
    },
    {
      title: 'Respectful Expression',
      description:
        'Content must be respectful and suitable for a diverse public audience.',
      displayOrder: 4,
    },
    {
      title: 'Live Attendance',
      description:
        'Performers must be present at the venue during their scheduled performance window.',
      displayOrder: 5,
    },
  ];

  for (const guideline of guidelinesData) {
    await prisma.poetryGuideline.create({
      data: {
        competitionId: competition.id,
        ...guideline,
      },
    });
  }

  console.log(`✅ Seeded ${guidelinesData.length} poetry guidelines.`);

  // ============================================================
  // 7. JUDGING CRITERIA
  // ============================================================
  await prisma.judgingCriterion.deleteMany({
    where: { competitionId: competition.id },
  });

  const criteriaData = [
    {
      name: 'Content & Theme Depth',
      title: 'Theme Relevance & Depth',
      description: 'Relevance to the Searching / Finding the Right Person theme, depth of thought, and imagery.',
      weight: 25,
      maxScore: 10,
      displayOrder: 1,
    },
    {
      name: 'Originality & Creativity',
      title: 'Creativity & Craft',
      description: 'Uniqueness of perspective, lyrical beauty, and stylistic craft.',
      weight: 25,
      maxScore: 10,
      displayOrder: 2,
    },
    {
      name: 'Stage Delivery & Voice',
      title: 'Delivery & Projection',
      description: 'Vocal modulation, confidence, cadence, and stage presence.',
      weight: 25,
      maxScore: 10,
      displayOrder: 3,
    },
    {
      name: 'Audience Impact & Emotion',
      title: 'Emotional Connection',
      description: 'Ability to move listeners and evoke genuine emotion.',
      weight: 25,
      maxScore: 10,
      displayOrder: 4,
    },
  ];

  for (const criterion of criteriaData) {
    await prisma.judgingCriterion.create({
      data: {
        competitionId: competition.id,
        ...criterion,
      },
    });
  }

  console.log(`✅ Seeded ${criteriaData.length} judging criteria.`);

  // ============================================================
  // 8. EVENT FAQs
  // ============================================================
  await prisma.eventFAQ.deleteMany({ where: { eventId: event.id } });

  const faqsData = [
    {
      question: 'Is registration free?',
      answer: 'Yes! Registration for the Dobatoo Grand Launch is 100% free of charge.',
      displayOrder: 1,
      isPublished: true,
    },
    {
      question: 'What is the official poetry theme?',
      answer:
        'The official poetry theme is "Searching / Finding the Right Person" (जहाँ दुई बाटो भेटिन्छन्).',
      displayOrder: 2,
      isPublished: true,
    },
    {
      question: 'Can I attend without performing?',
      answer:
        'Absolutely! Select "Event Attendance" to join as an audience member and enjoy the evening.',
      displayOrder: 3,
      isPublished: true,
    },
    {
      question: 'What performance styles are welcomed?',
      answer:
        'We welcome Poetry, Storytelling, Acoustic Music, and Spoken Word.',
      displayOrder: 4,
      isPublished: true,
    },
    {
      question: 'Where will the event be held?',
      answer: 'The event takes place in Kathmandu, Nepal. Final venue details will be sent via email confirmation.',
      displayOrder: 5,
      isPublished: true,
    },
  ];

  for (const faq of faqsData) {
    await prisma.eventFAQ.create({
      data: {
        eventId: event.id,
        ...faq,
      },
    });
  }

  console.log(`✅ Seeded ${faqsData.length} FAQs.`);

  // ============================================================
  // 9. EVENT PERFORMANCES
  // ============================================================
  await prisma.eventPerformance.deleteMany({ where: { eventId: event.id } });

  await prisma.eventPerformance.create({
    data: {
      eventId: event.id,
      title: 'Acoustic Soul Session',
      description: 'Soulful live acoustic performance to open the evening.',
      performanceType: 'music',
      displayOrder: 1,
      isPublished: true,
    },
  });

  // ============================================================
  // 10. SUPER ADMIN USER
  // ============================================================
  const superAdminEmail =
    process.env.SUPERADMIN_EMAIL ||
    process.env.ADMIN_EMAIL ||
    'superadmin@dobatoo.app';

  const adminPassword =
    process.env.ADMIN_PASSWORD ||
    process.env.ADMIN_DEFAULT_PASSWORD ||
    'AdminSecret@2026';

  const hashedPassword = await bcrypt.hash(adminPassword, 10);

  const admin = await prisma.adminUser.upsert({
    where: { email: superAdminEmail },
    update: {
      name: 'Dobatoo Super Admin',
      passwordHash: hashedPassword,
      role: Role.SUPER_ADMIN,
      isActive: true,
    },
    create: {
      name: 'Dobatoo Super Admin',
      email: superAdminEmail,
      passwordHash: hashedPassword,
      role: Role.SUPER_ADMIN,
      isActive: true,
    },
  });

  console.log(`✅ Super Admin configured: "${admin.email}" (${admin.role})`);

  console.log('');
  console.log('==============================================');
  console.log('🎉 DOBATOO PRODUCTION BASELINE READY');
  console.log('==============================================');
  console.log(`Event: ${event.title} (${event.slug})`);
  console.log(`Theme: ${competition.theme}`);
  console.log(`Admin Email: ${admin.email}`);
  console.log('Database state: Zero test records. Clean production baseline.');
  console.log('==============================================');
}

main()
  .catch((error) => {
    console.error('❌ Seeding error:', error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });