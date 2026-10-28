import {
  User,
  Institution,
  StudentProfile,
  SkillItem,
  Assessment,
  AssessmentAttempt,
  AttemptResultDetail,
  Company,
  CompanyRequirement,
  SkillGapAnalysis,
  ReadinessSnapshot,
  LearningResource,
  Subscription,
} from '../types';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5190/api/v1';

class ApiClient {
  private getToken(): string | null {
    return localStorage.getItem('samarthya_token');
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;
    const token = this.getToken();

    const headers: Record<string, string> = {
      ...(options.headers as Record<string, string>),
    };

    if (!(options.body instanceof FormData)) {
      headers['Content-Type'] = 'application/json';
    }

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(url, {
      ...options,
      headers,
    });

    if (!response.ok) {
      let errorMsg = `API Error ${response.status}: ${response.statusText}`;
      try {
        const errorData = await response.json();
        if (errorData.detail) {
          errorMsg = typeof errorData.detail === 'string' ? errorData.detail : JSON.stringify(errorData.detail);
        }
      } catch {
        // use default error message
      }
      throw new Error(errorMsg);
    }

    return response.json();
  }

  // Auth
  async login(email: string, password: string): Promise<{ access_token: string; user: User }> {
    return this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  }

  async getCurrentUser(): Promise<User> {
    return this.request('/auth/me');
  }

  async logout(): Promise<void> {
    localStorage.removeItem('samarthya_token');
    localStorage.removeItem('samarthya_user');
  }

  // Health
  async getHealth(): Promise<any> {
    return this.request('/health');
  }

  // Institutions
  async getInstitutions(): Promise<Institution[]> {
    return this.request('/institutions');
  }

  async getInstitution(id: string): Promise<Institution> {
    return this.request(`/institutions/${id}`);
  }

  async createInstitution(data: Partial<Institution>): Promise<Institution> {
    return this.request('/institutions', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async getDepartments(institutionId: string): Promise<string[]> {
    return this.request(`/institutions/${institutionId}/departments`);
  }

  // Students
  async getStudents(filters?: { department?: string; batch_year?: number; min_cgpa?: number }): Promise<StudentProfile[]> {
    const params = new URLSearchParams();
    if (filters?.department) params.append('department', filters.department);
    if (filters?.batch_year) params.append('batch_year', String(filters.batch_year));
    if (filters?.min_cgpa) params.append('min_cgpa', String(filters.min_cgpa));
    const qs = params.toString() ? `?${params.toString()}` : '';
    return this.request(`/students${qs}`);
  }

  async getStudent(id: string): Promise<StudentProfile> {
    return this.request(`/students/${id}`);
  }

  async getStudentSkills(id: string): Promise<SkillItem[]> {
    return this.request(`/students/${id}/skills`);
  }

  // Companies & Requirements
  async getCompanies(): Promise<Company[]> {
    return this.request('/companies');
  }

  async createCompany(data: { name: string; industry?: string; website?: string; description?: string; tier: string }): Promise<Company> {
    return this.request('/companies', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async getCompanyRequirements(companyId: string): Promise<CompanyRequirement[]> {
    return this.request(`/companies/${companyId}/requirements`);
  }

  async createCompanyRequirement(companyId: string, data: Partial<CompanyRequirement>): Promise<CompanyRequirement> {
    return this.request(`/companies/${companyId}/requirements`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async getAllRequirements(): Promise<CompanyRequirement[]> {
    return this.request('/companies/all/requirements');
  }

  // Assessments
  async getAssessments(category?: string): Promise<Assessment[]> {
    const qs = category ? `?category=${category}` : '';
    return this.request(`/assessments${qs}`);
  }

  async getAssessment(id: string): Promise<Assessment> {
    return this.request(`/assessments/${id}`);
  }

  async createAssessment(data: Partial<Assessment>): Promise<Assessment> {
    return this.request('/assessments', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async startAssessment(assessmentId: string): Promise<{ attempt_id: string; duration_minutes: number }> {
    return this.request(`/assessments/${assessmentId}/start`, {
      method: 'POST',
    });
  }

  async submitAssessment(attemptId: string, answers: Array<{ question_id: string; user_answer: string }>): Promise<any> {
    return this.request(`/assessments/attempts/${attemptId}/submit`, {
      method: 'POST',
      body: JSON.stringify({ answers }),
    });
  }

  async getAttemptsHistory(): Promise<AssessmentAttempt[]> {
    return this.request('/assessments/attempts/history');
  }

  async getAttemptResult(attemptId: string): Promise<AttemptResultDetail> {
    return this.request(`/assessments/attempts/${attemptId}/result`);
  }

  // Skill-Gap & Readiness
  async getSkillGap(studentId: string, companyId: string): Promise<SkillGapAnalysis> {
    return this.request(`/skill-gap/student/${studentId}/company/${companyId}`);
  }

  async getReadiness(studentId: string): Promise<ReadinessSnapshot> {
    return this.request(`/readiness/student/${studentId}`);
  }

  async recalculateReadiness(studentId: string): Promise<ReadinessSnapshot> {
    return this.request(`/readiness/student/${studentId}/recalculate`, {
      method: 'POST',
    });
  }

  // Learning
  async getLearningResources(): Promise<LearningResource[]> {
    return this.request('/learning/resources');
  }

  async uploadLearningResource(file: File, title: string, description: string): Promise<LearningResource> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('title', title);
    formData.append('description', description);

    return this.request('/learning/resources/upload', {
      method: 'POST',
      body: formData,
    });
  }

  async getRecommendations(): Promise<any[]> {
    return this.request('/learning/recommendations');
  }

  // AI Service
  async getAIStatus(): Promise<any> {
    return this.request('/ai/status');
  }

  async generateQuiz(data: { topic: string; question_count: number; difficulty: string; content?: string }): Promise<any> {
    return this.request('/ai/generate-quiz', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async explainQuestion(data: { question_text: string; correct_answer: string; user_answer?: string }): Promise<any> {
    return this.request('/ai/explain-question', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async getMockInterviewQuestions(data: { company_name: string; job_role: string; focus_area?: string }): Promise<any> {
    return this.request('/ai/mock-interview-questions', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  // Analytics
  async getAnalyticsOverview(institutionId: string): Promise<any> {
    return this.request(`/analytics/institution/${institutionId}/overview`);
  }

  getExportCsvUrl(institutionId: string): string {
    return `${API_BASE_URL}/analytics/institution/${institutionId}/export-csv`;
  }

  // Subscriptions
  async getSubscriptions(): Promise<Subscription[]> {
    return this.request('/subscriptions');
  }
}

export const api = new ApiClient();
