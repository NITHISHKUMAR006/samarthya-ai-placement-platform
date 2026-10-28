-- ====================================================================
-- SAMARTHYA AI - Comprehensive Development & Testing Seed Data
-- ====================================================================

-- 1. INSTITUTIONS
INSERT INTO public.institutions (id, name, code, slug, domain, contact_email, phone, address, is_active)
VALUES
    ('a0000000-0000-0000-0000-000000000001', 'Apex Institute of Technology', 'AIT', 'apex-tech', 'apex.edu', 'contact@apex.edu', '+91 98765 43210', 'Knowledge Corridor, Tech City, Karnataka', TRUE),
    ('a0000000-0000-0000-0000-000000000002', 'Zenith University of Engineering', 'ZUE', 'zenith-uni', 'zenith.edu', 'admissions@zenith.edu', '+91 98765 12345', 'Innovation Boulevard, Hyderabad, Telangana', TRUE)
ON CONFLICT (id) DO NOTHING;

-- 2. INSTITUTION SETTINGS
INSERT INTO public.institution_settings (institution_id, settings_json)
VALUES
    ('a0000000-0000-0000-0000-000000000001', '{"min_placement_cgpa": 6.5, "allow_ai_quizzes": true, "enable_coding_playground": true, "theme": "navy"}'),
    ('a0000000-0000-0000-0000-000000000002', '{"min_placement_cgpa": 6.0, "allow_ai_quizzes": true, "enable_coding_playground": true, "theme": "navy"}')
ON CONFLICT (institution_id) DO NOTHING;

