-- =========================================================================
-- INTERRO-GATE AI - PRODUCTION SUPABASE INITIAL SCHEMA MIGRATION (001)
-- =========================================================================

-- 1. Enable Required Extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 2. User Profiles Table (Mirrors Supabase auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT NOT NULL UNIQUE,
    full_name TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 3. Automatic Profile Creation Trigger on Supabase Auth Signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, email, full_name)
    VALUES (
        NEW.id,
        NEW.email,
        COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1))
    )
    ON CONFLICT (id) DO UPDATE
    SET email = EXCLUDED.email,
        full_name = COALESCE(EXCLUDED.full_name, public.profiles.full_name),
        updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 4. Negotiation Sessions Table
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

-- 5. Negotiation Logs Table (Turn by Turn)
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

-- 6. Stress Test Results Table
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

-- 7. Resume Roasts Table
CREATE TABLE IF NOT EXISTS public.resume_roasts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    resume_text TEXT NOT NULL,
    roast_output JSONB NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 8. Enable Realtime Replication
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_publication_tables 
        WHERE pubname = 'supabase_realtime' AND schemaname = 'public' AND tablename = 'negotiation_sessions'
    ) THEN
        ALTER PUBLICATION supabase_realtime ADD TABLE public.negotiation_sessions;
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM pg_publication_tables 
        WHERE pubname = 'supabase_realtime' AND schemaname = 'public' AND tablename = 'negotiation_logs'
    ) THEN
        ALTER PUBLICATION supabase_realtime ADD TABLE public.negotiation_logs;
    END IF;
EXCEPTION WHEN OTHERS THEN
    RAISE NOTICE 'Skipping realtime publication setup: %', SQLERRM;
END $$;

-- =========================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- =========================================================================

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.negotiation_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.negotiation_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.stress_test_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.resume_roasts ENABLE ROW LEVEL SECURITY;

-- Profiles Policies
DROP POLICY IF EXISTS "Users can view their own profile" ON public.profiles;
CREATE POLICY "Users can view their own profile" 
    ON public.profiles FOR SELECT USING (auth.uid() = id);

DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;
CREATE POLICY "Users can update their own profile" 
    ON public.profiles FOR UPDATE USING (auth.uid() = id);

DROP POLICY IF EXISTS "Users can insert their own profile" ON public.profiles;
CREATE POLICY "Users can insert their own profile" 
    ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);

-- Negotiation Sessions Policies
DROP POLICY IF EXISTS "Users can view own negotiation sessions" ON public.negotiation_sessions;
CREATE POLICY "Users can view own negotiation sessions" 
    ON public.negotiation_sessions FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can create own negotiation sessions" ON public.negotiation_sessions;
CREATE POLICY "Users can create own negotiation sessions" 
    ON public.negotiation_sessions FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update own negotiation sessions" ON public.negotiation_sessions;
CREATE POLICY "Users can update own negotiation sessions" 
    ON public.negotiation_sessions FOR UPDATE USING (auth.uid() = user_id);

-- Negotiation Logs Policies
DROP POLICY IF EXISTS "Users can view logs of their sessions" ON public.negotiation_logs;
CREATE POLICY "Users can view logs of their sessions" 
    ON public.negotiation_logs FOR SELECT 
    USING (EXISTS (
        SELECT 1 FROM public.negotiation_sessions 
        WHERE id = negotiation_logs.session_id AND user_id = auth.uid()
    ));

DROP POLICY IF EXISTS "Users can insert logs to their sessions" ON public.negotiation_logs;
CREATE POLICY "Users can insert logs to their sessions" 
    ON public.negotiation_logs FOR INSERT 
    WITH CHECK (EXISTS (
        SELECT 1 FROM public.negotiation_sessions 
        WHERE id = negotiation_logs.session_id AND user_id = auth.uid()
    ));

-- Stress Test Policies
DROP POLICY IF EXISTS "Users can view own stress test results" ON public.stress_test_results;
CREATE POLICY "Users can view own stress test results" 
    ON public.stress_test_results FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert own stress test results" ON public.stress_test_results;
CREATE POLICY "Users can insert own stress test results" 
    ON public.stress_test_results FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Resume Roasts Policies
DROP POLICY IF EXISTS "Users can view own resume roasts" ON public.resume_roasts;
CREATE POLICY "Users can view own resume roasts" 
    ON public.resume_roasts FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert own resume roasts" ON public.resume_roasts;
CREATE POLICY "Users can insert own resume roasts" 
    ON public.resume_roasts FOR INSERT WITH CHECK (auth.uid() = user_id);

-- =========================================================================
-- SEED DATA & BENCHMARKS
-- =========================================================================

DO $$
DECLARE
    demo_user_id UUID := '00000000-0000-0000-0000-000000000001';
BEGIN
    -- 1. Attempt to insert mock operative in auth.users if permissions allow
    BEGIN
        INSERT INTO auth.users (id, email, raw_user_meta_data, created_at, updated_at, role, aud)
        VALUES (
            demo_user_id,
            'operative@interrogate.ai',
            jsonb_build_object('full_name', 'Agent Alex Mercer'),
            NOW(),
            NOW(),
            'authenticated',
            'authenticated'
        )
        ON CONFLICT (id) DO NOTHING;
    EXCEPTION WHEN OTHERS THEN
        RAISE NOTICE 'Direct auth.users insert skipped: %', SQLERRM;
    END;

    -- 2. Seed profile if demo auth user exists
    IF EXISTS (SELECT 1 FROM auth.users WHERE id = demo_user_id) THEN
        INSERT INTO public.profiles (id, email, full_name)
        VALUES (demo_user_id, 'operative@interrogate.ai', 'Agent Alex Mercer')
        ON CONFLICT (id) DO UPDATE SET full_name = 'Agent Alex Mercer';

        -- 3. Seed benchmark negotiation session
        INSERT INTO public.negotiation_sessions (
            id, user_id, initial_offer, final_offer, compliance_score, total_turns, status, created_at
        ) VALUES (
            '11111111-1111-1111-1111-111111111111',
            demo_user_id,
            250000,
            680000,
            75,
            5,
            'COMPLETED',
            NOW() - INTERVAL '1 day'
        ) ON CONFLICT (id) DO NOTHING;

        -- 4. Seed benchmark stress test result
        INSERT INTO public.stress_test_results (
            id, user_id, track, total_score, logic_score, composure_score, speed_score, questions_answered, created_at
        ) VALUES (
            '22222222-2222-2222-2222-222222222222',
            demo_user_id,
            'ENGINEERING',
            82,
            85,
            80,
            78,
            5,
            NOW() - INTERVAL '2 days'
        ) ON CONFLICT (id) DO NOTHING;
    END IF;
END $$;
