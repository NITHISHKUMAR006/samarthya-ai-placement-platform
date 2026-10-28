export type Role = 'student' | 'faculty' | 'institution_admin' | 'super_admin';

export interface User {
  id: string;
  email: string;
  full_name: string;
  role: Role;
  avatar_url?: string;
  institution_id?: string;
  department?: string;
  is_super_admin?: boolean;
}

export interface Institution {
  id: string;
  name: string;
  code: string;
  slug: string;
  domain?: string;
  contact_email?: string;
  phone?: string;
  address?: string;
  is_active: boolean;
}

export interface StudentProfile {
  id: string;
  user_id: string;
  institution_id: string;
  full_name: string;
  email: string;
  roll_number: string;
  department: string;
  batch_year: number;
  current_semester: number;
  cgpa: number;
  tenth_percentage?: number;
  twelfth_percentage?: number;
  resume_url?: string;
  career_aspirations?: string;
}

export interface SkillItem {
  id: string;
  name: string;
  category: 'aptitude' | 'programming' | 'technical' | 'communication' | 'soft_skills';
  proficiency_level: number;
  icon?: string;
}

export interface Question {
  id: string;
  assessment_id: string;
  question_text: string;
  question_type: string;
  options: string[];
  correct_answer?: string;
  explanation?: string;
  marks: number;
  skill?: string;
  difficulty: 'easy' | 'medium' | 'hard';
}

export interface Assessment {
  id: string;
  institution_id: string;
  title: string;
  description?: string;
  category: 'aptitude' | 'programming' | 'technical' | 'communication' | 'mock_company';
  difficulty: 'easy' | 'medium' | 'hard' | 'mixed';
  duration_minutes: number;
  total_marks: number;
  pass_marks: number;
  max_attempts: number;
  question_count?: number;
  attempts_count?: number;
  user_completed?: boolean;
  best_score?: number;
  questions?: Question[];
}

export interface AssessmentAttempt {
  id: string;
  assessment_id: string;
  assessment_title?: string;
  category?: string;
  user_id: string;
  status: 'in_progress' | 'submitted' | 'evaluated' | 'expired';
  start_time: string;
  submit_time?: string;
  score: number;
  percentage: number;
  passed: boolean;
  feedback?: string;
}

export interface AttemptResultDetail {
  attempt: AssessmentAttempt;
  assessment: Assessment;
  result: {
    score_breakdown: Record<string, number>;
    strengths: string[];
    weaknesses: string[];
  };
  questions: Question[];
}

export interface Company {
  id: string;
  institution_id: string;
  name: string;
  logo_url?: string;
  website?: string;
  industry?: string;
  description?: string;
  tier: 'tier_1' | 'tier_2' | 'tier_3' | 'dream' | 'super_dream';
  requirements_count?: number;
  roles?: string[];
}

export interface CompanyRequirement {
  id: string;
  company_id: string;
  company_name?: string;
  job_role: string;
  min_cgpa: number;
  max_backlogs: number;
  eligible_departments: string[];
  required_skills: Array<{ name: string; min_level: number }>;
  min_aptitude_score: number;
  min_coding_score: number;
  min_technical_score: number;
  min_communication_score: number;
  salary_package?: string;
}

export interface SkillGapAnalysis {
  student_id: string;
  student_name: string;
  company_id: string;
  company_name: string;
  job_role: string;
  overall_match_percentage: number;
  readiness_status: 'meets_criteria' | 'preparation_in_progress' | 'skills_requiring_improvement' | 'insufficient_information';
  eligibility: {
    cgpa_met: boolean;
    student_cgpa: number;
    min_cgpa_required: number;
    department_eligible: boolean;
    student_department: string;
  };
  skills_breakdown: Array<{
    skill_name: string;
    required_level: number;
    current_level: number;
    gap: number;
    status: 'met' | 'action_needed';
    recommendation: string;
  }>;
  action_items: string[];
}

export interface ReadinessSnapshot {
  id: string;
  user_id: string;
  institution_id: string;
  target_company_id?: string;
  target_company_name?: string;
  target_role?: string;
  overall_readiness_score: number;
  status: 'meets_criteria' | 'preparation_in_progress' | 'skills_requiring_improvement' | 'insufficient_information';
  skill_gaps: Array<{
    skill: string;
    current_level: number;
    required_level: number;
    gap: number;
    recommendation: string;
  }>;
  strengths: string[];
  recommendations: string[];
  calculated_at: string;
}

export interface LearningResource {
  id: string;
  institution_id: string;
  title: string;
  description?: string;
  resource_type: string;
  file_size_bytes: number;
  processing_status: 'pending' | 'processing' | 'completed' | 'failed';
  chunks_count?: number;
  created_at: string;
}

export interface Subscription {
  id: string;
  institution_id: string;
  institution_name: string;
  plan_tier: 'starter' | 'professional' | 'enterprise';
  status: 'active' | 'trial' | 'past_due' | 'canceled';
  max_students: number;
  max_faculty: number;
  ai_quota_monthly: number;
  starts_at?: string;
  ends_at?: string;
}
