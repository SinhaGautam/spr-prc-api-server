import { MongoClient } from 'mongodb';

const mongoUser = process.env.MONGO_USER || '';
const mongoPassword = process.env.MONGO_PASSWORD || '';
const mongoUriTemplate = process.env.MONGO_URI || process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017';
const mongoUri = mongoUriTemplate
  .replaceAll('<MONGO_USER>', encodeURIComponent(mongoUser))
  .replaceAll('<MONGO_PASSWORD>', encodeURIComponent(mongoPassword));
const databaseName = process.env.MONGO_DB_NAME || process.env.MONGODB_DATABASE || 'bhakti_app';

const now = new Date();
const seed = {
  users: [
    {
      _id: 'user-1',
      authProvider: 'mock',
      authSubject: 'user-1',
      displayName: 'Seeker One',
      email: 'seeker@example.com',
      timezone: 'Asia/Kolkata',
      language: 'en',
      status: 'active',
      createdAt: now,
      updatedAt: now,
    },
  ],
  user_preferences: [
    {
      _id: 'pref-user-1',
      userId: 'user-1',
      traditionId: 'trad-hindu',
      primaryFocusId: 'focus-ram',
      enabledPractices: ['naam_jap', 'meditation'],
      naamJapTarget: { repetitions: 108 },
      meditationTarget: { minutes: 10 },
      reminder: { enabled: true, localTime: '07:00' },
      language: 'en',
      createdAt: now,
      updatedAt: now,
    },
  ],
  traditions: [
    { _id: 'trad-hindu', key: 'hindu', name: 'Hindu', status: 'published', sortOrder: 1, createdAt: now, updatedAt: now },
    { _id: 'trad-jain', key: 'jain', name: 'Jain', status: 'published', sortOrder: 2, createdAt: now, updatedAt: now },
  ],
  focuses: [
    { _id: 'focus-ram', key: 'ram', name: 'Ram', traditionIds: ['trad-hindu'], aliases: ['rama'], status: 'published', sortOrder: 1, createdAt: now, updatedAt: now },
    { _id: 'focus-krishna', key: 'krishna', name: 'Krishna', traditionIds: ['trad-hindu'], aliases: ['govinda'], status: 'published', sortOrder: 2, createdAt: now, updatedAt: now },
    { _id: 'focus-mahavira', key: 'mahavira', name: 'Mahavira', traditionIds: ['trad-jain'], aliases: ['vitarag'], status: 'published', sortOrder: 3, createdAt: now, updatedAt: now },
  ],
  tags: [
    { _id: 'tag-morning', key: 'morning', name: 'Morning', type: 'time', status: 'published', createdAt: now, updatedAt: now },
    { _id: 'tag-practice', key: 'practice', name: 'Practice', type: 'intent', status: 'published', createdAt: now, updatedAt: now },
    { _id: 'tag-festival', key: 'festival', name: 'Festival', type: 'festival', status: 'published', createdAt: now, updatedAt: now },
  ],
  mantras: [
    {
      _id: 'mantra-1',
      name: 'Ram Ram',
      text: 'राम राम',
      transliteration: 'Ram Ram',
      pronunciationNote: 'Repeat gently with a relaxed breath.',
      meaning: 'Remember the divine name with calm and devotion.',
      traditionIds: ['trad-hindu'],
      focusIds: ['focus-ram'],
      language: 'hi',
      status: 'published',
      createdAt: now,
      updatedAt: now,
    },
  ],
  naam_jap_sessions: [
    {
      _id: 'naam-jap-session-1',
      userId: 'user-1',
      mantraId: 'mantra-1',
      mantraTextSnapshot: 'राम राम',
      targetRepetitions: 108,
      completedRepetitions: 108,
      startedAt: now,
      endedAt: now,
      durationSeconds: 420,
      completed: true,
      clientSessionId: 'client-session-1',
      createdAt: now,
    },
  ],
  meditation_presets: [
    { _id: 'preset-5', key: 'five_minutes', durationMinutes: 5, status: 'published', sortOrder: 1, createdAt: now, updatedAt: now },
    { _id: 'preset-10', key: 'ten_minutes', durationMinutes: 10, status: 'published', sortOrder: 2, createdAt: now, updatedAt: now },
    { _id: 'preset-15', key: 'fifteen_minutes', durationMinutes: 15, status: 'published', sortOrder: 3, createdAt: now, updatedAt: now },
    { _id: 'preset-20', key: 'twenty_minutes', durationMinutes: 20, status: 'published', sortOrder: 4, createdAt: now, updatedAt: now },
  ],
  meditation_sessions: [
    {
      _id: 'meditation-session-1',
      userId: 'user-1',
      presetId: 'preset-10',
      plannedMinutes: 10,
      actualSeconds: 600,
      startedAt: now,
      endedAt: now,
      completed: true,
      completionReason: 'completed',
      clientSessionId: 'meditation-client-1',
      createdAt: now,
    },
  ],
  daily_goals: [
    {
      _id: 'daily-goal-1',
      userId: 'user-1',
      localDate: new Date().toISOString().slice(0, 10),
      timezone: 'Asia/Kolkata',
      naamJap: { enabled: true, targetRepetitions: 108 },
      meditation: { enabled: true, targetMinutes: 10 },
      createdAt: now,
      updatedAt: now,
    },
  ],
  daily_progress: [
    {
      _id: 'daily-progress-1',
      userId: 'user-1',
      localDate: new Date().toISOString().slice(0, 10),
      timezone: 'Asia/Kolkata',
      naamJap: { completed: true, repetitions: 108 },
      meditation: { completed: true, minutes: 10 },
      completedPractices: ['naam_jap', 'meditation'],
      enabledPracticeCount: 2,
      completedPracticeCount: 2,
      dayCompleted: true,
      createdAt: now,
      updatedAt: now,
    },
  ],
  media_assets: [
    {
      _id: 'asset-audio-1',
      type: 'audio',
  ],
  device_registrations: [
    {
      _id: 'device-1',
      userId: 'user-1',
      platform: 'ios',
      pushToken: 'token-demo-1',
      timezone: 'Asia/Kolkata',
      enabled: true,
      lastSeenAt: now,
      createdAt: now,
      updatedAt: now,
    },
  ],
};

const client = new MongoClient(mongoUri, { serverSelectionTimeoutMS: 10000 });

try {
  await client.connect();
  const db = client.db(databaseName);

  const collectionNames = Object.keys(seed);
  for (const collectionName of collectionNames) {
    await db.createCollection(collectionName).catch((error) => {
      if (!String(error).includes('already exists')) {
        throw error;
      }
    });

    const collection = db.collection(collectionName);
    const count = await collection.countDocuments();
    if (count === 0) {
      await collection.insertMany(seed[collectionName]);
      console.log(`Seeded ${collectionName}: ${seed[collectionName].length} documents`);
    } else {
      console.log(`Collection ${collectionName} already has ${count} documents; skipped seeding`);
    }
  }

  console.log(`MongoDB seed complete for database '${databaseName}'`);
} finally {
  await client.close();
}
