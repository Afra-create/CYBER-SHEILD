import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import OpenAI from 'openai';
import admin from 'firebase-admin';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

const PORT = process.env.PORT || 3000;

// ========== FIREBASE ADMIN INIT ==========
let db = null;
let auth = null;
let firebaseAvailable = false;

try {
  const serviceAccountPath = path.join(__dirname, 'serviceAccountKey.json');
  const serviceAccount = process.env.FIREBASE_SERVICE_ACCOUNT
    ? JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT)
    : fs.existsSync(serviceAccountPath)
      ? JSON.parse(fs.readFileSync(serviceAccountPath, 'utf8'))
      : null;

  if (serviceAccount) {
    admin.initializeApp({ credential: admin.credential.cert(serviceAccount) });
    db = admin.firestore();
    auth = admin.auth();
    firebaseAvailable = true;
    console.log('✅ Firebase initialized');
  } else {
    console.warn('⚠️  Firebase service account not provided, using mock database');
  }
} catch (error) {
  console.warn('⚠️  Firebase initialization failed, using mock database:', error.message);
}

// ========== OPENAI INIT ==========
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || 'dummy_key',
});
const openaiReady = process.env.OPENAI_API_KEY && process.env.OPENAI_API_KEY !== 'dummy_key';

// ========== MOCK DATABASE (Fallback) ==========
const mockDatabase = {
  users: {},
  reports: [],
  alerts: [
    { id: '1', type: 'SMS', message: 'High volume of fake delivery SMS reported in your area.', date: new Date().toISOString(), severity: 'high', region: 'All' },
    { id: '2', type: 'Email', message: 'Phishing campaign targeting bank customers.', date: new Date(Date.now() - 86400000).toISOString(), severity: 'medium', region: 'All' },
    { id: '3', type: 'WhatsApp', message: 'Job scam alert: Fake job offers via WhatsApp.', date: new Date(Date.now() - 172800000).toISOString(), severity: 'high', region: 'North' }
  ],
  lessons: [
    { id: 'phishing-101', title: 'Phishing 101', category: 'Phishing', duration: '5 min', description: 'Learn to identify phishing attempts', videoUrl: '/cyber-surakshit-video/' },
    { id: 'otp-security', title: 'OTP Security', category: 'OTP Fraud', duration: '3 min', description: 'Protect your OTP', videoUrl: '/cyber-surakshit-video/' },
    { id: 'social-eng', title: 'Social Engineering', category: 'Social Engineering', duration: '7 min', description: 'Understand social manipulation tactics', videoUrl: '/cyber-surakshit-video/' }
  ],
  trainerScenarios: [
    { id: 1, title: 'Phishing Email', type: 'email', content: 'Dear User, Your account needs verification...', correct: false },
    { id: 2, title: 'OTP Request', type: 'sms', content: 'Your OTP is 123456. Do not share.', correct: true },
    { id: 3, title: 'Job Scam', type: 'message', content: 'Congratulations! You have been selected for a job...', correct: false }
  ],
  userProgress: {
    default: {
      userId: 'user-default',
      level: 'Defender',
      xp: 240,
      xpToNext: 500,
      badges: ['First Report', 'Quick Learner'],
      completedModules: ['phishing-101', 'otp-security'],
      streak: 7,
      totalReports: 3,
      accuracy: 85
    }
  }
};

// ========== UTILITY FUNCTIONS ==========
async function getUserProgress(userId) {
  if (firebaseAvailable && db) {
    try {
      const doc = await db.collection('users').doc(userId).collection('progress').doc('data').get();
      return doc.exists ? doc.data() : null;
    } catch (error) {
      console.error('Firebase error:', error);
    }
  }
  return mockDatabase.userProgress[userId] || mockDatabase.userProgress.default;
}

async function saveUserProgress(userId, progressData) {
  if (firebaseAvailable && db) {
    try {
      await db.collection('users').doc(userId).collection('progress').doc('data').set({ ...progressData, updatedAt: new Date() });
      return true;
    } catch (error) {
      console.error('Firebase error:', error);
    }
  }
  mockDatabase.userProgress[userId] = progressData;
  return true;
}

// ==========================================================
//  API ROUTES — Must be defined BEFORE static file serving
// ==========================================================

// 1. HEALTH CHECK
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    message: 'CyberAngel Backend is running.',
    firebase: firebaseAvailable ? 'connected' : 'using mock database',
    openai: openaiReady ? 'enabled' : 'mock mode'
  });
});

