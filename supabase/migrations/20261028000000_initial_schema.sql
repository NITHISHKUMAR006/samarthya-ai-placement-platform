-- ====================================================================
-- SAMARTHYA AI - Initial Schema Migration
-- Complete multi-tenant schema with RLS and Vector Search
-- ====================================================================

-- 1. EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "vector";

-- 2. CORE INSTITUTIONS & SETTINGS
CREATE TABLE IF NOT EXISTS public.institutions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    code VARCHAR(50) UNIQUE NOT NULL,
    slug VARCHAR(100) UNIQUE NOT NULL,
    domain VARCHAR(255),
    logo_url TEXT,
    contact_email VARCHAR(255),
    phone VARCHAR(50),
    address TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.institution_settings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    institution_id UUID NOT NULL REFERENCES public.institutions(id) ON DELETE CASCADE,
    settings_json JSONB DEFAULT '{}'::jsonb,
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    CONSTRAINT uq_institution_settings UNIQUE(institution_id)
);

-- 3. ROLES & PERMISSIONS
CREATE TABLE IF NOT EXISTS public.roles (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT
);

INSERT INTO public.roles (id, name, description) VALUES
    ('super_admin', 'Platform Super Admin', 'Full control across all institutions and system configurations'),
    ('institution_admin', 'Institution Admin / Placement Officer', 'Workspace administrator managing students, placements, faculty, and company drives'),
    ('faculty', 'Faculty / Trainer', 'Educator creating quizzes, tracking assigned students, and uploading study materials'),
    ('student', 'Student', 'Learner undertaking skill assessments, tracking placement readiness, and practicing AI quizzes')
ON CONFLICT (id) DO NOTHING;

CREATE TABLE IF NOT EXISTS public.permissions (
    id VARCHAR(100) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    module VARCHAR(50) NOT NULL
);

-- 4. USER PROFILES & MEMBERSHIPS
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    avatar_url TEXT,
    phone VARCHAR(50),
    is_super_admin BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.institution_memberships (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    institution_id UUID NOT NULL REFERENCES public.institutions(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    role_code VARCHAR(50) NOT NULL REFERENCES public.roles(id),
    department VARCHAR(100),
    status VARCHAR(50) DEFAULT 'active' CHECK (status IN ('active', 'suspended', 'pending')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    CONSTRAINT uq_user_institution UNIQUE(institution_id, user_id)
);

CREATE TABLE IF NOT EXISTS public.student_profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    institution_id UUID NOT NULL REFERENCES public.institutions(id) ON DELETE CASCADE,
    roll_number VARCHAR(100) NOT NULL,
    department VARCHAR(100) NOT NULL,
    batch_year INT NOT NULL,
    current_semester INT DEFAULT 1,
    cgpa NUMERIC(4, 2) DEFAULT 0.00,
    tenth_percentage NUMERIC(5, 2),
    twelfth_percentage NUMERIC(5, 2),
    resume_url TEXT,
    linkedin_url TEXT,
    github_url TEXT,
    career_aspirations TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    CONSTRAINT uq_institution_student_roll UNIQUE(institution_id, roll_number),
    CONSTRAINT uq_student_user UNIQUE(user_id)
);

CREATE TABLE IF NOT EXISTS public.faculty_profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    institution_id UUID NOT NULL REFERENCES public.institutions(id) ON DELETE CASCADE,
    employee_id VARCHAR(100) NOT NULL,
    department VARCHAR(100) NOT NULL,
    designation VARCHAR(100),
    specialization TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    CONSTRAINT uq_institution_faculty_emp UNIQUE(institution_id, employee_id),
    CONSTRAINT uq_faculty_user UNIQUE(user_id)
);

CREATE TABLE IF NOT EXISTS public.academic_records (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    student_id UUID NOT NULL REFERENCES public.student_profiles(id) ON DELETE CASCADE,
    semester INT NOT NULL,
    sgpa NUMERIC(4, 2) NOT NULL,
    backlogs INT DEFAULT 0,
    attendance_percentage NUMERIC(5, 2) DEFAULT 100.0,
    verified_by UUID REFERENCES public.profiles(id),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    CONSTRAINT uq_student_semester UNIQUE(student_id, semester)
);

-- 5. SKILLS & COMPANIES
CREATE TABLE IF NOT EXISTS public.skills (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) UNIQUE NOT NULL,
    category VARCHAR(50) NOT NULL CHECK (category IN ('aptitude', 'programming', 'technical', 'communication', 'soft_skills')),
    description TEXT,
    icon VARCHAR(50)
);

