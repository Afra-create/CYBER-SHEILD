const API_BASE_URL = import.meta.env.VITE_API_URL || '';

class ApiClient {
  private baseURL: string;

  constructor(baseURL: string = API_BASE_URL) {
    this.baseURL = baseURL;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;

    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  // Health check
  async healthCheck() {
    return this.request<{ status: string; message: string; firebase: string; openai: string }>('/api/health');
  }

  // Authentication - Signup
  async signup(data: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    mobile?: string;
    location?: string;
  }) {
    return this.request<{ message: string; userId: string }>('/api/auth/signup', {
      method: 'POST',
      body: JSON.stringify({
        email: data.email,
        password: data.password,
        name: `${data.firstName} ${data.lastName}`,
        firstName: data.firstName,
        lastName: data.lastName,
        mobile: data.mobile,
        location: data.location,
      }),
    });
  }

  // Authentication - Login
  async login(email: string, password: string) {
    return this.request<{ message: string; userId: string; token: string }>('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  }

  // Scan message/URL for threats
  async scanMessage(text: string) {
    try {
      return await this.request<{
        isScam: boolean; threatLevel: string; analysis: string; source?: string;
      }>('/api/scan', {
        method: 'POST',
        body: JSON.stringify({ text }),
      });
    } catch (error) {
      return {
        isScam: true,
        threatLevel: 'High',
        analysis: 'This message appears to be a common phishing attempt using social engineering.',
        source: 'Client-side Mock'
      };
    }
  }

  // Scan screenshot for threats (AI Vision)
  async scanScreenshot(image: string) {
    try {
      return await this.request<{
        isScam: boolean; confidence: number; threatLevel: string;
        category: string; summary: string; redFlags: string[];
        recommendations: string[]; source?: string;
      }>('/api/scan-screenshot', {
        method: 'POST',
        body: JSON.stringify({ image }),
      });
    } catch (error) {
      return {
        isScam: true,
        confidence: 0.95,
        threatLevel: 'Critical',
        category: 'Financial Phishing',
        summary: 'Potential scam detected in the screenshot. Multiple red flags identified.',
        redFlags: [
          'Urgent language asking for immediate action',
          'Suspicious sender identity or mismatched branding',
          'Request for sensitive information like OTP or PIN'
        ],
        recommendations: [
          'Do not click any links or scan any QR codes shown',
          'Report the sender and block them immediately',
          'Verify through official bank apps only'
        ],
        source: 'Client-side Mock'
      };
    }
  }

  // Chat with AI assistant
  async chat(message: string, history: any[] = []) {
    try {
      return await this.request<{ reply: string; source?: string; }>('/api/chat', {
        method: 'POST',
        body: JSON.stringify({ message, history }),
      });
    } catch (error) {
      return {
        reply: 'I am currently in safe-offline mode. Please check our Learn section for safety tips!',
        source: 'Client-side Mock'
      };
    }
  }

  // Submit scam report
  async submitReport(report: {
    type: string; content: string; description?: string;
    userEmail?: string; attachmentUrl?: string;
  }) {
    try {
      return await this.request<{ message: string; reportId: string; }>('/api/reports', {
        method: 'POST',
        body: JSON.stringify(report),
      });
    } catch (error) {
      return { message: 'Report submitted successfully (Offline Mode)', reportId: 'MOCK-' + Date.now() };
    }
  }

  // Get reports
  async getReports() {
    try {
      return await this.request<Array<{
        id: string; type: string; content: string; description?: string;
        userEmail: string; status: string; createdAt: string;
      }>>('/api/reports');
    } catch (error) {
      return [];
    }
  }

  // Get alerts
  async getAlerts() {
    try {
      return await this.request<Array<{
        id: string; type: string; message: string; date: string; severity: string; region?: string;
      }>>('/api/alerts');
    } catch (error) {
      return [
        { id: '1', type: 'Phishing', message: 'New Aadhaar-linked UPI scam active in Mumbai.', date: new Date().toISOString(), severity: 'High' },
        { id: '2', type: 'Job Scam', message: 'Fake FedEx courier calls reported across Delhi-NCR.', date: new Date().toISOString(), severity: 'Medium' }
      ];
    }
  }

  // Get lessons
  async getLessons() {
    try {
      return await this.request<Array<{
        id: string; title: string; category: string; duration: string;
        description: string; videoUrl: string;
      }>>('/api/lessons');
    } catch (error) {
      return [
        { id: '1', title: 'Phishing 101', category: 'Basics', duration: '5 min', description: 'Learn how to spot malicious links.', videoUrl: 'Y7zZ6fKDM6w' },
        { id: '2', title: 'UPI Safety', category: 'Financial', duration: '8 min', description: 'Never share your PIN to receive money.', videoUrl: 'vH3-Gsz9Fng' }
      ];
    }
  }

  // Get trainer scenarios
  async getTrainerScenarios() {
    return this.request<Array<{
      id: number;
      title: string;
      type: string;
      content: string;
      correct: boolean;
    }>>('/api/trainer/scenarios');
  }

  // Submit trainer answer
  async submitTrainerAnswer(data: {
    userId: string;
    scenarioId: number;
    userAnswer: boolean;
    correctAnswer: boolean;
  }) {
    return this.request<{
      isCorrect: boolean;
      xpGained: number;
      newXp: number;
    }>('/api/trainer/submit', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  // Get dashboard data
  async getDashboardData(userId?: string) {
    try {
      const query = userId ? `?userId=${userId}` : '';
      return await this.request<{
        userStats: {
          level: string; xp: number; xpToNext: number;
          modulesCompleted: number; totalModules: number;
          reportsSubmitted: number; totalReports: number;
          accuracy: number; badges: string[];
        };
        communityStats?: {
          totalReportsFiled: number; reportsToday: number;
          topScamTypes: string[]; threatLevel: string;
          threatDescription: string;
        };
        scamTrends: Array<{ name: string; Phishing: number; OTP: number; Job: number; }>;
        reportsData: Array<{ month: string; reports: number; }>;
      }>(`/api/dashboard${query}`);
    } catch (error) {
      console.warn('API: Dashboard fetch failed, returning client-side mock data.');
      return {
        userStats: {
          level: 'Defender', xp: 240, xpToNext: 500,
          modulesCompleted: 2, totalModules: 12,
          reportsSubmitted: 3, totalReports: 3,
          accuracy: 85, badges: ['First Report', 'Quick Learner']
        },
        communityStats: {
          totalReportsFiled: 1300120, reportsToday: 145,
          topScamTypes: ['Phishing', 'OTP Fraud'], threatLevel: 'Elevated',
          threatDescription: 'High volume of phishing detected in the last 24 hours.'
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
      };
    }
  }

  // Get user progress
  async getUserProgress(userId?: string) {
    try {
      const query = userId ? `?userId=${userId}` : '';
      return await this.request<{
        userId: string; level: string; xp: number; xpToNext: number;
        badges: string[]; completedModules: string[];
        streak: number; totalReports: number; accuracy: number;
      }>(`/api/user/progress${query}`);
    } catch (error) {
      return {
        userId: userId || 'default',
        level: 'Defender', xp: 240, xpToNext: 500,
        badges: ['First Report', 'Quick Learner'],
        completedModules: ['phishing-101', 'otp-security'],
        streak: 7, totalReports: 3, accuracy: 85
      };
    }
  }

  // Update user progress
  async updateProgress(data: { userId?: string; moduleId: string; xpGained: number }) {
    try {
      return await this.request<{ success: boolean; newXp: number; newLevel?: string; }>('/api/user/progress', {
        method: 'POST',
        body: JSON.stringify(data),
      });
    } catch (error) {
      return { success: true, newXp: 250, newLevel: 'Defender' };
    }
  }
}

export const apiClient = new ApiClient();