// 2. AUTHENTICATION ENDPOINTS
app.post('/api/auth/signup', async (req, res) => {
  const { email, password, name, firstName, lastName, mobile, location } = req.body;
  const displayName = name || `${firstName || ''} ${lastName || ''}`.trim();

  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required.' });
  }

  try {
    if (firebaseAvailable && auth) {
      const userRecord = await auth.createUser({ email, password, displayName });
      const userData = {
        uid: userRecord.uid, email, name: displayName,
        mobile: mobile || '', location: location || '',
        createdAt: new Date().toISOString(), level: 'Beginner', xp: 0, badges: []
      };
      if (db) {
        await db.collection('users').doc(userRecord.uid).set(userData);
        await db.collection('users').doc(userRecord.uid).collection('progress').doc('data').set({
          userId: userRecord.uid, level: 'Beginner', xp: 0, xpToNext: 500,
          badges: [], completedModules: [], streak: 0, totalReports: 0, accuracy: 0
        });
      }
      return res.status(201).json({ message: 'User created successfully.', userId: userRecord.uid });
    } else {
      const userId = `user-${Date.now()}`;
      mockDatabase.users[userId] = { email, name: displayName, createdAt: new Date().toISOString() };
      mockDatabase.userProgress[userId] = {
        userId, level: 'Beginner', xp: 0, xpToNext: 500,
        badges: [], completedModules: [], streak: 0, totalReports: 0, accuracy: 0
      };
      return res.status(201).json({ message: 'User created (mock mode).', userId });
    }
  } catch (error) {
    console.error('Signup error:', error);
    const msg = error.code === 'auth/email-already-exists' ? 'Email already in use.' : 'Failed to create user.';
    res.status(400).json({ error: msg });
  }
});

app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required.' });
  }
  try {
    if (firebaseAvailable && auth) {
      const user = await auth.getUserByEmail(email);
      return res.json({ message: 'Login successful.', userId: user.uid, token: 'mock-token' });
    } else {
      const user = Object.values(mockDatabase.users).find(u => u.email === email);
      if (user) {
        return res.json({ message: 'Login successful (mock mode).', userId: email, token: 'mock-token' });
      } else {
        return res.status(401).json({ error: 'Invalid credentials.' });
      }
    }
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Login failed.' });
  }
});

// 3. SCAM TEXT SCANNER
app.post('/api/scan', async (req, res) => {
  const { text } = req.body;
  if (!text) return res.status(400).json({ error: 'Text is required for scanning.' });
  try {
    if (openaiReady) {
      const response = await openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [
          { role: 'system', content: 'You are a cybersecurity expert. Analyze the following text and determine if it is a scam. Respond with JSON: {"isScam": boolean, "threatLevel": "Low/Medium/High", "analysis": "string"}' },
          { role: 'user', content: text }
        ],
        response_format: { type: 'json_object' }
      });
      return res.json(JSON.parse(response.choices[0].message.content));
    } else {
      const keywords = ['urgent', 'win', 'click', 'verify', 'blocked', 'suspended', 'prize', 'otp', 'kyc'];
      const isScam = keywords.some(k => text.toLowerCase().includes(k));
      res.json({
        isScam, threatLevel: isScam ? 'High' : 'Low',
        analysis: isScam ? 'Suspicious keywords detected typical of phishing.' : 'No immediate threats detected.',
        source: 'Mock Scanner'
      });
    }
  } catch (error) {
    console.error('Scan error:', error);
    res.status(500).json({ error: 'Failed to scan message.' });
  }
});

// 4. SCREENSHOT SCANNER (AI Vision)
app.post('/api/scan-screenshot', async (req, res) => {
  const { image } = req.body;
  if (!image) return res.status(400).json({ error: 'Image data is required.' });
  try {
    if (openaiReady) {
      const response = await openai.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: 'You are a cybersecurity expert. Analyze the screenshot for scam indicators. Return JSON: {"isScam": boolean, "confidence": number (0-1), "threatLevel": "Low/Medium/High", "category": "string", "summary": "string", "recommendations": ["string"]}' },
          { role: 'user', content: [
            { type: 'text', text: 'Analyze this screenshot for scam/phishing patterns.' },
            { type: 'image_url', image_url: { url: image } }
          ]}
        ],
        response_format: { type: 'json_object' }, max_tokens: 800
      });
      return res.json(JSON.parse(response.choices[0].message.content));
    } else {
      const mockCategories = ['Phishing', 'OTP Fraud', 'Job Scam', 'Safe'];
      const isScam = Math.random() > 0.4;
      res.json({
        isScam, confidence: isScam ? 0.85 + Math.random() * 0.1 : 0.15 + Math.random() * 0.15,
        threatLevel: isScam ? 'High' : 'Low',
        category: isScam ? mockCategories[Math.floor(Math.random() * 3)] : 'Safe',
        summary: isScam ? 'This screenshot contains indicators of a scam.' : 'No significant threat indicators found.',
        recommendations: isScam
          ? ['Do not click any links.', 'Block the sender.', 'Report to your bank if financial details are mentioned.']
          : ['The message appears safe.', 'Verify sender identity through official channels.'],
        source: 'Mock Scanner'
      });
    }
  } catch (error) {
    console.error('Screenshot scan error:', error);
    res.status(500).json({ error: 'Failed to analyze screenshot.' });
  }
});

