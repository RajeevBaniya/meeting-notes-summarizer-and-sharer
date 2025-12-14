import { supabase } from "./supabase.js";

export async function saveSummary({
  userId,
  transcript,
  summary,
  instruction,
  title,
  emailRecipients,
  isShared,
  meetingTitle,
  meetingDate,
  meetingType,
  participants,
  location,
  tags,
  actionItems,
  decisions,
  deadlines,
  extractedParticipants,
}) {
  const record = {
    user_id: userId,
    transcript,
    summary,
    instruction,
    title: title || null,
    email_recipients: emailRecipients || null,
    is_shared: Boolean(isShared) || false,
    meeting_title: meetingTitle || null,
    meeting_date: meetingDate || null,
    meeting_type: meetingType || null,
    participants: participants || [],
    location: location || null,
    tags: tags || [],
    action_items: actionItems || [],
    decisions: decisions || [],
    deadlines: deadlines || [],
    extracted_participants: extractedParticipants || [],
    created_at: new Date(),
    updated_at: new Date(),
  };

  const { data, error } = await supabase
    .from("summaries")
    .insert([record])
    .select();

  if (error) throw error;
  return data[0];
}

export async function listSummaries(userId, options = {}) {
  const {
    skip = 0,
    take = 20,
    search = "",
    dateFrom = null,
    dateTo = null,
    meetingType = null,
    tags = [],
    sortBy = "created_at",
    sortOrder = "desc",
  } = options;

  let query = supabase.from("summaries").select("*").eq("user_id", userId);

  if (search.trim()) {
    const searchTerm = `%${search.trim()}%`;
    query = query.or(
      `meeting_title.ilike.${searchTerm},summary.ilike.${searchTerm},title.ilike.${searchTerm}`
    );
  }

  if (dateFrom) {
    query = query.gte("meeting_date", dateFrom);
  }

  if (dateTo) {
    query = query.lte("meeting_date", dateTo);
  }

  if (meetingType) {
    query = query.eq("meeting_type", meetingType);
  }

  if (tags.length > 0) {
    query = query.contains("tags", tags);
  }

  const allowedSortFields = [
    "created_at",
    "meeting_date",
    "meeting_title",
    "updated_at",
  ];
  const sortField = allowedSortFields.includes(sortBy) ? sortBy : "created_at";
  const ascending = sortOrder === "asc";

  query = query
    .order(sortField, { ascending, nullsFirst: false })
    .range(skip, skip + take - 1);

  const { data, error } = await query;

  if (error) throw error;
  return data;
}

export async function getSummaryById(id, userId) {
  const { data, error } = await supabase
    .from("summaries")
    .select("*")
    .eq("id", id)
    .eq("user_id", userId)
    .single();

  if (error && error.code !== "PGRST116") throw error;
  return data;
}

export async function deleteSummary(id, userId) {
  const { error } = await supabase
    .from("summaries")
    .delete()
    .eq("id", id)
    .eq("user_id", userId);

  if (error) throw error;
  return true;
}

export async function updateSummary(id, userId, data) {
  const formattedData = {
    ...Object.fromEntries(
      Object.entries(data).map(([key, value]) => [
        key.replace(/([A-Z])/g, "_$1").toLowerCase(),
        value,
      ])
    ),
    updated_at: new Date(),
  };

  const { data: updatedData, error } = await supabase
    .from("summaries")
    .update(formattedData)
    .eq("id", id)
    .eq("user_id", userId)
    .select();

  if (error) throw error;
  return updatedData[0];
}
