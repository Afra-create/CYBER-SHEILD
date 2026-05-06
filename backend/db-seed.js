/**
 * db-seed.js — Seeds the Firestore database with initial data.
 * Run once: node db-seed.js
 */
import admin from 'firebase-admin';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const serviceAccountPath = path.join(__dirname, 'serviceAccountKey.json');
const serviceAccount = JSON.parse(fs.readFileSync(serviceAccountPath, 'utf8'));

admin.initializeApp({ credential: admin.credential.cert(serviceAccount) });
const db = admin.firestore();

async function seed() {
  console.log('🌱 Seeding Firestore for project:', serviceAccount.project_id);

  // --- Lessons ---
  const lessons = [
    { id: 'phishing-101', title: 'Phishing 101', category: 'Phishing', duration: '5 min', description: 'Learn to identify phishing attempts — fake links, emails, and SMS tricks.', videoUrl: '/cyber-surakshit-video/', difficulty: 'Beginner', order: 1 },
    { id: 'otp-security', title: 'OTP & Bank Fraud', category: 'OTP Fraud', duration: '3 min', description: 'Protect your One-Time Passwords from scammers impersonating bank officials.', videoUrl: '/cyber-surakshit-video/', difficulty: 'Intermediate', order: 2 },
    { id: 'social-eng', title: 'Social Engineering', category: 'Social Engineering', duration: '7 min', description: 'Understand social manipulation tactics used by con artists online and offline.', videoUrl: '/cyber-surakshit-video/', difficulty: 'Intermediate', order: 3 },
    { id: 'job-scams', title: 'Fake Job Scams', category: 'Job Fraud', duration: '5 min', description: 'Identify fraudulent work-from-home offers and advance-fee job scams.', videoUrl: '/cyber-surakshit-video/', difficulty: 'Intermediate', order: 4 },
    { id: 'upi-safety', title: 'UPI & Digital Payment Safety', category: 'Payment Fraud', duration: '4 min', description: 'Stay safe while using UPI, PhonePe, GPay, and Paytm.', videoUrl: '/cyber-surakshit-video/', difficulty: 'Beginner', order: 5 },
    { id: 'social-media', title: 'Social Media Impersonation', category: 'Social Media', duration: '6 min', description: 'Protect yourself from cloned accounts and fake profiles asking for money.', videoUrl: '/cyber-surakshit-video/', difficulty: 'Advanced', order: 6 }
  ];

  for (const lesson of lessons) {
    await db.collection('lessons').doc(lesson.id).set(lesson);
    console.log(`  ✅ Lesson: ${lesson.title}`);
  }

  // --- Trainer Scenarios ---
  const scenarios = [
    {
      id: 'scn-1', title: 'Bank KYC SMS',
      type: 'sms', sender: 'BZ-HDFCBK',
      content: [
        { text: 'Dear Customer, ', isSus: false },
        { text: 'Your bank account has been blocked due to suspicious activity. ', isSus: true, explanation: 'Banks don\'t block accounts and notify via SMS.' },
        { text: 'Please verify your KYC immediately: ', isSus: false },
        { text: 'http://kyc-update-hdfc.info/login ', isSus: true, explanation: 'Fake URL. HDFC Bank uses hdfcbank.com.' },
        { text: 'Regards, HDFC Bank.', isSus: false }
      ],
      hint: 'Look for urgency and suspicious links.'
    },
    {
      id: 'scn-2', title: 'Prize Email',
      type: 'email', sender: 'support@amazon-rewards.com', subject: 'You\'ve won a new iPhone 15 Pro!',
      content: [
        { text: 'Congratulations! ', isSus: false },
        { text: 'You have been randomly selected to win a free iPhone 15 Pro. ', isSus: true, explanation: 'Too good to be true. Random giveaways are almost always scams.' },
        { text: 'To claim your prize, simply pay the shipping fee of ₹499 via UPI. ', isSus: true, explanation: 'Advanced fee fraud. Never pay to receive a prize.' },
        { text: 'Click here to claim: [LINK]', isSus: false }
      ],
      hint: 'If it sounds too good to be true, it probably is.'
    },
    {
      id: 'scn-3', title: 'Job Offer Scam',
      type: 'message', sender: '+91 98765 43210',
      content: [
        { text: 'Hello, we are hiring for ', isSus: false },
        { text: 'Work from Home data entry jobs paying ₹50,000/week. ', isSus: true, explanation: 'Unrealistic pay for simple work is a major red flag.' },
        { text: 'Please send ₹2,000 registration fee to start. ', isSus: true, explanation: 'Legitimate employers never ask for money upfront.' },
        { text: 'WhatsApp us for more details.', isSus: false }
      ],
      hint: 'Legitimate jobs pay you, not the other way around.'
    }
  ];

  for (const scenario of scenarios) {
    await db.collection('trainer_scenarios').doc(scenario.id).set(scenario);
    console.log(`  ✅ Scenario: ${scenario.title}`);
  }

  // --- Alerts ---
  const alerts = [
    { id: 'alert-1', type: 'SMS', message: 'High volume of fake delivery SMS reported across India.', date: new Date().toISOString(), severity: 'high', region: 'All' },
    { id: 'alert-2', type: 'Email', message: 'Phishing campaign targeting SBI and HDFC bank customers.', date: new Date(Date.now() - 86400000).toISOString(), severity: 'medium', region: 'All' },
    { id: 'alert-3', type: 'WhatsApp', message: 'Job scam alert: Fake WFH offers via WhatsApp groups.', date: new Date(Date.now() - 172800000).toISOString(), severity: 'high', region: 'North' },
    { id: 'alert-4', type: 'UPI', message: 'Fake UPI collect requests using merchant names.', date: new Date(Date.now() - 259200000).toISOString(), severity: 'high', region: 'South' }
  ];

  for (const alert of alerts) {
    await db.collection('alerts').doc(alert.id).set(alert);
    console.log(`  ✅ Alert: ${alert.message.substring(0, 50)}...`);
  }

  console.log('\n🎉 Seed complete! Firestore is ready.');
  process.exit(0);
}

seed().catch(err => {
  console.error('❌ Seed failed:', err);
  process.exit(1);
});