// 5. AI CHATBOT
app.post('/api/chat', async (req, res) => {
  const { message, history = [] } = req.body;
  if (!message) return res.status(400).json({ error: 'Message is required.' });
  try {
    if (openaiReady) {
      const response = await openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [
          { role: 'system', content: 'You are CyberAngel AI, a helpful cybersecurity assistant for Indian users. Help identify scams, explain security concepts simply in context of India (UPI, Aadhaar, PAN, etc.), and provide actionable advice. Keep answers concise and friendly.' },
          ...history, { role: 'user', content: message }
        ]
      });
      res.json({ reply: response.choices[0].message.content });
    } else {
      res.json({ reply: `I understand your concern about "${message.substring(0, 30)}...". Always verify sender identity before clicking links or sharing information.`, source: 'Mock AI' });
    }
  } catch (error) {
    console.error('Chat error:', error);
    res.status(500).json({ error: 'Chat failed.' });
  }
});

// 6. SCAM REPORTS
app.post('/api/reports', async (req, res) => {
  const { type, content, description, userEmail, attachmentUrl } = req.body;
  if (!type || !content) return res.status(400).json({ error: 'Type and content are required.' });
  const newReport = {
    id: Date.now().toString(), type, content, description,
    userEmail: userEmail || 'anonymous', attachmentUrl,
    status: 'pending_review', createdAt: new Date().toISOString()
  };
  if (firebaseAvailable && db) {
    try {
      await db.collection('reports').doc(newReport.id).set(newReport);
      return res.status(201).json({ message: 'Report submitted.', reportId: newReport.id });
    } catch (error) { console.error('Firebase error:', error); }
  }
  mockDatabase.reports.push(newReport);
  res.status(201).json({ message: 'Report submitted.', reportId: newReport.id });
});

app.get('/api/reports', async (req, res) => {
  try {
    if (firebaseAvailable && db) {
      const snapshot = await db.collection('reports').orderBy('createdAt', 'desc').limit(50).get();
      const reports = [];
      snapshot.forEach(doc => reports.push({ id: doc.id, ...doc.data() }));
      return res.json(reports);
    }
  } catch (error) { console.error('Firebase error:', error); }
  res.json(mockDatabase.reports);
});

// 7. LESSONS
app.get('/api/lessons', async (req, res) => {
  try {
    if (firebaseAvailable && db) {
      const snapshot = await db.collection('lessons').get();
      if (!snapshot.empty) {
        const lessons = [];
        snapshot.forEach(doc => lessons.push({ id: doc.id, ...doc.data() }));
        return res.json(lessons);
      }
    }
  } catch (error) { console.error('Firebase error:', error); }
  res.json(mockDatabase.lessons);
});

// 8. TRAINER SCENARIOS
app.get('/api/trainer/scenarios', async (req, res) => {
  try {
    if (firebaseAvailable && db) {
      const snapshot = await db.collection('trainer_scenarios').get();
      if (!snapshot.empty) {
        const scenarios = [];
        snapshot.forEach(doc => scenarios.push({ id: doc.id, ...doc.data() }));
        return res.json(scenarios);
      }
    }
  } catch (error) { console.error('Firebase error:', error); }
  res.json(mockDatabase.trainerScenarios);
});

app.post('/api/trainer/submit', async (req, res) => {
  const { userId, scenarioId, userAnswer, correctAnswer } = req.body;
  if (!userId || !scenarioId || userAnswer === undefined) {
    return res.status(400).json({ error: 'Required fields missing.' });
  }
  const isCorrect = userAnswer === correctAnswer;
  const xpGained = isCorrect ? 10 : 0;
  try {
    const progress = await getUserProgress(userId);
    progress.xp = (progress.xp || 0) + xpGained;
    progress.accuracy = ((progress.accuracy || 0) + (isCorrect ? 1 : 0)) / 2;
    await saveUserProgress(userId, progress);
    res.json({ isCorrect, xpGained, newXp: progress.xp });
  } catch (error) {
    console.error('Trainer submit error:', error);
    res.status(500).json({ error: 'Failed to submit answer.' });
  }
});

// 9. USER PROGRESS
app.get('/api/user/progress', async (req, res) => {
  const userId = req.query.userId || 'default';
  try {
    const progress = await getUserProgress(userId);
    res.json(progress || mockDatabase.userProgress.default);
  } catch (error) {
    console.error('Progress error:', error);
    res.status(500).json({ error: 'Failed to fetch progress.' });
  }
});

