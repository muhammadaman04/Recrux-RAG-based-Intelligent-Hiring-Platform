-- ============================================
-- RECRUX DATABASE SCHEMA
-- Multi-tenant AI Recruitment Platform
-- ============================================
-- Execute this script in Supabase SQL Editor
-- This will create all tables with Row-Level Security
-- ============================================

-- ============================================
-- 1. COMPANIES TABLE (Tenants)
-- ============================================
CREATE TABLE companies (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    domain VARCHAR(255) UNIQUE,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_companies_domain ON companies(domain);

-- Enable Row-Level Security
ALTER TABLE companies ENABLE ROW LEVEL SECURITY;

-- RLS Policy: Users can only view their own company
CREATE POLICY "Users can view own company"
    ON companies
    FOR SELECT
    USING (id = current_setting('app.current_tenant_id', true)::int);

-- ============================================
-- 2. USERS TABLE
-- ============================================
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    tenant_id INTEGER NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(255),
    role VARCHAR(50) DEFAULT 'hr_manager',
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_users_tenant ON users(tenant_id);
CREATE INDEX idx_users_email ON users(email);

-- Enable Row-Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- RLS Policy: Users can only view users from their own company
CREATE POLICY "Users can view own tenant users"
    ON users
    FOR SELECT
    USING (tenant_id = current_setting('app.current_tenant_id', true)::int);

-- ============================================
-- 3. JOB POSTINGS TABLE
-- ============================================
CREATE TABLE job_postings (
    id SERIAL PRIMARY KEY,
    tenant_id INTEGER NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
    created_by INTEGER REFERENCES users(id),
    title VARCHAR(255) NOT NULL,
    description TEXT,
    requirements JSONB,
    must_have_skills JSONB,
    nice_to_have_skills JSONB,
    min_experience INTEGER,
    status VARCHAR(50) DEFAULT 'active',
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_jobs_tenant ON job_postings(tenant_id);
CREATE INDEX idx_jobs_status ON job_postings(status);
CREATE INDEX idx_jobs_created_at ON job_postings(created_at DESC);

-- Enable Row-Level Security
ALTER TABLE job_postings ENABLE ROW LEVEL SECURITY;

-- RLS Policy: Users can manage their own company's job postings
CREATE POLICY "Users can manage own tenant jobs"
    ON job_postings
    FOR ALL
    USING (tenant_id = current_setting('app.current_tenant_id', true)::int);

-- ============================================
-- 4. CANDIDATES TABLE
-- ============================================
CREATE TABLE candidates (
    id SERIAL PRIMARY KEY,
    tenant_id INTEGER NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
    job_posting_id INTEGER NOT NULL REFERENCES job_postings(id) ON DELETE CASCADE,
    
    -- Basic Information
    name VARCHAR(255),
    email VARCHAR(255),
    phone VARCHAR(50),
    resume_url TEXT,
    
    -- Parsed Resume Data (JSON)
    parsed_data JSONB,
    
    -- AI Scores (0.0 to 1.0)
    skills_score FLOAT,
    experience_score FLOAT,
    education_score FLOAT,
    final_score FLOAT,
    match_percentage INTEGER,
    
    -- AI Analysis (JSON)
    skills_analysis JSONB,
    experience_analysis JSONB,
    ai_summary TEXT,
    strengths JSONB,
    weaknesses JSONB,
    
    -- Status Tracking
    status VARCHAR(50) DEFAULT 'pending',
    
    -- Human Review
    human_review_needed BOOLEAN DEFAULT FALSE,
    human_decision VARCHAR(50),
    human_notes TEXT,
    reviewed_by INTEGER REFERENCES users(id),
    reviewed_at TIMESTAMP,
    
    -- Timestamps
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_candidates_tenant_job ON candidates(tenant_id, job_posting_id);
CREATE INDEX idx_candidates_status ON candidates(status);
CREATE INDEX idx_candidates_match_score ON candidates(final_score DESC);
CREATE INDEX idx_candidates_email ON candidates(email);

-- Enable Row-Level Security
ALTER TABLE candidates ENABLE ROW LEVEL SECURITY;

-- RLS Policy: Users can manage their own company's candidates
CREATE POLICY "Users can manage own tenant candidates"
    ON candidates
    FOR ALL
    USING (tenant_id = current_setting('app.current_tenant_id', true)::int);

-- ============================================
-- 5. INTERVIEW QUESTIONS TABLE
-- ============================================
CREATE TABLE interview_questions (
    id SERIAL PRIMARY KEY,
    candidate_id INTEGER NOT NULL REFERENCES candidates(id) ON DELETE CASCADE,
    question TEXT NOT NULL,
    category VARCHAR(100),
    difficulty VARCHAR(50),
    created_at TIMESTAMP DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_questions_candidate ON interview_questions(candidate_id);

-- Enable Row-Level Security
ALTER TABLE interview_questions ENABLE ROW LEVEL SECURITY;

-- RLS Policy: Users can view questions for their own company's candidates
CREATE POLICY "Users can view questions for own tenant candidates"
    ON interview_questions
    FOR ALL
    USING (
        EXISTS (
            SELECT 1 FROM candidates
            WHERE candidates.id = interview_questions.candidate_id
            AND candidates.tenant_id = current_setting('app.current_tenant_id', true)::int
        )
    );

-- ============================================
-- 6. AUDIT LOGS TABLE
-- ============================================
CREATE TABLE audit_logs (
    id SERIAL PRIMARY KEY,
    tenant_id INTEGER NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
    user_id INTEGER REFERENCES users(id),
    action VARCHAR(100) NOT NULL,
    resource_type VARCHAR(100),
    resource_id INTEGER,
    details JSONB,
    ip_address VARCHAR(45),
    created_at TIMESTAMP DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_audit_tenant ON audit_logs(tenant_id);
CREATE INDEX idx_audit_user ON audit_logs(user_id);
CREATE INDEX idx_audit_created_at ON audit_logs(created_at DESC);

-- Enable Row-Level Security
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

-- RLS Policy: Users can view their own company's audit logs
CREATE POLICY "Users can view own tenant audit logs"
    ON audit_logs
    FOR SELECT
    USING (tenant_id = current_setting('app.current_tenant_id', true)::int);

-- ============================================
-- 7. HELPER FUNCTIONS
-- ============================================

-- Function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- 8. TRIGGERS
-- ============================================

-- Trigger for companies table
CREATE TRIGGER update_companies_updated_at 
    BEFORE UPDATE ON companies
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Trigger for users table
CREATE TRIGGER update_users_updated_at 
    BEFORE UPDATE ON users
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Trigger for job_postings table
CREATE TRIGGER update_job_postings_updated_at 
    BEFORE UPDATE ON job_postings
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Trigger for candidates table
CREATE TRIGGER update_candidates_updated_at 
    BEFORE UPDATE ON candidates
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- VERIFICATION QUERY
-- ============================================
-- Run this after executing the script to verify all tables were created:
-- SELECT table_name FROM information_schema.tables WHERE table_schema = 'public' ORDER BY table_name;

-- ============================================
-- EXPECTED OUTPUT:
-- audit_logs
-- candidates
-- companies
-- interview_questions
-- job_postings
-- users
-- ============================================
