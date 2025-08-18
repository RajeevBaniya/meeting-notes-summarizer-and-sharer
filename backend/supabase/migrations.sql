-- Drop existing tables if they exist
DROP TABLE IF EXISTS summaries CASCADE;
DROP TABLE IF EXISTS profiles CASCADE;

-- Create summaries table
CREATE TABLE summaries (
  id SERIAL PRIMARY KEY,
  user_id UUID NOT NULL,
  transcript TEXT NOT NULL,
  summary TEXT NOT NULL,
  instruction TEXT NOT NULL,
  title TEXT,
  email_recipients TEXT,
  is_shared BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Enable RLS
ALTER TABLE summaries ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view own summaries" ON summaries
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create own summaries" ON summaries
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own summaries" ON summaries
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own summaries" ON summaries
  FOR DELETE USING (auth.uid() = user_id);

-- Create profiles table
CREATE TABLE profiles (
  id UUID PRIMARY KEY,
  name TEXT,
  email TEXT,
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Enable RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view own profile" ON profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);