app.post('/api/user/progress', async (req, res) => {
  const { userId, moduleId, xpGained } = req.body;
  if (!moduleId || typeof xpGained !== 'number') {
    return res.status(400).json({ error: 'Required fields missing.' });
  }
  const uid = userId || 'default';
  try {
    const progress = await getUserProgress(uid);
    progress.xp = (progress.xp || 0) + xpGained;
    progress.completedModules = [...new Set([...(progress.completedModules || []), moduleId])];
    if (progress.xp >= (progress.xpToNext || 500)) {
      progress.level = 'Expert';
      progress.xpToNext = 1000;
    }
    await saveUserProgress(uid, progress);
    res.json({ success: true, newXp: progress.xp, newLevel: progress.level });
  } catch (error) {
    console.error('Progress update error:', error);
    res.status(500).json({ error: 'Failed to update progress.' });
  }
});

// 10. ALERTS
app.get('/api/alerts', async (req, res) => {
  try {
    if (firebaseAvailable && db) {
      const snapshot = await db.collection('alerts').orderBy('date', 'desc').limit(10).get();
      if (!snapshot.empty) {
        const alerts = [];
        snapshot.forEach(doc => alerts.push({ id: doc.id, ...doc.data() }));
        return res.json(alerts);
      }
    }
  } catch (error) { console.error('Firebase error:', error); }
  res.json(mockDatabase.alerts);
});

// 11. DASHBOARD
app.get('/api/dashboard', async (req, res) => {
  const userId = req.query.userId || 'default';
  try {
    const userProgress = await getUserProgress(userId);
    res.json({
      userStats: {
        level: userProgress.level, xp: userProgress.xp, xpToNext: userProgress.xpToNext,
        modulesCompleted: (userProgress.completedModules || []).length, totalModules: 12,
        badges: userProgress.badges || [], totalReports: userProgress.totalReports || 0,
        reportsSubmitted: userProgress.totalReports || 0, accuracy: userProgress.accuracy || 0
      },
      scamTrends: [
        { name: 'Mon', Phishing: 4000, OTP: 2400, Job: 2400 },
        { name: 'Tue', Phishing: 3000, OTP: 1398, Job: 2210 },
        { name: 'Wed', Phishing: 2000, OTP: 9800, Job: 2290 },
        { name: 'Thu', Phishing: 2780, OTP: 3908, Job: 2000 },
        { name: 'Fri', Phishing: 1890, OTP: 4800, Job: 2181 },
        { name: 'Sat', Phishing: 2390, OTP: 3800, Job: 2500 },
        { name: 'Sun', Phishing: 3490, OTP: 4300, Job: 2100 }
      ],
      reportsData: [
        { month: 'Jan', reports: 120 }, { month: 'Feb', reports: 150 },
        { month: 'Mar', reports: 220 }, { month: 'Apr', reports: 180 },
        { month: 'May', reports: 290 }, { month: 'Jun', reports: 350 }
      ]
    });
  } catch (error) {
    console.error('Dashboard error:', error);
    res.status(500).json({ error: 'Failed to fetch dashboard.' });
  }
});

// ==========================================================
//  STATIC FILE SERVING (Production) — After all API routes
// ==========================================================
const hubDistPath = path.resolve(__dirname, '../artifacts/cyber-safety-hub/dist/public');
const videoDistPath = path.resolve(__dirname, '../artifacts/cyber-surakshit-video/dist/public');

// Serve video module static files
if (fs.existsSync(videoDistPath)) {
  app.use('/cyber-surakshit-video', express.static(videoDistPath));
}

// Serve main frontend static files
const frontendDistExists = fs.existsSync(path.join(hubDistPath, 'index.html'));
if (frontendDistExists) {
  app.use(express.static(hubDistPath));
}

// SPA fallback — send index.html for all non-API routes
app.get('*', (req, res) => {
  if (req.path.startsWith('/api')) return res.status(404).json({ error: 'API route not found' });
  if (frontendDistExists) {
    return res.sendFile(path.join(hubDistPath, 'index.html'));
  }
  res.status(200).send('CyberAngel API is running. Build the frontend with: cd artifacts/cyber-safety-hub && npm run build');
});

// ========== ERROR HANDLING & SERVER START ==========
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

app.listen(PORT, () => {
  console.log(`\n✅ CyberAngel Unified Portal running on http://localhost:${PORT}`);
  console.log(`📊 Database: ${firebaseAvailable ? 'Firebase (cyberangle)' : 'Mock Database'}`);
  console.log(`🤖 OpenAI: ${openaiReady ? 'Enabled' : 'Mock mode'}`);
  console.log(`🌐 Frontend: http://localhost:${PORT}/`);
  console.log(`🎬 Video:    http://localhost:${PORT}/cyber-surakshit-video/`);
  console.log(`📡 API:      http://localhost:${PORT}/api/health`);
});
