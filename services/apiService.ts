// BRAINSAIT: Backend API Integration
// SECURITY: HIPAA-compliant API communication
// MEDICAL: Healthcare data handling

import { certificateService } from './certificateService';
import { documentService } from './documentService';
import { geminiService } from './geminiService';

/**
 * API Configuration
 */
const API_CONFIG = {
  baseUrl: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000',
  timeout: 30000, // 30 seconds
  retryAttempts: 3,
  retryDelay: 1000, // 1 second
};

/**
 * HIPAA: Audit logging for API calls
 */
function logAPICall(
  endpoint: string,
  method: string,
  status: 'success' | 'error',
  responseTime: number
) {
  console.log({
    timestamp: new Date().toISOString(),
    endpoint,
    method,
    status,
    responseTime,
    oid: '1.3.6.1.4.1.61026',
  });
}

/**
 * SECURITY: Fetch with timeout and retry
 */
async function fetchWithRetry(
  url: string,
  options: RequestInit,
  retryCount = 0
): Promise<Response> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), API_CONFIG.timeout);

  try {
    const startTime = Date.now();
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
    });
    const responseTime = Date.now() - startTime;

    logAPICall(url, options.method || 'GET', 'success', responseTime);
    
    clearTimeout(timeout);
    return response;
  } catch (error) {
    clearTimeout(timeout);

    if (retryCount < API_CONFIG.retryAttempts) {
      await new Promise(resolve => 
        setTimeout(resolve, API_CONFIG.retryDelay * (retryCount + 1))
      );
      return fetchWithRetry(url, options, retryCount + 1);
    }

    logAPICall(url, options.method || 'GET', 'error', 0);
    throw error;
  }
}

/**
 * NPHIES Integration Service
 */
class NPHIESService {
  private baseUrl = `${API_CONFIG.baseUrl}/nphies`;

  async submitClaim(claimData: any): Promise<any> {
    const response = await fetchWithRetry(`${this.baseUrl}/claims`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(claimData),
    });

    if (!response.ok) {
      throw new Error('Failed to submit claim');
    }

    return await response.json();
  }

  async requestAuthorization(authData: any): Promise<any> {
    const response = await fetchWithRetry(`${this.baseUrl}/authorization`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(authData),
    });

    if (!response.ok) {
      throw new Error('Failed to request authorization');
    }

    return await response.json();
  }

  async checkEligibility(patientId: string): Promise<any> {
    const response = await fetchWithRetry(
      `${this.baseUrl}/eligibility/${patientId}`,
      { method: 'GET' }
    );

    if (!response.ok) {
      throw new Error('Failed to check eligibility');
    }

    return await response.json();
  }
}

/**
 * Analytics Service
 */
class AnalyticsService {
  private baseUrl = `${API_CONFIG.baseUrl}/analytics`;

  async getDashboardStats(): Promise<any> {
    const response = await fetchWithRetry(`${this.baseUrl}/dashboard`, {
      method: 'GET',
    });

    if (!response.ok) {
      throw new Error('Failed to fetch dashboard stats');
    }

    return await response.json();
  }

  async getComplianceScore(): Promise<number> {
    const response = await fetchWithRetry(`${this.baseUrl}/compliance-score`, {
      method: 'GET',
    });

    if (!response.ok) {
      throw new Error('Failed to fetch compliance score');
    }

    const data = await response.json();
    return data.score;
  }

  async getUsageMetrics(period: 'day' | 'week' | 'month'): Promise<any> {
    const response = await fetchWithRetry(
      `${this.baseUrl}/metrics?period=${period}`,
      { method: 'GET' }
    );

    if (!response.ok) {
      throw new Error('Failed to fetch usage metrics');
    }

    return await response.json();
  }
}

/**
 * User Management Service
 */
class UserService {
  private baseUrl = `${API_CONFIG.baseUrl}/users`;

  async getCurrentUser(): Promise<any> {
    const response = await fetchWithRetry(`${this.baseUrl}/me`, {
      method: 'GET',
    });

    if (!response.ok) {
      throw new Error('Failed to fetch user');
    }

    return await response.json();
  }

  async updateProfile(profile: any): Promise<any> {
    const response = await fetchWithRetry(`${this.baseUrl}/profile`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(profile),
    });

    if (!response.ok) {
      throw new Error('Failed to update profile');
    }

    return await response.json();
  }
}

// Export all services
export const nphiesService = new NPHIESService();
export const analyticsService = new AnalyticsService();
export const userService = new UserService();

// Re-export existing services
export { certificateService, documentService, geminiService };

// Export API config
export { API_CONFIG };
