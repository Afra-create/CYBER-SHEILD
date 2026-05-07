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
    return this.request<{
      isScam: boolean;
      threatLevel: string;
      analysis: string;
      source?: string;
    }>('/api/scan', {
      method: 'POST',
      body: JSON.stringify({ text }),
    });
  }

  // Scan screenshot for threats (AI Vision)
  async scanScreenshot(image: string) {
    return this.request<{
      isScam: boolean;
      confidence: number;
      threatLevel: string;
      category: string;
      summary: string;
      recommendations: string[];
      source?: string;
    }>('/api/scan-screenshot', {
      method: 'POST',
      body: JSON.stringify({ image }),
    });
  }

  // Chat with AI assistant
  async chat(message: string, history: any[] = []) {
    return this.request<{
      reply: string;
      source?: string;
    }>('/api/chat', {
      method: 'POST',
      body: JSON.stringify({ message, history }),
    });
  }

  // Submit scam report
  async submitReport(report: {
    type: string;
    content: string;
    description?: string;
    userEmail?: string;
    attachmentUrl?: string;
  }) {
    return this.request<{
      message: string;
      reportId: string;
    }>('/api/reports', {
      method: 'POST',
      body: JSON.stringify(report),
    });
  }

  // Get reports
  async getReports() {
    return this.request<Array<{
      id: string;
      type: string;
      content: string;
      description?: string;
      userEmail: string;
      status: string;
      createdAt: string;
    }>>('/api/reports');
  }

  // Get alerts
  async getAlerts() {
    return this.request<Array<{
      id: string;
      type: string;
      message: string;
      date: string;
      severity: string;
      region?: string;
    }>>('/api/alerts');
  }

  // Get lessons
  async getLessons() {
    return this.request<Array<{
      id: string;
      title: string;
      category: string;
      duration: string;
      description: string;
      videoUrl: string;
    }>>('/api/lessons');
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
    const query = userId ? `?userId=${userId}` : '';
    return this.request<{
      userStats: {
        level: string;
        xp: number;
        xpToNext: number;
        modulesCompleted: number;
        totalModules: number;
        reportsSubmitted: number;
        totalReports: number;
        accuracy: number;
        badges: string[];
      };
      scamTrends: Array<{
        name: string;
        Phishing: number;
        OTP: number;
        Job: number;
      }>;
      reportsData: Array<{
        month: string;
        reports: number;
      }>;
    }>(`/api/dashboard${query}`);
  }

  // Get user progress
  async getUserProgress(userId?: string) {
    const query = userId ? `?userId=${userId}` : '';
    return this.request<{
      userId: string;
      level: string;
      xp: number;
      xpToNext: number;
      badges: string[];
      completedModules: string[];
      streak: number;
      totalReports: number;
      accuracy: number;
    }>(`/api/user/progress${query}`);
  }

  // Update user progress
  async updateProgress(data: { userId?: string; moduleId: string; xpGained: number }) {
    return this.request<{
      success: boolean;
      newXp: number;
      newLevel?: string;
    }>('/api/user/progress', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }
}

export const apiClient = new ApiClient();