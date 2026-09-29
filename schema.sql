-- =========================================================================
-- INTERRO-GATE AI - PRODUCTION SUPABASE POSTGRESQL SCHEMA & RLS POLICIES
-- =========================================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. User Profiles Table
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT NOT NULL UNIQUE,
    full_name TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 2. Negotiation Sessions Table
CREATE TABLE IF NOT EXISTS public.negotiation_sessions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    initial_offer NUMERIC NOT NULL DEFAULT 250000,
    final_offer NUMERIC DEFAULT 250000,
    compliance_score INTEGER DEFAULT 10,
    total_turns INTEGER DEFAULT 0,
    status TEXT CHECK (status IN ('IN_PROGRESS', 'COMPLETED', 'FAILED')) DEFAULT 'IN_PROGRESS',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 3. Negotiation Logs Table (Turn by Turn)
CREATE TABLE IF NOT EXISTS public.negotiation_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    session_id UUID NOT NULL REFERENCES public.negotiation_sessions(id) ON DELETE CASCADE,
    turn_number INTEGER NOT NULL,
    user_message TEXT NOT NULL,
    hr_response TEXT NOT NULL,
    detected_tactics TEXT[] DEFAULT '{}',
    compliance_impact INTEGER NOT NULL,
    offered_salary NUMERIC NOT NULL,
    ai_reasoning TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 4. Stress Test Results Table
CREATE TABLE IF NOT EXISTS public.stress_test_results (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    track TEXT CHECK (track IN ('ENGINEERING', 'UPSC_CIVIL')) NOT NULL,
    total_score INTEGER NOT NULL,
    logic_score INTEGER NOT NULL,
    composure_score INTEGER NOT NULL,
    speed_score INTEGER NOT NULL,
    questions_answered INTEGER NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 5. Resume Roasts Table
CREATE TABLE IF NOT EXISTS public.resume_roasts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    resume_text TEXT NOT NULL,
    roast_output JSONB NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Enable Realtime for Negotiation Updates
ALTER PUBLICATION supabase_realtime ADD TABLE public.negotiation_sessions;
ALTER PUBLICATION supabase_realtime ADD TABLE public.negotiation_logs;

-- =========================================================================
-- ROW LEVEL SECURITY (RLS) / DATA ISOLATION POLICIES
-- =========================================================================

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.negotiation_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.negotiation_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.stress_test_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.resume_roasts ENABLE ROW LEVEL SECURITY;

-- 1. Profiles Policies
CREATE POLICY "Users can view their own profile" 
    ON public.profiles FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" 
    ON public.profiles FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile" 
    ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);

-- 2. Negotiation Sessions Policies
CREATE POLICY "Users can view own negotiation sessions" 
    ON public.negotiation_sessions FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create own negotiation sessions" 
    ON public.negotiation_sessions FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own negotiation sessions" 
    ON public.negotiation_sessions FOR UPDATE USING (auth.uid() = user_id);

-- 3. Negotiation Logs Policies
CREATE POLICY "Users can view logs of their sessions" 
    ON public.negotiation_logs FOR SELECT 
    USING (EXISTS (
        SELECT 1 FROM public.negotiation_sessions 
        WHERE id = negotiation_logs.session_id AND user_id = auth.uid()
    ));

CREATE POLICY "Users can insert logs to their sessions" 
    ON public.negotiation_logs FOR INSERT 
    WITH CHECK (EXISTS (
        SELECT 1 FROM public.negotiation_sessions 
        WHERE id = negotiation_logs.session_id AND user_id = auth.uid()
    ));

-- 4. Stress Test Policies
CREATE POLICY "Users can view own stress test results" 
    ON public.stress_test_results FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own stress test results" 
    ON public.stress_test_results FOR INSERT WITH CHECK (auth.uid() = user_id);

-- 5. Resume Roasts Policies
CREATE POLICY "Users can view own resume roasts" 
    ON public.resume_roasts FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own resume roasts" 
    ON public.resume_roasts FOR INSERT WITH CHECK (auth.uid() = user_id);