-- 3. PROFILES
INSERT INTO public.profiles (id, email, full_name, avatar_url, phone, is_super_admin)
VALUES
    -- Super Admin
    ('b0000000-0000-0000-0000-000000000001', 'superadmin@samarthya.ai', 'Dr. Alok Verma', 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alok', '+91 99000 00001', TRUE),
    -- Apex Placement Officer
    ('b0000000-0000-0000-0000-000000000002', 'placement@apex.edu', 'Prof. Sunita Rao', 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sunita', '+91 99000 00002', FALSE),
    -- Apex Faculty
    ('b0000000-0000-0000-0000-000000000003', 'faculty.cs@apex.edu', 'Dr. Rajesh Khanna', 'https://api.dicebear.com/7.x/avataaars/svg?seed=Rajesh', '+91 99000 00003', FALSE),
    -- Apex Students
    ('b0000000-0000-0000-0000-000000000004', 'student.aarav@apex.edu', 'Aarav Sharma', 'https://api.dicebear.com/7.x/avataaars/svg?seed=Aarav', '+91 99000 00004', FALSE),
    ('b0000000-0000-0000-0000-000000000005', 'student.priya@apex.edu', 'Priya Patel', 'https://api.dicebear.com/7.x/avataaars/svg?seed=Priya', '+91 99000 00005', FALSE),
    -- Zenith Placement Officer & Student
    ('b0000000-0000-0000-0000-000000000006', 'placement@zenith.edu', 'Dr. Vikram Seth', 'https://api.dicebear.com/7.x/avataaars/svg?seed=Vikram', '+91 99000 00006', FALSE),
    ('b0000000-0000-0000-0000-000000000007', 'student.rohan@zenith.edu', 'Rohan Iyer', 'https://api.dicebear.com/7.x/avataaars/svg?seed=Rohan', '+91 99000 00007', FALSE)
ON CONFLICT (id) DO NOTHING;

-- 4. MEMBERSHIPS
INSERT INTO public.institution_memberships (institution_id, user_id, role_code, department, status)
VALUES
    ('a0000000-0000-0000-0000-000000000001', 'b0000000-0000-0000-0000-000000000002', 'institution_admin', 'Training & Placement Cell', 'active'),
    ('a0000000-0000-0000-0000-000000000001', 'b0000000-0000-0000-0000-000000000003', 'faculty', 'Computer Science & Engineering', 'active'),
    ('a0000000-0000-0000-0000-000000000001', 'b0000000-0000-0000-0000-000000000004', 'student', 'Computer Science & Engineering', 'active'),
    ('a0000000-0000-0000-0000-000000000001', 'b0000000-0000-0000-0000-000000000005', 'student', 'Information Science', 'active'),
    ('a0000000-0000-0000-0000-000000000002', 'b0000000-0000-0000-0000-000000000006', 'institution_admin', 'Career Services', 'active'),
    ('a0000000-0000-0000-0000-000000000002', 'b0000000-0000-0000-0000-000000000007', 'student', 'Electronics & Communication', 'active')
ON CONFLICT (institution_id, user_id) DO NOTHING;

-- 5. STUDENT PROFILES
INSERT INTO public.student_profiles (id, user_id, institution_id, roll_number, department, batch_year, current_semester, cgpa, tenth_percentage, twelfth_percentage, career_aspirations)
VALUES
    ('c0000000-0000-0000-0000-000000000001', 'b0000000-0000-0000-0000-000000000004', 'a0000000-0000-0000-0000-000000000001', 'AIT2023CS042', 'Computer Science & Engineering', 2026, 7, 8.75, 94.0, 91.5, 'Full-Stack Software Engineer & AI System Architect'),
    ('c0000000-0000-0000-0000-000000000002', 'b0000000-0000-0000-0000-000000000005', 'a0000000-0000-0000-0000-000000000001', 'AIT2023IS019', 'Information Science', 2026, 7, 7.90, 88.5, 85.0, 'Cloud Infrastructure Engineer & DevOps Specialist'),
    ('c0000000-0000-0000-0000-000000000003', 'b0000000-0000-0000-0000-000000000007', 'a0000000-0000-0000-0000-000000000002', 'ZUE2023EC088', 'Electronics & Communication', 2026, 7, 7.45, 82.0, 80.0, 'Embedded Software & IoT Developer')
ON CONFLICT (id) DO NOTHING;

-- 6. FACULTY PROFILES
INSERT INTO public.faculty_profiles (id, user_id, institution_id, employee_id, department, designation, specialization)
VALUES
    ('d0000000-0000-0000-0000-000000000001', 'b0000000-0000-0000-0000-000000000003', 'a0000000-0000-0000-0000-000000000001', 'EMP-CS-108', 'Computer Science & Engineering', 'Associate Professor', 'Data Structures, Operating Systems, Machine Learning')
ON CONFLICT (id) DO NOTHING;

-- 7. SKILLS
INSERT INTO public.skills (id, name, category, description, icon)
VALUES
    ('e0000000-0000-0000-0000-000000000001', 'Quantitative Aptitude', 'aptitude', 'Number series, percentages, time & work, probability', 'Calculator'),
    ('e0000000-0000-0000-0000-000000000002', 'Logical Reasoning', 'aptitude', 'Puzzles, syllogisms, blood relations, seating arrangement', 'Brain'),
    ('e0000000-0000-0000-0000-000000000003', 'Verbal Ability', 'aptitude', 'Reading comprehension, grammar, vocabulary, sentence completion', 'BookOpen'),
    ('e0000000-0000-0000-0000-000000000004', 'Data Structures & Algorithms', 'programming', 'Arrays, linked lists, trees, graphs, dynamic programming', 'Code'),
    ('e0000000-0000-0000-0000-000000000005', 'Python Programming', 'programming', 'Syntax, standard library, OOP, async, data processing', 'Terminal'),
    ('e0000000-0000-0000-0000-000000000006', 'Database Management & SQL', 'technical', 'Relational design, normalization, complex joins, indexing, ACID', 'Database'),
    ('e0000000-0000-0000-0000-000000000007', 'Operating Systems', 'technical', 'Processes, threads, synchronization, paging, file systems', 'Cpu'),
    ('e0000000-0000-0000-0000-000000000008', 'Computer Networks', 'technical', 'OSI model, TCP/IP, DNS, HTTP, socket programming', 'Network'),
    ('e0000000-0000-0000-0000-000000000009', 'Technical Communication', 'communication', 'Explaining architecture, code walkthroughs, design reviews', 'MessageSquare'),
    ('e0000000-0000-0000-0000-000000000010', 'Behavioral Interviewing', 'communication', 'STAR method, situational problem solving, leadership stories', 'Users')
ON CONFLICT (id) DO NOTHING;

-- 8. STUDENT SKILLS
INSERT INTO public.student_skills (student_id, skill_id, proficiency_level)
VALUES
    ('c0000000-0000-0000-0000-000000000001', 'e0000000-0000-0000-0000-000000000001', 4),
    ('c0000000-0000-0000-0000-000000000001', 'e0000000-0000-0000-0000-000000000002', 4),
    ('c0000000-0000-0000-0000-000000000001', 'e0000000-0000-0000-0000-000000000004', 5),
    ('c0000000-0000-0000-0000-000000000001', 'e0000000-0000-0000-0000-000000000005', 5),
    ('c0000000-0000-0000-0000-000000000001', 'e0000000-0000-0000-0000-000000000006', 4),
    ('c0000000-0000-0000-0000-000000000001', 'e0000000-0000-0000-0000-000000000007', 3),
    ('c0000000-0000-0000-0000-000000000001', 'e0000000-0000-0000-0000-000000000009', 4)
ON CONFLICT (student_id, skill_id) DO NOTHING;

-- 9. COMPANIES
INSERT INTO public.companies (id, institution_id, name, logo_url, website, industry, description, tier)
VALUES
    ('f0000000-0000-0000-0000-000000000001', 'a0000000-0000-0000-0000-000000000001', 'Google Cloud', 'https://upload.wikimedia.org/wikipedia/commons/2/2f/Google_2015_logo.svg', 'https://careers.google.com', 'Information Technology', 'Global technology leader in search, cloud infrastructure, AI, and developer platforms.', 'super_dream'),
    ('f0000000-0000-0000-0000-000000000002', 'a0000000-0000-0000-0000-000000000001', 'Microsoft India', 'https://upload.wikimedia.org/wikipedia/commons/9/96/Microsoft_logo_%282012%29.svg', 'https://careers.microsoft.com', 'Software & Cloud', 'Empowering organizations and individuals through state-of-the-art software systems.', 'dream'),
    ('f0000000-0000-0000-0000-000000000003', 'a0000000-0000-0000-0000-000000000001', 'Deloitte USI', 'https://upload.wikimedia.org/wikipedia/commons/5/56/Deloitte.svg', 'https://deloitte.com', 'Consulting & Analytics', 'Global professional services firm driving digital transformation and IT solutions.', 'tier_1'),
    ('f0000000-0000-0000-0000-000000000004', 'a0000000-0000-0000-0000-000000000001', 'Infosys Ltd', 'https://upload.wikimedia.org/wikipedia/commons/9/95/Infosys_logo.svg', 'https://infosys.com', 'Enterprise IT Services', 'Global digital transformation and enterprise software consulting service.', 'tier_2')
ON CONFLICT (id) DO NOTHING;

-- 10. COMPANY REQUIREMENTS
INSERT INTO public.company_requirements (id, company_id, job_role, min_cgpa, max_backlogs, eligible_departments, required_skills_json, min_aptitude_score, min_coding_score, min_technical_score, min_communication_score, salary_package)
VALUES
    ('10000000-0000-0000-0000-000000000001', 'f0000000-0000-0000-0000-000000000001', 'Software Development Engineer I', 8.0, 0, '["Computer Science & Engineering", "Information Science"]'::jsonb, '[{"name": "Data Structures & Algorithms", "min_level": 4}, {"name": "Python Programming", "min_level": 4}, {"name": "Operating Systems", "min_level": 3}]'::jsonb, 75.0, 85.0, 80.0, 70.0, '₹ 32,00,000 CTC'),
    ('10000000-0000-0000-0000-000000000002', 'f0000000-0000-0000-0000-000000000002', 'Associate Software Engineer', 7.5, 0, '["Computer Science & Engineering", "Information Science", "Electronics & Communication"]'::jsonb, '[{"name": "Data Structures & Algorithms", "min_level": 4}, {"name": "Database Management & SQL", "min_level": 3}]'::jsonb, 70.0, 75.0, 75.0, 70.0, '₹ 24,00,000 CTC'),
    ('10000000-0000-0000-0000-000000000003', 'f0000000-0000-0000-0000-000000000003', 'Technology Analyst - Cloud & Data', 6.8, 1, '["Computer Science & Engineering", "Information Science", "Electronics & Communication"]'::jsonb, '[{"name": "Quantitative Aptitude", "min_level": 3}, {"name": "Database Management & SQL", "min_level": 3}, {"name": "Technical Communication", "min_level": 4}]'::jsonb, 70.0, 60.0, 65.0, 75.0, '₹ 11,50,000 CTC')
ON CONFLICT (id) DO NOTHING;

-- 11. ASSESSMENTS
INSERT INTO public.assessments (id, institution_id, title, description, category, difficulty, duration_minutes, total_marks, pass_marks, max_attempts, is_published, created_by)
VALUES
    ('20000000-0000-0000-0000-000000000001', 'a0000000-0000-0000-0000-000000000001', 'Comprehensive Aptitude & Quantitative Readiness', 'Diagnostic assessment covering numerical computation, ratio & proportion, logical deduction and verbal analysis.', 'aptitude', 'medium', 25, 50.0, 25.0, 3, TRUE, 'b0000000-0000-0000-0000-000000000002'),
    ('20000000-0000-0000-0000-000000000002', 'a0000000-0000-0000-0000-000000000001', 'Data Structures & Algorithmic Complexity', 'Evaluates core algorithmic paradigms including dynamic programming, graph traversals, and asymptotic time bounds.', 'programming', 'hard', 30, 60.0, 36.0, 3, TRUE, 'b0000000-0000-0000-0000-000000000003'),
    ('20000000-0000-0000-0000-000000000003', 'a0000000-0000-0000-0000-000000000001', 'Operating Systems & System Architecture', 'Tests understanding of threads, synchronization, virtual memory, scheduling algorithms, and deadlock resolution.', 'technical', 'medium', 20, 40.0, 20.0, 3, TRUE, 'b0000000-0000-0000-0000-000000000003'),
    ('20000000-0000-0000-0000-000000000004', 'a0000000-0000-0000-0000-000000000001', 'Professional & Technical Communication Mock', 'Situational scenarios testing cross-functional stakeholder communication, technical presentation, and email etiquette.', 'communication', 'easy', 15, 30.0, 18.0, 3, TRUE, 'b0000000-0000-0000-0000-000000000002')
ON CONFLICT (id) DO NOTHING;

-- 12. QUESTIONS (Aptitude Assessment 20000000-0000-0000-0000-000000000001)
INSERT INTO public.questions (id, assessment_id, question_text, question_type, options_json, correct_answer, explanation, marks, skill_id, difficulty)
VALUES
    ('30000000-0000-0000-0000-000000000001', '20000000-0000-0000-0000-000000000001',
     'A car completes a journey in 10 hours. The first half at 21 km/hr and the second half at 24 km/hr. What is the total distance traveled?',
     'mcq', '["224 km", "230 km", "240 km", "216 km"]'::jsonb,
     '224 km',
     'Let distance be 2d. Time = d/21 + d/24 = 10 => d*(15/168) = 10 => d = 112 km. Total distance = 2*112 = 224 km.', 5.0, 'e0000000-0000-0000-0000-000000000001', 'medium'),

    ('30000000-0000-0000-0000-000000000002', '20000000-0000-0000-0000-000000000001',
     'Find the next number in the series: 4, 18, 48, 100, 180, ?',
     'mcq', '["294", "300", "280", "292"]'::jsonb,
     '294',
     'The series is n^3 - n^2: 2^3-2^2=4; 3^3-3^2=18; 4^3-4^2=48; 5^3-5^2=100; 6^3-6^2=180; 7^3-7^2=343-49=294.', 5.0, 'e0000000-0000-0000-0000-000000000002', 'medium'),

    ('30000000-0000-0000-0000-000000000003', '20000000-0000-0000-0000-000000000001',
     'Select the word most nearly opposite in meaning to EPHEMERAL.',
     'mcq', '["Transient", "Permanent", "Ethereal", "Fugitive"]'::jsonb,
     'Permanent',
     'Ephemeral means lasting for a very short time. The exact opposite is Permanent or enduring.', 5.0, 'e0000000-0000-0000-0000-000000000003', 'easy'),

    ('30000000-0000-0000-0000-000000000004', '20000000-0000-0000-0000-000000000001',
     'A and B together can do a piece of work in 12 days. B and C in 15 days, and C and A in 20 days. In how many days can A alone do the work?',
     'mcq', '["30 days", "25 days", "35 days", "40 days"]'::jsonb,
     '30 days',
     '2(A+B+C) = 1/12 + 1/15 + 1/20 = 12/60 = 1/5. Thus A+B+C = 1/10. A = (A+B+C) - (B+C) = 1/10 - 1/15 = 1/30. So A takes 30 days.', 5.0, 'e0000000-0000-0000-0000-000000000001', 'medium'),

    -- DSA Questions (20000000-0000-0000-0000-000000000002)
    ('30000000-0000-0000-0000-000000000005', '20000000-0000-0000-0000-000000000002',
     'What is the worst-case time complexity of searching in a Balanced Binary Search Tree (AVL / Red-Black Tree)?',
     'mcq', '["O(1)", "O(log n)", "O(n)", "O(n log n)"]'::jsonb,
     'O(log n)',
     'Because an AVL or Red-Black tree strictly enforces tree height balance within O(log n), any search is guaranteed to execute in O(log n) worst-case time.', 10.0, 'e0000000-0000-0000-0000-000000000004', 'easy'),

    ('30000000-0000-0000-0000-000000000006', '20000000-0000-0000-0000-000000000002',
     'Which algorithm is optimally suited to detect cycles in an undirected graph?',
     'mcq', '["Disjoint Set Union (Union-Find)", "Dijkstras Algorithm", "Prim Algorithm", "Floyd-Warshall"]'::jsonb,
     'Disjoint Set Union (Union-Find)',
     'Disjoint Set Union (DSU) checks whether two endpoints of an edge already belong to the same connected component in nearly O(1) amortized time using path compression.', 10.0, 'e0000000-0000-0000-0000-000000000004', 'medium'),

    ('30000000-0000-0000-0000-000000000007', '20000000-0000-0000-0000-000000000002',
     'What is the space complexity of an in-place QuickSort implementation when stack frames are considered in the worst case?',
     'mcq', '["O(1)", "O(log n)", "O(n)", "O(n^2)"]'::jsonb,
     'O(n)',
     'In the worst-case partition (e.g. sorted array with first element as pivot), the recursion tree degrades into a skewed list of depth n, consuming O(n) call stack space.', 10.0, 'e0000000-0000-0000-0000-000000000004', 'medium'),

    -- OS Questions (20000000-0000-0000-0000-000000000003)
    ('30000000-0000-0000-0000-000000000008', '20000000-0000-0000-0000-000000000003',
     'Which condition is NOT one of Coffman''s four necessary conditions for deadlock?',
     'mcq', '["Mutual Exclusion", "Hold and Wait", "Preemption allowed", "Circular Wait"]'::jsonb,
     'Preemption allowed',
     'Coffman''s 4 conditions are: Mutual Exclusion, Hold and Wait, NO Preemption, and Circular Wait. If preemption is allowed, deadlock cannot occur.', 10.0, 'e0000000-0000-0000-0000-000000000007', 'medium'),

    ('30000000-0000-0000-0000-000000000009', '20000000-0000-0000-0000-000000000003',
     'What phenomenon occurs when increasing the number of page frames results in an increase in the number of page faults?',
     'mcq', '["Thrashing", "Belady''s Anomaly", "Cache Invalidation", "Internal Fragmentation"]'::jsonb,
     'Belady''s Anomaly',
     'Belady''s Anomaly is observed primarily with FIFO page replacement where providing additional physical frames counter-intuitively increases total page faults.', 10.0, 'e0000000-0000-0000-0000-000000000007', 'medium')
ON CONFLICT (id) DO NOTHING;

-- 13. COMPLETED ATTEMPTS & RESULTS FOR DEMO STUDENT AARAV
INSERT INTO public.assessment_attempts (id, assessment_id, user_id, status, start_time, submit_time, score, percentage, passed, feedback)
VALUES
    ('40000000-0000-0000-0000-000000000001', '20000000-0000-0000-0000-000000000001', 'b0000000-0000-0000-0000-000000000004', 'evaluated', NOW() - INTERVAL '2 days', NOW() - INTERVAL '2 days' + INTERVAL '18 minutes', 20.0, 100.0, TRUE, 'Exceptional performance in quantitative and logical aptitude.'),
    ('40000000-0000-0000-0000-000000000002', '20000000-0000-0000-0000-000000000002', 'b0000000-0000-0000-0000-000000000004', 'evaluated', NOW() - INTERVAL '1 day', NOW() - INTERVAL '1 day' + INTERVAL '24 minutes', 30.0, 100.0, TRUE, 'Mastery demonstrated in advanced data structures and recursion analysis.')
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.assessment_results (attempt_id, user_id, assessment_id, score_breakdown_json, strength_tags, weakness_tags)
VALUES
    ('40000000-0000-0000-0000-000000000001', 'b0000000-0000-0000-0000-000000000004', '20000000-0000-0000-0000-000000000001',
     '{"quantitative": 10.0, "logical": 5.0, "verbal": 5.0}',
     '["Number Theory", "Pattern Recognition", "Vocabulary"]'::jsonb,
     '[]'::jsonb),
    ('40000000-0000-0000-0000-000000000002', 'b0000000-0000-0000-0000-000000000004', '20000000-0000-0000-0000-000000000002',
     '{"trees": 10.0, "graphs": 10.0, "sorting": 10.0}',
     '["Binary Search Trees", "Union Find", "Asymptotic Analysis"]'::jsonb,
     '[]'::jsonb)
ON CONFLICT (attempt_id) DO NOTHING;

-- 14. READINESS SNAPSHOT FOR AARAV
INSERT INTO public.readiness_snapshots (id, user_id, institution_id, target_company_id, target_role, overall_readiness_score, status, skill_gaps_json, strengths_json, recommendations_json)
VALUES
    ('50000000-0000-0000-0000-000000000001', 'b0000000-0000-0000-0000-000000000004', 'a0000000-0000-0000-0000-000000000001',
     'f0000000-0000-0000-0000-000000000001', 'Software Development Engineer I',
     88.5, 'meets_criteria',
     '[{"skill": "Operating Systems", "current_level": 3, "required_level": 4, "gap": 1, "status": "action_needed"}]'::jsonb,
     '["Data Structures & Algorithms (Level 5)", "Python Programming (Level 5)", "CGPA (8.75 >= 8.0)"]'::jsonb,
     '["Review Virtual Memory Paging and Inverted Page Tables", "Practice Mock Technical Architecture Interview", "Take Google-specific System Design Mock"]'::jsonb)
ON CONFLICT (id) DO NOTHING;

-- 15. SAMPLE LEARNING RESOURCES
INSERT INTO public.learning_resources (id, institution_id, title, description, resource_type, file_size_bytes, mime_type, processing_status, uploaded_by)
VALUES
    ('60000000-0000-0000-0000-000000000001', 'a0000000-0000-0000-0000-000000000001',
     'Modern Operating Systems: Memory Management & Paging.pdf',
     'Comprehensive lecture notes covering address translation, TLB hits/misses, multi-level paging, and page replacement strategies.',
     'pdf', 1542000, 'application/pdf', 'completed', 'b0000000-0000-0000-0000-000000000003'),
    ('60000000-0000-0000-0000-000000000002', 'a0000000-0000-0000-0000-000000000001',
     'Cracking the Placement Aptitude: Quantitative Masterclass.pptx',
     'Slide deck on fast mental math shortcuts, probability distributions, work-time formulas, and data interpretation case studies.',
     'pptx', 4280000, 'application/vnd.openxmlformats-officedocument.presentationml.presentation', 'completed', 'b0000000-0000-0000-0000-000000000002')
ON CONFLICT (id) DO NOTHING;

-- 16. SUBSCRIPTION
INSERT INTO public.subscriptions (institution_id, plan_tier, status, max_students, max_faculty, ai_quota_monthly)
VALUES
    ('a0000000-0000-0000-0000-000000000001', 'enterprise', 'active', 5000, 250, 50000),
    ('a0000000-0000-0000-0000-000000000002', 'professional', 'active', 2000, 100, 20000)
ON CONFLICT (institution_id) DO NOTHING;
