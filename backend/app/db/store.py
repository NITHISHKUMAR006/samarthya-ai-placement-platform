import uuid
from datetime import datetime, timezone
from typing import Dict, List, Any, Optional
from app.core.logging import logger

class MemoryStore:
    """Authoritative fast repository store supporting local dev, testing, and live syncing."""
    def __init__(self):
        self.institutions: Dict[str, Dict[str, Any]] = {}
        self.profiles: Dict[str, Dict[str, Any]] = {}
        self.institution_memberships: List[Dict[str, Any]] = []
        self.student_profiles: Dict[str, Dict[str, Any]] = {}
        self.faculty_profiles: Dict[str, Dict[str, Any]] = {}
        self.skills: Dict[str, Dict[str, Any]] = {}
        self.student_skills: List[Dict[str, Any]] = []
        self.companies: Dict[str, Dict[str, Any]] = {}
        self.company_requirements: Dict[str, Dict[str, Any]] = {}
        self.assessments: Dict[str, Dict[str, Any]] = {}
        self.questions: Dict[str, Dict[str, Any]] = {}
        self.assessment_attempts: Dict[str, Dict[str, Any]] = {}
        self.assessment_answers: List[Dict[str, Any]] = []
        self.assessment_results: Dict[str, Dict[str, Any]] = {}
        self.learning_resources: Dict[str, Dict[str, Any]] = {}
        self.resource_chunks: List[Dict[str, Any]] = []
        self.generated_quizzes: Dict[str, Dict[str, Any]] = {}
        self.learning_recommendations: List[Dict[str, Any]] = []
        self.readiness_snapshots: Dict[str, Dict[str, Any]] = {}
        self.subscriptions: Dict[str, Dict[str, Any]] = {}
        self.audit_logs: List[Dict[str, Any]] = []

        self._seed_initial_data()

    def _seed_initial_data(self):
        # 1. Institutions
        inst1 = {
            "id": "a0000000-0000-0000-0000-000000000001",
            "name": "Apex Institute of Technology",
            "code": "AIT",
            "slug": "apex-tech",
            "domain": "apex.edu",
            "contact_email": "contact@apex.edu",
            "phone": "+91 98765 43210",
            "address": "Knowledge Corridor, Tech City, Karnataka",
            "is_active": True,
            "created_at": datetime.now(timezone.utc).isoformat(),
        }
        inst2 = {
            "id": "a0000000-0000-0000-0000-000000000002",
            "name": "Zenith University of Engineering",
            "code": "ZUE",
            "slug": "zenith-uni",
            "domain": "zenith.edu",
            "contact_email": "admissions@zenith.edu",
            "phone": "+91 98765 12345",
            "address": "Innovation Boulevard, Hyderabad, Telangana",
            "is_active": True,
            "created_at": datetime.now(timezone.utc).isoformat(),
        }
        self.institutions[inst1["id"]] = inst1
        self.institutions[inst2["id"]] = inst2

        # 2. Profiles
        p_super = {
            "id": "b0000000-0000-0000-0000-000000000001",
            "email": "superadmin@samarthya.ai",
            "full_name": "Dr. Alok Verma",
            "avatar_url": "https://api.dicebear.com/7.x/avataaars/svg?seed=Alok",
            "phone": "+91 99000 00001",
            "is_super_admin": True,
            "role": "super_admin",
            "institution_id": inst1["id"],
        }
        p_admin1 = {
            "id": "b0000000-0000-0000-0000-000000000002",
            "email": "placement@apex.edu",
            "full_name": "Prof. Sunita Rao",
            "avatar_url": "https://api.dicebear.com/7.x/avataaars/svg?seed=Sunita",
            "phone": "+91 99000 00002",
            "is_super_admin": False,
            "role": "institution_admin",
            "institution_id": inst1["id"],
            "department": "Training & Placement Cell",
        }
        p_fac1 = {
            "id": "b0000000-0000-0000-0000-000000000003",
            "email": "faculty.cs@apex.edu",
            "full_name": "Dr. Rajesh Khanna",
            "avatar_url": "https://api.dicebear.com/7.x/avataaars/svg?seed=Rajesh",
            "phone": "+91 99000 00003",
            "is_super_admin": False,
            "role": "faculty",
            "institution_id": inst1["id"],
            "department": "Computer Science & Engineering",
        }
        p_stu1 = {
            "id": "b0000000-0000-0000-0000-000000000004",
            "email": "student.aarav@apex.edu",
            "full_name": "Aarav Sharma",
            "avatar_url": "https://api.dicebear.com/7.x/avataaars/svg?seed=Aarav",
            "phone": "+91 99000 00004",
            "is_super_admin": False,
            "role": "student",
            "institution_id": inst1["id"],
            "department": "Computer Science & Engineering",
        }
        p_stu2 = {
            "id": "b0000000-0000-0000-0000-000000000005",
            "email": "student.priya@apex.edu",
            "full_name": "Priya Patel",
            "avatar_url": "https://api.dicebear.com/7.x/avataaars/svg?seed=Priya",
            "phone": "+91 99000 00005",
            "is_super_admin": False,
            "role": "student",
            "institution_id": inst1["id"],
            "department": "Information Science",
        }
        p_admin2 = {
            "id": "b0000000-0000-0000-0000-000000000006",
            "email": "placement@zenith.edu",
            "full_name": "Dr. Vikram Seth",
            "avatar_url": "https://api.dicebear.com/7.x/avataaars/svg?seed=Vikram",
            "phone": "+91 99000 00006",
            "is_super_admin": False,
            "role": "institution_admin",
            "institution_id": inst2["id"],
            "department": "Career Services",
        }
        p_stu3 = {
            "id": "b0000000-0000-0000-0000-000000000007",
            "email": "student.rohan@zenith.edu",
            "full_name": "Rohan Iyer",
            "avatar_url": "https://api.dicebear.com/7.x/avataaars/svg?seed=Rohan",
            "phone": "+91 99000 00007",
            "is_super_admin": False,
            "role": "student",
            "institution_id": inst2["id"],
            "department": "Electronics & Communication",
        }

        for p in [p_super, p_admin1, p_fac1, p_stu1, p_stu2, p_admin2, p_stu3]:
            self.profiles[p["id"]] = p

        # 3. Student Profiles
        s1 = {
            "id": "c0000000-0000-0000-0000-000000000001",
            "user_id": p_stu1["id"],
            "institution_id": inst1["id"],
            "full_name": p_stu1["full_name"],
            "email": p_stu1["email"],
            "roll_number": "AIT2023CS042",
            "department": "Computer Science & Engineering",
            "batch_year": 2026,
            "current_semester": 7,
            "cgpa": 8.75,
            "tenth_percentage": 94.0,
            "twelfth_percentage": 91.5,
            "resume_url": "https://example.com/resumes/aarav_sharma.pdf",
            "career_aspirations": "Full-Stack Software Engineer & AI System Architect",
            "created_at": datetime.now(timezone.utc).isoformat(),
        }
        s2 = {
            "id": "c0000000-0000-0000-0000-000000000002",
            "user_id": p_stu2["id"],
            "institution_id": inst1["id"],
            "full_name": p_stu2["full_name"],
            "email": p_stu2["email"],
            "roll_number": "AIT2023IS019",
            "department": "Information Science",
            "batch_year": 2026,
            "current_semester": 7,
            "cgpa": 7.90,
            "tenth_percentage": 88.5,
            "twelfth_percentage": 85.0,
            "career_aspirations": "Cloud Infrastructure Engineer & DevOps Specialist",
            "created_at": datetime.now(timezone.utc).isoformat(),
        }
        s3 = {
            "id": "c0000000-0000-0000-0000-000000000003",
            "user_id": p_stu3["id"],
            "institution_id": inst2["id"],
            "full_name": p_stu3["full_name"],
            "email": p_stu3["email"],
            "roll_number": "ZUE2023EC088",
            "department": "Electronics & Communication",
            "batch_year": 2026,
            "current_semester": 7,
            "cgpa": 7.45,
            "tenth_percentage": 82.0,
            "twelfth_percentage": 80.0,
            "career_aspirations": "Embedded Software & IoT Developer",
            "created_at": datetime.now(timezone.utc).isoformat(),
        }
        self.student_profiles[s1["id"]] = s1
        self.student_profiles[s2["id"]] = s2
        self.student_profiles[s3["id"]] = s3

        # 4. Skills
        skill_list = [
            {"id": "e0000000-0000-0000-0000-000000000001", "name": "Quantitative Aptitude", "category": "aptitude", "description": "Number systems, percentages, time & work", "icon": "Calculator"},
            {"id": "e0000000-0000-0000-0000-000000000002", "name": "Logical Reasoning", "category": "aptitude", "description": "Puzzles, syllogisms, pattern deduction", "icon": "Brain"},
            {"id": "e0000000-0000-0000-0000-000000000003", "name": "Verbal Ability", "category": "aptitude", "description": "Reading comprehension, grammar, vocabulary", "icon": "BookOpen"},
            {"id": "e0000000-0000-0000-0000-000000000004", "name": "Data Structures & Algorithms", "category": "programming", "description": "Arrays, trees, graphs, dynamic programming", "icon": "Code"},
            {"id": "e0000000-0000-0000-0000-000000000005", "name": "Python Programming", "category": "programming", "description": "Syntax, async, OOP, standard library", "icon": "Terminal"},
            {"id": "e0000000-0000-0000-0000-000000000006", "name": "Database Management & SQL", "category": "technical", "description": "Relational schemas, queries, ACID, indexing", "icon": "Database"},
            {"id": "e0000000-0000-0000-0000-000000000007", "name": "Operating Systems", "category": "technical", "description": "Processes, threads, paging, deadlocks", "icon": "Cpu"},
            {"id": "e0000000-0000-0000-0000-000000000008", "name": "Technical Communication", "category": "communication", "description": "Explaining designs, presentations, documentation", "icon": "MessageSquare"},
        ]
        for sk in skill_list:
            self.skills[sk["id"]] = sk

        # 5. Companies & Requirements
        comp1 = {
            "id": "f0000000-0000-0000-0000-000000000001",
            "institution_id": inst1["id"],
            "name": "Google Cloud",
            "logo_url": "https://upload.wikimedia.org/wikipedia/commons/2/2f/Google_2015_logo.svg",
            "website": "https://careers.google.com",
            "industry": "Information Technology",
            "description": "Global technology leader in cloud infrastructure, search, and AI platforms.",
            "tier": "super_dream",
            "is_active": True,
        }
        comp2 = {
            "id": "f0000000-0000-0000-0000-000000000002",
            "institution_id": inst1["id"],
            "name": "Microsoft India",
            "logo_url": "https://upload.wikimedia.org/wikipedia/commons/9/96/Microsoft_logo_%282012%29.svg",
            "website": "https://careers.microsoft.com",
            "industry": "Software & Cloud",
            "description": "Enterprise software and cloud computing powerhouse.",
            "tier": "dream",
            "is_active": True,
        }
        comp3 = {
            "id": "f0000000-0000-0000-0000-000000000003",
            "institution_id": inst1["id"],
            "name": "Deloitte USI",
            "logo_url": "https://upload.wikimedia.org/wikipedia/commons/5/56/Deloitte.svg",
            "website": "https://deloitte.com",
            "industry": "Consulting & Analytics",
            "description": "Global advisory and digital transformation services.",
            "tier": "tier_1",
            "is_active": True,
        }
        self.companies[comp1["id"]] = comp1
        self.companies[comp2["id"]] = comp2
        self.companies[comp3["id"]] = comp3

        req1 = {
            "id": "10000000-0000-0000-0000-000000000001",
            "company_id": comp1["id"],
            "company_name": comp1["name"],
            "job_role": "Software Development Engineer I",
            "min_cgpa": 8.0,
            "max_backlogs": 0,
            "eligible_departments": ["Computer Science & Engineering", "Information Science"],
            "required_skills": [
                {"name": "Data Structures & Algorithms", "min_level": 4},
                {"name": "Python Programming", "min_level": 4},
                {"name": "Operating Systems", "min_level": 3},
            ],
            "min_aptitude_score": 75.0,
            "min_coding_score": 85.0,
            "min_technical_score": 80.0,
            "min_communication_score": 70.0,
            "salary_package": "₹ 32,00,000 CTC",
        }
        req2 = {
            "id": "10000000-0000-0000-0000-000000000002",
            "company_id": comp2["id"],
            "company_name": comp2["name"],
            "job_role": "Associate Software Engineer",
            "min_cgpa": 7.5,
            "max_backlogs": 0,
            "eligible_departments": ["Computer Science & Engineering", "Information Science", "Electronics & Communication"],
            "required_skills": [
                {"name": "Data Structures & Algorithms", "min_level": 4},
                {"name": "Database Management & SQL", "min_level": 3},
            ],
            "min_aptitude_score": 70.0,
            "min_coding_score": 75.0,
            "min_technical_score": 75.0,
            "min_communication_score": 70.0,
            "salary_package": "₹ 24,00,000 CTC",
        }
        self.company_requirements[req1["id"]] = req1
        self.company_requirements[req2["id"]] = req2

        # 6. Assessments
        ass1 = {
            "id": "20000000-0000-0000-0000-000000000001",
            "institution_id": inst1["id"],
            "title": "Comprehensive Aptitude & Quantitative Readiness",
            "description": "Diagnostic test assessing arithmetic computation, percentage logic, and verbal relations.",
            "category": "aptitude",
            "difficulty": "medium",
            "duration_minutes": 25,
            "total_marks": 20.0,
            "pass_marks": 10.0,
            "max_attempts": 3,
            "is_published": True,
        }
        ass2 = {
            "id": "20000000-0000-0000-0000-000000000002",
            "institution_id": inst1["id"],
            "title": "Data Structures & Algorithmic Complexity",
            "description": "Evaluates trees, graphs, asymptotic complexity, and memory tradeoffs.",
            "category": "programming",
            "difficulty": "hard",
            "duration_minutes": 30,
            "total_marks": 30.0,
            "pass_marks": 15.0,
            "max_attempts": 3,
            "is_published": True,
        }
        ass3 = {
            "id": "20000000-0000-0000-0000-000000000003",
            "institution_id": inst1["id"],
            "title": "Operating Systems & System Architecture",
            "description": "Paging, page faults, deadlock prevention, process isolation, and threading.",
            "category": "technical",
            "difficulty": "medium",
            "duration_minutes": 20,
            "total_marks": 20.0,
            "pass_marks": 10.0,
            "max_attempts": 3,
            "is_published": True,
        }
        self.assessments[ass1["id"]] = ass1
        self.assessments[ass2["id"]] = ass2
        self.assessments[ass3["id"]] = ass3

        # 7. Questions
        q_list = [
            {
                "id": "30000000-0000-0000-0000-000000000001",
                "assessment_id": ass1["id"],
                "question_text": "A car completes a journey in 10 hours. The first half at 21 km/hr and the second half at 24 km/hr. What is the total distance traveled?",
                "question_type": "mcq",
                "options": ["224 km", "230 km", "240 km", "216 km"],
                "correct_answer": "224 km",
                "explanation": "Total distance = 2*d. d/21 + d/24 = 10 => d*(15/168)=10 => d=112 km. Total = 224 km.",
                "marks": 5.0,
                "skill": "Quantitative Aptitude",
            },
            {
                "id": "30000000-0000-0000-0000-000000000002",
                "assessment_id": ass1["id"],
                "question_text": "Find the next number in the series: 4, 18, 48, 100, 180, ?",
                "question_type": "mcq",
                "options": ["294", "300", "280", "292"],
                "correct_answer": "294",
                "explanation": "Pattern is n^3 - n^2 for n=2,3,4,5,6,7. 7^3 - 7^2 = 343 - 49 = 294.",
                "marks": 5.0,
                "skill": "Logical Reasoning",
            },
            {
                "id": "30000000-0000-0000-0000-000000000003",
                "assessment_id": ass1["id"],
                "question_text": "Select the word most nearly opposite in meaning to EPHEMERAL.",
                "question_type": "mcq",
                "options": ["Transient", "Permanent", "Ethereal", "Fugitive"],
                "correct_answer": "Permanent",
                "explanation": "Ephemeral means fleeting or momentary. Opposite is Permanent.",
                "marks": 5.0,
                "skill": "Verbal Ability",
            },
            {
                "id": "30000000-0000-0000-0000-000000000004",
                "assessment_id": ass1["id"],
                "question_text": "A and B together can do a piece of work in 12 days. B and C in 15 days, and C and A in 20 days. In how many days can A alone do the work?",
                "question_type": "mcq",
                "options": ["30 days", "25 days", "35 days", "40 days"],
                "correct_answer": "30 days",
                "explanation": "2(A+B+C) = 1/12 + 1/15 + 1/20 = 1/5 => A+B+C = 1/10. A = 1/10 - 1/15 = 1/30 (30 days).",
                "marks": 5.0,
                "skill": "Quantitative Aptitude",
            },
            # DSA
            {
                "id": "30000000-0000-0000-0000-000000000005",
                "assessment_id": ass2["id"],
                "question_text": "What is the worst-case time complexity of searching in a Balanced Binary Search Tree (AVL / Red-Black Tree)?",
                "question_type": "mcq",
                "options": ["O(1)", "O(log n)", "O(n)", "O(n log n)"],
                "correct_answer": "O(log n)",
                "explanation": "A self-balancing BST guarantees height h <= c*log(n), giving O(log n) worst-case search.",
                "marks": 10.0,
                "skill": "Data Structures & Algorithms",
            },
            {
                "id": "30000000-0000-0000-0000-000000000006",
                "assessment_id": ass2["id"],
                "question_text": "Which algorithm is optimally suited to detect cycles in an undirected graph?",
                "question_type": "mcq",
                "options": ["Disjoint Set Union (Union-Find)", "Dijkstras Algorithm", "Prim Algorithm", "Floyd-Warshall"],
                "correct_answer": "Disjoint Set Union (Union-Find)",
                "explanation": "Disjoint Set Union finds cycles in O(alpha(V)) per edge via connected components.",
                "marks": 10.0,
                "skill": "Data Structures & Algorithms",
            },
            {
                "id": "30000000-0000-0000-0000-000000000007",
                "assessment_id": ass2["id"],
                "question_text": "What is the space complexity of an in-place QuickSort implementation when recursion stack frames are considered in the worst case?",
                "question_type": "mcq",
                "options": ["O(1)", "O(log n)", "O(n)", "O(n^2)"],
                "correct_answer": "O(n)",
                "explanation": "In degenerate partitions, call stack recursion depth reaches O(n).",
                "marks": 10.0,
                "skill": "Data Structures & Algorithms",
            },
            # OS
            {
                "id": "30000000-0000-0000-0000-000000000008",
                "assessment_id": ass3["id"],
                "question_text": "Which condition is NOT one of Coffman's four necessary conditions for deadlock?",
                "question_type": "mcq",
                "options": ["Mutual Exclusion", "Hold and Wait", "Preemption allowed", "Circular Wait"],
                "correct_answer": "Preemption allowed",
                "explanation": "The condition is No Preemption. If preemption is allowed, deadlock cannot exist.",
                "marks": 10.0,
                "skill": "Operating Systems",
            },
            {
                "id": "30000000-0000-0000-0000-000000000009",
                "assessment_id": ass3["id"],
                "question_text": "What phenomenon occurs when increasing the number of page frames results in an increase in the number of page faults?",
                "question_type": "mcq",
                "options": ["Thrashing", "Belady's Anomaly", "Cache Invalidation", "Internal Fragmentation"],
                "correct_answer": "Belady's Anomaly",
                "explanation": "Belady's Anomaly occurs in FIFO page replacement where more frames cause more faults.",
                "marks": 10.0,
                "skill": "Operating Systems",
            },
        ]
        for q in q_list:
            self.questions[q["id"]] = q

        # 8. Completed Attempt & Result
        att1 = {
            "id": "40000000-0000-0000-0000-000000000001",
            "assessment_id": ass1["id"],
            "user_id": p_stu1["id"],
            "status": "evaluated",
            "score": 20.0,
            "percentage": 100.0,
            "passed": True,
            "feedback": "Flawless score across Quantitative, Logical, and Verbal reasoning sections.",
            "created_at": "2026-10-26T10:00:00Z",
        }
        att2 = {
            "id": "40000000-0000-0000-0000-000000000002",
            "assessment_id": ass2["id"],
            "user_id": p_stu1["id"],
            "status": "evaluated",
            "score": 30.0,
            "percentage": 100.0,
            "passed": True,
            "feedback": "Strong command of graph cycle detection and tree complexity analysis.",
            "created_at": "2026-10-27T14:30:00Z",
        }
        self.assessment_attempts[att1["id"]] = att1
        self.assessment_attempts[att2["id"]] = att2

        res1 = {
            "id": "att-res-01",
            "attempt_id": att1["id"],
            "user_id": p_stu1["id"],
            "assessment_id": ass1["id"],
            "score_breakdown": {"quantitative": 10.0, "logical": 5.0, "verbal": 5.0},
            "strengths": ["Number Theory", "Pattern Recognition", "Vocabulary"],
            "weaknesses": [],
        }
        self.assessment_results[att1["id"]] = res1

        # 9. Readiness Snapshot
        snap1 = {
            "id": "50000000-0000-0000-0000-000000000001",
            "user_id": p_stu1["id"],
            "institution_id": inst1["id"],
            "target_company_id": comp1["id"],
            "target_company_name": comp1["name"],
            "target_role": "Software Development Engineer I",
            "overall_readiness_score": 88.5,
            "status": "meets_criteria",
            "skill_gaps": [
                {
                    "skill": "Operating Systems",
                    "current_level": 3,
                    "required_level": 4,
                    "gap": 1,
                    "recommendation": "Review Virtual Memory Paging and Deadlock Prevention before technical rounds.",
                }
            ],
            "strengths": [
                "Data Structures & Algorithms (Level 5)",
                "Python Programming (Level 5)",
                "Quantitative Aptitude (100% Diagnostic Score)",
                "CGPA (8.75 meets >= 8.0 criterion)",
            ],
            "recommendations": [
                "Complete the Operating Systems & System Architecture diagnostic assessment.",
                "Review Google Cloud Distributed Systems architecture whitepaper.",
                "Engage in mock peer coding interviews with 45-minute timed constraints.",
            ],
            "calculated_at": datetime.now(timezone.utc).isoformat(),
        }
        self.readiness_snapshots[p_stu1["id"]] = snap1

        # 10. Learning Resources
        lr1 = {
            "id": "60000000-0000-0000-0000-000000000001",
            "institution_id": inst1["id"],
            "title": "Modern Operating Systems: Memory Management & Paging",
            "description": "Comprehensive notes covering address translation, TLB hits/misses, multi-level paging, and page replacement strategies.",
            "resource_type": "pdf",
            "file_size_bytes": 1542000,
            "processing_status": "completed",
            "uploaded_by": p_fac1["id"],
            "created_at": "2026-10-25T11:00:00Z",
        }
        lr2 = {
            "id": "60000000-0000-0000-0000-000000000002",
            "institution_id": inst1["id"],
            "title": "Cracking Placement Aptitude: Quantitative Masterclass",
            "description": "Slide deck on fast mental math shortcuts, probability distributions, work-time formulas, and case studies.",
            "resource_type": "pptx",
            "file_size_bytes": 4280000,
            "processing_status": "completed",
            "uploaded_by": p_admin1["id"],
            "created_at": "2026-10-26T09:30:00Z",
        }
        self.learning_resources[lr1["id"]] = lr1
        self.learning_resources[lr2["id"]] = lr2

        # 11. Subscriptions
        sub1 = {
            "id": "sub-apex-01",
            "institution_id": inst1["id"],
            "institution_name": inst1["name"],
            "plan_tier": "enterprise",
            "status": "active",
            "max_students": 5000,
            "max_faculty": 250,
            "ai_quota_monthly": 50000,
            "starts_at": "2026-01-01T00:00:00Z",
            "ends_at": "2027-01-01T00:00:00Z",
        }
        sub2 = {
            "id": "sub-zenith-02",
            "institution_id": inst2["id"],
            "institution_name": inst2["name"],
            "plan_tier": "professional",
            "status": "active",
            "max_students": 2000,
            "max_faculty": 100,
            "ai_quota_monthly": 20000,
            "starts_at": "2026-03-01T00:00:00Z",
            "ends_at": "2027-03-01T00:00:00Z",
        }
        self.subscriptions[inst1["id"]] = sub1
        self.subscriptions[inst2["id"]] = sub2


store = MemoryStore()
