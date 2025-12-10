
-- Added meeting metadata columns (all nullable for backward compatibility)
ALTER TABLE summaries
ADD COLUMN IF NOT EXISTS meeting_title TEXT,
ADD COLUMN IF NOT EXISTS meeting_date TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS meeting_type TEXT,
ADD COLUMN IF NOT EXISTS participants TEXT[],
ADD COLUMN IF NOT EXISTS location TEXT;

-- Add structured extraction columns (JSONB for flexibility)
ALTER TABLE summaries
ADD COLUMN IF NOT EXISTS action_items JSONB DEFAULT '[]'::jsonb,
ADD COLUMN IF NOT EXISTS decisions JSONB DEFAULT '[]'::jsonb,
ADD COLUMN IF NOT EXISTS deadlines JSONB DEFAULT '[]'::jsonb,
ADD COLUMN IF NOT EXISTS extracted_participants TEXT[];

-- Create index for meeting_date for faster filtering
CREATE INDEX IF NOT EXISTS idx_summaries_meeting_date ON summaries(meeting_date);

-- Create index for meeting_type for faster filtering
CREATE INDEX IF NOT EXISTS idx_summaries_meeting_type ON summaries(meeting_type);

