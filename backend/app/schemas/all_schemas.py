from typing import List, Optional, Dict, Any
from pydantic import BaseModel, Field

# Authentication
class LoginRequest(BaseModel):
    email: str
    password: str

class UserResponse(BaseModel):
    id: str
    email: str
    full_name: str
    role: str
    avatar_url: Optional[str] = None
    institution_id: Optional[str] = None
    department: Optional[str] = None
    is_super_admin: bool = False

class AuthResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserResponse

# Institutions
class InstitutionCreate(BaseModel):
    name: str
    code: str
    slug: str
    domain: Optional[str] = None
    contact_email: Optional[str] = None
    phone: Optional[str] = None
    address: Optional[str] = None

class InstitutionResponse(BaseModel):
    id: str
    name: str
    code: str
    slug: str
    domain: Optional[str] = None
    contact_email: Optional[str] = None
    phone: Optional[str] = None
    address: Optional[str] = None
    is_active: bool = True
    created_at: Optional[str] = None

# Students
class StudentProfileCreate(BaseModel):
    user_id: Optional[str] = None
    email: str
    full_name: str
    roll_number: str
    department: str
    batch_year: int
    current_semester: int = 1
    cgpa: float = 0.0
    tenth_percentage: Optional[float] = None
    twelfth_percentage: Optional[float] = None
    career_aspirations: Optional[str] = None

class StudentProfileResponse(BaseModel):
    id: str
    user_id: str
    institution_id: str
    full_name: str
    email: str
    roll_number: str
    department: str
    batch_year: int
    current_semester: int
    cgpa: float
    tenth_percentage: Optional[float] = None
    twelfth_percentage: Optional[float] = None
    resume_url: Optional[str] = None
    career_aspirations: Optional[str] = None
    created_at: Optional[str] = None

# Companies & Requirements
class RequiredSkillItem(BaseModel):
    name: str
    min_level: int = 3

class CompanyCreate(BaseModel):
    name: str
    industry: Optional[str] = None
    website: Optional[str] = None
    description: Optional[str] = None
    tier: str = "tier_1"

class CompanyRequirementCreate(BaseModel):
    job_role: str
    min_cgpa: float = 6.0
    max_backlogs: int = 0
    eligible_departments: List[str] = []
    required_skills: List[RequiredSkillItem] = []
    min_aptitude_score: float = 60.0
    min_coding_score: float = 60.0
    min_technical_score: float = 60.0
    min_communication_score: float = 60.0
    salary_package: Optional[str] = None

# Assessments
class QuestionCreate(BaseModel):
    question_text: str
    question_type: str = "mcq"
    options: List[str]
    correct_answer: str
    explanation: Optional[str] = None
    marks: float = 5.0
    skill: Optional[str] = None
    difficulty: str = "medium"

class AssessmentCreate(BaseModel):
    title: str
    description: Optional[str] = None
    category: str = "aptitude"
    difficulty: str = "medium"
    duration_minutes: int = 30
    total_marks: float = 100.0
    pass_marks: float = 40.0
    max_attempts: int = 3
    questions: Optional[List[QuestionCreate]] = []

class AnswerSubmission(BaseModel):
    question_id: str
    user_answer: str

class SubmitAssessmentRequest(BaseModel):
    answers: List[AnswerSubmission]

# AI Quizzes & Assistance
class GenerateQuizRequest(BaseModel):
    topic: str
    question_count: int = 5
    difficulty: str = "medium"
    content: Optional[str] = ""

class ExplainQuestionRequest(BaseModel):
    question_text: str
    correct_answer: str
    user_answer: Optional[str] = None
    explanation: Optional[str] = None

class MockInterviewRequest(BaseModel):
    company_name: str
    job_role: str
    focus_area: str = "Mixed (Technical & Behavioral)"