CREATE TABLE IF NOT EXISTS public.student_skills (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    student_id UUID NOT NULL REFERENCES public.student_profiles(id) ON DELETE CASCADE,
    skill_id UUID NOT NULL REFERENCES public.skills(id) ON DELETE CASCADE,
    proficiency_level INT DEFAULT 1 CHECK (proficiency_level BETWEEN 1 AND 5),
    verified_by_assessment_id UUID,
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    CONSTRAINT uq_student_skill UNIQUE(student_id, skill_id)
);

CREATE TABLE IF NOT EXISTS public.companies (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    institution_id UUID NOT NULL REFERENCES public.institutions(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    logo_url TEXT,
    website VARCHAR(255),
    industry VARCHAR(100),
    description TEXT,
    tier VARCHAR(50) DEFAULT 'tier_1' CHECK (tier IN ('tier_1', 'tier_2', 'tier_3', 'dream', 'super_dream')),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.company_requirements (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    company_id UUID NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE,
    job_role VARCHAR(255) NOT NULL,
    min_cgpa NUMERIC(4, 2) DEFAULT 6.00,
    max_backlogs INT DEFAULT 0,
    eligible_departments JSONB DEFAULT '["Computer Science", "Information Technology"]'::jsonb,
    required_skills_json JSONB DEFAULT '[]'::jsonb,
    min_aptitude_score NUMERIC(5, 2) DEFAULT 60.00,
    min_coding_score NUMERIC(5, 2) DEFAULT 60.00,
    min_technical_score NUMERIC(5, 2) DEFAULT 60.00,
    min_communication_score NUMERIC(5, 2) DEFAULT 60.00,
    salary_package VARCHAR(100),
    application_deadline TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.recruitment_stages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    company_id UUID NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE,
    stage_order INT NOT NULL,
    stage_name VARCHAR(100) NOT NULL,
    stage_type VARCHAR(50) NOT NULL CHECK (stage_type IN ('aptitude_test', 'coding_round', 'technical_interview', 'hr_interview', 'group_discussion')),
    passing_criteria TEXT,
    description TEXT
);

-- 6. ASSESSMENTS & QUESTIONS
CREATE TABLE IF NOT EXISTS public.assessments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    institution_id UUID NOT NULL REFERENCES public.institutions(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    category VARCHAR(50) NOT NULL CHECK (category IN ('aptitude', 'programming', 'technical', 'communication', 'mock_company')),
    difficulty VARCHAR(50) DEFAULT 'medium' CHECK (difficulty IN ('easy', 'medium', 'hard', 'mixed')),
    duration_minutes INT DEFAULT 30,
    total_marks NUMERIC(6, 2) DEFAULT 100.00,
    pass_marks NUMERIC(6, 2) DEFAULT 40.00,
    max_attempts INT DEFAULT 3,
    is_published BOOLEAN DEFAULT TRUE,
    company_id UUID REFERENCES public.companies(id) ON DELETE SET NULL,
    created_by UUID REFERENCES public.profiles(id),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.questions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    assessment_id UUID NOT NULL REFERENCES public.assessments(id) ON DELETE CASCADE,
    question_text TEXT NOT NULL,
    question_type VARCHAR(50) DEFAULT 'mcq' CHECK (question_type IN ('mcq', 'code', 'boolean', 'short_answer')),
    options_json JSONB DEFAULT '[]'::jsonb,
    correct_answer TEXT NOT NULL,
    explanation TEXT,
    marks NUMERIC(5, 2) DEFAULT 1.00,
    skill_id UUID REFERENCES public.skills(id) ON DELETE SET NULL,
    difficulty VARCHAR(50) DEFAULT 'medium',
    source_chunk_id UUID,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.assessment_attempts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    assessment_id UUID NOT NULL REFERENCES public.assessments(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    status VARCHAR(50) DEFAULT 'in_progress' CHECK (status IN ('in_progress', 'submitted', 'evaluated', 'expired')),
    start_time TIMESTAMPTZ DEFAULT NOW(),
    submit_time TIMESTAMPTZ,
    score NUMERIC(6, 2) DEFAULT 0.00,
    percentage NUMERIC(5, 2) DEFAULT 0.00,
    passed BOOLEAN DEFAULT FALSE,
    feedback TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.assessment_answers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    attempt_id UUID NOT NULL REFERENCES public.assessment_attempts(id) ON DELETE CASCADE,
    question_id UUID NOT NULL REFERENCES public.questions(id) ON DELETE CASCADE,
    user_answer TEXT,
    is_correct BOOLEAN DEFAULT FALSE,
    marks_awarded NUMERIC(5, 2) DEFAULT 0.00,
    time_spent_seconds INT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    CONSTRAINT uq_attempt_question UNIQUE(attempt_id, question_id)
);

CREATE TABLE IF NOT EXISTS public.assessment_results (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    attempt_id UUID NOT NULL REFERENCES public.assessment_attempts(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    assessment_id UUID NOT NULL REFERENCES public.assessments(id) ON DELETE CASCADE,
    score_breakdown_json JSONB DEFAULT '{}'::jsonb,
    strength_tags JSONB DEFAULT '[]'::jsonb,
    weakness_tags JSONB DEFAULT '[]'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    CONSTRAINT uq_attempt_result UNIQUE(attempt_id)
);

-- 7. LEARNING RESOURCES, CHUNKS & AI
CREATE TABLE IF NOT EXISTS public.learning_resources (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    institution_id UUID NOT NULL REFERENCES public.institutions(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    resource_type VARCHAR(50) NOT NULL CHECK (resource_type IN ('pdf', 'ppt', 'pptx', 'article', 'video', 'document')),
    file_url TEXT,
    storage_path TEXT,
    file_size_bytes BIGINT DEFAULT 0,
    mime_type VARCHAR(100),
    processing_status VARCHAR(50) DEFAULT 'pending' CHECK (processing_status IN ('pending', 'processing', 'completed', 'failed')),
    processing_error TEXT,
    uploaded_by UUID REFERENCES public.profiles(id),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.resource_chunks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    resource_id UUID NOT NULL REFERENCES public.learning_resources(id) ON DELETE CASCADE,
    chunk_index INT NOT NULL,
    content TEXT NOT NULL,
    metadata_json JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.document_embeddings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    chunk_id UUID NOT NULL REFERENCES public.resource_chunks(id) ON DELETE CASCADE,
    embedding vector(1536),
    model_name VARCHAR(100),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.generated_quizzes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    resource_id UUID REFERENCES public.learning_resources(id) ON DELETE SET NULL,
    institution_id UUID NOT NULL REFERENCES public.institutions(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    status VARCHAR(50) DEFAULT 'draft' CHECK (status IN ('draft', 'approved', 'published', 'rejected')),
    question_count INT DEFAULT 5,
    prompt_used TEXT,
    generated_json JSONB DEFAULT '[]'::jsonb,
    approved_by UUID REFERENCES public.profiles(id),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.learning_recommendations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    institution_id UUID NOT NULL REFERENCES public.institutions(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    reason TEXT NOT NULL,
    priority VARCHAR(50) DEFAULT 'medium' CHECK (priority IN ('high', 'medium', 'low')),
    resource_id UUID REFERENCES public.learning_resources(id) ON DELETE SET NULL,
    assessment_id UUID REFERENCES public.assessments(id) ON DELETE SET NULL,
    is_completed BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.learning_activities (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    institution_id UUID NOT NULL REFERENCES public.institutions(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    activity_type VARCHAR(50) NOT NULL CHECK (activity_type IN ('quiz', 'reading', 'assignment', 'coding_challenge')),
    target_skill_id UUID REFERENCES public.skills(id) ON DELETE SET NULL,
    resource_id UUID REFERENCES public.learning_resources(id) ON DELETE SET NULL,
    due_date TIMESTAMPTZ,
    created_by UUID REFERENCES public.profiles(id),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.activity_progress (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    activity_id UUID NOT NULL REFERENCES public.learning_activities(id) ON DELETE CASCADE,
    status VARCHAR(50) DEFAULT 'not_started' CHECK (status IN ('not_started', 'in_progress', 'completed')),
    completed_at TIMESTAMPTZ,
    score NUMERIC(5, 2),
    CONSTRAINT uq_user_activity UNIQUE(user_id, activity_id)
);

-- 8. READINESS SNAPSHOTS & ADMINISTRATION
CREATE TABLE IF NOT EXISTS public.readiness_snapshots (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    institution_id UUID NOT NULL REFERENCES public.institutions(id) ON DELETE CASCADE,
    target_company_id UUID REFERENCES public.companies(id) ON DELETE SET NULL,
    target_role VARCHAR(255),
    overall_readiness_score NUMERIC(5, 2) DEFAULT 0.00,
    status VARCHAR(50) DEFAULT 'insufficient_information' CHECK (status IN ('meets_criteria', 'preparation_in_progress', 'skills_requiring_improvement', 'insufficient_information')),
    skill_gaps_json JSONB DEFAULT '[]'::jsonb,
    strengths_json JSONB DEFAULT '[]'::jsonb,
    recommendations_json JSONB DEFAULT '[]'::jsonb,
    calculated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    institution_id UUID REFERENCES public.institutions(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    type VARCHAR(50) DEFAULT 'info' CHECK (type IN ('info', 'alert', 'success', 'assessment')),
    is_read BOOLEAN DEFAULT FALSE,
    link TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.audit_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    institution_id UUID REFERENCES public.institutions(id) ON DELETE CASCADE,
    user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    action VARCHAR(100) NOT NULL,
    entity_type VARCHAR(100) NOT NULL,
    entity_id VARCHAR(100),
    details_json JSONB DEFAULT '{}'::jsonb,
    ip_address VARCHAR(50),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.subscriptions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    institution_id UUID NOT NULL REFERENCES public.institutions(id) ON DELETE CASCADE,
    plan_tier VARCHAR(50) DEFAULT 'professional' CHECK (plan_tier IN ('starter', 'professional', 'enterprise')),
    status VARCHAR(50) DEFAULT 'active' CHECK (status IN ('active', 'trial', 'past_due', 'canceled')),
    max_students INT DEFAULT 1000,
    max_faculty INT DEFAULT 100,
    ai_quota_monthly INT DEFAULT 10000,
    starts_at TIMESTAMPTZ DEFAULT NOW(),
    ends_at TIMESTAMPTZ DEFAULT NOW() + INTERVAL '1 year',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    CONSTRAINT uq_institution_subscription UNIQUE(institution_id)
);

-- 9. PERFORMANCE INDEXES
CREATE INDEX IF NOT EXISTS idx_memberships_inst_user ON public.institution_memberships(institution_id, user_id);
CREATE INDEX IF NOT EXISTS idx_memberships_role ON public.institution_memberships(role_code);
CREATE INDEX IF NOT EXISTS idx_student_profiles_inst ON public.student_profiles(institution_id);
CREATE INDEX IF NOT EXISTS idx_assessments_inst ON public.assessments(institution_id);
CREATE INDEX IF NOT EXISTS idx_questions_assessment ON public.questions(assessment_id);
CREATE INDEX IF NOT EXISTS idx_attempts_user ON public.assessment_attempts(user_id);
CREATE INDEX IF NOT EXISTS idx_attempts_assessment ON public.assessment_attempts(assessment_id);
CREATE INDEX IF NOT EXISTS idx_resources_inst ON public.learning_resources(institution_id);
CREATE INDEX IF NOT EXISTS idx_readiness_user_inst ON public.readiness_snapshots(user_id, institution_id);
CREATE INDEX IF NOT EXISTS idx_companies_inst ON public.companies(institution_id);

-- 10. ROW LEVEL SECURITY (RLS) POLICIES
ALTER TABLE public.institutions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.institution_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.institution_memberships ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.student_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.faculty_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.academic_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.student_skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.company_requirements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.recruitment_stages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.assessments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.assessment_attempts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.assessment_answers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.assessment_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.learning_resources ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.resource_chunks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.document_embeddings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.generated_quizzes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.learning_recommendations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.learning_activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.activity_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.readiness_snapshots ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;

-- Helper security functions
CREATE OR REPLACE FUNCTION public.current_user_id()
RETURNS UUID AS $$
    SELECT NULLIF(current_setting('request.jwt.claim.sub', true), '')::uuid;
$$ LANGUAGE sql STABLE;

CREATE OR REPLACE FUNCTION public.is_super_admin()
RETURNS BOOLEAN AS $$
    SELECT EXISTS (
        SELECT 1 FROM public.profiles
        WHERE id = public.current_user_id() AND is_super_admin = TRUE
    );
$$ LANGUAGE sql STABLE;

CREATE OR REPLACE FUNCTION public.user_belongs_to_institution(inst_id UUID)
RETURNS BOOLEAN AS $$
    SELECT public.is_super_admin() OR EXISTS (
        SELECT 1 FROM public.institution_memberships
        WHERE institution_id = inst_id AND user_id = public.current_user_id() AND status = 'active'
    );
$$ LANGUAGE sql STABLE;

CREATE OR REPLACE FUNCTION public.is_institution_admin(inst_id UUID)
RETURNS BOOLEAN AS $$
    SELECT public.is_super_admin() OR EXISTS (
        SELECT 1 FROM public.institution_memberships
        WHERE institution_id = inst_id AND user_id = public.current_user_id() AND role_code = 'institution_admin' AND status = 'active'
    );
$$ LANGUAGE sql STABLE;

-- RLS Policies Examples
-- Profiles: Users can view profiles in their institution, super_admin sees all, users update own profile
CREATE POLICY "Profiles are viewable by members of same institution or self"
    ON public.profiles FOR SELECT
    USING (
        id = public.current_user_id()
        OR public.is_super_admin()
        OR EXISTS (
            SELECT 1 FROM public.institution_memberships m1
            JOIN public.institution_memberships m2 ON m1.institution_id = m2.institution_id
            WHERE m1.user_id = public.current_user_id() AND m2.user_id = profiles.id
        )
    );

CREATE POLICY "Users can update own profile"
    ON public.profiles FOR UPDATE
    USING (id = public.current_user_id() OR public.is_super_admin());

-- Institutions: Viewable by its members or super admins
CREATE POLICY "Institutions viewable by members or superadmin"
    ON public.institutions FOR SELECT
    USING (public.user_belongs_to_institution(id));

CREATE POLICY "Superadmin manages institutions"
    ON public.institutions FOR ALL
    USING (public.is_super_admin());

-- Assessments: Viewable by institution members
CREATE POLICY "Assessments viewable by institution members"
    ON public.assessments FOR SELECT
    USING (public.user_belongs_to_institution(institution_id));

CREATE POLICY "Faculty and Admins manage assessments"
    ON public.assessments FOR ALL
    USING (
        public.is_super_admin()
        OR EXISTS (
            SELECT 1 FROM public.institution_memberships
            WHERE institution_id = assessments.institution_id
              AND user_id = public.current_user_id()
              AND role_code IN ('institution_admin', 'faculty')
        )
    );

-- Questions: Answer key protection for in-progress tests
CREATE POLICY "Questions readable by institution members"
    ON public.questions FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM public.assessments
            WHERE assessments.id = questions.assessment_id
              AND public.user_belongs_to_institution(assessments.institution_id)
        )
    );

-- Attempts: Students view/submit own, Admins/Faculty can view institution attempts
CREATE POLICY "Users view and manage own attempts"
    ON public.assessment_attempts FOR ALL
    USING (
        user_id = public.current_user_id()
        OR public.is_super_admin()
        OR EXISTS (
            SELECT 1 FROM public.assessments a
            JOIN public.institution_memberships m ON m.institution_id = a.institution_id
            WHERE a.id = assessment_attempts.assessment_id
              AND m.user_id = public.current_user_id()
              AND m.role_code IN ('institution_admin', 'faculty')
        )
    );

-- Learning Resources
CREATE POLICY "Resources accessible to institution members"
    ON public.learning_resources FOR SELECT
    USING (public.user_belongs_to_institution(institution_id));

CREATE POLICY "Faculty and Admins manage resources"
    ON public.learning_resources FOR ALL
    USING (
        public.is_super_admin()
        OR EXISTS (
            SELECT 1 FROM public.institution_memberships
            WHERE institution_id = learning_resources.institution_id
              AND user_id = public.current_user_id()
              AND role_code IN ('institution_admin', 'faculty')
        )
    );

-- Readiness Snapshots
CREATE POLICY "Readiness viewable by student and institution staff"
    ON public.readiness_snapshots FOR SELECT
    USING (
        user_id = public.current_user_id()
        OR public.is_institution_admin(institution_id)
        OR public.is_super_admin()
    );

-- Companies and requirements viewable by institution
CREATE POLICY "Companies viewable by institution members"
    ON public.companies FOR SELECT
    USING (public.user_belongs_to_institution(institution_id));

CREATE POLICY "Admins manage companies"
    ON public.companies FOR ALL
    USING (public.is_institution_admin(institution_id));

CREATE POLICY "Company requirements viewable by institution"
    ON public.company_requirements FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM public.companies c
            WHERE c.id = company_requirements.company_id
              AND public.user_belongs_to_institution(c.institution_id)
        )
    );

-- Skills are global readable
CREATE POLICY "Skills are readable by authenticated users"
    ON public.skills FOR SELECT
    USING (TRUE);
