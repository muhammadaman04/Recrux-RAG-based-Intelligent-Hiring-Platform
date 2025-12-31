-- ============================================
-- RECRUX DATABASE SCHEMA - SIMPLIFIED
-- Multi-tenant AI Recruitment Platform
-- ============================================

-- ============================================
-- 1. COMPANIES TABLE (Tenants)
-- ============================================
CREATE TABLE companies (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    domain VARCHAR(255) UNIQUE,
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_companies_domain ON companies(domain);

-- ============================================
-- 2. USERS TABLE
-- ============================================
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    tenant_id INTEGER REFERENCES companies(id) ON DELETE CASCADE,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(50) DEFAULT 'hr_manager',
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_users_tenant ON users(tenant_id);
CREATE INDEX idx_users_email ON users(email);

-- ============================================
-- 3. JOB POSTINGS TABLE
-- ============================================
CREATE TABLE job_postings (
    id SERIAL PRIMARY KEY,
    tenant_id INTEGER REFERENCES companies(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    requirements JSONB,
    must_have_skills JSONB,
    nice_to_have_skills JSONB,
    min_experience INTEGER,
    status VARCHAR(50) DEFAULT 'active',
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_job_postings_tenant ON job_postings(tenant_id, status);
CREATE INDEX idx_job_postings_created_at ON job_postings(created_at DESC);

-- ============================================
-- 4. CANDIDATES TABLE
-- ============================================
CREATE TABLE candidates (
    id SERIAL PRIMARY KEY,
    tenant_id INTEGER REFERENCES companies(id) ON DELETE CASCADE,
    job_posting_id INTEGER REFERENCES job_postings(id) ON DELETE CASCADE,
    name VARCHAR(255),
    email VARCHAR(255),
    phone VARCHAR(50),
    resume_url TEXT,
    parsed_data JSONB,
    match_score FLOAT,
    ai_summary TEXT,
    status VARCHAR(50) DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_candidates_tenant_job ON candidates(tenant_id, job_posting_id);
CREATE INDEX idx_candidates_match_score ON candidates(match_score DESC);

-- ============================================
-- 5. INTERVIEW QUESTIONS TABLE
-- ============================================
CREATE TABLE interview_questions (
    id SERIAL PRIMARY KEY,
    candidate_id INTEGER REFERENCES candidates(id) ON DELETE CASCADE,
    question TEXT NOT NULL,
    category VARCHAR(100),
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_questions_candidate ON interview_questions(candidate_id);

-- ============================================
-- 6. AUDIT LOGS TABLE
-- ============================================
CREATE TABLE audit_logs (
    id SERIAL PRIMARY KEY,
    tenant_id INTEGER REFERENCES companies(id) ON DELETE CASCADE,
    user_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
    action VARCHAR(255) NOT NULL,
    resource_type VARCHAR(100),
    resource_id INTEGER,
    ip_address VARCHAR(45),
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_audit_tenant ON audit_logs(tenant_id);
CREATE INDEX idx_audit_created_at ON audit_logs(created_at DESC);

-- ============================================
-- ROW-LEVEL SECURITY (RLS)
-- ============================================

-- Enable RLS on job_postings
ALTER TABLE job_postings ENABLE ROW LEVEL SECURITY;

CREATE POLICY tenant_isolation_jobs ON job_postings
    USING (tenant_id = current_setting('app.current_tenant', true)::int);

-- Enable RLS on candidates
ALTER TABLE candidates ENABLE ROW LEVEL SECURITY;

CREATE POLICY tenant_isolation_candidates ON candidates
    USING (tenant_id = current_setting('app.current_tenant', true)::int);

-- ============================================
-- VERIFICATION QUERY
-- ============================================
-- Run this after executing to verify:
-- SELECT table_name FROM information_schema.tables WHERE table_schema = 'public' ORDER BY table_name;
