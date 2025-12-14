
-- Add tags column for categorization
ALTER TABLE summaries
ADD COLUMN IF NOT EXISTS tags TEXT[] DEFAULT '{}'::text[];

-- Create GIN index for tags array for faster filtering
CREATE INDEX IF NOT EXISTS idx_summaries_tags ON summaries USING GIN(tags);

-- Create index for full-text search on meeting_title
CREATE INDEX IF NOT EXISTS idx_summaries_meeting_title ON summaries(meeting_title);

-- Create index for created_at for sorting performance
CREATE INDEX IF NOT EXISTS idx_summaries_created_at ON summaries(created_at DESC);

-- Create composite index for user_id + created_at (common query pattern)
CREATE INDEX IF NOT EXISTS idx_summaries_user_created ON summaries(user_id, created_at DESC);


